'use strict';
var tpModule = angular.module('gecscf.tradingPartner');
tpModule.controller('TradingPartnerController', [
        '$scope',
		'$stateParams',
		'UIFactory',
		'PageNavigation',
		'PagingController',
		'TradingPartnerService',
        function($scope, $stateParams, UIFactory, PageNavigation,
				PagingController, TradingPartnerService){

            var vm = this;
            vm.tradingPartner = {};
            var mode = {
                NEW : 'newTradingPartner',
		    	EDIT : 'editTradingPartner'
            }
            var currentMode = $stateParams.mode;

            vm.loadTradingPartner = function(){
                if(currentMode == mode.EDIT){

                }else{
                    vm.isNewMode = true;
                    vm.isEditMode = false;
                }
            }

            var isRequire = function(data) {
                return (data == '' || data == null);
            }

            $scope.cancel = function() {
                PageNavigation.gotoPreviousPage();
            }

            $scope.save = function() {
                if(_validate(vm.tradingPartner)){

                }
                
            }

            var _validate = function(tradingPartner){
                $scope.errors = {};
                var valid = true;
                if (isRequire(tradingPartner.sponsorId)) {
				    valid = false;
				    $scope.errors.sponsorId = {
					message : 'Buyer is required.'
				    }
				}

                if (isRequire(tradingPartner.supplierId)) {
				    valid = false;
				    $scope.errors.supplierId = {
					message : 'Supplier is required.'
				    }
				}

                return valid;
            }

            var _organizes = function(query) {
                query = UIFactory.createCriteria(query);
                return TradingPartnerService.getOrganizeByNameOrCodeLike(query);
            }
            
            vm.organizeAutoSuggestModel = UIFactory
                .createAutoSuggestModel({
                    placeholder : 'Please enter orgainze name or code',
                    itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
                    query : _organizes
                });

            var init = function() {
			    vm.loadTradingPartner();
			}();

        }
]);