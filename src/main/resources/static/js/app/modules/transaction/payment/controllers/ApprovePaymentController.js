var txnMod = angular.module('gecscf.transaction');
txnMod.controller('ApprovePaymentController', ['$rootScope', '$scope', '$log',
    '$stateParams', 'SCFCommonService', 'PageNavigation', 'UIFactory', 'ngDialog',
    '$timeout', 'ApprovePaymentService', 'TransactionService',
    function($rootScope, $scope, $log, $stateParams, SCFCommonService, PageNavigation, UIFactory,
        ngDialog, $timeout, ApprovePaymentService, TransactionService) {

        var vm = this;
        var log = $log;

        vm.txnHour = { allowSendToBank: false };

        vm.agreed = false;
        vm.disableButton = true;

        vm.agreeCondition = function() {
            vm.agreed = !vm.agreed;
            vm.disableButton = !(vm.txnHour.allowSendToBank && vm.agreed);
        };

        vm.transactionApproveModel = {
            transaction: undefined,
            credential: ''
        }

        var TransactionStatus = {
            PAID: 'D'
        }

        vm.backPage = function() {
            $timeout(function() {
                PageNavigation.backStep();
            }, 10);
        };

        vm.viewRecent = function() {
            $timeout(function() {
                PageNavigation.gotoPage('/payment-transaction/view', { transactionModel: vm.transaction, isShowViewHistoryButton: true, viewMode: 'MY_ORGANIZE' });
            }, 10);
        };

        vm.viewHistory = function() {
            $timeout(function() {
                PageNavigation.gotoPage('/my-organize/payment-transaction');
            }, 10);
        };

        function _getTransaction(transaction) {
            var deffered = ApprovePaymentService.getTransaction(transaction);
            return deffered;
        };

        function _getRequestForm(transaction) {
            var deffered = ApprovePaymentService.getRequestForm(transaction);
            return deffered;
        };

        var init = function() {
            vm.transactionApproveModel.transaction = $stateParams.transaction;
            if (vm.transactionApproveModel.transaction == null) {
                PageNavigation.gotoPage('/my-organize/payment-transaction');
            } else {
                var deffered = ApprovePaymentService.checkTransactionHour(vm.transactionApproveModel.transaction);
                deffered.promise.then(function(response) {
                    vm.txnHour = response.data;
                    if (!vm.txnHour.allowSendToBank || vm.txnHour.suspend ) {
                    	var message = vm.txnHour.suspend?'Please try again later.':'Please approve transaction within';
                        UIFactory.showHourDialog({
                            data: {
                                mode: 'transaction',
                                headerMessage: 'Service unavailable.',
                                bodyMessage: message,
                                startTransactionHour: vm.txnHour.startTransactionHour,
                                endTransactionHour: vm.txnHour.endTransactionHour,
                                suspend: vm.txnHour.suspend
                            },
                        });
                    }
                    vm.displayName = $scope.userInfo.displayName;
                    var transactionMethod = vm.transactionApproveModel.transaction.transactionMethod;
                    if (transactionMethod == 'DEBIT') {
                        vm.contractHeaderMsg = 'contract header debit';
                        vm.agreeConditionMsg = 'agree condition debit';
                    } else if (transactionMethod == 'TERM_LOAN' || transactionMethod == 'OD') {
                        vm.contractHeaderMsg = 'contract header loan';
                        vm.agreeConditionMsg = 'agree condition loan';
                    } else if (transactionMethod == 'DEBIT_SPECIAL') {
                        vm.contractHeaderMsg = 'contract header special debit';
                        vm.agreeConditionMsg = 'agree condition special debit';
                    }

                    _getRequestForm(vm.transactionApproveModel.transaction);
                    var deffered = _getTransaction(vm.transactionApproveModel.transaction);
                    deffered.promise.then(function(response) {
                        vm.transactionApproveModel.transaction = response.data;
                    }).catch(function(response) {
                        log.error('Get transaction payment fail');
                    });

                });
            }
        }();

        function _validateCredential(data) {
            var result = true;
            if (angular.isUndefined(data) || data === '') {
                result = false;
            }
            return result;
        }

        var dialogPopup;
        var closeDialogPopUp = function() {
            dialogPopup.close();
        }

        function printEvidence(transaction) {
            if (transaction.statusCode == 'PAYMENT_SUCCESS') {
                return true;
            }
            return false;
        }

        vm.printEvidenceFormAction = function() {
            TransactionService.generateEvidenceForm(vm.transaction);
        }
        
        
	    vm.resendPayment = function(data) {	
	    	vm.transaction = vm.transactionApproveModel.transaction;
	        var deffered = TransactionService.resend(vm.transaction);
	        deffered.promise.then(function(response) {
				UIFactory.showSuccessDialog({
                    data: {
                        mode: 'transactionComplete',
                        headerMessage: 'Resend transaction success.',
                        bodyMessage: vm.transaction,
                        viewRecent: vm.viewRecent,
                        viewHistory: vm.viewHistory,
                        backAndReset: vm.backPage,
                        hideBackButton: true,
                        hideViewRecentButton: false,
                        hideViewHistoryButton: true,
                        showOkButton: true
                    },
                });	        	
	        }).catch(function(response) {
	        	vm.handleDialogFail(response);
	        });	    	
	    };

        vm.retry = function() {
            vm.transaction = vm.transactionApproveModel.transaction;
            var deffered = TransactionService.retry(vm.transaction);
            deffered.promise.then(function(response) {
                vm.transaction = response.data;
                UIFactory.showSuccessDialog({
                    data: {
                        mode: 'transactionComplete',
                        headerMessage: 'Approve success.',
                        bodyMessage: vm.transaction,
                        viewRecent: vm.viewRecent,
                        viewHistory: vm.viewHistory,
                        backAndReset: vm.backPage,
                        hideBackButton: false,
                        hideViewRecentButton: false,
                        hideViewHistoryButton: false,
                        showOkButton: false,
                        printEvidenceFormAction: vm.printEvidenceFormAction,
                        canPrintEvidence: printEvidence(vm.transaction)
                    },
                });
            }).catch(function(response) {
                vm.handleDialogFail(response);
            });
        }

        vm.handleDialogFail = function(response) {
            $scope.response = response.data;
            if(response.status == 402){		
				UIFactory.showFailDialog({
					data: {
						mode: 'transaction',
						headerMessage: 'Approve fail',
						transaction: vm.transactionApproveModel.transaction,
						resend: vm.resendPayment,
						viewRecent: vm.viewRecent,
						viewHistory: vm.viewHistory,
						backAndReset: vm.backPage,
						hideBackButton: false,
						hideViewRecentButton: true,
						hideViewHistoryButton: false,
						showOkButton: false,
						showContactInfo: true,
						showResend: true
					},
				});
            	
            }else if (response.data.errorCode == "E0400") {
                vm.wrongPassword = true;
                vm.passwordErrorMsg = $scope.response.attributes.errorMessage;
                dialogPopup = UIFactory.showConfirmDialog({
                    data: {
                        headerMessage: 'Confirm approve ?',
                        mode: 'transaction',
                        credentialMode: true,
                        displayName: vm.displayName,
                        wrongPassword: vm.wrongPassword,
                        passwordErrorMsg: vm.passwordErrorMsg,
                        rejectReason: null,
                        hideReason: true,
                        transactionModel: vm.transactionApproveModel
                    },
                    confirm: function() {
                        if (_validateCredential(vm.transactionApproveModel.credential)) {
                            return approve(vm.transactionApproveModel);
                        } else {
                            vm.wrongPassword = true;
                            vm.passwordErrorMsg = 'Password is required';
                            closeDialogPopUp();
                            vm.confirmPopup('error');
                        }
                    },
                    onFail: function(response) {
                        vm.handleDialogFail(response);
                    },
                    onSuccess: function(response) {
                        UIFactory.showSuccessDialog({
                            data: {
                                mode: 'transactionComplete',
                                headerMessage: 'Approve success.',
                                bodyMessage: vm.transaction,
                                viewRecent: vm.viewRecent,
                                viewHistory: vm.viewHistory,
                                backAndReset: vm.backPage,
                                hideBackButton: false,
                                hideViewRecentButton: false,
                                hideViewHistoryButton: false,
                                showOkButton: false,
                                printEvidenceFormAction: vm.printEvidenceFormAction,
                                canPrintEvidence: printEvidence(vm.transaction)
                            },
                        });
                    }
                });
            }
            else {
                $scope.response.showViewRecentBtn = false;
                $scope.response.showViewHistoryBtn = true;
                $scope.response.showCloseBtn = $scope.response.errorCode == 'E1012' ? true : false;
                if ($scope.response.errorCode == 'E1012') {
                    vm.txnHour.allowSendToBank = false;
                    vm.disableButton = true;
                }
                $scope.response.showBackBtn = true;
                if ($scope.response.errorCode != 'E0403' ) {
                    vm.errorMessageModel = response.data;
                    var dialogUrl = TransactionService.getTransactionDialogErrorUrl($scope.response.errorCode, 'approve');
                    ngDialog.open({
                        template: dialogUrl,
                        scope: $scope,
                        disableAnimation: true
                    });
                }else if ($scope.response.errorCode == "E1017" || $scope.response.errorCode == "E1018" || $scope.response.errorCode == "E1019"){
                	vm.errorMessageModel = response.data;
                	$scope.response.errorMessage = $scope.response.errorCode;
                    var dialogUrl = TransactionService.getTransactionDialogErrorUrl($scope.response.errorCode, 'approve');
                    ngDialog.open({
                        template: dialogUrl,
                        scope: $scope,
                        disableAnimation: true
                    });
                }
            }

        };

        vm.confirmPopup = function(msg) {
            if (msg == 'clear') {
                vm.wrongPassword = false;
                vm.passwordErrorMsg = '';
                vm.transactionApproveModel.credential = '';
            }

            dialogPopup = UIFactory.showConfirmDialog({
                data: {
                    headerMessage: 'Confirm approve ?',
                    mode: 'transaction',
                    credentialMode: true,
                    displayName: vm.displayName,
                    wrongPassword: vm.wrongPassword,
                    passwordErrorMsg: vm.passwordErrorMsg,
                    rejectReason: null,
                    hideReason: true,
                    transactionModel: vm.transactionApproveModel
                },
                confirm: function() {
                    if (_validateCredential(vm.transactionApproveModel.credential)) {
                        return approve(vm.transactionApproveModel);
                    } else {
                        vm.wrongPassword = true;
                        vm.passwordErrorMsg = 'Password is required';
                        closeDialogPopUp();
                        vm.confirmPopup('error');
                    }
                },
                onFail: function(response) {
                    vm.handleDialogFail(response);
                },
                onSuccess: function(response) {
                    UIFactory.showSuccessDialog({
                        data: {
                            mode: 'transactionComplete',
                            headerMessage: 'Approve success.',
                            bodyMessage: vm.transaction,
                            viewRecent: vm.viewRecent,
                            viewHistory: vm.viewHistory,
                            backAndReset: vm.backPage,
                            hideBackButton: false,
                            hideViewRecentButton: false,
                            hideViewHistoryButton: false,
                            showOkButton: false,
                            printEvidenceFormAction: vm.printEvidenceFormAction,
                            canPrintEvidence: printEvidence(vm.transaction)
                        },
                    });
                }
            });
        };

        var approve = function(transactionApproveModel) {
            var deffered = ApprovePaymentService.approve(transactionApproveModel);
            deffered.promise.then(function(response) {
                vm.transaction = response.data;
            });
            return deffered;
        }

        var reject = function(transactionModel) {
            var deferred = ApprovePaymentService.reject(transactionModel);
            deferred.promise.then(function(response) {
                vm.transaction = response.data;
            })
            return deferred;
        }

        vm.confirmRejectPopup = function(msg) {
            if (msg == 'clear') {
                vm.wrongPassword = false;
                vm.passwordErrorMsg = '';
                vm.transactionApproveModel.credential = '';
                vm.transactionApproveModel.transaction.rejectReason = '';
            }
            UIFactory.showConfirmDialog({
                data: {
                    headerMessage: 'Confirm reject ?',
                    mode: 'transaction',
                    credentialMode: true,
                    displayName: vm.displayName,
                    wrongPassword: vm.wrongPassword,
                    passwordErrorMsg: vm.passwordErrorMsg,
                    rejectReason: '',
                    transactionModel: vm.transactionApproveModel
                },
                confirm: function() {
                    if (_validateCredential(vm.transactionApproveModel.credential)) {
                        return reject(vm.transactionApproveModel);
                    } else {
                        vm.wrongPassword = true;
                        vm.passwordErrorMsg = 'Password is required';
                        vm.confirmRejectPopup('error');
                    }
                },
                onFail: function(response) {
                    $scope.response = response.data;
                    if ($scope.response.errorCode == 'E0400') {
                        vm.wrongPassword = true;
                        vm.passwordErrorMsg = $scope.response.attributes.errorMessage;
                        vm.confirmRejectPopup('error');
                    } else {
                        UIFactory.showFailDialog({
                            data: {
                                mode: 'transaction',
                                headerMessage: 'Reject transaction fail',
                                backAndReset: vm.backPage,
                                viewHistory: vm.viewHistory,
                                viewRecent: vm.viewRecent,
                                errorCode: response.data.errorCode,
                                action: response.data.attributes.action,
                                actionBy: response.data.attributes.actionBy
                            },
                        });
                    }
                },
                onSuccess: function(response) {
                    UIFactory.showSuccessDialog({
                        data: {
                            mode: 'transaction',
                            headerMessage: 'Reject transaction success.',
                            bodyMessage: vm.transaction.transactionNo,
                            backAndReset: vm.backPage,
                            viewRecent: vm.viewRecent,
                            viewHistory: vm.viewHistory
                        },
                    });
                }
            });
        };
    }
]);