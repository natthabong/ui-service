angular
		.module('scfApp')
		.controller(
				'ProfileController',
				[
						'SCFCommonService',
						'$log',
						'$scope',
						'$rootScope',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'Service',
						function(SCFCommonService, $log, $scope,$rootScope, $stateParams, $timeout,
								PageNavigation, Service) {
							var vm = this;
							vm.sponsorName = '';
							vm.organizeData = {};
							
						    if($stateParams.organizeModel != null){
						    	vm.organizeModel = $stateParams.organizeModel;	
						    }else{
						    	vm.organizeModel = $rootScope.organizeModel;
						    }
						    
							vm.initLoad = function() {						
								var serviceUrl = '/api/v1/organize-customers/'+vm.organizeModel.organizeId+'/profile';
								var serviceDiferred = Service.doGet(serviceUrl, {});		
								serviceDiferred.promise.then(function(response){
									vm.organizeData = response.data;
								}).catch(function(response){
									log.error('Load customer code group data error');
								});
							}

							vm.initLoad();
						} ]);