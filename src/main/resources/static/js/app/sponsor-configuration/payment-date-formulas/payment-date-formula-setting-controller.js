var app = angular.module('scfApp');
app.constant('FORMULA_TYPE_ITEM', [{
    formulaTypeName: 'Credit term',
    formulaType: 'CREDIT_TERM'
}]);
app.constant('PAGE_SIZE_ITEM',[ {
	label : '10',
	value : '10'
}, {
	label : '20',
	value : '20'
}, {
	label : '50',
	value : '50'
} ]);
app.factory('DataTableFactory', ['$q', '$http', '$sce', 'blockUI', function($q, $http, $sce, blockUI){
	
	var create = function(config){
		
		return {
			pageModel: {
				pageSizeSelectModel : '20',
				totalRecord : 0,
				currentPage : 0,
				clearSortOrder : false,
				page: 0,
				pageSize: 20
			},
			config: config
		}
	}
	
	return {
		create: create
	}
	
}]);
app.controller('PaymentDateFormulaSettingController', [
		'SCFCommonService',
		'$log',
		'$scope',
		'$stateParams',
		'$timeout',
		'$rootScope',
		'PageNavigation',
		'Service', 
		'blockUI',
		'ngDialog',
		'DataTableFactory',
		'FORMULA_TYPE_ITEM','PAGE_SIZE_ITEM',
		function(SCFCommonService, $log, $scope, $stateParams, $timeout,$rootScope,
				PageNavigation, Service, blockUI, ngDialog, DataTableFactory, FORMULA_TYPE_ITEM, PAGE_SIZE_ITEM) {

			var vm = this;
			var log = $log;
			
			var sponsorId = $rootScope.sponsorId;
			
			var selectedItem = $stateParams.paymentDateFormulaModel;
			var formulaId = selectedItem.paymentDateFormulaId;
			
			var BASE_URI = 'api/v1/organize-customers/' + sponsorId
			+ '/sponsor-configs/SFP';
			
			vm.periodData = [];
			vm.creditTermData = [];
			
			vm.periodTable = DataTableFactory.create({
				options : {},
				columns : [{
					fieldName : '$rowNo',
					labelEN: 'No.',
					cssTemplate: 'text-right'
				},{
					labelEN: 'Period',
				    idValueField: '$rowNo',
				    id: 'payment-period-{value}',
				    sortData: true,
				    cssTemplate: 'text-left',
				    cellTemplate: '{{data | paymentPeriod}}'
				}, {
					cssTemplate: 'text-center',
					sortData: false,
					cellTemplate: '<scf-button id="payment-period-{{data.paymentPeriodId}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a payment period"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
					'<scf-button id="payment-period-{{data.paymentPeriodId}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deletePeriod(data)" title="Delete  a payment period"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
				} ]
			});
			
			vm.creditTermTable = DataTableFactory.create({
				options : {},
				columns : [{
					fieldName : '$rowNo',
					labelEN: 'No.',
					cssTemplate: 'text-right'
				},{
					fieldName : 'creditTermCode',
					labelEN: 'Credit term code',
				    idValueField: '$rowNo',
				    id: 'credit-term-code-{value}',
				    sortData: true 
				},{
					labelEN: 'Formula',
				    idValueField: '$rowNo',
				    id: 'formula-{value}',
				    sortData: true ,
				    cellTemplate: '{{data | paymentDateFormula}}'
				},{
					labelEN: 'Period',
				    idValueField: '$rowNo',
				    id: 'period-{value}',
				    sortData: true ,
				    cellTemplate: '{{data.paymentPeriods | paymentPeriod}}'
				}, {
					cssTemplate: 'text-center',
					sortData: false,
					cellTemplate: '<scf-button id="credit-term-{{data.creditTermId}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.configCreditTerm(data)" title="Config a credit term"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
					'<scf-button id="credit-term-{{data.creditTermId}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteCreditTerm(data)" title="Delete a credit term"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
				} ]
			});

			vm.searchPeriod = function(){
				var serviceUrl = '/api/v1/organize-customers/'+sponsorId+'/sponsor-configs/SFP/payment-date-formulas/'+formulaId+'/periods';
				var serviceDiferred = Service.doGet(serviceUrl, {
					limit:  vm.periodTable.pageModel.pageSizeSelectModel,
					offset: vm.periodTable.pageModel.currentPage
				});		
				
				serviceDiferred.promise.then(function(response){
					vm.periodData = response.data;
	                vm.periodTable.pageModel.totalRecord = response.headers('X-Total-Count');
	                vm.periodTable.pageModel.totalPage = response.headers('X-Total-Page');
	                vm.periodSplitePageTxt = SCFCommonService.splitePage(vm.periodTable.pageModel.pageSizeSelectModel, vm.periodTable.pageModel.page, vm.periodTable.pageModel.totalRecord);
				}).catch(function(response){
					log.error('Load payment period data error');
				});
			}
			
			vm.searchCreditTerm = function(){
				var serviceUrl = '/api/v1/organize-customers/'+sponsorId+'/sponsor-configs/SFP/payment-date-formulas/'+formulaId+'/credit-terms';
				var serviceDiferred = Service.doGet(serviceUrl, {
					limit:  vm.creditTermTable.pageModel.pageSizeSelectModel,
					offset: vm.creditTermTable.pageModel.currentPage
				});		
				
				serviceDiferred.promise.then(function(response){
					vm.creditTermData = response.data;
	                vm.creditTermTable.pageModel.totalRecord = response.headers('X-Total-Count');
	                vm.creditTermTable.pageModel.totalPage = response.headers('X-Total-Page');
	                vm.creditTermSplitePageTxt = SCFCommonService.splitePage(vm.creditTermTable.pageModel.pageSizeSelectModel, vm.creditTermTable.pageModel.page, vm.creditTermTable.pageModel.totalRecord);
				}).catch(function(response){
					log.error('Load payment period data error');
				});
			}
	        
			vm.pageSizeList = PAGE_SIZE_ITEM;
			
			vm.formulaTypes = [];
			vm.model = {
			   formulaType: 'CREDIT_TERM'
			}
				
			var sendRequest = function(uri, succcesFunc, failedFunc) {
                var serviceDiferred = Service.doGet(BASE_URI + uri);

                var failedFunc = failedFunc | function(response) {
                    log.error('Load data error');
                };
                serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
            }
			
			var loadTypes = function() {
				FORMULA_TYPE_ITEM.forEach(function(obj) {
                    var selectObj = {
                        label: obj.formulaTypeName,
                        value: obj.formulaType
                    }

                    vm.formulaTypes.push(selectObj);
                });
            }
			
			vm.initLoad = function() {
				loadTypes();
				if(selectedItem.paymentDateFormulaId){
					var reqDataUrl = '/payment-date-formulas/'+ formulaId;;
					sendRequest(reqDataUrl, function(response) {
	                    vm.model = response.data;
	                   
	                });
					vm.searchCreditTerm();
					vm.searchPeriod();
				}
				
			}

			vm.initLoad();
			
			
			vm.backToSponsorConfigPage = function(){
				PageNavigation.gotoPreviousPage();
			}
			
			vm.save = function() {
    			var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/payment-date-formulas/'+formulaId;
    			var serviceDiferred = Service.requestURL(serviceUrl, vm.model, 'PUT');
    			blockUI.start();
    			serviceDiferred.promise.then(function(response) {
    				vm.backToSponsorConfigPage();
    				blockUI.stop();
				}); 
    		};
    		
			vm.deletePeriod = function(period) {
	        	 ngDialog.open({
	                 template: '/js/app/common/dialogs/confirm-dialog.html',
	                 scope: $scope,
	                 data: period,
	                 disableAnimation: true,
                     preCloseCallback: function(value) {
                        if (value !== 0) {
                        	vm.confirmDeletePeriod(value);
                        }
                        return true;
                    }
	             });
	        };
	        
	        vm.deleteCreditTerm = function(creditTerm) {
	        	 ngDialog.open({
	                 template: '/js/app/common/dialogs/confirm-dialog.html',
	                 scope: $scope,
	                 data: period,
	                 disableAnimation: true,
                    preCloseCallback: function(value) {
                       if (value !== 0) {
                       	vm.confirmDeleteCreditTerm(value);
                       }
                       return true;
                   }
	             });
	        };

			vm.confirmDeleteCreditTerm = function(creditTerm) {
				var serviceUrl = '/api/periods/'+ creditTerm.creditTermId;
    			var serviceDiferred = Service.requestURL(serviceUrl, vm.model, 'DELETE');
    			blockUI.start();
    			serviceDiferred.promise.then(function(response) {
    				vm.searchCreditTerm();
    				blockUI.stop();
				}); 
	        };
	        
	        
	        vm.confirmDeletePeriod = function(period) {
				var serviceUrl = '/api/credit-terms/'+ period.paymentPeriodId;
    			var serviceDiferred = Service.requestURL(serviceUrl, vm.model, 'DELETE');
    			blockUI.start();
    			serviceDiferred.promise.then(function(response) {
    				vm.searchPeriod();
    				blockUI.stop();
				}); 
	        };
			
		} ]);