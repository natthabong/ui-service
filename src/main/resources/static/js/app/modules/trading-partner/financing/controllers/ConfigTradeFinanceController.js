'use strict';
var tradeFinanceModule = angular.module('scfApp');
tradeFinanceModule.controller('ConfigTradeFinanceController',['$scope','$stateParams','UIFactory','PageNavigation','PagingController','ConfigTradeFinanceService',
    function($scope, $stateParams, UIFactory,PageNavigation, PagingController,ConfigTradeFinanceService) {

        var vm = this;

        vm.financeModel = $stateParams.setupModel;

        if(vm.financeModel == null){
            PageNavigation.gotoPage('/trading-partners');
        }

        var TradeFinanceURL = '/v1/organize-customers/'+vm.financeModel.sponsorId+'/trading-partners/'+vm.financeModel.supplierId+'/trade-finance';
        vm.pagingController = PagingController.create(TradeFinanceURL, {},'GET');
        

        vm.dataTable = {
			options : {
				
			},
			columns : [
				{
                    fieldName : 'borrower',
					field : 'borrower',
					label : 'Borrower',
					idValueField : 'template',
					id : 'loan-account-{value}-label',
					sortable : false
				},{
					fieldName : 'loanAccount',
					field : 'loanAccount',
					label : 'Loan account',
					idValueField : 'template',
					id : 'loan-account-{value}-label',
					sortable : false
				},{
					cssTemplate : 'text-center',
					sortable : false,
					cellTemplate : '<scf-button id="{{$parent.$index + 1}}-edit-button" class="btn-default gec-btn-action" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></scf-button>'
								+ '<scf-button id="{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.delete(data)" title="Delete"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
				} ]
		}

        var initLoad = function() {
            vm.pagingController.search();
        }
        initLoad();

        vm.back = function(){
            PageNavigation.gotoPreviousPage();
        }

    } ]);