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
				'$filter',
				'AccountService',
				function($log, $scope, $state, $stateParams, $timeout,
						PageNavigation, Service, $rootScope, $http, blockUI, $q, UIFactory, $filter, AccountService) {
					var vm = this;
					var organizeId = $rootScope.userInfo.organizeId;
					var log = $log;
					vm.index = 0;
					
					vm.getAccountNoToDisplay = function(record){
						if(record.format){
							return $filter('accountNoDisplay')(record.accountNo);
						}else{
							return record.accountNo;
						}
						
					}
					
					vm.getCreditInformation = function(){
						var dataSource = $http({url:'/api/credit-information/get', method: 'GET',params: {organizeId:organizeId}});
						
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
					}
					
					vm.getCreditInformation();
					
					vm.decodeBase64 = function(data){
						return (data ? atob(data) : UIFactory.constants.NOLOGO);
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
					
					vm.enquiryAvailableBalance = function (data) {
						blockUI.start("Processing...");
						var deffered = null;
						var criteria = {
							buyerId: data.buyerId,
							supplierId: data.supplierId,
							accountId: data.accountId
						}

						if (data.accountType == 'LOAN') {
							deffered = AccountService.enquiryCreditLimit(criteria);
						} else {
							//overdraft
							deffered = AccountService.enquiryAccountBalance(criteria);
						}

						deffered.promise.then(function (response) {
							blockUI.stop();
							if (response.status == 200) {
								vm.getCreditInformation();
								UIFactory.showSuccessDialog({
									data: {
										headerMessage: 'Enquiry credit information success.',
										bodyMessage: ''
									},
									showOkButton: true,
								});
							} else {
								UIFactory.showFailDialog({
									data: {
										headerMessage: 'Enquiry credit information failure',
										bodyMessage: 'please try again.'
									},
									showOkButton: true,
								});
							}
						}).catch(function (response) {
							blockUI.stop();
							UIFactory.showFailDialog({
								data: {
									headerMessage: 'Enquiry credit information failure',
									bodyMessage: ' please try again.'
								},
								showOkButton: true,
							});
						});
					}
				}]);