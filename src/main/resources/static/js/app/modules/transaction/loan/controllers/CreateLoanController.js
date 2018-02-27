var createapp = angular.module('gecscf.transaction');
createapp.controller('CreateLoanController', ['TransactionService', '$state',
    '$scope', 'SCFCommonService', '$stateParams', '$log', 'PageNavigation', '$q', 'PagingController', '$rootScope', 'blockUI', 'scfFactory', '$filter','AccountService',
    function (TransactionService, $state, $scope, SCFCommonService, $stateParams, $log, PageNavigation, $q, PagingController, $rootScope, blockUI, scfFactory, $filter, AccountService) {

        var vm = this;
        var defered = scfFactory.getUserInfo();
        defered.promise.then(function (response) {
            var ownerId = response.organizeId;
            var log = $log;
            var comparator = angular.equals;

            $scope.validateDataFailPopup = false;

            vm.errorMsgPopup = 'Insufficient Fund'
            vm.errorDisplay = false;
            vm.showBackButton = false;
            vm.selectedAccountInfo = [];

            // SponsorCode dropdown
            vm.sponsorCodes = [];
            vm.showEnquiryButton = false;

            vm.loanRequestMode = null;
            var supplierCodeSelectionMode = 'SINGLE_PER_TRANSACTION';
            var hasSponsorPaymentDate = false;
            var dashboardParams = $stateParams.dashboardParams;
            var backAction = $stateParams.backAction || false;

            var checkSelectMatchingRef = false;
            vm.documentSelects = [];

            $scope.errors = {}

            function _setDefualtValue(clearAll) {
                if (clearAll) {
                    vm.supplierCodes = [];
                    vm.sponsorPaymentDates = [];
                    vm.transactionDates = [];
                    vm.submitTransactionAmount = 0.00;
                }
                vm.showInfomation = false;
                vm.documentSelects = [];
                vm.checkAllModel = false;
                vm.selectAllModel = false;
            };
            _setDefualtValue(true);

            vm.createTransactionModel = {
                sponsorCode: '',
                supplierCode: '',
                sponsorPaymentDate: '',
                transactionDate: '',
                supplierCodeSelected: '',
                sponsorIdSelected: '',
                order: '',
                orderBy: '',
                createTransactionType: 'WITH_INVOICE'
            };

            vm.tradingpartnerInfoModel = {};

            vm.dataTable = {
                options: {
                    displaySelect: {
                        label: '<input type="checkbox" id="select-all-checkbox" ng-model="ctrl.checkAllModel" ng-click="ctrl.checkAllDocument()"/>',
                        cssTemplate: 'text-center',
                        cellTemplate: '<input type="checkbox" checklist-model="ctrl.documentSelects" checklist-value="data" ng-click="ctrl.selectDocument(data)"/>',
                        displayPosition: 'first',
                        idValueField: '$rowNo',
                        id: 'document-{value}-checkbox'
                    }
                },
                columns: []
            };
            var _criteria = $stateParams.criteria || {
                accountingTransactionType: 'PAYABLE',
                sponsorId: vm.createTransactionModel.sponsorCode,
                supplierId: ownerId,
                customerCode: vm.createTransactionModel.supplierCode,
                documentStatus: ['NEW'],
                sponsorPaymentDate: vm.createTransactionModel.sponsorPaymentDate,
                showOverdue: true,
                viewMyOrganize: false,
                searchMatching: false
            }

            function calculateTransactionAmount(documentSelects, prepercentagDrawdown) {
                vm.totalDocumentAmount = TransactionService.summaryAllDocumentAmount(documentSelects);
                vm.submitTransactionAmount = TransactionService.calculateTotalDocumentAmountWithPrePercentTage(vm.totalDocumentAmount, prepercentagDrawdown);
            }

            vm.accountChange = function () {
                var sponsorCode = vm.createTransactionModel.sponsorCode;
                var sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;
                _loadTradingPartnerInfo(sponsorCode, sponsorPaymentDate);
            }

            vm.loadDocument = function (pagingModel) {
                _criteria.buyerId = vm.createTransactionModel.sponsorCode;
                _criteria.customerCode = vm.createTransactionModel.supplierCode;
                _criteria.sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;
                _criteria.searchMatching = false;

                var deffered = vm.pagingController.search(pagingModel || ($stateParams.backAction ? {
                    offset: _criteria.offset,
                    limit: _criteria.limit
                } : undefined));

                deffered.promise.then(function (response) {
                    _criteria.searchMatching = true;
                    var defferedAll = vm.pagingAllController.search(pagingModel);
                    defferedAll.promise.then(function (response) {
                        if (backAction) {
                            vm.documentSelects = $stateParams.documentSelects;
                            // clear param
                            $stateParams.documentSelects = [];
                            $stateParams.backAction = false;
                            backAction = false;
                            calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                        } else if (!backAction && dashboardParams != null) {
                            vm.selectAllDocument();
                            //clear dashboard param after search
                            $stateParams.dashboardParams = null;
                            dashboardParams = null;
                        }
                        watchCheckAll();
                        blockUI.stop();
                    }).catch(function (response) {
                        blockUI.stop();
                    });
                }).catch(function (response) {
                    blockUI.stop();
                });
                vm.showInfomation = true;
            }

            function _loadTransactionDate(sponsorCode, sponsorPaymentDate) {
                var tenor = vm.tradingpartnerInfoModel.tenor;
                var loanRequestMode = vm.loanRequestMode;
                var deffered = TransactionService.getTransactionDate(sponsorCode, sponsorPaymentDate, loanRequestMode, tenor);
                deffered.promise.then(function (response) {
                    // clear list transaction date
                    vm.transactionDates = [];
                    var transactionResponse = response.data;

                    if (transactionResponse.length > 0) {
                        transactionResponse.forEach(function (data) {
                            vm.transactionDates.push({
                                label: data,
                                value: data
                            });
                        });

                        // Check action come from page validate and sumbit
                        if (backAction === false) {
                            // set select default value
                            vm.createTransactionModel.transactionDate = vm.transactionDates[0].value;
                        }
                    }
                    vm.loadDocument();
                }).catch(function (response) {
                    log.error(response);
                });
                return deffered;
            };

            function _loadTradingPartnerInfo(sponsorCode, sponsorPaymentDate) {
                var accountId = vm.createTransactionModel.payerAccountId;
                vm.accountDropDown.forEach(function (account) {
                    if (accountId == account.item.accountId) {
                        vm.createTransactionModel.payerAccountNo = account.item.accountNo;
                    }
                });

                var accountSelected = $.grep(vm.accountList, function (account) {
                    return account.accountId == accountId;
                });

				var isODAccount = false;
                if (vm.tradingpartnerInfoModel.accountType == 'LOAN') {
                    vm.createTransactionModel.transactionMethod = 'TERM_LOAN';
                    isODAccount = false;
                } else if (vm.tradingpartnerInfoModel.accountType == 'OVERDRAFT') {
                    vm.createTransactionModel.transactionMethod = 'OD';
                    isODAccount = true;
                }
                
                if(!isODAccount && vm.hasPrivilegeEnqCreditLimit){
            		vm.showEnquiryButton = true;
	            }else if(isODAccount && vm.hasPrivilegeEnqAcctBalance){
	            	vm.showEnquiryButton = true;
	            }else{
	            	vm.showEnquiryButton = false;
	            }

                var deferred = null;
                var tradingInfo = TransactionService.getTradingInfo(sponsorCode, ownerId, accountId);
                tradingInfo.promise.then(function (response) {
                    vm.tradingpartnerInfoModel = response.data;
                    deferred = _loadTransactionDate(sponsorCode, sponsorPaymentDate);
                    calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                }).catch(function (response) {
                    log.error("Load trading partner fail !");
                });
                return deferred;
            }

            function validateSponsorPaymentDate(paymentDate) {
                return paymentDate === '' ? false : true;
            }

            function _loadAccount(buyerId) {
                var paymentDate = vm.createTransactionModel.sponsorPaymentDate;
                var loanRequestMode = vm.loanRequestMode;
                vm.accountDropDown = [];
                var deffered = $q.defer();
                var defferedAccounts = TransactionService.getAccountsByTenor(ownerId, buyerId, paymentDate, loanRequestMode);
                defferedAccounts.promise.then(function (response) {
                    var accounts = response.data;
                    vm.isLoanPayment = false;
                    if (accounts.length > 0) {
                        accounts.forEach(function (account, index) {
                            var formatAccount = {
                                label: account.format ? ($filter('accountNoDisplay')(account.accountNo)) : account.accountNo,
                                value: account.accountId,
                                item: account
                            }
                            vm.accountDropDown.push(formatAccount);
                        });


                        if (accounts[0].accountType == 'LOAN') {
                            vm.createTransactionModel.transactionMethod = 'TERM_LOAN';
                        } else if (accounts[0].accountType == 'OVERDRAFT') {
                            vm.createTransactionModel.transactionMethod = 'OD';
                        }
                    }
                    deffered.resolve(accounts);
                });
                return deffered;
            }

            vm.searchDocument = function (pagingModel) {
                blockUI.start();
                var searchDocumentDeferred = $q.defer();
                var sponsorCode = vm.createTransactionModel.sponsorCode;
                var sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;
                _setDefualtValue(false);

                // validate SponsorPayment Date is Select
                if (hasSponsorPaymentDate) {
                    if (validateSponsorPaymentDate(sponsorPaymentDate)) {
                        var defferedAccounts = _loadAccount(sponsorCode);
                        defferedAccounts.promise.then(function (response) {
                            vm.accountList = response;
                            var _accounts = [];
                            angular.copy(vm.accountList, _accounts);
                            if (!$stateParams.backAction) {
                                if (_accounts.length > 0) {
                                    vm.createTransactionModel.payerAccountId = _accounts[0].accountId;
                                    vm.createTransactionModel.payerAccountNo = _accounts[0].accountNo;
                                }
                            } else {
                                var result = $.grep(_accounts, function (account) {
                                    return account.accountId == vm.createTransactionModel.payerAccountId;
                                });
                            }

                            _loadTradingPartnerInfo(sponsorCode, sponsorPaymentDate);
                        });

                        // set supplierCode after search
                        vm.createTransactionModel.supplierCodeSelected = vm.createTransactionModel.supplierCode;
                        vm.createTransactionModel.sponsorIdSelected = vm.createTransactionModel.sponsorCode;
                    } else {
                        vm.requireSponsorPaymentDate = true;
                        blockUI.stop();
                    }
                    return searchDocumentDeferred;
                } else {
                    vm.errorMsgGroups = 'Could not be create transaction because the document not found.';
                    vm.showErrorMsg = true;
                    blockUI.stop();
                }
            };

            function _loadSponsorPaymentDate() {
                var sponsorId = vm.createTransactionModel.sponsorCode;
                var supplierCode = vm.createTransactionModel.supplierCode;
                var loanRequestMode = vm.loanRequestMode;

                vm.requireSponsorPaymentDate = false;
                vm.showErrorMsg = false;
                vm.showInfomation = false;

                hasSponsorPaymentDate = false;

                vm.sponsorPaymentDates = [{
                    label: 'Please select',
                    value: ''
                }];

                var deffered = TransactionService.getSponsorPaymentDate(sponsorId, supplierCode, loanRequestMode);
                deffered.promise.then(function (response) {
                        var supplierDates = response.data;

                        supplierDates.forEach(function (data) {
                            hasSponsorPaymentDate = true;
                            vm.sponsorPaymentDates.push({
                                label: data,
                                value: data
                            })
                        });

                        if (backAction === false && dashboardParams == null) {
                            vm.createTransactionModel.sponsorPaymentDate = vm.sponsorPaymentDates[0].value;
                        } else if (dashboardParams != null) {
                            vm.createTransactionModel.sponsorPaymentDate = SCFCommonService.convertDate(dashboardParams.paymentDate);
                            dashboardInitLoad();
                        } else {
                            hasSponsorPaymentDate = true;
                            vm.searchDocument(undefined);
                        }
                    })
                    .catch(function (response) {
                        log.error(response);
                    });
            }

            function _loadSupplierCode() {
                var sponsorId = vm.createTransactionModel.sponsorCode;
                var supplierDeffered = TransactionService.getSupplier(sponsorId);
                supplierDeffered.promise.then(function (response) {
                    vm.supplierCodes = [];
                    if (supplierCodeSelectionMode == 'MULTIPLE_PER_TRANSACTION') {
                        var supplierCode = {
                            label: 'All',
                            value: ''
                        }
                        vm.supplierCodes.push(supplierCode);
                    }
                    var supplilerCodeList = response.data;
                    if (supplilerCodeList.length > 0) {
                        supplilerCodeList.forEach(function (obj) {
                            var supplierCode = {
                                label: obj,
                                value: obj
                            }
                            vm.supplierCodes.push(supplierCode);
                        });

                        if (dashboardParams != null) {
                            vm.createTransactionModel.supplierCode = dashboardParams.customerCode;
                        } else if (backAction === false && dashboardParams == null) {
                            vm.createTransactionModel.supplierCode = vm.supplierCodes[0].value;
                        }
                        _loadSponsorPaymentDate();
                    }
                }).catch(function (response) {
                    vm.errorMsgPopup = response.data.errorCode;
                    vm.showErrorMsgPopup = true;
                });
            };

            function _loadDocumentDisplayConfig(sponsorId) {
                var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId, 'PAYABLE', 'TRANSACTION_DOCUMENT');
                displayConfig.promise.then(function (response) {
                    vm.dataTable.columns = response.items;
                    vm.pagingController = PagingController.create('api/v1/documents/matching-by-fields', _criteria, 'GET');
                    vm.pagingAllController = vm.pagingController;

                    vm.loanRequestMode = response.loanRequestMode;
                    vm.documentSelection = response.documentSelection;
                    supplierCodeSelectionMode = response.supplierCodeSelectionMode;
                    _criteria.sort = response.sort;

                    if (vm.documentSelection != 'ANY_DOCUMENT') {
                        checkSelectMatchingRef = true;
                    } else {
                        checkSelectMatchingRef = false;
                    }

                    if (vm.loanRequestMode != null) {
                        _loadSupplierCode();
                    } else {
                        log.error("Load document dispay fail!");
                    }
                });
            }

            function _loadSponsor() {
                var sponsorDeffered = TransactionService.getSponsor();
                sponsorDeffered.promise.then(function (response) {
                    vm.sponsorCodes = [];
                    var sponsorCodeList = response.data;
                    if (sponsorCodeList !== undefined) {
                        sponsorCodeList.forEach(function (obj) {
                            var selectObj = {
                                label: obj.buyerName,
                                value: obj.buyerId
                            }
                            vm.sponsorCodes.push(selectObj);
                        });
                        if (dashboardParams != null) {
                            vm.createTransactionModel.sponsorCode = dashboardParams.buyerId;
                        }

                        // Check action come from page validate
                        // and sumbit
                        else if (backAction == false && dashboardParams == null) {
                            vm.createTransactionModel.sponsorCode = vm.sponsorCodes[0].value;
                        }

                        // Load documentConfig from DB
                        _loadDocumentDisplayConfig(vm.createTransactionModel.sponsorCode);
                    }

                }).catch(function (response) {
                    log.error(response);
                });
            };

            var initLoad = function () {
                if (backAction) {
                    var tradingPartnerInfo = $stateParams.tradingpartnerInfoModel;
                    var txnModel = $stateParams.transactionModel;
                    vm.showBackButton = $stateParams.showBackButton;
                    if (tradingPartnerInfo !== null) {
                        var transactionModel = $stateParams.transactionModel;
                        vm.tradingpartnerInfoModel = tradingPartnerInfo;
                        vm.createTransactionModel = {
                            sponsorCode: tradingPartnerInfo.buyerId,
                            supplierCode: tradingPartnerInfo.supplierCodeSelected,
                            sponsorPaymentDate: SCFCommonService.convertDate(transactionModel.sponsorPaymentDate),
                            transactionDate: SCFCommonService.convertDate(transactionModel.transactionDate),
                            payerAccountId: txnModel.payerAccountId
                        };
                        hasSponsorPaymentDate = true;
                    } else {
                        $timeout(function () {
                            PageNavigation.gotoPage('/');
                        }, 10);
                    }
                }
                _loadSponsor();
//                vm.accountChange();
            }();

            var watchCheckAll = function () {
                var allDocumentInPage = vm.pagingController.tableRowCollection;
                vm.checkAllModel = TransactionService.checkSelectAllDocumentInPage(vm.documentSelects, allDocumentInPage);
                watchSelectAll();
            }

            var watchSelectAll = function () {
                var pageSize = vm.pagingController.splitePageTxt.split("of ")[1];
                vm.selectAllModel = TransactionService.checkSelectAllDocument(vm.documentSelects, pageSize);
            }

            var dashboardInitLoad = function () {
                vm.showBackButton = true;
                vm.searchDocument(undefined);
            }

            $scope.sortData = function (order, orderBy) {
                vm.createTransactionModel.order = order;
                vm.createTransactionModel.orderBy = orderBy;
                vm.loadDocument();
            };

            // <------------------------------------- User Action ------------------------------->
            
            vm.enquiryAvailableBalance = function(){
            	var deffered = null;
            	var criteria ={
 	           		buyerId: vm.createTransactionModel.sponsorIdSelected,
					supplierId: ownerId,
					accountId: vm.createTransactionModel.payerAccountId
				}
            	
				if(vm.createTransactionModel.transactionMethod == 'TERM_LOAN'){
					deffered = AccountService.enquiryCreditLimit(criteria);
				}
				else{
					//overdraft
					deffered = AccountService.enquiryAccountBalance(criteria);
				}
				            	
				deffered.promise.then(function(response) {
					vm.accountChange();
				});
            }

            vm.sponsorChange = function () {
                _setDefualtValue(true);
                _loadDocumentDisplayConfig(vm.createTransactionModel.sponsorCode);
            }

            vm.supplierCodeChange = function () {
                _setDefualtValue(false);
                _loadSponsorPaymentDate();
            }

            vm.paymentDateChange = function () {
                _setDefualtValue(false);
                vm.requireSponsorPaymentDate = false;
            }

            vm.backStep = function () {
                PageNavigation.gotoPreviousPage(true);
            }

            function isFound(data) {
                return TransactionService.findIndexFromDoucmentListByDocument(data, vm.documentSelects) > -1;
            }

            var selectMatchingField = function (data) {
                if (isFound(data)) {
                    if (data.groupingKey != null) {
                        vm.pagingAllController.tableRowCollection.forEach(function (document) {
                            if (comparator(data.groupingKey, document.groupingKey)) {
                                if (!isFound(document)) {
                                    vm.documentSelects = vm.documentSelects.concat(document);
                                }
                            }
                        });
                    }
                } else {
                    if (data.groupingKey != null) {
                        for (var index = vm.documentSelects.length; index--;) {
                            if (comparator(data.groupingKey, vm.documentSelects[index].groupingKey)) {
                                vm.documentSelects.splice(index, 1);
                            }
                        }
                    }
                }

                watchCheckAll();
                calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
            }

            vm.selectDocument = function (data) {
                vm.checkAllModel = false;
                vm.selectAllModel = false;

                if (checkSelectMatchingRef) {
                    selectMatchingField(data);
                } else {
                    watchCheckAll();
                    calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                }

            }

            // this function control selected all document in page
            vm.checkAllDocument = function () {
                var allDocumentInPage = vm.pagingController.tableRowCollection;

                if (vm.checkAllModel) {
                    allDocumentInPage.forEach(function (document) {
                        if (!isFound(document)) {
                            vm.documentSelects.push(document);

                            if (checkSelectMatchingRef) {
                                selectMatchingField(document);
                            }
                        }
                    });
                } else {
                    allDocumentInPage.forEach(function (document) {
                        var index = TransactionService.findIndexFromDoucmentListByDocument(document, vm.documentSelects);
                        if (index > -1) {
                            vm.documentSelects.splice(index, 1);
                        }

                        if (checkSelectMatchingRef) {
                            selectMatchingField(document);
                        }
                    });
                }

                calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
            }

            vm.selectAllDocument = function () {
                if (!vm.selectAllModel) {
                    var allDocument = vm.pagingAllController.tableRowCollection;
                    angular.copy(allDocument, vm.documentSelects);

                    vm.selectAllModel = true;
                    vm.checkAllModel = true;
                } else {
                    _setDefualtValue(false);
                    vm.showInfomation = true;
                }
                calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
            };

            // next to page verify and submit
            vm.nextStep = function () {
                vm.errorDisplay = false;
                if (vm.documentSelects.length === 0) {
                    $scope.errors.message = 'Please select document.';
                    vm.errorDisplay = true;
                } else {
                    vm.createTransactionModel.tenor = vm.tradingpartnerInfoModel.tenor;
                    var transactionModel = angular.extend(vm.createTransactionModel, {
                        documents: vm.documentSelects,
                        transactionAmount: vm.submitTransactionAmount,
                        sponsorId: vm.createTransactionModel.sponsorIdSelected,
                        payerAccountId: vm.createTransactionModel.payerAccountId
                    });
                    var sponsorNameSelect = '';
                    vm.sponsorCodes.forEach(function (sponsorObj) {
                        if (vm.createTransactionModel.sponsorIdSelected === sponsorObj.value) {
                            sponsorNameSelect = sponsorObj.label;
                        }
                    });

                    transactionModel.sponsorPaymentDate = SCFCommonService.convertStringTodate(transactionModel.sponsorPaymentDate);
                    transactionModel.transactionDate = SCFCommonService.convertStringTodate(transactionModel.transactionDate);
                    transactionModel.transactionType = 'DRAWDOWN';
                    
                    var deffered = TransactionService.verifyTransaction(transactionModel);
                    deffered.promise.then(function (response) {
                        var tradingpartnerInfoExtend = angular.extend(vm.tradingpartnerInfoModel, {
                            sponsorName: sponsorNameSelect,
                            supplierCodeSelected: vm.createTransactionModel.supplierCodeSelected,

                        });
                        var transaction = response.data;
                        SCFCommonService.parentStatePage().saveCurrentState('/my-organize/create-transaction');
                        PageNavigation.nextStep('/create-transaction/validate-submit', {
                            transactionModel: transaction,
                            totalDocumentAmount: vm.totalDocumentAmount,
                            tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                            documentSelects: vm.documentSelects
                        }, {
                            transactionModel: transaction,
                            totalDocumentAmount: vm.totalDocumentAmount,
                            tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                            documentSelects: vm.documentSelects,
                            showBackButton: vm.showBackButton,
                            criteria: _criteria
                        });
                    }).catch(function (response) {
                        vm.errorMsgPopup = response.data.errorCode;
                        $scope.validateDataFailPopup = true;
                        vm.createTransactionModel.sponsorPaymentDate = SCFCommonService.convertDate(vm.createTransactionModel.sponsorPaymentDate);
                        vm.createTransactionModel.transactionDate = SCFCommonService.convertDate(vm.createTransactionModel.transactionDate);
                    });
                }
            };
        });
        // <------------------------------------- User Action ------------------------------->
    }
]);