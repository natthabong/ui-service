'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule.controller('EditMappingDataController', [
		'$stateParams',
		'$log',
		'UIFactory',
		'PageNavigation',
		'PagingController',
		'MappingDataService',
		
        function($stateParams, $log, UIFactory, PageNavigation,
				PagingController, MappingDataService){

            var vm = this;
			var log = $log;
			var model = $stateParams.mappingData || {
				mappingDataId: undefined,
				mappingType: 'TEXT_MAPPING'
			};
			var hideSignFlag = model.mappingType == 'TEXT_MAPPING'? true:false;

            vm.criteria = {};
            
            vm.dataTable = {
				identityField : 'code',
				columns : [
					{
						fieldName : '$rowNo',
						labelEN : 'No.',
						labelTH : 'No.',
						id : 'No-{value}',
						sortable : false,
						cssTemplate : 'text-right',
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
						id : 'display-{value}',
						sortable : false,
						cssTemplate : 'text-left',
					},{
						fieldName : 'signFlag',
						labelEN : 'Sign flag',
						labelTH : 'Sign flag',
						idValueField :'code',
						id : 'sign-flag-{value}',
						sortable : false,
						cssTemplate : 'text-left',
						hiddenColumn: hideSignFlag,
						dataRenderer: function(record){
							if(record.signFlag){
								record = "Negative";
							}else{
								record = "Positive";
							}
							return record;
						},
					},{
						fieldName: 'action',
						cssTemplate: 'text-center',
						sortData: false,
						cellTemplate: '<scf-button id="{{data.code}}-edit-button" class="btn-default gec-btn-action" ng-click="ctrl.editMappingDataCode(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
									+ '<scf-button id="{{data.code}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteMappingData(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
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
				if(model.mappingDataId != undefined){
					var deffered = MappingDataService.getMappingData(model);
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
						var msg = {409:'Code has been deleted.', 405:'Code has been used.'};
						UIFactory.showFailDialog({
						data: {
							headerMessage: 'Delete code fail.',
							bodyMessage: msg[response.status]?msg[response.status]:response.statusText
						},
						preCloseCallback: preCloseCallback
						});
					},
					onSuccess: function(response){
						UIFactory.showSuccessDialog({
						data: {
							headerMessage: 'Delete code success.',
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
			
			vm.newMappingDataCode = function(){
				var params = {
						mappingData : model
					};
					
				PageNavigation.gotoPage('/sponsor-configuration/mapping-data/code/new', params, {mappingData: model});
			}
			
			vm.editMappingDataCode = function(data){
				if(data.signFlag){
					data.signFlag = 1;
				}else{
					data.signFlag = 0;
				}
				
				var params = {
						mappingData : model,
						mappingDataItem: data
					};
					
				PageNavigation.gotoPage('/sponsor-configuration/mapping-data/code/edit', params, {mappingData: model});
			}

        }
]);