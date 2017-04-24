angular.module('scfApp').controller('SupplierCreditInformationController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', '$rootScope',
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http ,$rootScope){
		var vm = this;
		var organizeId = $rootScope.userInfo.organizeId;

		vm.documentListModel = {
			sponsor : undefined,
			supplier : undefined,
			supplierCode : undefined,
			documentNo : undefined
		}
		
		var querySupplierCode = function(value) {
			var sponsorId = organizeId;
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

		vm.initLoad = function() {
			vm.supplierAutoSuggestModel
		}

		vm.initLoad();
}]);