var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentWithoutInvoiceController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'TransactionService',
    'PagingController', 'PageNavigation', '$filter', 'blockUI', '$q',
    function ($rootScope, $scope, $log, $stateParams, SCFCommonService, TransactionService, PagingController, PageNavigation, $filter, blockUI, $q) {

        var vm = this;
        var log = $log;
        var _criteria = {};
        var ownerId = $stateParams.buyerId;
        var createTransactionType = 'WITHOUT_INVOICE';
        vm.paymentModel = null;
        $scope.validateDataFailPopup = false;
        vm.accountType = '';
        vm.suppliers = [];
        var tradingPartnerList = [];
        var accountList = [];

        vm.maturityDateErrorDisplay = false;
        vm.errorDisplay = false;
        vm.loanRequestMode = 'CURRENT_AND_FUTURE';

        $scope.errors = {
            message: null
        }

        var deffered = TransactionService.getSuppliers($stateParams.accountingTransactionType);
        deffered.promise.then(function (response) {
            tradingPartnerList = response.data;
            if (tradingPartnerList !== undefined) {
                tradingPartnerList.forEach(function (supplier) {
                    var selectObj = {
                        label: supplier.supplierName,
                        value: supplier.supplierId
                    }
                    vm.suppliers.push(selectObj);
                });
            }
        }).catch(function (response) {
            log.error(response);
        });
        //}

        vm.criteria = {
            accountingTransactionType: $stateParams.accountingTransactionType,
            supplierId: $stateParams.supplierId,
            buyerId: $stateParams.buyerId,
            documentStatus: 'NEW',
            showOverdue: false,
            viewMyOrganize: false
        }

        $scope.documents = $stateParams.documents || [{
            documentNo: null,
            optionVarcharField1: null,
            optionVarcharField2: null,
            netAmount: null
        }];

        vm.transactionModel = $stateParams.transactionModel || {
            sponsorId: ownerId,
            transactionAmount: 0.0,
            documents: [],
            transactionDate: null,
            maturityDate: null
        }

        vm.tradingpartnerInfoModel = $stateParams.tradingpartnerInfoModel || {
            available: '0.00',
            tenor: null,
            interestRate: null
        }

        var _checkCreatePaymentType = function (supplierId) {
            var result = $.grep(tradingPartnerList, function (td) { return td.supplierId == supplierId; });
            if (result[0].createTransactionType !== undefined && result[0].createTransactionType == 'WITH_INVOICE') {
                var params = {
                    supplierModel: tradingPartnerList,
                    criteria: {
                        accountingTransactionType: 'RECEIVABLE',
                        documentStatus: 'NEW',
                        supplierId: result[0].supplierId,
                        buyerId: ownerId,
                        showOverdue: false
                    }
                }
                PageNavigation.gotoPage('/my-organize/create-payment', params);
            } else {
                _loadAccount(ownerId, supplierId);
            }
        }

        function _loadMaturityDate() {
            vm.maturityDateDropDown = [];
            if (angular.isDefined(vm.paymentModel) && vm.paymentModel != null) {
                var deffered = TransactionService.getAvailableMaturityDates(vm.paymentModel, vm.tradingpartnerInfoModel.tenor);
                deffered.promise.then(function (response) {
                    var maturityDates = response.data;

                    maturityDates.forEach(function (data) {
                        vm.maturityDateDropDown.push({
                            label: data,
                            value: data
                        });
                    });
                    if (vm.maturityDateDropDown.length != 0) {
                        vm.maturityDateModel = vm.maturityDateDropDown[0].value;
                    }

                    if ($stateParams.backAction && vm.transactionModel.maturityDate != null) {
                        vm.maturityDateModel = SCFCommonService.convertDate(vm.transactionModel.maturityDate);
                    }

                }).catch(function (response) {
                    log.error(response);
                });
            }
            $stateParams.backAction = false;
        }

        function _loadPaymentDate() {
            vm.paymentDropDown = [];
            vm.transactionModel.documents = $scope.documents;
            vm.transactionModel.supplierId = vm.criteria.supplierId;
            var deffered = TransactionService.getPaymentDate(vm.transactionModel, createTransactionType, vm.accountType, vm.loanRequestMode);
            deffered.promise.then(function (response) {
                var paymentDates = response.data;

                paymentDates.forEach(function (data) {
                    vm.paymentDropDown.push({
                        label: data,
                        value: data
                    })
                });

                if ($stateParams.backAction && vm.transactionModel.transactionDate != null) {
                    vm.paymentModel = SCFCommonService.convertDate(vm.transactionModel.transactionDate);
                    vm.accountChange();
                } else {
                    vm.paymentModel = vm.paymentDropDown[0].value;
                }
                _loadMaturityDate();
            }).catch(function (response) {
                log.error(response);
            });

        }
        
        function _padZero(s) {
        	return (s < 10) ? '0' + s : s;
        }
        
        function _dateToString(date) {
			var dateString = [_padZero(date.getDate()), _padZero(date.getMonth()+1), date.getFullYear()].join('/');
			var timeString = [_padZero(date.getHours()), _padZero(date.getMinutes())].join(':');
			return [dateString, timeString].join(' ');
		}

        var setTransactionMethod = function (supportSpecialDebit) {
            if (supportSpecialDebit) {
                vm.transactionModel.transactionMethod = 'DEBIT_SPECIAL';
            } else {
                vm.transactionModel.transactionMethod = 'DEBIT';
            }
            vm.isLoanPayment = false;
        }

        var setTradingpartnerInfoModel = function (account) {
            vm.transactionModel.transactionMethod = 'TERM_LOAN';
            vm.tradingpartnerInfoModel.available = account.remainingAmount - account.pendingAmount;
            vm.tradingpartnerInfoModel.tenor = account.tenor;
            vm.tradingpartnerInfoModel.interestRate = account.interestRate;
            vm.isLoanPayment = true;
        }

        function _loadAccount(ownerId, supplierId) {
            vm.accountDropDown = [];
            var deffered = TransactionService.getAccounts(ownerId, supplierId);
            deffered.promise.then(function (response) {
                accountList = response.data;
                var accounts = response.data;
                vm.isLoanPayment = false;
                if (accounts.length > 0) {
                    accounts.forEach(function (account, index) {
                        if (index == 0) {
                            if (account.defaultLoanNo && account.accountType == 'LOAN') {
                                vm.accountNotSupportSpecialDirectDebit = false;
                            } else {
                                vm.accountNotSupportSpecialDirectDebit = true;
                            }
                        }

                        var formatAccount = {
                            label: account.format ? ($filter('accountNoDisplay')(account.accountNo)) : account.accountNo,
                            value: account.accountId,
                            item: account
                        }
                        vm.accountDropDown.push(formatAccount);
                    });
                } else {
                    vm.accountNotSupportSpecialDirectDebit = true;
                }

                if (!$stateParams.backAction) {
                    if (accounts.length > 0) {
                        vm.transactionModel.payerAccountId = accounts[0].accountId;
                        vm.transactionModel.payerAccountNo = accounts[0].accountNo;
                        vm.accountType = accounts[0].accountType;
                        var date = new Date(accounts[0].accountUpdatedTime);
            			vm.tradingpartnerInfoModel.updateTime = _dateToString(date);

                        if (accounts[0].accountType == 'LOAN') {
                            setTradingpartnerInfoModel(accounts[0]);
                        } else {
                            setTransactionMethod(supportSpecialDebit);
                        }
                    }
                } else {
                    var result = $.grep(accounts, function (account) { return account.accountId == vm.transactionModel.payerAccountId; });
                    vm.accountType = result[0].accountType;
                    var date = new Date(result[0].accountUpdatedTime);
            		vm.tradingpartnerInfoModel.updateTime = _dateToString(date);

                    if (result[0].accountType !== undefined && result[0].accountType == 'LOAN') {
                        setTradingpartnerInfoModel(accounts[0]);
                    } else {
                        setTransactionMethod(supportSpecialDebit);
                    }
                }
                _loadPaymentDate();

            }).catch(function (response) {
                log.error(response);
            });
        }

        var _loadDocumentDisplayConfig = function () {
            var deffered = SCFCommonService.getDocumentDisplayConfig(vm.criteria.supplierId, 'RECEIVABLE', 'TRANSACTION_DOCUMENT');
            deffered.promise.then(function (response) {
                supportSpecialDebit = response.supportSpecialDebit;
                vm.loanRequestMode = response.loanRequestMode;
                _loadAccount(ownerId, vm.criteria.supplierId);
            });
        }


        var init = function () {
            _loadDocumentDisplayConfig();
        } ();

        $scope.sum = function (documents) {
            var total = 0;
            documents.forEach(function (document) {
                total = parseFloat(total) + (parseFloat(document.netAmount) || 0);
            });
            vm.transactionModel.transactionAmount = total;
            return total;
        };

        var validateDocument = function () {
            var valid = true;
            vm.errorDisplay = false;
            vm.maturityDateErrorDisplay = false;

            if ($scope.documents == [] || $scope.documents.length == 0) {
                valid = false;
                vm.errorDisplay = true;
                $scope.errors.message = "Document is required."
            } else {
                var index = 0;
                $scope.documents.forEach(function (document) {
                    if (document.optionVarcharField1 == null || document.optionVarcharField1 == "") {
                        valid = false;
                        vm.errorDisplay = true;
                        $scope.errors.message = "Description is required."
                    } else if (document.netAmount == null || document.netAmount == "") {
                        valid = false;
                        vm.errorDisplay = true;
                        $scope.errors.message = "Payment amount is required."
                    }
                    $scope.documents[index].documentNo = ++index;
                });
            }
            return valid;
        }

        var validateMaturityDate = function () {
            var valid = true;
            vm.errorDisplay = false;
            vm.maturityDateErrorDisplay = false;

            if (vm.isLoanPayment && (vm.maturityDateModel == null || vm.maturityDateModel == '' || vm.maturityDateModel === undefined)) {
                valid = false;
                vm.maturityDateErrorDisplay = true;
                $scope.errors.message = 'Maturity date is required.';
            }
            return valid;
        }

        var defaultEmptyValue = function (documents) {
            documents.forEach(function (document) {
                if (document.netAmount == null || document.netAmount == "") {
                    document.netAmount = 0;
                }
            });
            return documents;
        }

        // <---------------------------------- User Action ---------------------------------->
        vm.nextStep = function () {
            if (validateDocument()) {
                if (validateMaturityDate()) {
                    vm.transactionModel.supplierId = vm.criteria.supplierId;
                    vm.transactionModel.sponsorId = ownerId;
                    vm.transactionModel.documents = defaultEmptyValue($scope.documents);
                    vm.transactionModel.sponsorPaymentDate = SCFCommonService.convertStringTodate(vm.paymentModel);
                    vm.transactionModel.transactionDate = SCFCommonService.convertStringTodate(vm.paymentModel);
                    vm.transactionModel.maturityDate = SCFCommonService.convertStringTodate(vm.maturityDateModel);
                    vm.transactionModel.supplierName = getSupplierName(vm.transactionModel.supplierId);
                    vm.transactionModel.transactionType = 'PAYMENT';

                    vm.tradingpartnerInfoModel.createTransactionType = createTransactionType;

                    var deffered = TransactionService.verifyTransaction(vm.transactionModel);
                    deffered.promise.then(function (response) {
                        var transaction = response.data;
                        SCFCommonService.parentStatePage().saveCurrentState('/my-organize/create-transaction');

                        var accountSelected = $.grep(accountList, function (account) { return account.accountId == vm.transactionModel.payerAccountId; });
                        var formatAccount = accountSelected[0].format || false;

                        var supplier = $.grep(vm.suppliers, function (td) { return td.value == vm.criteria.supplierId; });
                        var objectToSend = {
                            transactionModel: vm.transactionModel,
                            tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                            formatAccount: formatAccount
                        };

                        PageNavigation.nextStep('/create-payment/validate-submit', objectToSend, {
                            transactionModel: vm.transactionModel,
                            tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                            criteria: vm.criteria,
                            supplierModel: tradingPartnerList,
                            documents: $scope.documents
                        });
                    }).catch(function (response) {
                        vm.errorMsgPopup = response.data.errorCode;
                        $scope.validateDataFailPopup = true;
                    });
                }
            }
        }

        vm.supplierChange = function () {
            $scope.documents = [{
                optionVarcharField1: null,
                optionVarcharField2: null,
                netAmount: null
            }];
            _checkCreatePaymentType(vm.criteria.supplierId);

        }

        vm.removeDocumentItem = function (documents, item) {
            var index = documents.indexOf(item);
            documents.splice(index, 1);
        }

        vm.addItem = function () {
            var document = {
                optionVarcharField1: null,
                optionVarcharField2: null,
                netAmount: null
            }
            $scope.documents.push(document);
        }

        vm.paymentDateChange = function () {
            _loadMaturityDate();
        }

        vm.accountChange = function () {
            var accountId = vm.transactionModel.payerAccountId;
            vm.accountDropDown.forEach(function (account) {
                if (accountId == account.item.accountId) {
                    vm.transactionModel.payerAccountNo = account.item.accountNo;
                    vm.tradingpartnerInfoModel.available = account.item.remainingAmount - account.item.pendingAmount;
                    vm.tradingpartnerInfoModel.tenor = account.item.tenor;
                    vm.tradingpartnerInfoModel.interestRate = account.item.interestRate;
                    vm.accountType = account.item.accountType;
                    
                    var date = new Date(account.item.accountUpdatedTime);
                    vm.tradingpartnerInfoModel.updateTime = _dateToString(date);

                    if (vm.accountType == 'LOAN') {
                        vm.transactionModel.transactionMethod = 'TERM_LOAN';
                        vm.isLoanPayment = true;
                    } else {
                        if (supportSpecialDebit) {
                            vm.transactionModel.transactionMethod = 'DEBIT_SPECIAL';
                        } else {
                            vm.transactionModel.transactionMethod = 'DEBIT';
                        }
                        vm.isLoanPayment = false;
                    }

                    _loadPaymentDate();
                }
            });
        }

        function getSupplierName(supplierId) {
            var supplierName = null;
            vm.suppliers.map(function (obj) {
                if (obj.value == supplierId) {
                    supplierName = obj.label;
                }
            });
            return supplierName;
        }
        
        vm.inquiryAccount = function(data) {
			var preCloseCallback = function(confirm) {
				$scope.closeThisDialog();
			}
			
			blockUI.start("Processing...");
			var deffered = $q.defer();
			var tpAccountModel = {
				sponsorId : data.buyerId,
				supplierId : data.supplierId,
				accountId : data.accountId,
			}			
			var inquiryAccountDeffered = inquiryAccountToApi(tpAccountModel);
			inquiryAccountDeffered.promise.then(function(response) {
				blockUI.stop();
				if(response.status==200){
					dialogPopup = UIFactory.showSuccessDialog({
						data: {
						    headerMessage: 'Inquiry credit information success.',
						    bodyMessage: ''
						},
						buttons : [{
							id: 'ok-button',
							label: 'OK',
							action:function(){
								vm.getCreditInformation();
								closeDialogSucccess();
							}
						}],
						preCloseCallback: null
				    });
				}else{
				    dialogPopup = UIFactory.showFailDialog({
						data: {
						    headerMessage: 'Inquiry credit information failure',
						    bodyMessage: 'please try again.'
						},
						buttons : [{
							id: 'ok-button',
							label: 'OK',
							action:function(){
								closeDialogFail();
							}
						}],
						preCloseCallback: null
					});					
				}
			}).catch(function(response) {
				blockUI.stop();
			    dialogPopup = UIFactory.showFailDialog({
					data: {
					    headerMessage: 'Inquiry credit information failure',
					    bodyMessage: ' please try again.'
					},
					buttons : [{
							id: 'ok-button',
							label: 'OK',
							action:function(){
								closeDialogFail();
							}
						}],
					preCloseCallback: null
				});
	        });
			
		}
		
		
		function inquiryAccountToApi(tpAccountModel){
			var deffered = $q.defer();	
			$http({
				url: '/api/v1/update-credit-limit-from-bank',
				method: 'POST',
				data: tpAccountModel
			}).then(function(response){
				deffered.resolve(response);
			}).catch(function(response){
				deffered.reject(response);
			});	
			return deffered;
		}

        // <---------------------------------- User Action ---------------------------------->
    }
]);