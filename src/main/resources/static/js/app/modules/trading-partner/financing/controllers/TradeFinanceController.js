'use strict';
var tradeFinanceModule = angular.module('scfApp');
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
                console.log(response)
				return response.data.map(function(item) {
                    console.log(item)
					item.identity = [ 'account-', item.accountNo, '-option' ].join('');
					item.label = [ item.accountNo ].join('');
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

        var prepareAutoSuggestLabel = function(account) {
            var item = {
                accountNo : account,
                identity : [ 'account-', account, '-option' ].join(''),
                label : [ account ].join(''),
            }
			return item;
		}

        var initialTradeFinance = function(data){
            var tradeFinanceData = data;
            if(tradeFinanceData != null){
                vm.tradeFinanceModel.borrower = tradeFinanceData.borrowerId;
                vm.tradeFinanceModel.financeAccount = prepareAutoSuggestLabel(tradeFinanceData.accountNo);
                vm.tradeFinanceModel.tenor = tradeFinanceData.tenor;
                vm.tradeFinanceModel.percentageLoan = tradeFinanceData.prePercentageDrawdown;
                vm.tradeFinanceModel.interestRate = tradeFinanceData.interest_rate;
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
            console.log(vm.tradeFinanceModel)

            if(vm.tradeFinanceModel.financeAccount != null && angular.isObject(vm.tradeFinanceModel.financeAccount)){
                
            }else{
                valid = false;
                $scope.errors.financeAccount = {
                    message : 'Finance account is required.'
                }
            }

            if(vm.tradeFinanceModel.tenor != null){
                // vm.tradingPartner.sponsorId = vm.organizeListModel.buyer.organizeId;
            }else{
                valid = false;
                $scope.errors.tenor = {
                    message : 'Tenor (Day) is required.'
                }
            }

            if(vm.tradeFinanceModel.percentageLoan != null){
                // vm.tradingPartner.sponsorId = vm.organizeListModel.buyer.organizeId;
            }else{
                valid = false;
                $scope.errors.percentageLoan = {
                    message : 'Percentage loan (%) is required.'
                }
            }

            if(vm.tradeFinanceModel.agreementDate != null){
                if(angular.isDate(vm.tradeFinanceModel.agreementDate)){
                
                }else{
                    valid = false;
                    $scope.errors.agreementDate = {
                        message : 'Wrong date format data.'
                    }
                }
            }else{
                valid = false;
                $scope.errors.agreementDate = {
                    message : 'Agreement date is required.'
                }
            }

            if(vm.tradeFinanceModel.creditExpirationDate != null){
                if(angular.isDate(vm.tradeFinanceModel.creditExpirationDate)){
                
                }else{
                    valid = false;
                    $scope.errors.creditExpirationDate = {
                        message : 'Wrong date format data.'
                    }
                }
            }else{
                valid = false;
                $scope.errors.creditExpirationDate = {
                    message : 'Credit expiration date is required.'
                }
            }

            console.log($scope.error)
            
            return valid;
        }

        var initLoad = function() {
            if(currentMode=='NEW'){
                vm.headerName = 'New trade finance';
            }else if(currentMode=='EDIT'){
                vm.headerName = 'Edit trade finance';
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

        }
		
        vm.save = function(){
            console.log("Hi")
            if(_validate()){

            }
        }

        vm.cancel = function(){
            PageNavigation.gotoPreviousPage();
        }

    } ]);