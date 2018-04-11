'use strict';
angular.module('gecscf.transaction').controller(
                'AdjustStatusPopupController',
                [   '$scope','UIFactory','PageNavigation','ViewTransactionService','$stateParams','$timeout',
            function($scope , UIFactory , PageNavigation , ViewTransactionService , $stateParams , $timeout) {
                      var vm = this;
                      $scope.errors = undefined;
                      vm.transactionModel = $stateParams.transactionModel;
                      var data = $scope.ngDialogData.data;
                      vm.modeAdjust = $scope.ngDialogData.modeAdjust;
                      var transactionId = $scope.ngDialogData.transactionId;
                      vm.transactionNo = $scope.ngDialogData.transactionNo;
                      vm.result  = undefined;
                      vm.reason  = $scope.ngDialogData.reason;
                      vm.errorMessage  = $scope.ngDialogData.errorMessage;
                      var confirmToken = undefined;
                      vm.model = {
                          password: null,
                          reason: null
                      }

                      vm.hasError = false;

                      var isEmpty = function(data) {
                        return !data || !data.length;
                      }
                      var _isValid = function() {
                        $scope.errors = {};
                        var valid = true;
                        if (isEmpty(vm.model.password)) {
                          $scope.errors.password = 'Password is required';
                          valid = false;
                        }
                        if (isEmpty(vm.model.reason)) {
                          $scope.errors.reason = 'Reason is required';
                          valid = false;
                        }
                        return valid;
                      }
                      
                    vm.adjustStatus = function(callback) {
                        if (_isValid()) {
                          var preCloseCallback = function(confirm) {
                            callback();
                            console.log($scope.ngDialogData)
                            $scope.ngDialogData.preCloseCallback(confirm);
                          }
                          var deffered = ViewTransactionService.adjustStatus(vm.transactionNo,vm.model,confirmToken);
    						deffered.promise.then(function (response) {
    							console.log(response);
    							callback();
    							UIFactory.showDialog({
    		                            templateUrl: '/js/app/modules/transaction/loan/templates/success-dialog.html',
    		                            controller: 'AdjustStatusPopupController',
    		                            data: {
    		                                preCloseCallback: function(confirm) {
    		                                	init();
    		                                },
    		                                modeAdjust : vm.modeAdjust,
    		                                transactionModel : vm.transactionModel,
    		                                transactionId : transactionId,
    		                                transactionNo : response.transactionNo,
    		                                reason : response.reason
    		                            }
    	                        });
    					  })
    						.catch(function (response) {
    							console.log('Confirm status error');
    							callback();
    							UIFactory.showDialog({
		                            templateUrl: '/js/app/modules/transaction/loan/templates/fail-dialog.html',
		                            controller: 'AdjustStatusPopupController',
		                            data: {
		                                preCloseCallback: function(confirm) {
		                                	init();
		                                },
		                                modeAdjust : vm.modeAdjust,
		                                transactionModel : vm.transactionModel,
		                                transactionId : transactionId,
		                                transactionNo : response.transactionNo,
		                                reason : response.reason,
		                                errorMessage : response.errorMessage
		                            }
	                        });
    					  });
                        }
                    }
                      
                    vm.backPage = function() {
                        $timeout(function() {
                            PageNavigation.gotoPage('/customer-organize/transaction-list');
                        }, 10);
                    };

                    vm.viewRecent = function() {
                        $timeout(function() {
                            PageNavigation.gotoPage('/view-transaction', { transactionModel: vm.transactionModel, isShowViewHistoryButton: true, viewMode: 'CUSTOMER' });
                        }, 10);
                    };

                    vm.viewHistory = function() {
                        $timeout(function() {
                            PageNavigation.gotoPage('/customer-organize/transaction-list');
                        }, 10);
                    };
                    
                    function init(){
                    	if(vm.modeAdjust == 'failToDrawdown'){
                    		vm.result = 'Fail to drawdown';
                    	} else {
                    		vm.result = 'Drawdown success';
                    	}
                    	
                    	var deffered = ViewTransactionService.getConfirmToken(vm.transactionNo);
  						deffered.promise.then(function (response) {
  							confirmToken = response.data.confirmToken;
  							console.log(confirmToken);
  						})
  						.catch(function (response) {
  							console.log('View Transaction load error');
  						});

  					}
                    init();

                    }]);
