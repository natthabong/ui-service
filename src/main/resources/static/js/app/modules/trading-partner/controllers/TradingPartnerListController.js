'use strict';
var tpModule = angular.module('gecscf.tradingPartner');
tpModule.controller('TradingPartnerListController',['$scope','$stateParams','UIFactory','PageNavigation'
	,'PagingController','TradingPartnerService','$timeout','$cookieStore','SCFCommonService','$state',
	function($scope, $stateParams, UIFactory,PageNavigation, PagingController,TradingPartnerService, 
	$timeout,$cookieStore,SCFCommonService,$state) {
		var vm = this;
		vm.canManage = false;
		
		vm.criteria = $stateParams.criteria || {
			organizeId : null,
		};

		vm.organize = $stateParams.organize || null;

		// The pagingController is a tool for navigate the
		// page of a table.
		vm.pagingController = PagingController.create('/api/v1/trading-partners', vm.criteria,'GET');

		// Organize auto suggestion model.
		var _organizeTypeHead = function(q) {
			q = UIFactory.createCriteria(q);
			return TradingPartnerService.getOrganizeByNameOrCodeLike(q);
		}

		vm.organizeAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Enter organization name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : _organizeTypeHead
		});

		// All functions of a controller.
		vm.search = function(pageModel) {
			var organizeId = undefined;
			if (angular.isObject(vm.organize)) {
				vm.criteria.organizeId = vm.organize.memberId;
			} else {
				vm.criteria.organizeId = undefined;
			}

			vm.pagingController.search(pageModel || ( $stateParams.backAction? {
				offset : vm.criteria.offset,
				limit : vm.criteria.limit
			}: undefined));
			$stateParams.backAction = false;
		}

		vm.createNew = function() {
			SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
			var params = {
				selectedItem : null
			};

			$timeout(function() {
				PageNavigation.nextStep('/trading-partners/new',params, {criteria : vm.criteria,organize : vm.organize});
			}, 10);
		}

		vm.edit = function(record) {
			SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
			var params = {
				selectedItem : record
			};
			$timeout(function() {
				PageNavigation.nextStep('/trading-partners/edit', params, {criteria : vm.criteria,organize : vm.organize});
			}, 10);
		}

		vm.setup = function(data){
			SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
			var params = {
				setupModel : data
			};
			$timeout(function() {
				PageNavigation.nextStep('/trade-finance/config', params, {criteria : vm.criteria,organize : vm.organize});
			}, 10);
		}
		
		vm.deleteTP = function(trading) {
			var preCloseCallback = function(confirm) {
				vm.pagingController.reload();
			}

			UIFactory.showConfirmDialog({
				data : {
					headerMessage : 'Confirm delete?'
				},
				confirm : function() {
					return TradingPartnerService.deleteTradingPartner(trading);
				},
				onFail : function(response) {
					var msg = {
							404 : 'Trading partner has been deleted.',
							409 : 'Trading partner has been modified.',
							405 : 'Trading partner has been used.'
					};
					UIFactory.showFailDialog({
						data : {
							headerMessage : 'Delete trading partner fail.',
							bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback : preCloseCallback
					});
				},
				onSuccess : function(response) {
					UIFactory.showSuccessDialog({
						data : {
							headerMessage : 'Delete trading partner success.',
							bodyMessage : ''
						},
						preCloseCallback : preCloseCallback
					});
				}
			});
		}
		
		// Main of program
		var initLoad = function() {
			if($stateParams.backAction){
				if(vm.organize != null){
					vm.organize = TradingPartnerService._prepareItem(vm.organize);
				}
			}
			vm.search();
		}();

	} ]);