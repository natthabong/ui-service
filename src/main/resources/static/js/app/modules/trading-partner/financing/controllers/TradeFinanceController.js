'use strict';
var tradeFinanceModule = angular.module('scfApp');
tradeFinanceModule.controller('TradeFinanceController',['$scope','$stateParams','UIFactory','PageNavigation','PagingController','$log',
    function($scope, $stateParams, UIFactory,PageNavigation, PagingController,$log) {

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

        vm.loanAccountAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Please enter supplier account no.',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySupplierCode
		});

        var querySupplierCode = function(value) {
			var sponsorId = vm.documentListModel.sponsor.organizeId;
			var supplierCodeServiceUrl = 'api/v1/suppliers';

			value = value = UIFactory.createCriteria(value);
			
			return $http.get(supplierCodeServiceUrl, {
				params : {
					q : value,
					sponsorId : sponsorId,
					offset : 0,
					limit : 5
				}
			}).then(function(response) {
				return response.data.map(function(item) {
					item.identity = [ 'supplier-', item.organizeId, '-option' ].join('');
					item.label = [ item.organizeId, ': ', item.organizeName ].join('');
					return item;
				});
			});
		};

        vm.tradeFinanceModel = {
            borrower : vm.borrowerModel[0].value,
            loanAccount : null,
            tenor : null,
            percentageLoan: null,
            interestRate : null,
            agreementDate: currentDate,
            creditExpirationDate: null,
            isSuspend: false
        };

        var initialTradeFinance = function(){
            var tradeFinanceData = $stateParams.data;
            console.log(tradeFinanceData)
            vm.tradeFinanceModel.borrower = tradeFinanceData.borrowerId;
            vm.tradeFinanceModel.loanAccount = tradeFinanceData.accountNo;
            vm.tradeFinanceModel.tenor = tradeFinanceData.tenor;
            vm.tradeFinanceModel.percentageLoan = tradeFinanceData.prePercentageDrawdown;
            vm.tradeFinanceModel.interestRate = tradeFinanceData.interestRate;
            vm.tradeFinanceModel.agreementDate = null;
            vm.tradeFinanceModel.creditExpirationDate = null;
            vm.tradeFinanceModel.isSuspend = false;
        }

        var initLoad = function() {
            if(currentMode=='NEW'){
                vm.headerName = 'New trade finance';
            }else if(currentMode=='EDIT'){
                vm.headerName = 'Edit trade finance';
                if($stateParams.data == ''){
                    log.error("Trade finance data is null.")
                    PageNavigation.gotoPage('/trading-partners');
                }
                initialTradeFinance();
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
            
        }

        vm.cancel = function(){
            PageNavigation.gotoPreviousPage();
        }

    } ]);