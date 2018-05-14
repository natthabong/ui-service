'use strict';
angular.module('gecscf.transaction').controller(
                'AdjustStatusPopupController',
                [   '$scope','UIFactory','PageNavigation','TransactionService','$stateParams','$timeout','$state','$window',
            function($scope , UIFactory , PageNavigation , TransactionService , $stateParams , $timeout , $state , $window) {
                      var vm = this;
                      $scope.errors = undefined;
                      vm.transactionModel = $stateParams.transactionModel;
                      var data = $scope.ngDialogData.data;
                      vm.modeAdjust = $scope.ngDialogData.modeAdjust;
                      var transactionId = $scope.ngDialogData.transactionId;
                      vm.transactionNo = $scope.ngDialogData.transactionNo;
                      vm.result  = undefined;
                      vm.transactionType  = undefined;
                      vm.reason  = $scope.ngDialogData.reason;
                      vm.isTokenExpired = $scope.ngDialogData.isTokenExpired;
                      vm.errorMessage  = $scope.ngDialogData.errorMessage;
                      var confirmToken = $scope.ngDialogData.confirmToken;
                      vm.model = {
                          credential: null,
                          bankTransactionNo: null,
                          reason: null,
                          adjustRemark: null
                      }

                      vm.hasError = false;

                      var isEmpty = function(data) {
                        return !data || !data.length;
                      }
                      var _isValid = function() {
                        $scope.errors = {};
                        var valid = true;
                        if (isEmpty(vm.model.credential)) {
                          $scope.errors.credential = 'Password is required.';
                          valid = false;
                        }
                        if (isEmpty(vm.model.bankTransactionNo)) {
                        	if(vm.modeAdjust == 'drawdownSuccess'){
                        		$scope.errors.bankTransactionNo = 'Bank transaction no is required.';
                            	valid = false;
                        	} else if(vm.modeAdjust == 'paymentSuccess'){
                        		$scope.errors.bankTransactionNo = 'Bank transaction no is required.';
                            	valid = false;
                        	}
                        }
                        if (isEmpty(vm.model.reason)) {
                          $scope.errors.reason = 'Reason is required.';
                          valid = false;
                        }
                        if (isEmpty(vm.model.adjustRemark)) {
                            $scope.errors.adjustRemark = 'Adjustment remark is required.';
                            valid = false;
                          }
                        return valid;
                      }
                      
                    var countFail = 0;
                    vm.adjustStatus = function(callback) {
                        if (_isValid()) {
                          var preCloseCallback = function(confirm) {
                            callback();
                            console.log($scope.ngDialogData)
                            $scope.ngDialogData.preCloseCallback(confirm);
                          }
                          var deffered = TransactionService.adjustStatus(vm.transactionModel,vm.model,confirmToken);
    						deffered.promise.then(function (response) {
    							callback();
    							UIFactory.showDialog({
    		                            templateUrl: '/js/app/modules/transaction/templates/success-dialog.html',
    		                            controller: 'AdjustStatusPopupController',
    		                            data: {
    		                                preCloseCallback: function(confirm) {
    		                                	init();
    		                                },
    		                                modeAdjust : vm.modeAdjust,
    		                                transactionModel : vm.transactionModel,
    		                                transactionId : transactionId,
    		                                transactionNo : response.transactionNo,
    		                                reason : vm.model.reason,
    		                                result : response.statusCode
    		                            }
    	                        });
    					  })
    					  .catch(function (response) {
    					    console.log(response.status)
    							if(response.status == 403){
    									$window.location.href = "/error/403";
    							} else if(response.status == 400){
    							    console.log(response.data);
    							   if(response.data.reference == 'token'){
    							     callback();
    							     UIFactory.showDialog({
	                                     templateUrl: '/js/app/modules/transaction/templates/fail-dialog.html',
	                                     controller: 'AdjustStatusPopupController',
	                                     data: {
	                                         preCloseCallback: function(confirm) {
	                                           init();
	                                         },
	                                         modeAdjust : vm.modeAdjust,
	                                         transactionModel : vm.transactionModel,
	                                         transactionId : transactionId,
	                                         transactionNo :  vm.transactionNo,
	                                         errorMessage : 'You have exceeded the maximum session idle time',
	                                         isTokenExpired : true
	                                     }
    							     });
    							   }
    							   else{
    							      $scope.errors.credential = 'Invalid current password.';
    							   }
    							  
    								 
    							} else {
    								callback();
        							UIFactory.showDialog({
    		                            templateUrl: '/js/app/modules/transaction/templates/fail-dialog.html',
    		                            controller: 'AdjustStatusPopupController',
    		                            data: {
    		                                preCloseCallback: function(confirm) {
    		                                	init();
    		                                },
    		                                modeAdjust : vm.modeAdjust,
    		                                transactionModel : vm.transactionModel,
    		                                transactionId : transactionId,
    		                                transactionNo :  vm.transactionNo,
    		                                errorMessage : 'Transaction has been modified',
    		                                isTokenExpired : false
    		                            }
        							});
    							}
    					  });
                        }
                    }
                      
                    vm.backPage = function() {
                    	var url = null;
                    	if(vm.transactionType == 'LOAN'){
                    		url = '/customer-organize/transaction-list';
                    	} 
                    	else {
                    		url = '/customer-organize/payment-transaction';
                    	} 
                        $timeout(function() {
                            PageNavigation.gotoPage(url);
                        }, 10);
                    };

                    vm.viewRecent = function() {
                    	if(vm.transactionType == 'LOAN'){
                    		$timeout(function() {
                                PageNavigation.gotoPage('/view-transaction', {
                                	transactionModel: vm.transactionModel,
                                	isShowViewHistoryButton: true,
                                	viewMode: 'CUSTOMER' });
                            }, 10);
                    	} 
                    	else {
                    		$timeout(function(){		
                				PageNavigation.nextStep('/payment-transaction/view', {
                					viewMode: 'CUSTOMER', 
                					transactionModel: vm.transactionModel,
                					isShowViewHistoryButton: true });
                	    	}, 10);
                    	} 
                    };

                    vm.viewHistory = function() {
                    	var url = null;
                    	if(vm.transactionType == 'LOAN'){
                    		url = '/customer-organize/transaction-list';
                    	} 
                    	else {
                    		url = '/customer-organize/payment-transaction';
                    	} 
                        $timeout(function() {
                            PageNavigation.gotoPage(url);
                        }, 10);
                    };
                    
                    function init(){
                    	if(vm.modeAdjust == 'failToDrawdown'){
                    		vm.result = 'Fail to drawdown';
                    		vm.model.status = 'FAIL_TO_DRAWDOWN';
                    		vm.transactionType = 'LOAN';
                    	} 
                    	else if (vm.modeAdjust == 'drawdownSuccess'){
                    		vm.result = 'Drawdown success';
                    		vm.model.status = 'DRAWDOWN_SUCCESS';
                    		vm.transactionType = 'LOAN';
                    	} 
                    	else if (vm.modeAdjust == 'failToPay'){
                    		vm.result = 'Fail to pay';
                      	  	vm.model.status = 'FAIL_TO_PAYMENT';
                      	  	vm.transactionType = 'PAYMENT';
                      	} 
                    	else if (vm.modeAdjust == 'paymentSuccess'){
                    		vm.result = 'Payment success';
                      	  	vm.model.status = 'PAYMENT_SUCCESS';
                      	    vm.transactionType = 'PAYMENT';
                      	}
  					}
                    init();

                    }]);
