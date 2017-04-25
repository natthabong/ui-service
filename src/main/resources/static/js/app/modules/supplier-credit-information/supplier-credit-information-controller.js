angular.module('scfApp').controller('SupplierCreditInformationController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', '$rootScope', '$q','blockUI',
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http ,$rootScope,$q,blockUI){
		var vm = this;

		vm.documentListModel = {
			sponsor : undefined,
			supplier : undefined,
			supplierCode : undefined
		}

		vm.data = [];
		
		var querySupplierCode = function(value) {
			var supplierCodeServiceUrl = 'api/v1/suppliers';
			value = value = UIFactory.createCriteria(value);
			
			return $http.get(supplierCodeServiceUrl, {
				params : {
					q : value,
					offset : 0,
					limit : 5
				}
			}).then(function(response) {
				return response.data.map(function(item) {
					item.identity = [ 'supplier-', item.organizeId, '-option' ].join('');
					item.label = [ item.organizeId, ': ', item.organizeName ].join('');
					return item;
				});
			});
		};

		vm.supplierAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Enter organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySupplierCode
		});

		var prepareAutoSuggestLabel = function(item) {
			item.identity = [ 'sponsor-', item.organizeId, '-option' ].join('');
			item.label = [ item.organizeId, ': ', item.organizeName ].join('');
			return item;
		}

		var initSupplierAutoSuggest = function() {
			var supplierInfo = angular.copy($rootScope.userInfo);
			supplierInfo = prepareAutoSuggestLabel(supplierInfo);			
			vm.documentListModel.supplier = supplierInfo;		
		}

		vm.requireSupplier = false;

		vm.search = function(){
			var supplier = undefined;
			if(!angular.isUndefined(vm.documentListModel.supplier) && angular.isObject(vm.documentListModel.supplier)){
				supplier = vm.documentListModel.supplier.organizeId;
				var dataSource = $http({url:'/api/credit-information/get', method: 'GET',params: {organizeId:supplier}});
				dataSource.success(function(response) {						
					vm.data = response.content;
					console.log(vm.data)
					i = 0;
					angular.forEach(vm.data, function(value, idx) {
						if(isSameAccount(value.accountId, vm.data, idx)){
							value.rowNo = ++i;
							value.showAccountFlag = true;
						}
					});
				});
				vm.requireSupplier = false;
			}else{
				vm.requireSupplier = true;
			}
		}
		
		vm.decodeBase64 = function(data){
			return atob(data);
		}
					
		var isSameAccount = function(accountId, data, index){
			if(index == 0 ){
				return true;
			}
			else{
				return accountId != data[index-1].accountId;
			}
		}

		vm.inquiryAccount = function(data) {
			var preCloseCallback = function(confirm) {
				vm.search();
			}
			blockUI.start("Processing...");
			var deffered = $q.defer();
			var tpAccountModel = {
				sponsorId : data.sponsorId,
				supplierId : data.supplierId,
				accountId : data.accountId,
			}			
			var inquiryAccountDeffered = inquiryAccountToApi(tpAccountModel);
			inquiryAccountDeffered.promise.then(function(response) {
				blockUI.stop();
				if(response.status==200){
					UIFactory.showSuccessDialog({
						data: {
						    headerMessage: 'Inquiry credit information success.',
						    bodyMessage: ''
						},
						preCloseCallback: preCloseCallback
				    });
				}else{
				    UIFactory.showFailDialog({
						data: {
						    headerMessage: 'Inquiry credit information failure',
						    bodyMessage: 'please try again.'
						},
						preCloseCallback: null
					});					
				}
			}).catch(function(response) {
				blockUI.stop();
			    UIFactory.showFailDialog({
					data: {
					    headerMessage: 'Inquiry credit information failure',
					    bodyMessage: ' please try again.'
					},
					preCloseCallback: null
				});
	        });
			
		}
		
		function inquiryAccountToApi(tpAccountModel){
			var deffered = $q.defer();	
			$http({
				url: '/api/v1/update-credit-limit-from-bank',
				method: 'POST',
				data: tpAccountModel
			}).then(function(response){
				deffered.resolve(response);
			}).catch(function(response){
				deffered.reject(response);
			});	
			return deffered;
		}
}]);