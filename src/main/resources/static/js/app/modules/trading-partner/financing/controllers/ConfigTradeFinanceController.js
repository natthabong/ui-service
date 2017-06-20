'use strict';
var tradeFinanceModule = angular.module('scfApp');
tradeFinanceModule.controller('ConfigTradeFinanceController',['$scope','$stateParams','UIFactory','PageNavigation','PagingController','ConfigTradeFinanceService','$log',
    function($scope, $stateParams, UIFactory,PageNavigation, PagingController,ConfigTradeFinanceService,$log) {

        var vm = this;
		var log = $log;

		vm.financeModel = $stateParams.setupModel;
        
        if(vm.financeModel == null){
            PageNavigation.gotoPage('/trading-partners');
        }

		var sponsorId = $stateParams.setupModel.sponsorId;
		var supplierId = $stateParams.setupModel.supplierId;

		vm.pagingController = {
			tableRowCollection : undefined
		};

		var getFinanceInfo = function(){
			var defered = ConfigTradeFinanceService.getTradeFinanceInfo(sponsorId,supplierId);
			defered.promise.then(function(response) {
				vm.pagingController.tableRowCollection = response.data;
			}).catch(function(response) {
				log.error('Get trading finance fail');
			});
		}
		

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
					id : 'loan-account-{value}-label',
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
					cellTemplate : '<scf-button id="{{$parent.$index + 1}}-edit-button" class="btn-default gec-btn-action" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></scf-button>'
								+ '<scf-button id="{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteTradeFinance(data)" title="Delete"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
				} ]
		}

        var initLoad = function() {
            getFinanceInfo();
        }();

        vm.back = function(){
            PageNavigation.gotoPreviousPage();
        }

		vm.newTF = function(){
			var param = {
				params: vm.financeModel,
			}
			PageNavigation.gotoPage('/trade-finance/new',param,param);
		}

		vm.edit = function(data){
			var param = {
				params: data,
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
						409 : 'Trade finance has been deleted.',
						405 : 'Trade finance has been used.'
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