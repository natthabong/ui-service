var createapp = angular.module('gecscf.transaction');
createapp.controller('CreateLoanController', ['TransactionService', '$state',
    '$scope', 'SCFCommonService', '$stateParams', '$log', 'PageNavigation', '$q', 'PagingController', '$rootScope', 'blockUI',
    function (TransactionService, $state, $scope, SCFCommonService, $stateParams, $log, PageNavigation, $q, PagingController
        , $rootScope, blockUI) {

        var vm = this;
        var log = $log;

        var ownerId = $rootScope.userInfo.organizeId;

        $scope.validateDataFailPopup = false;

        vm.errorMsgPopup = 'Insufficient Fund'
        vm.showErrorMsg = false;
        vm.errorMsgGroups = '';
        vm.showBackButton = false;

        // SponsorCode dropdown
        vm.sponsorCodes = [];

        vm.loanRequestMode = null;
        var supplierCodeSelectionMode = 'SINGLE_PER_TRANSACTION';
        var hasSponsorPaymentDate = false;
        var dashboardParams = $stateParams.dashboardParams;
        var backAction = $stateParams.backAction || false;

        var checkSelectMatchingRef = false;
        var documentGroupingFields = [];
        var matchingField = [];

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
            orderBy: ''
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
            showOverdue: true
        }

        function calculateTransactionAmount(documentSelects, prepercentagDrawdown) {
            var sumAmount = 0;
            documentSelects.forEach(function (document) {
                sumAmount += document.netAmount;
            });
            vm.totalDocumentAmount = sumAmount;
            vm.submitTransactionAmount = TransactionService.calculateTransactionAmount(sumAmount, prepercentagDrawdown);
        }

        vm.loadDocument = function (pagingModel) {
            _criteria.buyerId = vm.createTransactionModel.sponsorCode;
            _criteria.customerCode = vm.createTransactionModel.supplierCode;
            _criteria.sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;

            var deffered = vm.pagingController.search(pagingModel || ($stateParams.backAction ? {
                offset: _criteria.offset,
                limit: _criteria.limit
            } : undefined));

            deffered.promise.then(function (response) {
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
                vm.watchCheckAll();
                blockUI.stop();
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
            var differed = null;
            var tradingInfo = TransactionService.getTradingInfo(sponsorCode, ownerId);
            tradingInfo.promise.then(function (response) {
                vm.tradingpartnerInfoModel = response.data;
                differed = _loadTransactionDate(sponsorCode, sponsorPaymentDate);
            }).catch(function (response) {
                log.error("Load trading partner fail !");
            });
            return differed;
        }

        function validateSponsorPaymentDate(paymentDate) {
            return paymentDate === '' ? false : true;
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
                    _loadTradingPartnerInfo(sponsorCode, sponsorPaymentDate);
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
                }
                else if (dashboardParams != null) {
                    vm.createTransactionModel.sponsorPaymentDate = SCFCommonService.convertDate(dashboardParams.paymentDate);
                    dashboardInitLoad();
                }
                else {
                    hasSponsorPaymentDate = true;
                    vm.searchDocument(undefined);
                }
            }).catch(function (response) {
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
                    }
                    else if (backAction === false && dashboardParams == null) {
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
                vm.pagingController = PagingController.create('api/v1/documents', _criteria, 'GET');
                vm.loanRequestMode = response.loanRequestMode;
                vm.documentSelection = response.documentSelection;
                supplierCodeSelectionMode = response.supplierCodeSelectionMode;
                _criteria.sort = response.sort;

                if (vm.documentSelection != 'ANY_DOCUMENT') {
                    checkSelectMatchingRef = true;
                    documentGroupingFields = response.documentGroupingFields;

                    documentGroupingFields.forEach(function (documentFeild) {
                        var deferred = SCFCommonService.getDocumentField(documentFeild.documentFieldId);
                        deferred.promise.then(function (response) {
                            var field = response.data.documentFieldName;
                            matchingField.push(field);
                        }).catch(function (response) {

                        });
                    });
                } else {
                    checkSelectMatchingRef = false;
                }

                if (vm.loanRequestMode != null) {
                    _loadSupplierCode();
                }
                else {
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
                            label: obj.sponsorName,
                            value: obj.sponsorId
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
                vm.showBackButton = $stateParams.showBackButton;
                if (tradingPartnerInfo !== null) {
                    var transactionModel = $stateParams.transactionModel;
                    vm.tradingpartnerInfoModel = tradingPartnerInfo;
                    vm.createTransactionModel = {
                        sponsorCode: tradingPartnerInfo.sponsorId,
                        supplierCode: tradingPartnerInfo.supplierCodeSelected,
                        sponsorPaymentDate: SCFCommonService.convertDate(transactionModel.sponsorPaymentDate),
                        transactionDate: SCFCommonService.convertDate(transactionModel.transactionDate)
                    };
                    hasSponsorPaymentDate = true;
                } else {
                    $timeout(function () {
                        PageNavigation.gotoPage('/');
                    }, 10);
                }
            }
            _loadSponsor();
        } ();

        vm.watchCheckAll = function () {
            console.log(vm.documentSelects);
            vm.checkAllModel = false;
            var comparator = angular.equals;
            var countRecordData = 0;
            vm.pagingController.tableRowCollection.forEach(function (document) {
                for (var index = vm.documentSelects.length; index--;) {
                    if (comparator(document, vm.documentSelects[index])) {
                        countRecordData++;
                        break;
                    }
                }
            });
            if (countRecordData === vm.pagingController.tableRowCollection.length && countRecordData > 0) {
                vm.checkAllModel = true;
            }
            vm.watchSelectAll();
        }

        vm.watchSelectAll = function () {
            vm.selectAllModel = false;
            var pageSize = vm.pagingController.splitePageTxt.split("of ")[1];
            if (vm.documentSelects.length > 0 && vm.documentSelects.length == pageSize) {
                vm.selectAllModel = true;
            }
        }

        var selectMatchingField = function (data) {
            // search docment is selected ?
            var isSelected = (vm.documentSelects.map(function (o) {
                return o.documentId;
            }).indexOf(data.documentId) > -1);

            var params = {
                accountingTransactionType: _criteria.accountingTransactionType,
                buyerId: _criteria.buyerId,
                supplierId: _criteria.supplierId,
                customerCode: _criteria.customerCode,
                paymentDate: _criteria.sponsorPaymentDate
            }

            var groupingFieldCriteria = {
                fieldName: matchingField[0],
                fieldValue: data[matchingField[0]],
            }

            var listGroupingFieldCriteria = [];
            listGroupingFieldCriteria.push(groupingFieldCriteria);

            if (isSelected) {
                var removeDupDataFormSearch = vm.documentSelects.indexOf(data);
                vm.documentSelects.splice(removeDupDataFormSearch, 1);

                var result = TransactionService.searchMatchingField(params, listGroupingFieldCriteria);
                result.promise.then(function (response) {
                    vm.documentSelects = vm.documentSelects.concat(response.data);
                    vm.watchCheckAll();
                    calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                }).catch(function (response) {

                });
            } else {
                var result = TransactionService.searchMatchingField(params, listGroupingFieldCriteria);
                result.promise.then(function (response) {
                    var matchingDocuments = response.data;
                    if (matchingDocuments.length > 0) {
                        matchingDocuments.forEach(function (docment) {
                            vm.documentSelects.some(item => {
                                if (item.documentId == docment.documentId) {
                                    vm.documentSelects.splice(vm.documentSelects.indexOf(item), 1);
                                }
                            })
                        });
                    }
                    vm.watchCheckAll();
                    calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                }).catch(function (response) {

                });
            }
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

        // <----------------------------------------- User action -------------------------------------->

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

        // next to page verify and submit
        vm.nextStep = function () {
            if (vm.documentSelects.length === 0) {
                vm.errorMsgGroups = 'Please select document.';
                vm.showErrorMsg = true;
            } else {
                var transactionModel = angular.extend(vm.createTransactionModel, {
                    documents: vm.documentSelects,
                    transactionAmount: vm.submitTransactionAmount,
                    sponsorId: vm.createTransactionModel.sponsorIdSelected,
                    payerAccountId: vm.tradingpartnerInfoModel.accountId
                });
                var sponsorNameSelect = '';
                vm.sponsorCodes.forEach(function (sponsorObj) {
                    if (vm.createTransactionModel.sponsorIdSelected === sponsorObj.value) {
                        sponsorNameSelect = sponsorObj.label;
                    }
                });

                transactionModel.sponsorPaymentDate = SCFCommonService.convertStringTodate(transactionModel.sponsorPaymentDate);
                transactionModel.transactionDate = SCFCommonService.convertStringTodate(transactionModel.transactionDate);

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

        vm.selectDocument = function (data) {
            vm.checkAllModel = false;
            vm.selectAllModel = false;

            if (checkSelectMatchingRef) {
                selectMatchingField(data);
            } else {
                vm.watchCheckAll();
                calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
            }

        }

        // this function control selected all document in page
        vm.checkAllDocument = function () {

            var params = {
                accountingTransactionType: _criteria.accountingTransactionType,
                buyerId: _criteria.buyerId,
                supplierId: _criteria.supplierId,
                customerCode: _criteria.customerCode,
                paymentDate: _criteria.sponsorPaymentDate
            }

            var allDocumentInPage = vm.pagingController.tableRowCollection;
            if (vm.checkAllModel) {
                allDocumentInPage.forEach(function (document, documentInPageIndex) {
                    // check document is selected already
                    // find a document in list
                    var foundDataSelect = (vm.documentSelects.map(function (o) {
                        return o.documentId;
                    }).indexOf(document.documentId) > -1);

                    if (!foundDataSelect) {
                        if (checkSelectMatchingRef) {
                            var groupingFieldCriteria = {
                                fieldName: matchingField[0],
                                fieldValue: document[matchingField[0]]
                            }

                            var listGroupingFieldCriteria = [];
                            listGroupingFieldCriteria.push(groupingFieldCriteria);

                            var result = TransactionService.searchMatchingField(params, listGroupingFieldCriteria);
                            result.promise.then(function (response) {
                                var matchingDocuments = response.data;
                                if (matchingDocuments.length > 0) {
                                    matchingDocuments.forEach(function (document, index) {

                                        // check document is selected already
                                        // find a document in list
                                        var foundDataSelect = (vm.documentSelects.map(function (o) {
                                            return o.documentId;
                                        }).indexOf(document.documentId) > -1);

                                        if (!foundDataSelect) {
                                            vm.documentSelects.push(document);
                                        }

                                        if (documentInPageIndex + 1 == allDocumentInPage.length) {
                                            vm.watchCheckAll();
                                            calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                                        }
                                    });

                                }
                            });
                        } else {
                            vm.documentSelects.push(document);
                            calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                        }
                    }


                });

            } else {
                // vm.selectAllModel = false;
                allDocumentInPage.forEach(function (document, documentInPageIndex) {


                    // check document is selected already
                    // find a document in list
                    var foundDataSelect = (vm.documentSelects.map(function (o) {
                        return o.documentId;
                    }).indexOf(document.documentId) > -1);

                    if (foundDataSelect) {
                        if (checkSelectMatchingRef) {
                            var groupingFieldCriteria = {
                                fieldName: matchingField[0],
                                fieldValue: document[matchingField[0]]
                            }

                            var listGroupingFieldCriteria = [];
                            listGroupingFieldCriteria.push(groupingFieldCriteria);

                            var result = TransactionService.searchMatchingField(params, listGroupingFieldCriteria);
                            result.promise.then(function (response) {
                                var matchingDocuments = response.data;
                                if (matchingDocuments.length > 0) {
                                    matchingDocuments.forEach(function (document, index) {

                                        // check document is selected already
                                        // find a document in list
                                        var deleteDocIndex = vm.documentSelects.map(function (o) {
                                            return o.documentId;
                                        }).indexOf(document.documentId);

                                        if (deleteDocIndex >= 0) {
                                            vm.documentSelects.splice(deleteDocIndex, 1);
                                        }

                                        if (documentInPageIndex + 1 == allDocumentInPage.length) {
                                            vm.watchCheckAll();
                                            calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                                        }

                                    });

                                }
                            });
                        } else {
                            var index = vm.documentSelects.map(function (o) {
                                return o.documentId;
                            }).indexOf(document.documentId);

                            if (index >= 0) {
                                vm.documentSelects.splice(index, 1);
                            }
                            calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                        }
                    }

                    if (index + 1 == allDocumentInPage.length) {
                        vm.watchCheckAll();
                    }
                });
            }


        }

        vm.selectAllDocument = function () {
            if (!vm.selectAllModel) {
                var totalRecord = vm.pagingController.splitePageTxt.split(" of")[1];
                var searchCriteria = angular.copy(_criteria);
                searchCriteria.offset = 0;
                searchCriteria.limit = totalRecord;

                var diferredDocumentAll = TransactionService.getDocuments(searchCriteria);
                diferredDocumentAll.promise.then(function (response) {
                    vm.documentSelects = response.data;
                    calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                    vm.selectAllModel = true;
                    vm.checkAllModel = true;
                }).catch(function (response) {
                    log.error('select all document error')
                });
            } else {
                _setDefualtValue(false);
                vm.showInfomation = true;
                calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
            }
        };

        // <----------------------------------------- User action -------------------------------------->
    }
]);