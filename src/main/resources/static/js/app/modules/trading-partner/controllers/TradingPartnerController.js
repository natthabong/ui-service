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
        function($scope, $stateParams, UIFactory, PageNavigation,
				PagingController, TradingPartnerService, $log){

            var vm = this;
            var log = $log;
            vm.tradingPartner = {};
            vm.organizeListModel = {
                buyer : undefined,
                supplier : undefined
            }
            var mode = {
                NEW : 'newTradingPartner',
		    	EDIT : 'editTradingPartner'
            }
            var currentMode = $stateParams.mode;

            vm.loadTradingPartner = function(){
                if(currentMode == mode.EDIT){
                    vm.isNewMode = false;
                    vm.isEditMode = true;

                    var sponsorId = $stateParams.selectedItem.sponsorId;
                    var supplierId = $stateParams.selectedItem.supplierId;

                    var deffered = TradingPartnerService.findTradingPartnerBySponsorIdAndSupplierId(sponsorId, supplierId);
                    deffered.promise.then(function(response) {

                        console.log(response);
                        vm.tradingPartner = response.data;

                    
                    }).catch(function(response) {
                        log.error('Get trading partner fail');
                    });

                }else{
                    vm.isNewMode = true;
                    vm.isEditMode = false;
                }
            }

            $scope.cancel = function() {
                PageNavigation.gotoPreviousPage();
            }

            var _save = function(tp){
                console.log(tp);
                var deferred = TradingPartnerService.createTradingPartner(tp);
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
                var tp = vm.tradingPartner;
                if(_validate()){
                    var preCloseCallback = function(confirm) {
					PageNavigation.gotoPreviousPage(true);
				    }

				    UIFactory.showConfirmDialog({
					data : {
						headerMessage : 'Confirm save?'
					},
					confirm : function() {
						return _save(tp);
					},
					onFail : function(response) {
					    // if(response.status != 400){
                        //     var msg = {
                        //             409 : 'Trading partner has been modified.'
                        //     };
			    		// 	UIFactory.showFailDialog({
                        //         data : {
                        //             headerMessage : vm.isNewMode? 'Add new user fail.':'Edit user fail.',
                        //             bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
                        //         },
                        //         preCloseCallback : preCloseCallback
                        //     });
					    // }
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

            var _validate = function(){
                $scope.errors = {};
                var valid = true;
                if(angular.isDefined(vm.organizeListModel.buyer)){
                    vm.tradingPartner.sponsorId = vm.organizeListModel.buyer.organizeId;
                }else{
                    valid = false;
				    $scope.errors.sponsorId = {
					message : 'Buyer is required.'
				    }
                }

                if(angular.isDefined(vm.organizeListModel.supplier)){
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

            var init = function() {
			    vm.loadTradingPartner();
			}();

        }
]);