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

            $scope.cancel = function() {
                PageNavigation.gotoPreviousPage();
            }

            $scope.save = function() {
            
            }

            var _organizeBuyer = function(query) {
                var deffered = TradingPartnerService.getOrganizeByNameOrCodeLike(query);
                deffered.promise.then(function(response) {
                    response.data.map(function(item) {
                        item.identity = [ 'buyer-', item.organizeId, '-option' ].join('');
                        item.label = [ item.organizeId, ': ', item.organizeName ].join('');
                        return item;
                    });
                });
                return deffered;
            }

            var _organizeSupplier = function(query) {
                var deffered = TradingPartnerService.getOrganizeByNameOrCodeLike(query);
                deffered.promise.then(function(response) {
                    response.data.map(function(item) {
                        item.identity = [ 'supplier-', item.organizeId, '-option' ].join('');
                        item.label = [ item.organizeId, ': ', item.organizeName ].join('');
                        return item;
                    });
                });
                return deffered;
            }
            
            vm.buyerAutoSuggestModel = UIFactory
                .createAutoSuggestModel({
                    placeholder : 'Please enter orgainze name or code',
                    itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
                    query : _organizeBuyer
                });

            vm.supplierAutoSuggestModel = UIFactory
                .createAutoSuggestModel({
                    placeholder : 'Please enter orgainze name or code',
                    itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
                    query : _organizeSupplier
                });

            var init = function() {
			    vm.loadTradingPartner();
			}();

        }
]);