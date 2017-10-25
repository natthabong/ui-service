'use strict';
var sciModule = angular.module('gecscf.supplierCreditInformation');
sciModule.controller('SupplierCreditInformationController',[
	'$scope',
	'$stateParams',
	'UIFactory',
	'PagingController',
	'SupplierCreditInformationService',
	'SCFCommonService',
	'$http',
	function($scope,$stateParams, UIFactory,PagingController,SupplierCreditInformationService,SCFCommonService,$http) {
		var vm = this;
		
		vm.buyer = $stateParams.buyer || null;
		vm.supplier = $stateParams.supplier || null;
		
		vm.data = [];
		
		vm.search = function(){
			var buyer = undefined;
			var supplier = undefined;
			if(angular.isObject(vm.buyer)){
				if(angular.isObject(vm.supplier)){
					buyer = vm.buyer.organizeId;
					supplier = vm.supplier.organizeId;
				} else {
					buyer = vm.buyer.organizeId;
				}
			} else if(angular.isObject(vm.supplier)){
				supplier = vm.supplier.organizeId;
			} else {
				buyer = null;
				supplier = null;
			}
			var dataSource = $http({url:'/api/v1/supplier-credit-information', method: 'GET',params: {buyerId:buyer,supplierId:supplier}});
			//var dataSource = SupplierCreditInformationService.getCreditInformation(buyer,supplier);
			dataSource.success(function(response) {						
				vm.data = response.content;
				var i = 0;
				angular.forEach(vm.data, function(value, idx) {
					if(isSameAccount(value.accountId, vm.data, idx)){
						value.showAccountFlag = true;
					}
					value.rowNo = ++i;
				});
			});
		};
	
		// Organize auto suggestion model.
		var _organizeTypeHead = function(q) {
			q = UIFactory.createCriteria(q);
			return SupplierCreditInformationService.getOrganizeByNameOrCodeLike(q);
		}

		vm.organizeAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Enter organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : _organizeTypeHead
		});

		// Main of program
		var initLoad = function() {
			vm.search();
		}();
		
		vm.decodeBase64 = function(data){
			return atob(data);
		};
		
		var isSameAccount = function(accountId, data, index){
			if(index == 0 ){
				return true;
			}
			else{
				return accountId != data[index-1].accountId;
			}
		}

	} ]);