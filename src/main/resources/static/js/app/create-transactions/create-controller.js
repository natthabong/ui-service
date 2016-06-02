var createapp = angular.module('scfApp');
createapp.controller('CreateTransactionController', ['CreateTransactionService', '$state', '$scope', 'TransactionService', 'SCFCommonService',
    function(CreateTransactionService, $state, $scope, TransactionService, SCFCommonService) {
        var vm = this;
        // Initail Data
        $scope.validateDataFailPopup = false;
        vm.showInfomation = false;
        vm.errorMsgPopup = "Insufficient Fund"
        vm.showErrorMsg = false;
        vm.errorMsgGroups = 'transaction-error-msg-payment-date';
        vm.documentSelects = [];
        vm.tableRowCollection = [];
        vm.checkAllModel = false;
        vm.splitePageTxt = '';
        // Data Sponsor for select box
        vm.sponsorCodes = [];
        vm.supplierCodes = [];
        vm.sponsorPaymentDates = [];
        vm.transactionDates = [];
        vm.submitTransactionAmount = 0.00;
        // End Data Sponsor
        // Model for transaction
        vm.createTransactionModel = {
            sponsorCode: '',
            supplierCode: '',
            sponsorPaymentDate: '',
            transactionDate: ''
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
            currentPage: 0
        };

        // Search Document
        vm.searchDocument = function(pagingModel) {
            var sponsorCode = vm.createTransactionModel.sponsorCode;
            var sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;
            vm.checkAllModel = false;
            // validate SponsorPayment Date is Select
            if (validateSponsorPaymentDate(sponsorPaymentDate)) {
                if (pagingModel === undefined) {
                    // Clear list document selected
                    vm.documentSelects = [];
                    vm.loadDocument();
                    vm.loadTransactionDate(sponsorCode, sponsorPaymentDate);
                } else {
                    vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
                    vm.pageModel.currentPage = pagingModel.page;
                    vm.loadDocument();
                }

                vm.showInfomation = true;
                vm.showErrorMsg = false;
            } else {
                vm.showErrorMsg = true;
            }
        };

        // Load Sponsor paymentDate
        vm.loadSupplierDate = function() {
            var sponsorCode = vm.createTransactionModel.sponsorCode;
            var supplierCode = vm.createTransactionModel.supplierCode;
            vm.sponsorPaymentDates = [{
                label: 'Please Select',
                value: ''
            }];
            // Reset SponsorPaymentDate of User selected
            vm.createTransactionModel.sponsorPaymentDate = vm.sponsorPaymentDates[0].value;
            var deffered = CreateTransactionService.getSponsorPaymentDate(sponsorCode, supplierCode);
            deffered.promise.then(function(response) {
                    var supplierDates = response.data;

                    supplierDates.forEach(function(data) {
                        vm.sponsorPaymentDates.push({
                            label: data,
                            value: data
                        })
                    });
                })
                .catch(function(response) {
                    console.log(response);
                });
        }

        vm.loadSponsor = function() {
            var sponsorDeffered = CreateTransactionService.getSponsor();
            sponsorDeffered.promise.then(function(response) {
                var sponsorCodeList = response.data;
                if (sponsorCodeList !== undefined) {
                    sponsorCodeList.forEach(function(obj) {
                        var selectObj = {
                            label: obj.sponsorName,
                            value: obj.sponsorId
                        }

                        vm.sponsorCodes.push(selectObj);
                    });
                    vm.createTransactionModel.sponsorCode = vm.sponsorCodes[0].value;
                    vm.loadSupplierCode();
                }
            }).catch(function(response) {
                console.log(response);
            });
        };

        vm.loadSupplierCode = function() {
            var sponsorId = vm.createTransactionModel.sponsorCode;
            var supplierDeffered = CreateTransactionService.getSupplier(sponsorId);
            supplierDeffered.promise.then(function(response) {
                var supplilerCodeList = response.data;
                if (supplilerCodeList.length > 0) {
                    supplilerCodeList.forEach(function(obj) {
                        var supplierCode = {
                            label: obj,
                            value: obj
                        }
                        vm.supplierCodes.push(supplierCode);
                    });
                    vm.createTransactionModel.supplierCode = vm.supplierCodes[0].value;
                    vm.loadSupplierDate();
                }

            }).catch(function(response) {
                console.log(response);
            });
        };
        vm.loadSponsor();

        // next to page verify and submit
        vm.nextStep = function() {
            var transactionModel = angular.extend(vm.createTransactionModel, {
                documents: vm.documentSelects,
                transactionAmount: vm.submitTransactionAmount,
                sponsorId: vm.createTransactionModel.sponsorCode,
                payeeAccountId: vm.tradingpartnerInfoModel.accountId
            });
            var sponsorSelect = '';
            vm.sponsorCodes.forEach(function(sponsorObj) {
                if (vm.createTransactionModel.sponsorCode == sponsorObj.value) {
                    sponsorNameSelect = sponsorObj.label;
                }
            });

            var deffered = CreateTransactionService.verifyTransaction(transactionModel);
            deffered.promise.then(function(response) {
				var tradingpartnerInfoExtend = angular.extend(vm.tradingpartnerInfoModel, {
                    sponsorName: sponsorNameSelect
                });
                var transaction = response.data;                
                $state.go('/create-transaction/validate-submit', {
                    transactionModel: transaction,
                    totalDocumentAmount: vm.totalDocumentAmount,
                    tradingpartnerInfoModel: vm.tradingpartnerInfoModel,

                });
            }).catch(function(response) {
                $scope.validateDataFailPopup = true;
            });
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
                    // set select default value
                    vm.createTransactionModel.transactionDate = vm.transactionDates[0].value;
                }

            }).catch(function(response) {
                console.log(response);
            });
        };

        vm.loadDocument = function() {
            var sponsorCode = vm.createTransactionModel.sponsorCode;
            var supplierCode = vm.createTransactionModel.supplierCode;

            var sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;
            var page = vm.pageModel.currentPage;
            var pageSize = vm.pageModel.pageSizeSelectModel;
            // Call Service
            var deffered = CreateTransactionService.getDocument(sponsorCode, supplierCode, sponsorPaymentDate, page, pageSize);
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
                    console.log(response);
                });

            //Get Tradingpartner Info
            var tradingInfo = CreateTransactionService.getTradingInfo(sponsorCode, supplierCode);
            tradingInfo.promise.then(function(response) {
                vm.tradingpartnerInfoModel = response.data;
            }).catch(function(response) {
                console.log(response);
            });
        }

        vm.dataTable = {
            options: {
                displayRowNo: {},
                displaySelect: {
                    label: '<input type="checkbox" ng-model="createTransactionCtrl.checkAllModel" ng-click="createTransactionCtrl.checkAllDocument()"/>',
                    cssTemplate: 'text-center',
                    cellTemplate: '<input type="checkbox" checklist-model="createTransactionCtrl.documentSelects" checklist-value="data" id="document-{{data.documentId}}-checkbox" ng-click="createTransactionCtrl.selectDocument()"/>',
                    displayPosition: 'first'
                }
            },
            columns: [{
                field: 'sponsorPaymentDate',
                label: 'วันครบกำหนดชำระ',
                sortData: false,
                cssTemplate: 'text-center',
                filterType: 'date',
                filterFormat: 'dd/MM/yyyy'
            }, {
                field: 'sponsorPaymentDate',
                label: 'วันที่เอกสาร',
                sortData: false,
                cssTemplate: 'text-center',
                filterType: 'date',
                filterFormat: 'dd/MM/yyyy'
            }, {
                field: 'documentNo',
                label: 'เลขที่เอกสาร',
                sortData: false,
                cssTemplate: 'text-center',
            }, {
                field: 'documentType',
                label: 'ประเภทเอกสาร',
                sortData: false,
                cssTemplate: 'text-center',
            }, {
                field: 'supplierCode',
                label: 'รหัสลูกค้า',
                sortData: false,
                cssTemplate: 'text-center'
            }, {
                field: 'outstandingAmount',
                label: 'จำนวนเงินตามเอกสาร',
                sortData: false,
                cssTemplate: 'text-right',
                filterType: 'number',
                filterFormat: '2'
            }]
        };

        function validateSponsorPaymentDate(paymentDate) {
            return paymentDate === '' ? false : true;
        }

        vm.selectDocument = function() {
            vm.checkAllModel = false;
            calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdawn);
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
            calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdawn);
        };

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