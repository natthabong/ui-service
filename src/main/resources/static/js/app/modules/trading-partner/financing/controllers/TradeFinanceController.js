'use strict';
var tradeFinanceModule = angular.module('gecscf.tradingPartner.financing');
tradeFinanceModule.controller('TradeFinanceController',['$scope','$stateParams','UIFactory',
    'PageNavigation','PagingController','$log','$http','TradeFinanceService',
    function($scope, $stateParams, UIFactory,PageNavigation, PagingController,$log,$http,TradeFinanceService) {

        var vm = this;
        var log = $log;

        vm.dateFormat = "dd/MM/yyyy";
		vm.openAgreementDate = false;
		vm.openCreditExpirationDate = false;
        vm.openActiveDate = false;
        vm.openExpireDate = false;
        vm.isUseExpireDate = false;
        vm.headerName = null;
        
        
        var currentMode = $stateParams.mode;
        var borrower = $stateParams.params;

        if(currentMode == 'NEW'){
            vm.isNewMode = true;
        }else{
            vm.isNewMode = false;
        }

        var currentDate = new Date();

        if($stateParams.params ==''){
            PageNavigation.gotoPage('/trading-partners');
        }

        vm.borrowerModel = [
            {
                label : '[Buyer] '+borrower.sponsorId+': '+borrower.sponsorName,
                value : "BUYER"
            },
            {
                label : '[Supplier] '+borrower.supplierId+': '+borrower.supplierName,
                value : "SUPPLIER"
            }
        ];

        function _setAccountNoFormat(accountNo){
            var word1 = accountNo.substring(0,3);
            var word2 = accountNo.substring(3,4);
            var word3 = accountNo.substring(4, 9);
            var word4 = accountNo.substring(9,10);
            var accountSetFormat = word1+'-'+word2+'-'+word3+'-'+word4;
            return accountSetFormat;
        }

        var queryAccount = function(value) {
			var organizeId = null;
            if(vm.tradeFinanceModel.borrower == "BUYER"){
                organizeId = borrower.sponsorId;
            }else{
                organizeId = borrower.supplierId;
            }
			var accountServiceUrl = 'api/v1/organize-customers/'+organizeId+'/accounts';

			value = value = UIFactory.createCriteria(value);
			
			return $http.get(accountServiceUrl, {
				params : {
					q : value,
					offset : 0,
					limit : 5,
					accountType : "LOAN"
				}
			}).then(function(response) {
				return response.data.map(function(item) {
                    var accountNo = _setAccountNoFormat(item.accountNo);
					item.identity = [ 'account-', item.accountNo, '-option' ].join('');
					item.label = [ accountNo ].join('');
					return item;
				});
			});
		};

        vm.financeAccountAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Please enter borrower account no.',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : queryAccount
		});
        
        vm.tradeFinanceModel = {
            borrower : vm.borrowerModel[0].value,
            financeAccount : null,
            tenor : null,
            percentageLoan: null,
            interestRate : null,
            agreementDate: currentDate,
            creditExpirationDate: null,
            isSuspend: false
        };
        
        var prepareAutoSuggestLabel = function(accountId,accountNo) {
            var accountNoSetFormat = _setAccountNoFormat(accountNo);
            var item = {
                accountId : accountId,
                accountNo : accountNo,
                identity : [ 'account-', accountNo, '-option' ].join(''),
                label : [ accountNoSetFormat ].join(''),
            }
			return item;
		}

        var initialTradeFinance = function(data){
            var tradeFinanceData = data;
			if(tradeFinanceData.limitExpiryDate == null){
                tradeFinanceData.limitExpiryDate = undefined;
            }
            if(tradeFinanceData.limitExpiryDate == undefined){
                vm.isUseExpireDate = false;
            }else{
                vm.isUseExpireDate = true;
            }
            if(tradeFinanceData != null){
                vm.tradeFinanceModel.borrower = tradeFinanceData.borrowerType;

                if(vm.tradeFinanceModel.borrower == "SUPPLIER"){
                    vm.isSupplier = true;
                }else{
                    vm.isSupplier = false;
                }
                
                vm.tradeFinanceModel.financeAccount = prepareAutoSuggestLabel(tradeFinanceData.accountId,tradeFinanceData.accountNo);
                vm.tradeFinanceModel.tenor = tradeFinanceData.tenor;
                vm.tradeFinanceModel.percentageLoan = tradeFinanceData.prePercentageDrawdown;
                vm.tradeFinanceModel.interestRate = tradeFinanceData.interestRate;
                vm.tradeFinanceModel.agreementDate = new Date(tradeFinanceData.agreementDate);
                vm.tradeFinanceModel.creditExpirationDate = new Date(tradeFinanceData.limitExpiryDate);
                vm.tradeFinanceModel.isSuspend = tradeFinanceData.suspend;
            }
        }

        var _getTradeFinanceInfo = function(sponsorId,supplierId,accountId){
			var defered = TradeFinanceService.getTradeFinanceInfo(sponsorId,supplierId,accountId);
			defered.promise.then(function(response) {
                initialTradeFinance(response.data)
			}).catch(function(response) {
				log.error('Get trading finance fail');
			});
		}

        var initLoad = function() {
            if(currentMode=='NEW'){
                vm.headerName = 'New trade finance';
                vm.isNewMode = true;
                vm.isSupplier = false;
            }else if(currentMode=='EDIT'){
                vm.headerName = 'Edit trade finance';
                vm.isNewMode = false;
                if($stateParams.data == ''){
                    log.error("Trade finance data is null.");
                    PageNavigation.gotoPage('/trading-partners');
                }else{
                    var sponsorId = $stateParams.data.sponsorId;
                    var supplierId = $stateParams.data.supplierId;
                    var accountId = $stateParams.data.accountId;
                    _getTradeFinanceInfo(sponsorId,supplierId,accountId);
                }
            }
        }();

        vm.openCalendarAgreementDate = function() {
			vm.openAgreementDate = true;
		}

		vm.openCalendarCreditExpirationDate = function() {
			vm.openCreditExpirationDate = true;
		}
        
        vm.openCalendarActiveDate = function() {
            vm.openActiveDate = true;
        };
        
        vm.openCalendarExpireDate = function() {
            vm.openExpireDate = true;
        };

        vm.add = function(){
            var organizeId = null;
            if(vm.tradeFinanceModel.borrower == "BUYER"){
                organizeId = borrower.sponsorId;
            }else{
                organizeId = borrower.supplierId;
            }
        	if(vm.tradeFinanceModel.borrower){
        		UIFactory.showDialog({
            		templateUrl: '/js/app/modules/trading-partner/financing/templates/dialog-new-account.html',
            		controller: 'AccountController',
            		data: {organizeId: organizeId},
            		preCloseCallback : function(data){
            			if(data){
            				vm.tradeFinanceModel.financeAccount = prepareAutoSuggestLabel(data.accountId,data.accountNo);
            			}
            		}
    			});
        	}
        }

        var _save = function(){
            var sponsorId = borrower.sponsorId;
            var supplierId = borrower.supplierId;
            var tradeFinanceModule = {
                sponsorId : vm.isSupplier? borrower.supplierId:borrower.sponsorId,
                supplierId : vm.isSupplier? borrower.sponsorId:borrower.supplierId,
                accountId : vm.tradeFinanceModel.financeAccount.accountId,
                limitExpiryDate : vm.tradeFinanceModel.creditExpirationDate,
                tenor : vm.tradeFinanceModel.tenor,
                prePercentageDrawdown : vm.tradeFinanceModel.percentageLoan,
                interestRate : vm.tradeFinanceModel.interestRate,
                agreementDate : vm.tradeFinanceModel.agreementDate,
                suspend : vm.tradeFinanceModel.isSuspend,
                borrowerType : vm.isSupplier? "SUPPLIER":"BUYER"
            }

            var deferred = TradeFinanceService.createTradeFinance(sponsorId,supplierId,tradeFinanceModule,vm.isSupplier);
            deferred.promise.then(function(response){}).catch(function(response){
            	if (response) {
                    if(Array.isArray(response.data)){
                        response.data.forEach(function(error){
                            $scope.errors[error.errorCode] = {
                                message : error.errorMessage
                            };
                        });
                    }
                }
                deferred.reject(response);
            });
            return deferred;
        }

        var _update = function(){
            var sponsorId = borrower.sponsorId;
            var supplierId = borrower.supplierId;

            if(vm.tradeFinanceModel.creditExpirationDate == "Invalid Date"){
                vm.tradeFinanceModel.creditExpirationDate = null;
            }

            var tradeFinanceModule = {
                sponsorId : sponsorId,
                supplierId : supplierId,
                accountId : vm.tradeFinanceModel.financeAccount.accountId,
                limitExpiryDate : vm.tradeFinanceModel.creditExpirationDate,
                tenor : vm.tradeFinanceModel.tenor,
                prePercentageDrawdown : vm.tradeFinanceModel.percentageLoan,
                interestRate : vm.tradeFinanceModel.interestRate,
                agreementDate : vm.tradeFinanceModel.agreementDate,
                suspend : vm.tradeFinanceModel.isSuspend,
                version: $stateParams.data.version
            }
            var deferred = TradeFinanceService.updateTradeFinance(sponsorId,supplierId,tradeFinanceModule.accountId,tradeFinanceModule);
            deferred.promise.then(function(response){}).catch(function(response){
            	if (response) {
            		if(Array.isArray(response.data)){
                        response.data.forEach(function(error){
                            $scope.errors[error.errorCode] = {
                                message : error.errorMessage
                            };
                        });
                    }
                }
                deferred.reject(response);
            });
            return deferred;
        }

        var _validate = function(){
            $scope.errors = {};
            var valid = true;

            if(!angular.isObject(vm.tradeFinanceModel.financeAccount)){
                valid = false;
                $scope.errors.financeAccount = {
                    message : 'Loan account is required.'
                }
            }

            if(vm.tradeFinanceModel.tenor == null || vm.tradeFinanceModel.tenor ==''){
                valid = false;
                $scope.errors.tenor = {
                    message : 'Tenor (Day) is required.'
                }
            }

            if(vm.isSupplier){
                if(vm.tradeFinanceModel.percentageLoan == null || vm.tradeFinanceModel.percentageLoan == ''){
                    valid = false;
                    $scope.errors.percentageLoan = {
                        message : 'Percentage loan (%) is required.'
                    }
                }
            }

            if(!angular.isDefined(vm.tradeFinanceModel.agreementDate) || vm.tradeFinanceModel.agreementDate == null){
                var agreementDate = document.getElementById("agreement-date-textbox").value;
                if(agreementDate != null && agreementDate != ''){
                    valid = false;
                    $scope.errors.agreementDate = {
                        message : 'Wrong date format data.'
                    }
                }else{
                    valid = false;
                    $scope.errors.agreementDate = {
                        message : 'Agreement date is required.'
                    }
                }
                
            }
            
            if(vm.isUseExpireDate){
                if(!angular.isDefined(vm.tradeFinanceModel.creditExpirationDate) || vm.tradeFinanceModel.creditExpirationDate == null){
                    var creditExpirationDate = document.getElementById("credit-expiration-date-textbox").value;
                    if(creditExpirationDate != null && creditExpirationDate != ''){
                        valid = false;
                        $scope.errors.creditExpirationDate = {
                            message : 'Wrong date format data.'
                        }
                    }else{
                        valid = false;
                        $scope.errors.creditExpirationDate = {
                            message : 'Credit expiration date is required.'
                        }
                    }
                }
            }
            return valid;
        }
		
        vm.save = function(){
            if(_validate()){
                var preCloseCallback = function(confirm) {
                    PageNavigation.gotoPreviousPage();
                }

                UIFactory.showConfirmDialog({
                    data : {
                        headerMessage : 'Confirm save?'
                    },
                    confirm : function() {
                        if(currentMode=='NEW'){
                            return _save();
                        }
                        else if(currentMode=='EDIT'){
                            return _update();
                        }
                    },
                    onFail : function(response) {
                        var status = response.status;
                        if(status!=400){
                        	var msg = {
                                404 : "Trade finance has been deleted.",
                                405 : "Trade finance has been used.",
                                409 : (vm.isNewMode? "Trade finance is existed.": 'Trade finance has been modified.')
                            }
                            UIFactory.showFailDialog({
                                data : {
                                    headerMessage : vm.isNewMode? 'Add new trade finance fail.':'Edit trade finance fail.',
                                    bodyMessage : msg[status] ? msg[status] : response.errorMessage
                                },
                                preCloseCallback : preCloseCallback
                            });
                        }
                        
                    },
                    onSuccess : function(response) {
                        UIFactory.showSuccessDialog({
                            data : {
                                headerMessage : vm.isNewMode? 'Add new trade finance success.':'Edit trade finance complete.',
                                bodyMessage : ''
                            },
                            preCloseCallback : preCloseCallback
                        });
                    }
                });
            }
        }
        
        vm.setCreditExpirationDate = function(){
            if(!vm.isUseExpireDate){
                vm.tradeFinanceModel.creditExpirationDate = null;
            }
        }

        vm.cancel = function(){
            PageNavigation.gotoPreviousPage();
        }

        var _clearCriteria = function(){
            vm.tradeFinanceModel.financeAccount = null;
            vm.tradeFinanceModel.tenor  = null;
            vm.tradeFinanceModel.percentageLoan = null;
            vm.tradeFinanceModel.interestRate  = null;
            vm.tradeFinanceModel.agreementDate = currentDate;
            vm.tradeFinanceModel.creditExpirationDate = null;
            vm.tradeFinanceModel.isSuspend = false;
            vm.isUseExpireDate = false;
            $scope.errors = {};
        }

        vm.changeBorrower = function(){
            if(vm.tradeFinanceModel.borrower == "SUPPLIER"){
                vm.isSupplier = true;
            }else{
                vm.isSupplier = false;
            }
            _clearCriteria();
        }

    } ]);