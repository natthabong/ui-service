angular
		.module('scfApp')
		.controller(
				'InternalStepDashboardController',
				[
						'$log',
						'$scope',
						'$state',
						'SCFCommonService',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'PagingController',
						'Service',
						function($log, $scope, $state, SCFCommonService, $stateParams, $timeout,
								PageNavigation, PagingController, Service) {
							var vm = this;
							var log = $log;
							var organizeId = $scope.userInfo.organizeId;
							vm.dashboardItem = $scope.$parent.$parent.dashboardItem;
							vm.criteria = {
									supplierId: organizeId,
									orders: vm.dashboardItem.orderItems
							}
							
							vm.view = function(data){		
								SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
								var params = { transactionModel: data,
										party: 'supplier',
							            isShowViewHistoryButton: false,
							            isShowBackButton: true
							        }
								PageNavigation.gotoPage('/view-transaction',params,params)
							}
							
							vm.decodeBase64 = function(data){
								if(angular.isUndefined(data)){
									return '';
								}
								return atob(data);
							}
							
							if(vm.dashboardItem.headerLabel == 'Transaction result'){
								vm.pagingController = PagingController.create('api/v1/transactions/transaction-result', vm.criteria, 'GET');
								
							}else{
								vm.pagingController = PagingController.create('api/v1/transactions/internal-step', vm.criteria, 'GET');
							}
							

							vm.dataTable = {
								columns : [
										{
										    fieldName: '$rowNo',
											labelEN: 'No.',
										    labelTH: 'ลำดับที่',
										    idValueField: '$rowNo',
										    id: 'internal-step-{value}-no',
										    cssTemplate: 'text-center',	
										},
										{
										    labelEN: 'TP',
										    labelTH: 'TP',
										    sortData: true,
										    cssTemplate: 'text-center',
											cellTemplate: '<img	title="{{data.sponsor}}" style="height: 32px; width: 32px;"	'+
											'data-ng-src="data:image/png;base64,{{internalStepCtrl.decodeBase64(data.sponsorLogo)}}" data-err-src="images/png/avatar.png" />'
										}, {
											fieldName: 'transactionNo',
											labelEN: 'Transaction No',
											labelTH: 'Transaction No',
											idValueField: '$rowNo',
							                id: 'internal-step-{value}-transaction-no',
							                sortData : true,
											cssTemplate : 'text-center'
										}, {
											fieldName: 'sponsorPaymentDate',
											labelEN: 'Sponsor payment date',
											labelTH: 'Sponsor payment date',
											idValueField: '$rowNo',
							                id: 'internal-step-{value}-sponsor-payment-date',
							                filterType : 'date',
											filterFormat : 'dd/MM/yyyy',
											sortData : true,
											cssTemplate : 'hidden-xs hidden-sm text-center'
										}, {
											fieldName: 'noOfDocument',
											labelEN: 'No of document',
											labelTH: 'No of document',
											idValueField: '$rowNo',
							                id: 'internal-step-{value}-no-of-document',
							                sortData : true,
											cssTemplate : 'hidden-xs hidden-sm text-center'
										}, {
											fieldName: 'transactionAmount',
											labelEN: 'Transaction amount',
											labelTH: 'Transaction amount',
											idValueField: '$rowNo',
							                id: 'internal-step-{value}-transaction-amount',
							                sortData : true,
											cssTemplate : 'text-right',
											filterType : 'number',
											filterFormat : '2'
										}, {
											fieldName: 'statusCode',
											labelEN: 'Status',
											labelTH: 'Status',
											idValueField: '$rowNo',
							                id: 'internal-step-{value}-transaction-status',
							                sortData : true,
											filterType : 'translate',
											cssTemplate : 'text-center'
										}, {
											fieldName: '',
											labelEN: '',
											labelTH: '',
											cssTemplate: 'hidden-xs hidden-sm text-center',
											sortData: false,
											cellTemplate: '<scf-button class="btn-default gec-btn-action" id="transaction-{{data.transactionNo}}-view-button" title="View a transaction" ng-click="internalStepCtrl.view(data)"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></scf-button>'
										}]
							};

							
							vm.loadData = function(pagingModel){
						    	vm.pagingController.search(pagingModel);
						    }

							vm.decodeBase64 = function(data) {
								return atob(data);
							}
							
							vm.initLoad = function(pagingModel) {
								vm.loadData(pagingModel);
							}
							
							vm.initLoad();
							
						} ]);