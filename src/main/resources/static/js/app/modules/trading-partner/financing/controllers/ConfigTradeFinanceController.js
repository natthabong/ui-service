'use strict';
var tradeFinanceModule = angular.module('gecscf.tradingPartner.financing');
tradeFinanceModule.controller('ConfigTradeFinanceController',['$scope','$stateParams','UIFactory',
	'PageNavigation','PagingController','ConfigTradeFinanceService','$log','SCFCommonService','$state','$cookieStore',
    function($scope, $stateParams, UIFactory,PageNavigation, PagingController,ConfigTradeFinanceService,$log,SCFCommonService,$state,$cookieStore) {

        var vm = this;
		var log = $log;
		var listStoreKey = 'config';

		vm.pagingController = {
			tableRowCollection : undefined
		};

		
        vm.dataTable = {
			options : {
				
			},
			columns : [
				{
                    fieldName : 'borrowerName',
					field : 'borrowerName',
					label : 'Borrower',
					idValueField : 'template',
					id : 'borrower-name-{value}-label',
					sortable : false,
					dataRenderer: function(record){
						return record.borrowerType+': '+record.borrowerName;
					}
				},{
					fieldName : 'accountNo',
					field : 'accountNo',
					label : 'Loan account',
					idValueField : 'template',
					id : 'finance-account-{value}-label',
					sortable : false,
					dataRenderer: function(record){
						var word1 = record.accountNo.substring(0,3);
						var word2 = record.accountNo.substring(3,4);
						var word3 = record.accountNo.substring(4, 9);
						var word4 = record.accountNo.substring(9,10);
						var accountNo = word1+'-'+word2+'-'+word3+'-'+word4;
						return accountNo;
					}
				},{
					cssTemplate : 'text-center',
					sortable : false,
					cellTemplate : '<scf-button id="{{$parent.$index + 1}}-edit-button" class="btn-default gec-btn-action" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
								+ '<scf-button id="{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteTradeFinance(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
				} ]
		}

		var storeCriteria = function(){
			$cookieStore.put(listStoreKey, vm.financeModel);
		}

		var getFinanceInfo = function(sponsorId,supplierId){
			var defered = ConfigTradeFinanceService.getTradeFinanceInfo(sponsorId,supplierId);
			defered.promise.then(function(response) {
				if(response.data.length == 0 || response.data[0] != null){
					vm.pagingController.tableRowCollection = null;
					vm.pagingController.tableRowCollection = response.data;
				}
			}).catch(function(response) {
				log.error('Get trading finance fail');
			});
		}

		var initLoad = function() {
			var backAction = $stateParams.backAction;

			if(backAction === true){
				vm.financeModel = $cookieStore.get(listStoreKey);
			}else{
				vm.financeModel = $stateParams.setupModel;
			}
			
			if(vm.financeModel == null){
				PageNavigation.gotoPage('/trading-partners');
			}

			var sponsorId = vm.financeModel.sponsorId;
			var supplierId = vm.financeModel.supplierId;

            getFinanceInfo(sponsorId,supplierId);
        }();

        vm.back = function(){
            PageNavigation.gotoPreviousPage();
        }

		vm.newTF = function(){
			SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
			storeCriteria();
			var param = {
				params: vm.financeModel,
			}
			PageNavigation.gotoPage('/trade-finance/new',param,param);
		}

		vm.edit = function(data){
			SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
			storeCriteria();
			var param = {
				params: vm.financeModel,
				data : data
			}
			PageNavigation.gotoPage('/trade-finance/edit',param,param);
		}
		
		vm.deleteTradeFinance = function(record){
			var preCloseCallback = function(confirm) {
				 getFinanceInfo();
			}

			UIFactory.showConfirmDialog({
				data : {
					headerMessage : 'Confirm delete?'
				},
				confirm : function() {
					return ConfigTradeFinanceService.deleteTradeFinance(record);
				},
				onFail : function(response) {
					var msg = {
						404 : 'Trade finance has been deleted.',
						405 : 'Trade finance has been used.',
						409 : 'Trade finance has been modified.'
					};
					UIFactory.showFailDialog({
						data : {
							headerMessage : 'Delete trade finance fail.',
							bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback : preCloseCallback
					});
				},
				onSuccess : function(response) {
					UIFactory.showSuccessDialog({
						data : {
							headerMessage : 'Delete trade finance success.',
							bodyMessage : ''
						},
						preCloseCallback : preCloseCallback
					});
				}
			});
		}
    } ]);