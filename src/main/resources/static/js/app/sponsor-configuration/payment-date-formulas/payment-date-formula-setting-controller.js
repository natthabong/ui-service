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
		'DataTableFactory',
		'FORMULA_TYPE_ITEM','PAGE_SIZE_ITEM',
		function(SCFCommonService, $log, $scope, $stateParams, $timeout,$rootScope,
				PageNavigation, Service, blockUI, DataTableFactory, FORMULA_TYPE_ITEM, PAGE_SIZE_ITEM) {

			var vm = this;
			var log = $log;
			
			var sponsorId = $rootScope.sponsorId;
			
			var selectedItem = $stateParams.paymentDateFormulaModel;
			var formulaId = selectedItem.paymentDateFormulaId;
			
			var BASE_URI = 'api/v1/organize-customers/' + sponsorId
			+ '/sponsor-configs/SFP';
			
			vm.periodData = [];
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
					cellTemplate: '<scf-button id="payment-period-{{data.paymentPeriodId}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a customer code groups"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
					'<scf-button id="payment-period-{{data.paymentPeriodId}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deletePeriod(data)" title="Delete a file layout"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
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
					vm.searchPeriod();
				}
				
			}

			vm.initLoad();
			
			
			vm.backToSponsorConfigPage = function(){
				PageNavigation.gotoPreviousPage();
			}
			
			vm.save = function() {
    			var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/payment-date-formulas';
    			var serviceDiferred = Service.requestURL(serviceUrl, vm.model, 'PUT');
    			blockUI.start();
    			serviceDiferred.promise.then(function(response) {
    				vm.backToSponsorConfigPage();
    				blockUI.stop();
				}); 
    			return promise;
    		};
			
		} ]);