var txnMod = angular.module('gecscf.transaction');
txnMod.controller('PaymentTransactionController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'PaymentTransactionService',
		'PagingController', 'PageNavigation', function($rootScope, $scope, $log, $stateParams, SCFCommonService, PaymentTransactionService, PagingController, PageNavigation) {
	
	var vm = this;
	var log = $log;

    vm.criteria = $stateParams.criteria || {

	}

    vm.openDateFrom = false;
	vm.openDateTo = false;
	
	vm.openCalendarDateFrom = function() {
		vm.openDateFrom = true;
	}

	vm.openCalendarDateTo = function() {
		vm.openDateTo = true;
	}
    var hiddenSponsor = false;
    var hiddenSponsorPic = false;
    var hiddenSupplier = false;

    vm.dataTable = {
        options: {
            displayRowNo: {
            	idValueField: 'transactionNo',
            	id: 'transaction-{value}-row-no-label'
            }
        },
        expansion:{
        	expanded: true
        },
        columns: [{
			fieldName: 'supplier',
            field: 'supplierLogo',
            label: 'Supplier',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-supplier-name-label',
            sortData: true,
            cssTemplate: 'text-center',
			dataRenderer: function(record){
				return '<img style="height: 32px; width: 32px;" data-ng-src="data:image/png;base64,'+atob(record.sponsorLogo)+'"></img>';
			}
        }, {
			fieldName: 'transactionNo',
            field: 'transactionNo',
            label: 'Transaction No',
            id: 'transaction-{value}-transaction-no-label',
            sortData: true,
            cssTemplate: 'text-center',
        },{
			fieldName: 'paymentAmount',
            field: 'paymentAmount',
            label: 'Payment Amount',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-payment-amount-label',
            sortData: true,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        },{
			fieldName: 'bankTransactionNo',
            field: 'bankTransactionNo',
            label: 'Bank Transaction No',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-bank-transaction-no-label',
            sortData: true,
            cssTemplate: 'text-center'
        },{
			fieldName: 'statusMessageKey',
            field: 'statusCode',
            label: 'Status',
            sortData: true,
            idValueField: 'transactionNo',
            id: 'status-{value}',
			filterType: 'translate',
            cssTemplate: 'text-center',
        },{
			fieldName: 'action',
			field: 'action',
			label: 'Action',
			cssTemplate: 'text-center',
			sortData: false,
			cellTemplate: '<scf-button class="btn-default gec-btn-action" ng-disabled="!(ctrl.verify && (data.statusCode === ctrl.statusDocuments.waitForVerify))" id="transaction-{{data.transactionNo}}-verify-button" ng-click="ctrl.verifyTransaction(data)" title="Verify"><i class="fa fa-inbox" aria-hidden="true"></i></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-approve-button" ng-disabled="!(ctrl.approve &&(data.statusCode === ctrl.statusDocuments.waitForApprove))" class="btn-default gec-btn-action"  ng-click="ctrl.approveTransaction(data)" title="Approve"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>' +
			'<scf-button class="btn-default gec-btn-action" id="transaction-{{data.transactionNo}}-view-button" ng-disabled="{{!ctrl.canView}}" ng-click="ctrl.view(data)" title="View"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-re-check-button" class="btn-default gec-btn-action" ng-disabled="{{!(data.retriable && ctrl.canRetry)}}" ng-click="ctrl.retry(data)" title="Re-check"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-print-button"class="btn-default gec-btn-action" ng-disabled="ctrl.disabledPrint(data.returnStatus)" ng-click="ctrl.printEvidenceFormAction(data)" title="Print"><span class="glyphicon glyphicon-print" aria-hidden="true"></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-reject-button"class="btn-default gec-btn-action" ng-disabled="ctrl.disabledReject(data)" ng-click="ctrl.confirmRejectPopup(data,\'clear\')" title="Reject"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>'
		}]
    };

    vm.statusStepDropDown = [{
		label: 'All',
		value: ''
	}];

    vm.criteria = {
        dateFrom: '',
        dateTo: '',
        sponsorId: '',
        supplierId:'',
        supplierCode: '',
		transactionNo:'',
        statusGroup: '',
        order: '',
        orderBy:''
    }
	
    // Init data paging
    vm.pageSizeList = [{
        label: '10',
        value: '10'
    }, {
        label: '20',
        value: '20'
    }, {
        label: '50',
        value: '50'
    }];

    vm.pageModel = {
        pageSizeSelectModel: '20',
        totalRecord: 0,
        currentPage: 0,
		clearSortOrder: false
    };

    vm.searchTransactionService = function() {
		// saveSearchCriteriaData();
		var transactionModel = angular.extend(vm.listTransactionModel, {
			page: vm.pageModel.currentPage,
			pageSize: vm.pageModel.pageSizeSelectModel
		});
			
		var transactionDifferd = ListTransactionService.getTransactionDocument(transactionModel);
		transactionDifferd.promise.then(function(response) {
			vm.serverTime = response.headers('current-date');
			vm.listTransactionModel.statusCode = '';
			vm.showInfomation = true;
			var transactionDocs = response.data;
			vm.tableRowCollection = transactionDocs.content;
			vm.pageModel.totalRecord = transactionDocs.totalElements;
			vm.pageModel.totalPage = transactionDocs.totalPages;

			// Calculate Display page
			vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
			vm.clearInternalStep();
			// reset value of internal step
            
            if (vm.listTransactionModel.statusGroup === 'INTERNAL_STEP' || vm.listTransactionModel.statusGroup === '') {
                var internalStepDeffered = ListTransactionService.summaryInternalStep(transactionModel);
                internalStepDeffered.promise.then(function(response) {
                    var internalStemp = response.data;							
                    if (internalStemp.length > 0) {
                        internalStemp.forEach(function(summary) {
                        vm.summaryInternalStep[summary.statusMessageKey].totalRecord = summary.totalRecord;
                        vm.summaryInternalStep[summary.statusMessageKey].totalAmount = summary.totalAmount;
                        });
                    }						
                }).catch(function(response) {
                    $log.error('Internal Error');
                });
            }
		}).catch(function(response) {
			$log.error('Cannot search document');
		});		
    };
} ]);