var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentWithoutInvoiceController', [
	'$rootScope',
    '$scope',
    '$log',
    '$stateParams',
    'SCFCommonService',
    'TransactionService',
    'PagingController',
    'PageNavigation',
    '$filter',
    'blockUI',
    '$q',
    'scfFactory',
    'AccountService',
    function ($rootScope, $scope, $log, $stateParams, SCFCommonService, TransactionService, PagingController, PageNavigation, $filter, blockUI, $q, scfFactory, AccountService) {
        var vm = this;
        var log = $log;
        var ownerId = $rootScope.userInfo.organizeId;
        var dashboardParams = $stateParams.dashboardParams;
        var backAction = $stateParams.backAction || false;
        
        vm.hasPrivilegeEnqAcctBalance = false;
        vm.hasPrivilegeEnqCreditLimit = false;
        vm.showEnquiryButton = false;
        
        $scope.errors = {
            message: null
        }

        function prepareCriteria() {
            return $stateParams.criteria || {
                accountingTransactionType: 'RECEIVABLE',
                sponsorId: ownerId,
                buyerId: ownerId,
                overDuePeriod: null,
                displayNegativeDocument: true
            }
        }

        $scope.documents = $stateParams.documents || [{
            documentNo: null,
            optionVarcharField1: null,
            optionVarcharField2: null,
            netAmount: null
        }];
        
        function prepareTransactionModel() {
            return $stateParams.transactionModel || {
                sponsorId: ownerId,
                transactionAmount: 0.0,
                documents: [],
                transactionDate: null,
                maturityDate: null
            }
        }
        
        function prepareTradingpartnerInfoModel() {
            return $stateParams.tradingpartnerInfoModel || {
                available: '0.00',
                tenor: null,
                interestRate: null
            }
        }

        function _loadSuppliers() {
            vm.suppliers = [];
            var supplierDeffered = TransactionService.getSuppliers('RECEIVABLE');
            supplierDeffered.promise.then(function (response) {
            	vm.tradingPartnerList = response.data;
                if (vm.tradingPartnerList !== undefined) {
                	vm.tradingPartnerList.forEach(function (supplier) {
                        var selectObj = {
                            label: supplier.supplierName,
                            value: supplier.supplierId
                        }
                        vm.suppliers.push(selectObj);
                    });
                    
                    if (dashboardParams != null) {
                    	vm.criteria.supplierId = dashboardParams.supplierId;
                    }
                    
                    _checkCreatePaymentType();
                }
            }).catch(function (response) {
                log.error(response);
            });
        }
        
        var _checkCreatePaymentType = function () {
            var result = $.grep(vm.tradingPartnerList, function (supplier) {
                return supplier.supplierId == vm.criteria.supplierId;
            });
            if (result[0].createTransactionType !== undefined && result[0].createTransactionType == 'WITH_INVOICE') {
            	vm.displayPaymentPage = true;
            	var params = {
                    supplierModel: vm.tradingPartnerList,
                    formWIOP: true,
                    criteria: {
                        accountingTransactionType: 'RECEIVABLE',
                        documentStatus: 'NEW',
                        supplierId: result[0].supplierId,
                        buyerId: ownerId,
                        overDuePeriod: null,
                        displayNegativeDocument: true
                    }
                }
                PageNavigation.gotoPage('/my-organize/create-payment', params);
            } else {
            	vm.displayPaymentPage = false;
            	var defferedDocumentDisplayConfig = _loadDocumentDisplayConfig();
                defferedDocumentDisplayConfig.promise.then(function (response) {
                    var defferedAccount = _loadAccount();
                    defferedAccount.promise.then(function (response) {
                    	var defferedTradingPartner =_loadTradingPartnerInfo();
                    	defferedTradingPartner.promise.then(function (response) {
                            _loadPaymentDate();
                    	});
                    });
                });
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
                        $stateParams.backAction = false;
                    }

                }).catch(function (response) {
                    log.error(response);
                });
            }
        }

        function _loadPaymentDate() {
            vm.paymentDropDown = [];
            vm.transactionModel.documents = $scope.documents;
            vm.transactionModel.supplierId = vm.criteria.supplierId;
            var deffered = TransactionService.getPaymentDate(vm.transactionModel, vm.createTransactionType, vm.accountType, vm.criteria.loanRequestMode, null);
            deffered.promise.then(function (response) {
                var paymentDates = response.data;
                paymentDates.forEach(function (data) {
                    vm.paymentDropDown.push({
                        label: data,
                        value: data
                    })
                });

                vm.paymentModel = vm.paymentDropDown[0].value;
                if (backAction) {
                    if (vm.transactionModel.transactionDate != null) {
                        vm.paymentModel = SCFCommonService.convertDate(vm.transactionModel.transactionDate);
                    }
                }
                _loadMaturityDate();
                
            }).catch(function (response) {
                log.error(response);
            });
        }

        function _loadAccount() {
            vm.accountDropDown = [];
            var deffered = $q.defer();
            var defferedAccounts = TransactionService.getAccounts(ownerId, vm.criteria.supplierId);
            defferedAccounts.promise.then(function (response) {
            	vm.accountList = response.data;
                vm.isLoanPayment = false;
                if (vm.accountList.length > 0) {
                	vm.accountList.forEach(function (account, index) {
                		if (index == 0 && vm.supportSpecialDebit) {
                            if (account.defaultLoanNo) {
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
                	if (vm.supportSpecialDebit) {
                        vm.accountNotSupportSpecialDirectDebit = true;
                    } else {
                        vm.accountNotSupportSpecialDirectDebit = false;
                    }
                }

                if (!backAction && dashboardParams == null) {
                	vm.transactionModel.payerAccountId = vm.accountDropDown[0].value;
                	vm.transactionModel.payerAccountNo = vm.accountDropDown[0].item.accountNo;
                	vm.accountType = vm.accountDropDown[0].item.accountType;
                }
                deffered.resolve(response);
            }).catch(function (response) {
                log.error(response);
                deffered.resolve(response);
            });
            return deffered;
        }
        
        function _loadTradingPartnerInfo() {
        	var accountId = vm.transactionModel.payerAccountId;
        	vm.accountDropDown.forEach(function (account) {
                if (accountId == account.item.accountId) {
                    vm.transactionModel.payerAccountNo = account.item.accountNo;
                    vm.accountType = account.item.accountType;
                }
            });
        	
			var accountSelected = $.grep(vm.accountList, function (account) {
			    return account.accountId == accountId;
			});

        	var deffered = $q.defer();
            var tradingInfo = TransactionService.getTradingInfo(ownerId, vm.criteria.supplierId, accountId);
            tradingInfo.promise.then(function (response) {
                vm.tradingpartnerInfoModel = response.data;

                var isLoanAccount = true;
    			if (vm.accountType == 'LOAN') {
                    vm.transactionModel.transactionMethod = 'TERM_LOAN';
                    vm.isLoanPayment = true;
                    _loadMaturityDate();
                }else if(vm.accountType == 'OVERDRAFT'){
                	vm.transactionModel.transactionMethod = 'OD';
                	vm.isLoanPayment = false;
                	isLoanAccount = false;
                } else {
                    if (vm.supportSpecialDebit) {
                        vm.transactionModel.transactionMethod = 'DEBIT_SPECIAL';
                    } else {
                        vm.transactionModel.transactionMethod = 'DEBIT';
                    }
                    vm.isLoanPayment = false;
                    isLoanAccount = false;
                }
    			
                if(isLoanAccount && vm.hasPrivilegeEnqCreditLimit){
                	vm.showEnquiryButton = true;
                }else if(!isLoanAccount && vm.hasPrivilegeEnqAcctBalance){
                	vm.showEnquiryButton = true;
                }else{
                	vm.showEnquiryButton = false;
                }
                deffered.resolve(response);
            }).catch(function (response) {
                log.error("Load trading partner fail !");
                deffered.resolve(response);
            });
            return deffered;
        }

        var _loadDocumentDisplayConfig = function () {
        	var deffered = $q.defer();
            var defferedDocumentDisplay = SCFCommonService.getDocumentDisplayConfig(vm.criteria.supplierId, 'RECEIVABLE', 'TRANSACTION_DOCUMENT');
            defferedDocumentDisplay.promise.then(function (response) {
                vm.supportSpecialDebit = response.supportSpecialDebit;
                vm.criteria.displayNegativeDocument = response.displayNegativeDocument;
                vm.criteria.overDuePeriod = response.overDuePeriod;
                vm.criteria.sort = response.sort;
                vm.criteria.loanRequestMode = response.loanRequestMode;
                
                deffered.resolve(response);
            });
            return deffered;
        }

        vm.getUserInfoSuccess = false;
        var defered = scfFactory.getUserInfo();
        defered.promise.then(function (response) {
            vm.getUserInfoSuccess = true;
            vm.criteria = prepareCriteria();
            vm.transactionModel = prepareTransactionModel();

            vm.tradingPartnerList = [];
            vm.tradingpartnerInfoModel = prepareTradingpartnerInfoModel();
            vm.suppliers = [];
            
            vm.supportSpecialDebit = false;
            vm.accountList = [];
            vm.accountDropDown = [];
            vm.isLoanPayment = false;
            vm.accountNotSupportSpecialDirectDebit = false;

            vm.createTransactionType = 'WITHOUT_INVOICE';
            
	        var init = function () {
	        	if (backAction) {
	        		var tradingPartnerInfo = $stateParams.tradingpartnerInfoModel;
	        		vm.showBackButton = $stateParams.showBackButton;
	        		if (tradingPartnerInfo !== null) {
	                    var transactionModel = $stateParams.transactionModel;
	                    vm.tradingpartnerInfoModel = tradingPartnerInfo;
	                } else {
	                    $timeout(function () {
	                        PageNavigation.gotoPage('/');
	                    }, 10);
	                }
	        	}
	        	
	        	if (dashboardParams != null) {
	                vm.showBackButton = true;
	            }
	        	
	        	$scope.sum = function (documents) {
	                var total = 0;
	                documents.forEach(function (document) {
	                    total = parseFloat(total) + (parseFloat(document.netAmount) || 0);
	                });
	                vm.transactionModel.transactionAmount = total;
	                return total;
	            };
	        	
	        	_loadSuppliers();
	        }();
        });
        
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
                vm.errorDisplay = true;
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

        vm.accountChange = function () {
            _loadTradingPartnerInfo();
        }

        vm.supplierChange = function () {
            $scope.documents = [{
                optionVarcharField1: null,
                optionVarcharField2: null,
                netAmount: null
            }];
            _checkCreatePaymentType();

        }

        vm.paymentDateChange = function () {
            _loadMaturityDate();
        }
        
        vm.nextStep = function () {
            if (validateDocument()) {
                if (validateMaturityDate()) {
                    vm.transactionModel.documents = defaultEmptyValue($scope.documents);
                    vm.transactionModel.sponsorPaymentDate = SCFCommonService.convertStringTodate(vm.paymentModel);
                    vm.transactionModel.transactionDate = SCFCommonService.convertStringTodate(vm.paymentModel);
                    vm.transactionModel.maturityDate = SCFCommonService.convertStringTodate(vm.maturityDateModel);
                    vm.transactionModel.transactionType = 'PAYMENT';
                    vm.transactionModel.supplierName = getSupplierName(vm.transactionModel.supplierId);
                    vm.tradingpartnerInfoModel.createTransactionType = vm.createTransactionType;
                    
                    var _accountList = [];
                    angular.copy(vm.accountList, _accountList);
                    var accountSelected = $.grep(_accountList, function (account) {
                        return account.accountId == vm.transactionModel.payerAccountId;
                    });
                    var formatAccount = accountSelected[0].format || false;
                    
                    var deffered = TransactionService.verifyTransaction(vm.transactionModel);
                    deffered.promise.then(function (response) {
                        var transaction = response.data;
                        SCFCommonService.parentStatePage().saveCurrentState('/my-organize/create-transaction');

                        var objectToSend = {
                            transactionModel: vm.transactionModel,
                            tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                            formatAccount: formatAccount
                        };

                        var _criteria = {};
                        angular.copy(vm.criteria, _criteria);
                        PageNavigation.nextStep('/create-payment/validate-submit', objectToSend, {
                            transactionModel: vm.transactionModel,
                            tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                            criteria: _criteria,
                            documents: $scope.documents
                        });
                    }).catch(function (response) {
                        vm.errorMsgPopup = response.data.errorCode;
                        $scope.validateDataFailPopup = true;
                    });
                }
            }
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
        
        vm.backStep = function () {
            PageNavigation.gotoPreviousPage(true);
        }

        vm.enquiryAvailableBalance = function(){
        	var deffered = null;
        	var criteria ={
 	    		buyerId: ownerId,
				supplierId: vm.criteria.supplierId,
				accountId: vm.transactionModel.payerAccountId
			}
				
			if(vm.transactionModel.transactionMethod  == 'TERM_LOAN'){
				deffered = AccountService.enquiryCreditLimit(criteria);
			}
			else{
				//current, saving, overdraft
				deffered = AccountService.enquiryAccountBalance(criteria);
			}
				            	
			deffered.promise.then(function(response) {
				_loadTradingPartnerInfo();
			});
        }
    }
]);