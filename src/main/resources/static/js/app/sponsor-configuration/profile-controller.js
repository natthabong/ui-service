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
							vm.manageAllConfig = false;
							vm.viewAllConfig = false;
							vm.completed = false;
							
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
									
									if(vm.organizeData.organizeLogo != null){
										vm.completed = true;
									}
								}).catch(function(response){
									log.error('Load customer code group data error');
								});
							}
							
							vm.config = function(data){
								var params = {
										organizeInfo: data
								};
								PageNavigation.gotoPage('/sponsor-configuration/organize-logo/settings',params);
							}
							
							vm.decodeBase64 = function(data) {
								if (data == null || angular.isUndefined(data)) {
									return '';
								}
								return atob(data);
							}

							vm.initLoad();
							
							vm.unauthenConfig = function(){
								if(vm.manageAllConfig || vm.viewAllConfig){
									return false;
								}else{
									return true;
								}
							}
						} ]);