var app = angular.module('scfApp');
		app.controller(
				'PaymentDateFormulaController',
				[
						'SCFCommonService',
						'$log',
						'$scope',
						'$stateParams',
						'$timeout',
						'ngDialog',
						'PageNavigation',
						'Service','UIFactory','$q','$http',
						function(SCFCommonService, $log, $scope, $stateParams, $timeout, ngDialog,
								PageNavigation, Service, UIFactory, $q, $http) {
							var vm = this;
							var log = $log;
							
							vm.viewAllConfig=false;
							vm.manageAllConfig=false;
							
							vm.sponsorId = $scope.sponsorId;
							
							vm.pageModel = {
								pageSizeSelectModel : '20',
								totalRecord : 0,
								currentPage : 0,
								clearSortOrder : false,
								page: 0,
								pageSize: 20
							};

							vm.pageSizeList = [ {
								label : '10',
								value : '10'
							}, {
								label : '20',
								value : '20'
							}, {
								label : '50',
								value : '50'
							} ];
							
							
							vm.decodeBase64 = function(data){
								if(angular.isUndefined(data)){
									return '';
								}
								return atob(data);
							}

							vm.dataTable = {
								options : {
								},
								columns : [
										{
											field : 'formulaName',
										    label: 'Formula name',
										    idValueField: 'template',
										    id: 'payment-date-formula-{value}',
										    sortData: true,
										    cssTemplate: 'text-left',
										},{
											field: '',
											label: '',
											cssTemplate: 'text-center',
											sortData: false,
											cellTemplate: '<scf-button id="payment-date-formula-{{data.formulaName}}-setup-button"  class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a payment date formula configs" ng-hide="!data.completed" ng-disabled="ctrl.unauthenConfig()"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
											'<scf-button id="payment-date-formula-{{data.formulaName}}-warning-setup-button"  class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a payment date formula configs" ng-hide="data.completed" ng-disabled="ctrl.unauthenConfig()"><img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/></scf-button>' +
											'<scf-button id="payment-date-formula-{{data.formulaName}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteFormula(data)" title="Delete a file layout" ng-disabled="!ctrl.manageAllConfig"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
										} ]
							};

							vm.data = []
							
							vm.config = function(data){		
								var params = {paymentDateFormulaModel: data};
								PageNavigation.gotoPage('/sponsor-configuration/payment-date-formulas/settings',params);
							}
							
							vm.search = function(){
								var serviceUrl = '/api/v1/organize-customers/'+$scope.sponsorId+'/sponsor-configs/SFP/payment-date-formulas';
								var serviceDiferred = Service.doGet(serviceUrl, {
									limit:  vm.pageModel.pageSizeSelectModel,
									offset: vm.pageModel.currentPage
								});		
								
								serviceDiferred.promise.then(function(response){
									vm.data = response.data;
					                vm.pageModel.totalRecord = response.headers('X-Total-Count');
					                vm.pageModel.totalPage = response.headers('X-Total-Page');
					                vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
								}).catch(function(response){
									log.error('Load payment date formula data error');
								});
							}
							
							vm.initLoad = function() {
				                vm.pageModel.currentPage = 0;
				                vm.pageModel.pageSizeSelectModel = '20';
				                
				                vm.search();
							}

							vm.initLoad();
							
							vm.unauthenConfig = function(){
								if(vm.viewAllConfig || vm.manageAllConfig){
									return false;
								}else{
									return true;
								}
							}
							
				            vm.formula = {
				                	paymentDateFormulaId : null,	
				                	formulaName: '',
				                	formulaType: 'CREDIT_TERM',
				                	sponsorId: vm.sponsorId,
				                	isCompleted: '0'
				            };
							
				            vm.openNewFormula = function(){
				            	vm.formula.paymentDateFormulaId = null,
				            	vm.formula.formulaName = '';
				            	vm.formula.formulaType = 'CREDIT_TERM';
				            	vm.formula.sponsorId = vm.sponsorId;
				            	vm.formula.isCompleted = '0'

				            	var dialog = ngDialog.open({
		                            id: 'new-formula-dialog',
		                            template: '/js/app/sponsor-configuration/file-layouts/dialog-new-formula.html',
		                            className: 'ngdialog-theme-default',
		                            controller: 'NewPaymentDateFormulaController',
		                            controllerAs: 'ctrl',
		                            scope: $scope,
		                            data: {
		                            	formula: vm.formula
		                            },
		                            cache: false,
		                            preCloseCallback: function() {
										vm.refershFormulaTable();
		                            }
			                    });	
				            						            					            		
				            };
				            
				    		vm.refershFormulaTable = function(){
				    			vm.search();
				    		}
				    		
				    		var deleteFormula = function(formula) {

							var serviceUrl = 'api/v1/organize-customers/'+ vm.sponsorId +'/sponsor-configs/SFP/payment-date-formulas/' + formula.paymentDateFormulaId;
							var deferred = $q.defer();
							$http({
								method : 'POST',
								url : serviceUrl,
								headers : {
									'If-Match' : formula.version,
									'X-HTTP-Method-Override': 'DELETE'
								},
								data: formula
							}).then(function(response) {
								return deferred.resolve(response);
							}).catch(function(response) {
								return deferred.reject(response);
							});
							return deferred;
						}

				    		
				    		vm.deleteFormula = function(formula) {
				    		    
				    		var preCloseCallback = function(confirm) {
				    		    vm.refershFormulaTable();
				    		}

				    		UIFactory.showConfirmDialog({
				    			data : {
				    				headerMessage : 'Confirm delete?'
				    			},
				    			confirm : function() {
				    				return deleteFormula(formula);
				    			},
				    			onFail : function(response) {
				    				var msg = {
				    					409 : 'Formula has been deleted.',
				    					405 : 'Formula has been used.'
				    				};
				    				UIFactory.showFailDialog({
				    					data : {
				    						headerMessage : 'Delete formula failed.',
				    						bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
				    					},
				    					preCloseCallback : preCloseCallback
				    				});
				    			},
				    			onSuccess : function(response) {
				    				UIFactory.showSuccessDialog({
				    					data : {
				    						headerMessage : 'Delete formula completed.',
				    						bodyMessage : ''
				    					},
				    					preCloseCallback : preCloseCallback
				    				});
				    			}
				    		});
				    	}
				    		
				    		
				            
						} ]);

app.controller('NewPaymentDateFormulaController', [ '$scope', '$rootScope','Service','PaymentDateFormulaService','ngDialog', function($scope, $rootScope, Service,PaymentDateFormulaService,ngDialog) {
	var vm = this;
	vm.formula = angular.copy($scope.ngDialogData.formula);
	vm.formula.formulaName = null;
	var sponsorId  = angular.copy($scope.ngDialogData.formula.sponsorId);
	vm.showMessageError = false;
	vm.messageError = null;

	vm.create = function(){
		console.log(vm.formula.formulaName)
		if(vm.formula.formulaName == null ||vm.formula.formulaName == ""){
			vm.showMessageError = true;
			vm.messageError = "Formula name is required";
		}else{
			var deffered = PaymentDateFormulaService.saveNewFormula(sponsorId,vm.formula);
			deffered.promise.then(function(response) {
				vm.showMessageError = false;
				vm.messageError = null;
				ngDialog.close()
			}).catch(function(response) {
				if(response.status == 500){
					vm.showMessageError = true;
					vm.messageError = "Formula name is exist";
				}
			});
		}
	}
} ]);
