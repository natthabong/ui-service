angular.module('scfApp').controller('NewduedateGroupController', ['Service', '$state','$translate', '$scope', 'SCFCommonService', '$stateParams', '$cookieStore' , 'PageNavigation' , function(NewduedateGroupService, $state,$translate, $scope, SCFCommonService, $stateParams, $cookieStore, PageNavigation) {
    var vm = this;
    var listStoreKey = 'listrancri';
    vm.model ={};
    vm.transactionType = {
            transactionDate: 'transactionDate',
            maturityDate: 'maturityDate'
        }

    vm.tableRowCollection = [];
    vm.summaryOutstandingAmount = '';
    
    // Model mapping with page list
    vm.listDocumentModel = {
            totalRecord: '10',
            orders:[{
        		"fieldName":"sponsorPaymentDate",
        		"direction":"ASC"
        		},{
        		"fieldName":"outstandingAmount",
        		"direction":"DESC"
        	}]

        }
        vm.pageModel = {
//        pageSizeSelectModel: '20',
//        totalRecord: 0,
//        currentPage: 0,
		clearSortOrder: false
    };
   
    vm.dataTable = {
        options: {
        },
        columns: [{
            field: 'sponsorLogo',
            label: 'TP',
            sortData: true,
            cssTemplate: 'text-center',
            
        }, {
            field: 'sponsorPaymentDate',
            label: 'Sponsor Payment Date',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
            field: 'supplierCode',
            label: 'Supplier Code',
//            id: 'transaction-{value}-transaction-no-label',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
            field: 'noOfDocument',
            label: 'No Of document',
//            idValueField: 'transactionNo',
//            id: 'transaction-{value}-drawdown-amount-label',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
            field: 'outstandingAmount',
            label: 'Outstanding Amount (THB)',
//            idValueField: 'transactionNo',
//            id: 'transaction-{value}-interest-label',
            sortData: true,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
			field: 'action',
			label: 'Action',
			cssTemplate: 'text-center',
			sortData: false,
			cellTemplate: '<scf-button class="btn-default gec-btn-action" id="doc-group-{rowno}-button" ng-click="ctrl.view(data)"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></scf-button>'
		}]
    };

	vm.searchTransaction = function(criteria){
//		 var dateFrom = vm.dateModel.dateFrom;
//            var dateTo = vm.dateModel.dateTo;
//
//            vm.listTransactionModel.dateFrom = convertDate(dateFrom);
//            vm.listTransactionModel.dateTo = convertDate(dateTo);

            if (criteria === undefined) {
//                vm.pageModel.currentPage = '0';
//                vm.pageModel.pageSizeSelectModel = '20';
//				vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
//				vm.listTransactionModel.order = '';
//            	vm.listTransactionModel.orderBy = '';
            } 
//            else {
//                vm.pageModel.currentPage = criteria.page;
//                vm.pageModel.pageSizeSelectModel = criteria.pageSize;				
//            }
            vm.searchTransactionService();
	};
	
	vm.searchTransactionService = function() {
            var documentModel = angular.extend(vm.listDocumentModel, {
//                page: vm.pageModel.currentPage,
//                pageSize: vm.pageModel.pageSizeSelectModel
            });
            
            var documentDifferd = NewduedateGroupService.getDocumentsGroupbyDuedate(documentModel);
            documentDifferd.promise.then(function(response) {
	            vm.showInfomation = true;
	            var documents = response.data;
	            vm.tableRowCollection = documents.documentGroupByDuedateList;
//	            console.log(vm.tableRowCollection);
	            vm.summaryOutstandingAmount = documents.totalOutstandingAmount;
            }).catch(function(response) {
            	console.log('Cannot search document');
            });
	};
    
	vm.searchTransaction();
	
		
//    vm.createTransaction = function(data){
//		SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
//		vm.storeCriteria();
//		PageNavigation.gotoPage('/create-transaction', {
//			documentModel: data
//        });
//	}
        	
	 vm.initLoad = function() {
		var backAction = $stateParams.backAction;
		if(backAction === true){
//			vm.listTransactionModel = $cookieStore.get(listStoreKey);
//			vm.dateModel.dateFrom = convertStringTodate(vm.listTransactionModel.dateFrom);
//			vm.dateModel.dateTo = convertStringTodate(vm.listTransactionModel.dateTo);			
			vm.searchTransaction();
		}
//		$cookieStore.remove(listStoreKey);
//		vm.loadSponsorCode();
        
    };

    vm.initLoad();

}]);