angular.module('scfApp').controller('SupplierCreditInformationController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', '$rootScope',
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http ,$rootScope){
		var vm = this;

		vm.documentListModel = {
			sponsor : undefined,
			supplier : undefined,
			supplierCode : undefined,
			documentNo : undefined
		}

		vm.data = [];
		
		var querySupplierCode = function(value) {
			// var sponsorId = organizeId;
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

		var requireSupplier = false
		
		vm.search = function(){
			console.log("hi")
			console.log(vm.documentListModel.supplier)
			var supplier = vm.documentListModel.supplier.organizeId;
			console.log(supplier)
			if(supplier != '' && supplier!= null){
				var dataSource = $http({url:'/api/credit-information/get', method: 'GET',params: {organizeId:supplier}});
				dataSource.success(function(response) {						
					vm.data = response.content;
					console.log(vm.data)
					i = 0;
					angular.forEach(vm.data, function(value, idx) {
						if(vm.isSameAccount(value.accountId, vm.data, idx)){
							value.rowNo = ++i;
							value.showAccountFlag = true;
						}
					});
				});
			}
		}
		
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

		vm.initLoad = function() {
		}

		vm.initLoad();
}]);