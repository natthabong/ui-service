var createapp = angular.module('scfApp');
createapp.controller('CreateTransactionController', ['CreateTransactionService', '$state', '$scope', 'TransactionService', 'SCFCommonService', '$stateParams', '$log','PageNavigation',
    function(CreateTransactionService, $state, $scope, TransactionService, SCFCommonService, $stateParams, $log, PageNavigation) {
        var vm = this;
        var log = $log;
        // Initail Data
        $scope.validateDataFailPopup = false;
        vm.errorMsgPopup = 'Insufficient Fund'
        vm.showErrorMsg = false;
        vm.errorMsgGroups = '';
        vm.tableRowCollection = [];
        // SponsorCode dropdown
        vm.sponsorCodes = [];
        
        vm.dashboardParams = $stateParams.dashboardParams;
        
        vm.initValueDefault = function() {
            vm.showInfomation = false;
            vm.documentSelects = [];
            vm.checkAllModel = false;
            vm.splitePageTxt = '';

            // Data Sponsor for select box
            vm.supplierCodes = [];
            vm.sponsorPaymentDates = [];
            vm.transactionDates = [];
            vm.submitTransactionAmount = 0.00;
            
            
        }
        vm.initValueDefault();
        var backAction = $stateParams.backAction || false;
        log.debug(backAction);
        // End Data Sponsor
        // Model for transaction
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

        // Init data paging
        vm.pageSizeList = [{
            label: '10',
            value: '10'
        }, {
            label: '20',
            value: '20'
        }, {
            label: '50',
            value: '50'
        }];
        vm.pageModel = {
            pageSizeSelectModel: '20',
            totalRecord: 0,
            currentPage: 0,
            clearSortOrder: false
        };

        // Search Document
        vm.searchDocument = function(pagingModel) {
            var sponsorCode = vm.createTransactionModel.sponsorCode;
            var sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;
            vm.submitTransactionAmount = 0.00;
            vm.checkAllModel = false;
            // validate SponsorPayment Date is Select
            if (validateSponsorPaymentDate(sponsorPaymentDate)) {
                if (pagingModel === undefined) {
                    // Clear list document selected
                    // Clear list document when backAction is false
                    if (backAction === false) {
                        vm.documentSelects = [];
                    }
                    vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
                    vm.createTransactionModel.order = '';
                    vm.createTransactionModel.orderBy = '';
                    vm.pageModel.pageSizeSelectModel = '20';
                    vm.pageModel.currentPage = 0;

                    vm.loadDocument();
                    vm.loadTransactionDate(sponsorCode, sponsorPaymentDate);
                } else {
                    vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
                    vm.pageModel.currentPage = pagingModel.page;
                    vm.loadDocument();
                }

                vm.showInfomation = true;
                vm.showErrorMsg = false;

                // set supplierCode after search
                vm.createTransactionModel.supplierCodeSelected = vm.createTransactionModel.supplierCode;
                vm.createTransactionModel.sponsorIdSelected = vm.createTransactionModel.sponsorCode;
            } else {
                vm.errorMsgGroups = 'Sponsor payment date is require.';
                vm.showErrorMsg = true;
            }
        };

        // Load Sponsor paymentDate
        vm.loadSponsorPaymentDate = function() {
            var sponsorCode = vm.createTransactionModel.sponsorCode;
            var supplierCode = vm.createTransactionModel.supplierCode;

            vm.sponsorPaymentDates = [{
                label: 'Please select',
                value: ''
            }];

            // Reset SponsorPaymentDate of User selected
            // Check action come from page validate and sumbit
            if (backAction === false) {
                vm.createTransactionModel.sponsorPaymentDate = vm.sponsorPaymentDates[0].value;
            }

            // reset actionBank is false
            backAction = false;

            var deffered = CreateTransactionService.getSponsorPaymentDate(sponsorCode, supplierCode);
            deffered.promise.then(function(response) {
                    var supplierDates = response.data;

                    supplierDates.forEach(function(data) {
                        vm.sponsorPaymentDates.push({
                            label: data,
                            value: data
                        })
                    });
                    
                    if(vm.dashboardParams!=null){
                    	vm.createTransactionModel.sponsorPaymentDate = vm.dashboardParams.sponsorPaymentDate;
                    }
                })
                .catch(function(response) {
                    log.error(response);
                });
        }

        vm.loadDocumentDisplayConfig = function(sponsorId) {
            var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId);
            displayConfig.promise.then(function(response) {
                vm.dataTable.columns = response;
            });
        }

        vm.dataTable = {
            options: {
                displayRowNo: {},
                displaySelect: {
                    label: '<input type="checkbox" ng-model="ctrl.checkAllModel" ng-click="ctrl.checkAllDocument()"/>',
                    cssTemplate: 'text-center',
                    cellTemplate: '<input type="checkbox" checklist-model="ctrl.documentSelects" checklist-value="data" ng-click="ctrl.selectDocument()"/>',
                    displayPosition: 'first',
					idValueField: 'template',
					id: 'document-{value}-checkbox'
                }
            },
            columns: []
        };

        vm.loadSponsor = function() {
            var sponsorDeffered = CreateTransactionService.getSponsor();
            sponsorDeffered.promise.then(function(response) {
                vm.sponsorCodes = [];
                var sponsorCodeList = response.data;
                if (sponsorCodeList !== undefined) {
                    sponsorCodeList.forEach(function(obj) {
                        var selectObj = {
                            label: obj.sponsorName,
                            value: obj.sponsorId
                        }
                        vm.sponsorCodes.push(selectObj);
                    });
                    // Check action come from page validate and sumbit
                    if (backAction === false) {
                        vm.createTransactionModel.sponsorCode = vm.sponsorCodes[0].value;
                    }
                    else if(vm.dashboardParams!=null){
                     	vm.createTransactionModel.sponsorCode = vm.dashboardParams.sponsorId;
                    }
                    vm.loadSupplierCode();
                    // Load documentConfig from DB
                    vm.loadDocumentDisplayConfig(vm.createTransactionModel.sponsorCode);
                }
               
            }).catch(function(response) {
                log.error(response);
            });
        };

        vm.loadSupplierCode = function() {
            var sponsorId = vm.createTransactionModel.sponsorCode;
            var supplierDeffered = CreateTransactionService.getSupplier(sponsorId);
            supplierDeffered.promise.then(function(response) {
                vm.supplierCodes = [];
                var supplilerCodeList = response.data;
                if (supplilerCodeList.length > 0) {
                    supplilerCodeList.forEach(function(obj) {
                        var supplierCode = {
                            label: obj,
                            value: obj
                        }
                        vm.supplierCodes.push(supplierCode);
                    });
                    // Check action come from page validate and sumbit
                    if (backAction === false) {
                        vm.createTransactionModel.supplierCode = vm.supplierCodes[0].value;
                    }
                    else if(vm.dashboardParams!=null){
                    	console.log(vm.dashboardParams)
                     	vm.createTransactionModel.supplierCode = vm.dashboardParams.supplierCode;
                    }
                    vm.loadSponsorPaymentDate();
                }
            }).catch(function(response) {
                vm.errorMsgPopup = response.data.errorCode;
                vm.showErrorMsgPopup = true;
            });
        };

        // next to page verify and submit
        vm.nextStep = function() {
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
                vm.sponsorCodes.forEach(function(sponsorObj) {
                    if (vm.createTransactionModel.sponsorIdSelected === sponsorObj.value) {
                        sponsorNameSelect = sponsorObj.label;
                    }
                });

                transactionModel.sponsorPaymentDate = SCFCommonService.convertStringTodate(transactionModel.sponsorPaymentDate);
                transactionModel.transactionDate = SCFCommonService.convertStringTodate(transactionModel.transactionDate);

                var deffered = CreateTransactionService.verifyTransaction(transactionModel);
                deffered.promise.then(function(response) {
                    var tradingpartnerInfoExtend = angular.extend(vm.tradingpartnerInfoModel, {
                        sponsorName: sponsorNameSelect,
                        supplierCodeSelected: vm.createTransactionModel.supplierCodeSelected
                    });
                    var transaction = response.data;
                    SCFCommonService.parentStatePage().saveCurrentState('/create-transaction');
                    PageNavigation.nextStep('/create-transaction/validate-submit', {
                        transactionModel: transaction,
                        totalDocumentAmount: vm.totalDocumentAmount,
                        tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                        documentSelects: vm.documentSelects
                    },{
                        transactionModel: transaction,
                        totalDocumentAmount: vm.totalDocumentAmount,
                        tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                        documentSelects: vm.documentSelects
                    });
                }).catch(function(response) {
                    vm.errorMsgPopup = response.data.errorCode;
                    $scope.validateDataFailPopup = true;
                    vm.createTransactionModel.sponsorPaymentDate = SCFCommonService.convertDate(vm.createTransactionModel.sponsorPaymentDate);
                    vm.createTransactionModel.transactionDate = SCFCommonService.convertDate(vm.createTransactionModel.transactionDate);
                });
            }
        };

        // Load Transaction Date
        vm.loadTransactionDate = function(sponsorCode, sponsorPaymentDate) {
            var deffered = CreateTransactionService.getTransactionDate(sponsorCode, sponsorPaymentDate);
            deffered.promise.then(function(response) {
                // clear list transaction date
                vm.transactionDates = [];
                var transactionResponse = response.data;

                if (transactionResponse.length > 0) {
                    transactionResponse.forEach(function(data) {
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

            }).catch(function(response) {
                log.error(response);
            });
        };

        vm.loadDocument = function() {
            var sponsorCode = vm.createTransactionModel.sponsorCode;

            // Search criteria model
            var searchDocumentCriteria = {
                    sponsorId: sponsorCode,
                    supplierCode: vm.createTransactionModel.supplierCode,
                    sponsorPaymentDate: vm.createTransactionModel.sponsorPaymentDate,
                    order: vm.createTransactionModel.order,
                    orderBy: vm.createTransactionModel.orderBy,
                    page: vm.pageModel.currentPage,
                    pageSize: vm.pageModel.pageSizeSelectModel
                }
                // Call Service
            var deffered = CreateTransactionService.getDocument(searchDocumentCriteria);
            deffered.promise
                .then(function(response) {
                    // response success
                    vm.pageModel.totalRecord = response.data.totalElements;
                    vm.pageModel.currentPage = response.data.number;
                    vm.pageModel.totalPage = response.data.totalPages;
                    // Generate Document for display

                    vm.tableRowCollection = response.data.content;
                    // Calculate Display page
                    vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
                    vm.watchCheckAll();
                })
                .catch(function(response) {
                    log.error(response);
                });

            // Get Tradingpartner Info
            var tradingInfo = CreateTransactionService.getTradingInfo(sponsorCode);
            tradingInfo.promise.then(function(response) {
                vm.tradingpartnerInfoModel = response.data;
            }).catch(function(response) {
                log.error(response);
            });
        }

        vm.initLoad = function() {
            if ($stateParams.backAction === true) {
                backAction = true;
                var tradingPartnerInfo = $stateParams.tradingpartnerInfoModel;
                if (tradingPartnerInfo !== null) {

                    var transactionModel = $stateParams.transactionModel;

                    vm.tradingpartnerInfoModel = tradingPartnerInfo;
                    vm.createTransactionModel = {
                        sponsorCode: tradingPartnerInfo.sponsorId,
                        supplierCode: tradingPartnerInfo.supplierCodeSelected,
                        sponsorPaymentDate: SCFCommonService.convertDate(transactionModel.sponsorPaymentDate),
                        transactionDate: SCFCommonService.convertDate(transactionModel.transactionDate)
                    };

                    vm.documentSelects = $stateParams.documentSelects;
                    vm.searchDocument();
                    calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                } else {
                    backAction = false;
                }
            }
            vm.loadSponsor();
        }

        vm.initLoad();

        function validateSponsorPaymentDate(paymentDate) {
            return paymentDate === '' ? false : true;
        }

        vm.selectDocument = function() {
            vm.checkAllModel = false;
            calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
        };

        vm.watchCheckAll = function() {
                var comparator = angular.equals;
                var countRecordData = 0;
                vm.tableRowCollection.forEach(function(document) {
                    for (var index = vm.documentSelects.length; index--;) {
                        if (comparator(document, vm.documentSelects[index])) {
                            countRecordData++;
                            break;
                        }
                    }
                });
                if (countRecordData === vm.tableRowCollection.length) {
                    vm.checkAllModel = true;
                }
            }
            // Select All in page
        vm.checkAllDocument = function() {
            var comparator = angular.equals;
            var documentSelectClone = angular.copy(vm.documentSelects);
            if (vm.checkAllModel) {
                vm.tableRowCollection.forEach(function(document) {
                    var foundDataSelect = false;
                    for (var index = documentSelectClone.length; index--;) {
                        if (comparator(document, documentSelectClone[index])) {
                            foundDataSelect = true;
                            break;
                        }
                    }

                    if (!foundDataSelect) {
                        documentSelectClone.push(document);
                    }
                });
                vm.documentSelects = angular.copy(documentSelectClone);
            } else {
                vm.tableRowCollection.forEach(function(document) {
                    for (var index = documentSelectClone.length; index--;) {
                        if (comparator(document, documentSelectClone[index])) {
                            documentSelectClone.splice(index, 1);
                            break;
                        }
                    }
                });

                vm.documentSelects = documentSelectClone;
            }
            calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
        };

        $scope.sortData = function(order, orderBy) {
            vm.createTransactionModel.order = order;
            vm.createTransactionModel.orderBy = orderBy;
            vm.loadDocument();
        };

        vm.sponsorChange = function() {
            vm.initValueDefault();
            vm.loadDocumentDisplayConfig(vm.createTransactionModel.sponsorCode);
            vm.loadSupplierCode();
        }
		
		vm.supplierCodeChange = function(){
			vm.showInfomation = false;
            vm.documentSelects = [];
            vm.checkAllModel = false;
            vm.splitePageTxt = '';
			vm.loadSponsorPaymentDate();
		}
		
		vm.paymentDateChange = function(){
			vm.showInfomation = false;
            vm.documentSelects = [];
            vm.checkAllModel = false;
            vm.splitePageTxt = '';
		}

        function calculateTransactionAmount(documentSelects, prepercentagDrawdown) {
            var sumAmount = 0;
            documentSelects.forEach(function(document) {
                sumAmount += document.outstandingAmount;
            });
            vm.totalDocumentAmount = sumAmount;
            vm.submitTransactionAmount = TransactionService.calculateTransactionAmount(sumAmount, prepercentagDrawdown);
        }
    }
]);

function convertStringTodate(date) {
    result = '';
    if (date != undefined && date != '') {
        var dateSplite = date.toString().split('/');
        result = new Date(dateSplite[2] + '-' + dateSplite[1] + '-' + dateSplite[0]);
    }
    return result
}