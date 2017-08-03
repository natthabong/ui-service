var txnMod = angular.module('gecscf.transaction');
txnMod.controller('VerifyPaymentController', ['$rootScope', '$scope', '$log', 
	'$stateParams', 'SCFCommonService','PageNavigation', 'UIFactory', 'ngDialog', '$timeout', 
    'PagingController', 'VerifyPaymentService', 
	function($rootScope, $scope, $log, $stateParams, SCFCommonService, PageNavigation, UIFactory, ngDialog, $timeout, PagingController, VerifyPaymentService) {

	var vm = this;
	var log = $log;
	
	if($stateParams.transaction == null){
        $timeout(function(){		
			PageNavigation.gotoPage('/payment-transaction/buyer');
		}, 10);
    }
	vm.transactionModel = $stateParams.transaction;
	vm.isLoanPayment = false;
	
	vm.dataTable = {
        columns: []
    };

	vm.back = function(){
    	$timeout(function(){
            PageNavigation.backStep();
        }, 10);
    }

	var loadTransaction = function(callback){
        var deffered = VerifyPaymentService.getTransaction(vm.transactionModel);
        deffered.promise.then(function(response){
            
        	vm.transactionModel = response.data;
            vm.transactionModel.supplier =  response.data.supplierOrganize.organizeName;
            vm.transactionModel.sponsor =  response.data.sponsorOrganize.organizeName;
            vm.transactionModel.documents = response.data.documents;
            
            if(vm.transactionModel.transactionMethod == 'TERM_LOAN'){
            	vm.isLoanPayment = true;
            }
            
            var _criteria = {
                transactionId : vm.transactionModel.transactionId
            }
            
            vm.pagingController = PagingController.create('api/v1/transaction-documents', _criteria, 'GET');
            
            loadDocumentDisplayConfig(vm.transactionModel.supplierId, 'BFP', vm.searchDocument);
            
        })
        .catch(function(response){
            log.error('verify payment load error');
        })
    }
	
	var loadDocumentDisplayConfig = function(ownerId, mode, callback) {
        var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, mode);
        deffered.promise.then(function(response) {
            vm.dataTable.columns = response.items;
            callback();
        });
    }
	
	vm.searchDocument = function(pagingModel) {
        vm.pagingController.search(pagingModel);
    }
	
	var init = function(){
		loadTransaction();
	}();

	vm.confirmApprove = function(){
		UIFactory.showConfirmDialog({
			data : {
				headerMessage : 'Confirm approval ?',
				mode: '',
				credentialMode : false,
				transactionModel : vm.transactionModel
			}, 
			confirm : function() {
				return vm.approve();
			},
			onFail : function(response) {					
				$scope.response = response.data;
				UIFactory.showFailDialog({
					data : {
						mode: 'concurrency',
						headerMessage : 'Verify transaction fail.',
						backAndReset : vm.back,
						viewHistory : vm.viewHistory,
						viewRecent : vm.viewRecent,
						errorCode : response.data.errorCode,
						action : response.data.attributes.action,
						actionBy : response.data.attributes.actionBy
					}
				});						
			},
			onSuccess : function(response) {
				UIFactory.showSuccessDialog({
					data : {
						mode: 'transaction',
						headerMessage : 'Verify transaction success.',						
						bodyMessage : vm.transactionModel.transactionNo,
						backAndReset : vm.back,
						viewRecent : vm.viewRecent,
						viewHistory : vm.viewHistory
					},
				});				
			}
		});
	}
	
	vm.approve = function(){
		var deffered = VerifyPaymentService.approve(vm.transactionModel);
		return deffered;
	}
	
	vm.confirmReject = function(){
		UIFactory.showConfirmDialog({
			data : {
				headerMessage : 'Confirm reject ?',
				mode: 'transaction',
				credentialMode : false,
				rejectReason : '',
				transactionModel : vm.transactionModel
			}, 
			confirm : function() {
				return vm.reject();
			},
			onFail : function(response) {					
				$scope.response = response.data;
				UIFactory.showFailDialog({
					data : {
						mode: 'concurrency',
						headerMessage : 'Reject transaction fail.',
						backAndReset : vm.back,
						viewHistory : vm.viewHistory,
						viewRecent : vm.viewRecent,
						errorCode : response.data.errorCode,
						action : response.data.attributes.action,
						actionBy : response.data.attributes.actionBy
					}
				});						
			},
			onSuccess : function(response) {
				UIFactory.showSuccessDialog({
					data : {
						mode: 'transaction',
						headerMessage : 'Reject transaction success.',						
						bodyMessage : vm.transactionModel.transactionNo,
						backAndReset : vm.back,
						viewRecent : vm.viewRecent,
						viewHistory : vm.viewHistory
					},
				});				
			}
		});
	}
	
	vm.reject = function(){
		var deffered = VerifyPaymentService.reject(vm.transactionModel);
		return deffered;
	}
	
	vm.viewRecent = function(){
		$timeout(function(){		
			PageNavigation.nextStep('/payment-transaction/view', 
                {transactionModel: vm.transactionModel, isShowViewHistoryButton: true, isShowBackButton: false});
    	}, 10);
	};
	
	vm.viewHistory = function(){
		$timeout(function(){
			PageNavigation.gotoPage('/payment-transaction/buyer');
		}, 10);
	};	
}]);	