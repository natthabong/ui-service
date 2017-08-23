'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule.controller('EditMappingDataController', [
        '$scope',
        '$rootScope',
		'$stateParams',
		'UIFactory',
		'PageNavigation',
		'PagingController',
		'MappingDataService',
		'$log',
        function($scope, $rootScope, $stateParams, UIFactory, PageNavigation,
				PagingController, MappingDataService,$log){

            var vm = this;
			var log = $log;
			var defalutData = $stateParams.mappingData;
			var hideSignFlag = false;
			if(defalutData == null){
				PageNavigation.gotoPage('/organize-list/bank');
			}else{
				hideSignFlag = defalutData.mappingType == 'TEXT_MAPPING'? true:false;
			}
			

            vm.criteria = {};
            
            vm.dataTable = {
				columns : [
					{
						fieldName : '$rowNo',
						labelEN : 'No.',
						labelTH : 'No.',
						id : 'No-{value}',
						sortable : false,
						cssTemplate : 'text-left',
					},{
						fieldName : 'code',
						labelEN : 'Code',
						labelTH : 'Code',
						id : 'code-{value}',
						sortable : false,
						cssTemplate : 'text-left',
					},{
						fieldName : 'display',
						labelEN : 'Display',
						labelTH : 'Display',
						idValueField : '$rowNo',
						id : 'display-{value}-label',
						sortable : false,
						cssTemplate : 'text-left',
					},{
						fieldName : 'signFlag',
						labelEN : 'Sign flag',
						labelTH : 'Sign flag',
						idValueField :'$rowNo',
						id : 'sign-flag-{value}',
						sortable : false,
						cssTemplate : 'text-left',
						hiddenColumn: hideSignFlag,
						dataRenderer: function(record){
							if(record.signFlag){
								record = "Positive";
							}else{
								record = "Negative ";
							}
							return record;
						},
					},{
						fieldName: 'action',
						cssTemplate: 'text-center',
						sortData: false,
						cellTemplate: '<scf-button id="mapping-data-{{$parent.$index+1}}-edit-button" class="btn-default gec-btn-action" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
									+ '<scf-button id="mapping-data-{{$parent.$index+1}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteMappingData(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
					}
				]
			}


			vm.loadData = function(pagingModel){
				vm.pagingController.search(pagingModel);
			}
			
			var initialPaging = function(criteria){
				var uri = 'api/v1/organize-customers/'+criteria.ownerId+'/accounting-transactions/'+criteria.accountingTransactionType+'/mapping-datas/'+criteria.mappingDataId+'/items';
				vm.pagingController = PagingController.create(uri, vm.criteria, 'GET');
				vm.loadData();
			}

            var init = function() {
				if(defalutData != null){
					var deffered = MappingDataService.getMappingData(defalutData);
					deffered.promise.then(function(response){
						vm.criteria = response.data;
						initialPaging(vm.criteria);
					}).catch(function(response){
						log.error("Can not load mapping data !")
					});
				}
			}();

			
			vm.deleteMappingData = function(mappingItem){
				var preCloseCallback = function(confirm) {
					vm.loadData();
				}

				UIFactory.showConfirmDialog({
					data: { 
						headerMessage: 'Confirm delete?'
					},
					confirm: function(){
						return MappingDataService.deleteMappingData(vm.criteria,mappingItem);
					},
					onFail: function(response){
						var msg = {409:'Role has been deleted.', 405:'Role has been used.'};
						UIFactory.showFailDialog({
						data: {
							headerMessage: 'Delete role fail.',
							bodyMessage: msg[response.status]?msg[response.status]:response.statusText
						},
						preCloseCallback: preCloseCallback
						});
					},
					onSuccess: function(response){
						UIFactory.showSuccessDialog({
						data: {
							headerMessage: 'Delete role success.',
							bodyMessage: ''
						},
						preCloseCallback: preCloseCallback
						});
					}
				});
			} 

			vm.back = function(){
				PageNavigation.gotoPreviousPage(false);
			}

        }
]);