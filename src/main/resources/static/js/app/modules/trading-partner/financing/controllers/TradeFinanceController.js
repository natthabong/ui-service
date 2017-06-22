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
        var defaultVal = $stateParams.params;

        if(currentMode=='NEW'){
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
                label : '[Supplier] '+defaultVal.supplierId+': '+defaultVal.supplierName,
                value : defaultVal.supplierId
            }
        ];

        var queryAccount = function(value) {
			var organizeId = vm.tradeFinanceModel.borrower;
			var accountServiceUrl = 'api/v1/organize-customers/'+organizeId+'/accounts';

			value = value = UIFactory.createCriteria(value);
			
			return $http.get(accountServiceUrl, {
				params : {
					q : value,
					offset : 0,
					limit : 5
				}
			}).then(function(response) {
				return response.data.map(function(item) {
                    var word1 = item.accountNo.substring(0,3);
                    var word2 = item.accountNo.substring(3,4);
                    var word3 = item.accountNo.substring(4, 9);
                    var word4 = item.accountNo.substring(9,10);
                    var accountNo = word1+'-'+word2+'-'+word3+'-'+word4;
					item.identity = [ 'account-', item.accountNo, '-option' ].join('');
					item.label = [ accountNo ].join('');
					return item;
				});
			});
		};

        vm.financeAccountAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Please enter supplier account no.',
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
            var word1 = accountNo.substring(0,3);
            var word2 = accountNo.substring(3,4);
            var word3 = accountNo.substring(4, 9);
            var word4 = accountNo.substring(9,10);
            var word = word1+'-'+word2+'-'+word3+'-'+word4;
            var item = {
                accountId : accountId,
                accountNo : accountNo,
                identity : [ 'account-', accountNo, '-option' ].join(''),
                label : [ word ].join(''),
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
                vm.tradeFinanceModel.borrower = tradeFinanceData.borrowerId;
                vm.tradeFinanceModel.financeAccount = prepareAutoSuggestLabel(tradeFinanceData.accountId,tradeFinanceData.accountNo);
                vm.tradeFinanceModel.tenor = tradeFinanceData.tenor;
                vm.tradeFinanceModel.percentageLoan = tradeFinanceData.prePercentageDrawdown;
                vm.tradeFinanceModel.interestRate = tradeFinanceData.interestRate;
                vm.tradeFinanceModel.agreementDate = new Date(tradeFinanceData.agreementDate);
                vm.tradeFinanceModel.creditExpirationDate = new Date(tradeFinanceData.limitExpiryDate);
                vm.tradeFinanceModel.isSuspend = tradeFinanceData.suspend;
            }
        }

        var getTradeFinanceInfo = function(sponsorId,supplierId,accountId){
			var defered = TradeFinanceService.getTradeFinanceInfo(sponsorId,supplierId,accountId);
			defered.promise.then(function(response) {
                initialTradeFinance(response.data)
			}).catch(function(response) {
				log.error('Get trading finance fail');
			});
		}

        var _validate = function(){
            $scope.errors = {};
            var valid = true;

            if(!angular.isObject(vm.tradeFinanceModel.financeAccount)){
                valid = false;
                $scope.errors.financeAccount = {
                    message : 'Finance account is required.'
                }
            }

            if(vm.tradeFinanceModel.tenor == null || vm.tradeFinanceModel.tenor ==''){
                valid = false;
                $scope.errors.tenor = {
                    message : 'Tenor (Day) is required.'
                }
            }

            if(vm.tradeFinanceModel.percentageLoan == null || vm.tradeFinanceModel.percentageLoan == ''){
                valid = false;
                $scope.errors.percentageLoan = {
                    message : 'Percentage loan (%) is required.'
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

        var initLoad = function() {
            if(currentMode=='NEW'){
                vm.headerName = 'New trade finance';
                vm.isNewMode = true;
            }else if(currentMode=='EDIT'){
                vm.headerName = 'Edit trade finance';
                vm.isNewMode = false;
                if($stateParams.data == ''){
                    log.error("Trade finance data is null.")
                    PageNavigation.gotoPage('/trading-partners');
                }else{
                    var sponsorId = $stateParams.data.sponsorId;
                    var supplierId = $stateParams.data.supplierId;
                    var accountId = $stateParams.data.accountId;
                    getTradeFinanceInfo(sponsorId,supplierId,accountId);
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
        	if(vm.tradeFinanceModel.borrower){
        		UIFactory.showDialog({
            		templateUrl: '/js/app/modules/trading-partner/financing/templates/dialog-new-account.html',
            		controller: 'AccountController',
            		data: {organizeId: vm.tradeFinanceModel.borrower},
            		preCloseCallback : function(data){
            			if(data){
            				vm.tradeFinanceModel.financeAccount = prepareAutoSuggestLabel(data.accountId,data.accountNo);
            			}
            		}
    			});
        	}
        	
        }

        var _save = function(){
            var sponsorId = defaultVal.sponsorId;
            var supplierId = defaultVal.supplierId;
            var tradeFinanceModule = {
                sponsorId : sponsorId,
                supplierId : supplierId,
                accountId : vm.tradeFinanceModel.financeAccount.accountId,
                limitExpiryDate : vm.tradeFinanceModel.creditExpirationDate,
                tenor : vm.tradeFinanceModel.tenor,
                prePercentageDrawdown : vm.tradeFinanceModel.percentageLoan,
                interest_rate : vm.tradeFinanceModel.interestRate,
                agreementDate : vm.tradeFinanceModel.agreementDate,
                suspend : vm.tradeFinanceModel.isSuspend,
            }
            var deferred = TradeFinanceService.createTradeFinance(sponsorId,supplierId,tradeFinanceModule);
            deferred.promise.then(function(response){}).catch(function(response){
                if (response) {
                    if(Array.isArray(response.data)){
                        response.data.forEach(function(error){
                            $scope.errors[error.code] = {
                                message : error.message
                            };
                        });
                    }
                }
                deferred.resolve(response);
            });
            return deferred;
        }

        var _update = function(){
            var sponsorId = defaultVal.sponsorId;
            var supplierId = defaultVal.supplierId;
            var tradeFinanceModule = {
                sponsorId : sponsorId,
                supplierId : supplierId,
                accountId : vm.tradeFinanceModel.financeAccount.accountId,
                limitExpiryDate : vm.tradeFinanceModel.creditExpirationDate,
                tenor : vm.tradeFinanceModel.tenor,
                prePercentageDrawdown : vm.tradeFinanceModel.percentageLoan,
                interest_rate : vm.tradeFinanceModel.interestRate,
                agreementDate : vm.tradeFinanceModel.agreementDate,
                suspend : vm.tradeFinanceModel.isSuspend,
                version: $stateParams.data.version
            }
            var deferred = TradeFinanceService.updateTradeFinance(sponsorId,supplierId,tradeFinanceModule.accountId,tradeFinanceModule);
            deferred.promise.then(function(response){}).catch(function(response){
                if (response) {
                    if(Array.isArray(response.data)){
                        response.data.forEach(function(error){
                            $scope.errors[error.code] = {
                                message : error.message
                            };
                        });
                    }
                }
                deferred.resolve(response);
            });
            return deferred;
        }
		
        vm.save = function(){
            if(_validate()){
                var preCloseCallback = function(confirm) {
                    PageNavigation.gotoPreviousPage(true);
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
                        UIFactory.showFailDialog({
                            data : {
                                headerMessage : vm.isNewMode? 'Add new trade finance fail.':'Edit trade finance fail.',
                                bodyMessage : response.message
                            },
                            preCloseCallback : preCloseCallback
                        });
                        
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

    } ]);