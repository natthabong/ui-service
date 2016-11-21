angular
		.module('scfApp')
		.controller(
				'ProfileController',
				[
						'SCFCommonService',
						'$log',
						'$scope',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'Service',
						function(SCFCommonService, $log, $scope, $stateParams, $timeout,
								PageNavigation, Service) {
							var vm = this;
							vm.sponsorName = '';
							vm.organizeData = {};
							vm.organizeModel = $stateParams.organizeModel;
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