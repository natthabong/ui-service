'use strict';
var tpModule = angular.module('gecscf.tradingPartner');
tpModule.controller('TradingPartnerController', [
        '$scope',
		'$stateParams',
		'UIFactory',
		'PageNavigation',
		'PagingController',
		'TradingPartnerService',
        '$log',
        '$timeout',
        function($scope, $stateParams, UIFactory, PageNavigation,
				PagingController, TradingPartnerService, $log,$timeout){

            var vm = this;
            var log = $log;
            vm.tradingPartner = {
            	createTransactionType: 'WITH_INVOICE'
            };
            // vm.tradingPartner.createTransactionType = 'WITH_INVOICE';
            vm.organizeListModel = {
                buyer : undefined,
                supplier : undefined
            }
            var mode = {
                NEW : 'newTradingPartner',
		    	EDIT : 'editTradingPartner'
            }
            var currentMode = $stateParams.mode;

            var _prepareItem = function(item) {
        		item.identity = [ 'organize-', item.organizeId, '-option' ].join('');
        		item.label = [ item.organizeId, ': ', item.organizeName ].join('');
        		return item;
        	}
            
            vm.loadTradingPartner = function(){
                if(currentMode == mode.EDIT){
                    vm.isNewMode = false;
                    vm.isEditMode = true;

                    var sponsorId = $stateParams.selectedItem.sponsorId;
                    var supplierId = $stateParams.selectedItem.supplierId;

                    var deffered = TradingPartnerService.findTradingPartnerBySponsorIdAndSupplierId(sponsorId, supplierId);
                    deffered.promise.then(function(response) {
                        console.log(response.data);
                        vm.tradingPartner = response.data;
                        var sponsorOrganize = _prepareItem(vm.tradingPartner.sponsorOrganize);
                        vm.organizeListModel.buyer = sponsorOrganize;
                        var supplierOrganize = _prepareItem(vm.tradingPartner.supplierOrganize);
                        vm.organizeListModel.supplier = supplierOrganize;

                    
                    }).catch(function(response) {
                        log.error('Get trading partner fail');
                    });

                }else{
                    vm.isNewMode = true;
                    vm.isEditMode = false;
                }
            }

            $scope.cancel = function() {
                $timeout(function(){
                    PageNavigation.backStep();
                }, 10);
            }

            var _save = function(tp){
                var deferred = TradingPartnerService.createTradingPartner(tp, vm.isEditMode);
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

            $scope.save = function() {
                if(_validate()){
                    var preCloseCallback = function(confirm) {
					PageNavigation.backStep(true);
				    }

				    UIFactory.showConfirmDialog({
					data : {
						headerMessage : 'Confirm save?'
					},
					confirm : function() {
						return _save(vm.tradingPartner);
					},
					onFail : function(response) {
					     if(response.status != 400){
                             var msg = {
                            		 404 : 'Trading partner has been deleted.',
                            		 405 : 'Trading partner is existed.',
                            		 409 : 'Trading partner has been modified.'
                             };
			    		 	UIFactory.showFailDialog({
                                 data : {
                                     headerMessage : vm.isNewMode? 'Add new trading partner fail.':'Edit trading partner fail.',
                                     bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
                                 },
                                 preCloseCallback : preCloseCallback
                             });
					     }
					},
					onSuccess : function(response) {
						UIFactory.showSuccessDialog({
							data : {
								headerMessage : vm.isNewMode? 'Add new trading partner success.':'Edit trading partner complete.',
								bodyMessage : ''
							},
							preCloseCallback : preCloseCallback
						});
					}
				    });
                }
                
            }

            var isRequire = function(data) {
                return (data == '' || data == null);
            }

            var _validate = function(){
                $scope.errors = {};
                var valid = true;
                if(angular.isDefined(vm.organizeListModel.buyer) && !isRequire(vm.organizeListModel.buyer.organizeId) ){
                    vm.tradingPartner.sponsorId = vm.organizeListModel.buyer.organizeId;
                }else{
                    valid = false;
				    $scope.errors.sponsorId = {
					message : 'Buyer is required.'
				    }
                }

                if(angular.isDefined(vm.organizeListModel.supplier) && !isRequire(vm.organizeListModel.supplier.organizeId)){
                    vm.tradingPartner.supplierId = vm.organizeListModel.supplier.organizeId;
                }else{
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
            
            vm.supplierAutoSuggestModel = UIFactory
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