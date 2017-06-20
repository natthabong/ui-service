'use strict';
var tradeFinanceModule = angular.module('scfApp');
tradeFinanceModule.controller('TradeFinanceController',['$scope','$stateParams','UIFactory','PageNavigation','PagingController',
    function($scope, $stateParams, UIFactory,PageNavigation, PagingController) {

        var vm = this;

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
                label : '[Buyer] '+defaultVal.sponsorId+': '+defaultVal.sponsorName,
                value : defaultVal.sponsorId
            }, {
                label : '[Suppiler] '+defaultVal.supplierId+': '+defaultVal.supplierName,
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
            activeDate: null,
            expireDate: null,
            isSuspend: false
        };

        var initLoad = function() {
            if(currentMode=='NEW'){
                vm.headerName = 'New trade finance';
            }else if(currentMode=='EDIT'){
                vm.headerName = 'Edit trade finance';
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
			    

        vm.save = function(){
            
        }

        vm.cancel = function(){
            var param = {
                setupModel : defaultVal,
            }
            PageNavigation.gotoPage('/trade-finance/config',param,param);
        }

    } ]);