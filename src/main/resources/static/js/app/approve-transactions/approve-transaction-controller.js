angular.module('scfApp').controller('ApproveController', ['$scope', 'ApproveTransactionService', 'TransactionService', 'Service', '$stateParams', '$state', '$timeout', 'PageNavigation', 'UIFactory', 'ngDialog', '$q', '$log',

    function($scope, ApproveTransactionService, TransactionService, Service, $stateParams, $state, $timeout, PageNavigation, UIFactory, ngDialog, $q, $log) {
        var vm = this;
        var log = $log;
        vm.TransactionStatus = {
            book: 'B'
        }
        vm.canReject = false;
        vm.canApprove = false;
        vm.displayName = null;
        vm.agreed = false;
        vm.disableButton = true;
        vm.transaction = {};
        vm.response = {};
        vm.showEvidenceForm = false;
        vm.focusOnPassword = false;
        vm.wrongPassword = false;
        vm.transactionApproveModel = {
            transaction: vm.transactionApproveModel,
            credential: ''
        };

        vm.errorMessageCode = {
            timeout: 'TIMEOUT'
        }

        vm.errorMessageModel = {};
        vm.txnHour = { allowSendToBank: false };

        vm.agreeCondition = function() {
            vm.agreed = !vm.agreed;
            vm.disableButton = !(vm.txnHour.allowSendToBank && vm.agreed);
        };

        vm.confirmPopup = function() {
            ngDialog.open({
                template: '/js/app/approve-transactions/confirm-dialog.html',
                scope: $scope,
                disableAnimation: true
            });
        };

        var reject = function(transactionModel) {
            var deferred = ApproveTransactionService.reject(transactionModel);
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
                    if (validateCredential(vm.transactionApproveModel.credential)) {
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


        vm.approve = function() {
            if (validateCredential(vm.transactionApproveModel.credential)) {
                vm.wrongPassword = false;

                var deffered = ApproveTransactionService.approve(vm.transactionApproveModel);
                deffered.promise.then(function(response) {
                    vm.transaction = response.data;
                    vm.showEvidenceForm = printEvidence(vm.transaction);
                    ngDialog.open({
                        template: '/js/app/approve-transactions/success-dialog.html',
                        scope: $scope,
                        disableAnimation: true
                    });

                }).catch(function(response) {
                    $scope.response = response.data;
                    if(response.status == 402){		
    					UIFactory.showFailDialog({
    						data: {
    							mode: 'transaction',
    							headerMessage: 'Approve transaction fail.',
    							transaction: vm.transaction,
    							resend: vm.resendLoan,
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
                    	
                    } else if ($scope.response.errorCode == 'E0400') {
                        vm.confirmPopup();
                        vm.wrongPassword = true;
                        vm.passwordErrorMsg = $scope.response.attributes.errorMessage;
                    } else {
                    	
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
                        } else if ($scope.response.errorCode == "E1017" || $scope.response.errorCode == "E1018" || $scope.response.errorCode == "E1019"){
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
                });
            } else {
                vm.confirmPopup();
                vm.wrongPassword = true;
                vm.passwordErrorMsg = 'Password is required';
            }
        };


        vm.retry = function() {
            vm.transaction = vm.transactionApproveModel.transaction;

            var deffered = TransactionService.retry(vm.transaction);
            deffered.promise.then(function(response) {
                vm.transaction = response.data;
                vm.showEvidenceForm = printEvidence(vm.transaction);
                ngDialog.open({
                    template: '/js/app/approve-transactions/success-dialog.html',
                    scope: $scope,
                    disableAnimation: true
                });

            }).catch(function(response) {
                $scope.response = response.data;
                $scope.response.showViewRecentBtn = false;
                $scope.response.showViewHistoryBtn = true;
                $scope.response.showCloseBtn = $scope.response.errorCode == 'E1012' ? true : false;
                $scope.response.showBackBtn = true;

                vm.errorMessageModel = response.data;
                var dialogUrl = TransactionService.getTransactionDialogErrorUrl($scope.response.errorCode, 'approve');
                ngDialog.open({
                    template: dialogUrl,
                    scope: $scope,
                    disableAnimation: true
                });

            });
        }

		vm.resendLoan = function (data) {
			vm.transaction = vm.transactionApproveModel.transaction;
			
			var deffered = TransactionService.resend(vm.transaction);
			deffered.promise.then(function (response) {
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
				vm.searchTransactionService();
			}).catch(function (response) {
				UIFactory.showFailDialog({
					data: {
						mode: 'transaction',
						headerMessage: 'Resend transaction fail.',
						transaction: vm.transaction,
						resend: vm.resendLoan,
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
			});
		}
		
        vm.getTransaction = function() {
            var deffered = ApproveTransactionService.getTransaction(vm.transactionApproveModel.transaction);
            deffered.promise.then(function(response) {
                vm.transaction = response.data;
                ApproveTransactionService.generateRequestForm(vm.transactionApproveModel.transaction);

            }).catch(function(response) {
                log.error('Get transaction fail');
            });
        }

        vm.disable = function() {
            var disable = true;
            if (!vm.disableButton && vm.canApprove) {
                disable = false;
            }
            return disable;
        }

        vm.init = function() {
            vm.transactionApproveModel.transaction = $stateParams.transaction;
            if (vm.transactionApproveModel.transaction == null) {
                PageNavigation.gotoPage('/my-organize/transaction-list');
            } else {
                var params = {
                    transactionType: vm.transactionApproveModel.transaction.transactionType,
                    transactionMethod: vm.transactionApproveModel.transaction.transactionMethod,
                    transactionDate: vm.transactionApproveModel.transaction.transactionDate
                };
                var deffered = Service.requestURL('/api/transaction/verify-transaction-hour', params);
                deffered.promise.then(function(response) {
                    vm.txnHour = response;
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
                });

                vm.getTransaction();
                vm.displayName = $scope.userInfo.displayName;
            }

        }

        vm.init();

        vm.printEvidenceFormAction = function() {
            if (printEvidence(vm.transaction)) {
                TransactionService.generateEvidenceForm(vm.transaction);
            }
        }

        vm.backPage = function() {
            $timeout(function() {
                PageNavigation.gotoPreviousPage(false);
            }, 10);
        }

        vm.backAndReset = function() {
            $timeout(function() {
                PageNavigation.gotoPreviousPage(true);
            }, 10);
        }

        vm.viewRecent = function() {
            if (!angular.isUndefined(vm.transaction.sponsorOrganize)) {
                vm.transaction.sponsor = vm.transaction.sponsorOrganize.organizeName;
            }

            $timeout(function() {
                var params = { transactionModel: vm.transaction, isShowViewHistoryButton: 'show', isShowViewHistoryButton: true, viewMode: 'MY_ORGANIZE' };
                PageNavigation.gotoPage('/view-transaction', params, params);
            }, 10);
        };

        vm.viewHistory = function() {
            $timeout(function() {
                PageNavigation.gotoPage('/my-organize/transaction-list');
            }, 10);
        };

        function validateCredential(data) {
            var result = true;
            if (angular.isUndefined(data) || data === '') {
                result = false;
            }
            return result;
        }

        function printEvidence(transaction) {
            if (transaction.returnStatus === vm.TransactionStatus.book) {
                return true;
            }
            return false;
        }

        function getTransactionDialogErrorUrl(errorCode) {
            var templateUrl = '/js/app/approve-transactions/fail-dialog.html';
            if (angular.isDefined(errorCode)) {
                if (errorCode == vm.errorMessageCode.timeout) {
                    templateUrl = '/js/app/approve-transactions/incomplete-dialog.html';
                }
            }
            return templateUrl;
        }
    }
]);