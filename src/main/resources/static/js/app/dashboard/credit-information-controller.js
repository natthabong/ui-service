angular.module('scfApp').controller(
		'CreditInformationDashboardController',
		[
				'$log',
				'$scope',
				'$state',
				'$stateParams',
				'$timeout',
				'PageNavigation',
				'Service',
				'$rootScope',
				'$http', 
				'blockUI',
				'$q',
				'UIFactory',
				function($log, $scope, $state, $stateParams, $timeout,
						PageNavigation, Service, $rootScope, $http, blockUI, $q, UIFactory) {
					var vm = this;
					var organizeId = $rootScope.userInfo.organizeId;
					var log = $log;
					vm.index = 0;
					var dataSource = $http({url:'/api/credit-information/get', method: 'GET', params: {organizeId:organizeId}});
					
					dataSource.success(function(response) {						
		                vm.data = response.content;
		                i = 0;
		                angular.forEach(vm.data, function(value, idx) {
		                	if(vm.isSameAccount(value.accountId, vm.data, idx)){
		                		value.rowNo = ++i;
		                		value.showAccountFlag = true;
		                	}
		                });
		            });
					
					vm.decodeBase64 = function(data){
						return atob(data);
					}
					
					vm.isSameAccount = function(accountId, data, index){
						if(index == 0 ){
							return true;
						}
						else{
							return accountId != data[index-1].accountId;
						}
					}
					
					var closeDialogSucccess = function(){
						dialogPopup.close();
					}
					
					var closeDialogFail = function(){
						dialogPopup.close();
					}
					
					vm.inquiryAccount = function(data) {
						var preCloseCallback = function(confirm) {
							$scope.closeThisDialog();
						}
						blockUI.start("Processing...");
						var deferred = $q.defer();
						var tpAccountModel = {
							buyerId : data.buyerId,
							supplierId : data.supplierId,
							accountId : data.accountId,
						}			
						var inquiryAccountDeferred = inquiryAccountToApi(tpAccountModel);
						inquiryAccountDeferred.promise.then(function(response) {
							blockUI.stop();
							if(response.status==200){
								dialogPopup = UIFactory.showSuccessDialog({
									data: {
									    headerMessage: 'Inquiry credit information success.',
									    bodyMessage: ''
									},
									buttons : [{
										id: 'ok-button',
										label: 'OK',
										action:function(){
											closeDialogSucccess();
										}
									}],
									preCloseCallback: preCloseCallback
							    });
							}else{
							    dialogPopup = UIFactory.showFailDialog({
									data: {
									    headerMessage: 'Inquiry credit information failure',
									    bodyMessage: 'please try again.'
									},
									buttons : [{
										id: 'ok-button',
										label: 'OK',
										action:function(){
											closeDialogFail();
										}
									}],
									preCloseCallback: null
								});					
							}
						}).catch(function(response) {
							blockUI.stop();
						    dialogPopup = UIFactory.showFailDialog({
								data: {
								    headerMessage: 'Inquiry credit information failure',
								    bodyMessage: ' please try again.'
								},
								buttons : [{
										id: 'ok-button',
										label: 'OK',
										action:function(){
											closeDialogFail();
										}
									}],
								preCloseCallback: null
							});
				        });
						
					}
					
					
					function inquiryAccountToApi(tpAccountModel){
						var deferred = $q.defer();	
						$http({
							url: '/api/v1/update-credit-limit-from-bank',
							method: 'POST',
							data: tpAccountModel
						}).then(function(response){
							deferred.resolve(response);
						}).catch(function(response){
							deferred.reject(response);
						});	
						return deferred;
					}
				}]);