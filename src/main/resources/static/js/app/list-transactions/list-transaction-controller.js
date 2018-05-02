angular.module('scfApp').controller('ListTransactionController', ['ListTransactionService', 'TransactionService', '$state', '$timeout', '$translate',
	'$rootScope', '$scope', 'SCFCommonService', '$stateParams', '$cookieStore', 'UIFactory', 'PageNavigation', 'ngDialog', '$log', '$http', '$q', 'Service', 'scfFactory',
	function (ListTransactionService, TransactionService, $state, $timeout, $translate,
		$rootScope, $scope, SCFCommonService, $stateParams, $cookieStore, UIFactory, PageNavigation, ngDialog, $log, $http, $q, Service, scfFactory) {
		var vm = this;
		vm.getUserInfoSuccess = false;
		var defered = scfFactory.getUserInfo();
		defered.promise.then(function (response) {
			vm.getUserInfoSuccess = true;
			var log = $log;
			var listStoreKey = 'listrancri';
			var organizeId = $rootScope.userInfo.organizeId;
			var sponsorAutoSuggestServiceUrl;
			var displayBank = false;
			var displaySponsor = false;
			var displaySupplier = false;
			vm.showInfomation = false;
			var sponsorInfo = null;
			var supplierInfo = null;
			vm.serverTime = '';
			vm.splitePageTxt = '';
			vm.transactionType = {
				transactionDate: 'transactionDate',
				maturityDate: 'maturityDate'
			}

			var hiddenSponsor = null;
			var hiddenSponsorPic = null;
			var hiddenSupplier = null;

			// Data Sponsor for select box
			vm.verify = false;
			vm.approve = false;
			vm.reject = false;
			vm.rejectInsufficientFunds = false;
			vm.resend = false;
			vm.canAdjustStatus = false;
			vm.transactionIdForRetry = '';
			vm.transaction = {};
			vm.statusDocuments = {
				waitForVerify: 'WAIT_FOR_VERIFY',
				waitForApprove: 'WAIT_FOR_APPROVE',
				rejectByChecker: 'REJECT_BY_CHECKER',
				rejectByApprover: 'REJECT_BY_APPROVER',
				canceledBySupplier: 'CANCELLED_BY_SUPPLIER',
				waitForDrawdownResult: 'WAIT_FOR_DRAWDOWN_RESULT',
				rejectIncomplete: 'REJECT_INCOMPLETE',
				incomplete: 'INCOMPLETE',
				insufficientFunds: 'INSUFFICIENT_FUNDS'
			}

			vm.storeSearchCriteria = undefined;

			vm.displayName = $scope.userInfo.displayName;

			vm.transactionPayload = {
				transaction: null,
				credential: ''
			};

			var viewMode = $stateParams.viewMode;

			var mode = {
				MY_ORGANIZE: 'MY_ORGANIZE',
				PARTNER: 'PARTNER',
				CUSTOMER: 'CUSTOMER'
			}

			var initialHidden = function () {
				if (viewMode == mode.CUSTOMER) {
					hiddenSponsor = true;
					hiddenSponsorPic = false;
					hiddenSupplier = false;
				} else if (viewMode == mode.PARTNER) {
					hiddenSponsor = true;
					hiddenSponsorPic = true;
					hiddenSupplier = false;
				} else if (viewMode == mode.MY_ORGANIZE) {
					hiddenSponsor = false;
					hiddenSponsorPic = true;
					hiddenSupplier = true;
				}
			}();

			vm.documentListModel = {
				sponsor: undefined,
				supplier: undefined,
				supplierCode: undefined,
				uploadDateFrom: '',
				uploadDateTo: '',
			}

			vm.transactionStatus = {
				book: 'B'
			}

			vm.transactionStatusGroupDropdown = [{
				label: 'All',
				value: ''
			}];

			vm.sponsorCodeDropdown = [{
				label: 'All',
				value: ''
			}];

			vm.tableRowCollection = [];

			vm.clearInternalStep = function () {
				vm.summaryInternalStep = {
					wait_for_verify: {
						totalRecord: 0,
						totalAmount: 0
					},
					wait_for_approve: {
						totalRecord: 0,
						totalAmount: 0
					},
					reject_by_checker: {
						totalRecord: 0,
						totalAmount: 0
					},
					reject_by_approver: {
						totalRecord: 0,
						totalAmount: 0
					},
					cancelled_by_supplier: {
						totalRecord: 0,
						totalAmount: 0
					}
				};
				vm.summaryStatusGroup = {
					INTERNAL_STEP: {
						totalRecord: 0,
						totalAmount: 0
					},
					WAIT_FOR_DRAWDOWN_RESULT: {
						totalRecord: 0,
						totalAmount: 0
					},
					DRAWDOWN_SUCCESS: {
						totalRecord: 0,
						totalAmount: 0
					},
					DRAWDOWN_FAIL: {
						totalRecord: 0,
						totalAmount: 0
					},
					GRAND_TOTAL: {
						totalRecord: 0,
						totalAmount: 0
					}
				};
			}

			// Datepicker
			vm.openDateFrom = false;
			vm.dateFormat = 'dd/MM/yyyy';
			vm.openDateTo = false;
			vm.dateModel = {
				dateFrom: '',
				dateTo: ''
			}
			// Model mapping whith page list
			vm.listTransactionModel = {
				dateType: vm.transactionType.transactionDate,
				dateFrom: '',
				dateTo: '',
				sponsorId: '',
				supplierId: '',
				supplierCode: '',
				transactionNo: '',
				statusGroup: '',
				order: '',
				orderBy: ''
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

			vm.loadTransactionGroup = function () {
				var transactionStatusGroupDefered = ListTransactionService.getTransactionStatusGroups('DRAWDOWN');
				transactionStatusGroupDefered.promise.then(function (response) {
					var transactionStatusGroupList = response.data;
					if (transactionStatusGroupList !== undefined) {
						transactionStatusGroupList.forEach(function (obj) {
							var selectObj = {
								label: obj.statusMessageKey,
								value: obj.statusGroup
							}
							vm.transactionStatusGroupDropdown.push(selectObj);
						});
					}
				}).catch(function (response) {
					$log.error('Load TransactionStatusGroup Fail');
				});
			};

			var reject = function (transactionPayload) {
				var deffered = TransactionService.reject(transactionPayload);
				deffered.promise.then(function (response) {
					vm.transaction = response.data;
					vm.searchTransactionService();
				});
				return deffered;
			}

			var retryReject = function (transaction) {
				var deffered = TransactionService.retry(transaction);
				deffered.promise.then(function (response) {
					vm.transaction = response.data;
					vm.searchTransactionService();
				});
				return deffered;
			}

			vm.retryReject = function () {
				vm.transaction.transactionId = vm.transactionIdForRetry;
				var deffered = retryReject(vm.transaction);
				deffered.promise.then(function (response) {
					if (response.status == 200) {
						if (vm.transaction.returnStatus == 'C') {
							UIFactory.showSuccessDialog({
								data: {
									mode: 'transaction',
									headerMessage: 'Reject transaction success.',
									bodyMessage: vm.transaction.transactionNo,
									viewRecent: vm.viewRecent,
									viewHistory: vm.searchTransactionService,
									hideBackButton: true,
									hideViewRecentButton: false,
									hideViewHistoryButton: true,
									showOkButton: true
								},
							});
						} else {
							vm.transaction.retriable = true;
							vm.transaction.rejectReason = null;
							UIFactory.showIncompleteDialog({
								data: {
									mode: 'transaction',
									headerMessage: 'Reject transaction incomplete.',
									transaction: vm.transaction,
									retry: vm.retryReject,
									viewHistory: vm.searchTransactionService,
									hideBackButton: true,
									hideViewRecentButton: true,
									hideViewHistoryButton: true,
									showOkButton: true
								},
							});
						}
					} else {
						vm.handleDialogFail(response);
					}
				}).catch(function (response) {
					vm.handleDialogFail(response);
				});
			};

			var dialogPopup;

			var closeDialogPopUp = function () {
				dialogPopup.close();
			}

			vm.confirmRejectPopup = function (data, msg) {
				if (msg == 'clear') {
					vm.wrongPassword = false;
					vm.passwordErrorMsg = '';
					vm.transactionPayload.credential = '';
					vm.transactionPayload.rejectReason = '';
					vm.transactionPayload.transaction = null;
				}

				vm.transaction = {};
				vm.transaction.transactionId = data.transactionId;
				vm.transaction.transactionNo = data.transactionNo;
				vm.transaction.version = data.version;
				vm.transaction.statusCode = data.statusCode;
				vm.transaction.rejectReason = data.rejectReason;
				vm.transaction.sponsorId = data.sponsorId;
				vm.transaction.supplierId = data.supplierId;
				vm.transaction.transactionType = data.transactionType;
				vm.transactionIdForRetry = data.transactionId;

				vm.transactionPayload.transaction = vm.transaction;
				dialogPopup = UIFactory.showConfirmDialog({
					data: {
						headerMessage: 'Confirm reject ?',
						mode: 'transaction',
						credentialMode: true,
						displayName: vm.displayName,
						wrongPassword: vm.wrongPassword,
						passwordErrorMsg: vm.passwordErrorMsg,
						rejectReason: null,
						transactionModel: vm.transactionPayload
					},
					confirm: function () {
						if (TransactionService.validateCredential(vm.transactionPayload.credential)) {
							return reject(vm.transactionPayload);
						} else {
							vm.wrongPassword = true;
							vm.passwordErrorMsg = 'Password is required';
							closeDialogPopUp();
							vm.confirmRejectPopup(vm.transactionPayload.transaction, 'error');
						}
					},
					onFail: function (response) {
						vm.handleDialogFail(response);
					},
					onSuccess: function (response) {
						UIFactory.showSuccessDialog({
							data: {
								mode: 'transaction',
								headerMessage: 'Reject transaction success.',
								bodyMessage: vm.transaction.transactionNo,
								viewRecent: vm.viewRecent,
								viewHistory: vm.searchTransactionService,
								hideBackButton: true,
								hideViewRecentButton: false,
								hideViewHistoryButton: true,
								showOkButton: true
							},
						});
					}
				});
			};
			
			vm.resendLoan = function (data) {
				vm.transaction = {};
				if (angular.isUndefined(data)) {
					vm.transaction.transactionId = vm.transactionIdForRetry;
				} else {
					vm.transaction.transactionId = data.transactionId;
					vm.transaction.transactionNo = data.transactionNo;
					vm.transaction.version = data.version;
					vm.transaction.statusCode = data.statusCode;
					vm.transactionIdForRetry = vm.transaction.transactionId;
				}
				vm.storeCriteria();				
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
					vm.handleDialogFail(response,'Resend transaction');
				});
			}

			vm.handleDialogFail = function (response, action) {
				if (response.status == 400) {
					if (response.data.errorCode == 'E0400') {
						vm.wrongPassword = true;
						vm.passwordErrorMsg = response.data.errorMessage;
						vm.confirmRejectPopup(vm.transactionPayload.transaction, 'error');
					} else if (response.data.errorCode == 'INVALID') {
						var message = response.data.attributes.suspend?'Please try again later.':'Please approve transaction within';
						UIFactory.showHourDialog({
							data: {
								mode: 'transaction',
								headerMessage: 'Service unavailable.',
								bodyMessage: message,
								startTransactionHour: response.data.attributes.startTransactionHour,
								endTransactionHour: response.data.attributes.endTransactionHour,
                                suspend: response.data.attributes.suspend
							},
						});
					}
				} else if(response.status == 402){
					vm.transaction.transactionNo = response.data.attributes.transactionNo;
					vm.transaction.returnCode = response.data.attributes.returnCode;
					vm.transaction.returnMessage = response.data.attributes.returnMessage;
			    	vm.transaction.retriable = response.data.attributes.retriable;
			    	vm.transaction.version = response.data.attributes.version;					
					UIFactory.showFailDialog({
						data: {
							mode: 'transaction',
							headerMessage: action+' fail.',
							transaction: vm.transaction,
							resend: vm.resendLoan,
							backAndReset: vm.backAndReset,
							viewRecent: vm.viewRecent,
							viewHistory: vm.searchTransactionService,
							hideBackButton: true,
							hideViewRecentButton: true,
							hideViewHistoryButton: true,
							showOkButton: true,
							showContactInfo: true,
							showResend: true
						},
					});
				} else if (response.status == 409) {
					if (response.data.errorCode == 'FAILED') {
						UIFactory.showFailDialog({
							data: {
								mode: 'transaction',
								headerMessage: action+' fail.',
								backAndReset: vm.backAndReset,
								viewHistory: vm.searchTransactionService,
								errorCode: response.data.errorCode,
								action: response.data.attributes.action,
								actionBy: response.data.attributes.actionBy
							},
						});
					}
				} else if (response.status == 500) {
					if (response.data.errorCode == 'INCOMPLETE') {
						vm.transaction.transactionNo = response.data.attributes.transactionNo;
						vm.transaction.returnCode = response.data.attributes.returnCode;
						vm.transaction.returnMessage = response.data.attributes.returnMessage;
						vm.transaction.retriable = response.data.attributes.retriable;
						vm.transaction.version = response.data.attributes.version;
						vm.transaction.rejectReason = null;
						UIFactory.showIncompleteDialog({
							data: {
								mode: 'transaction',
								headerMessage: action+' incomplete.',
								transaction: vm.transaction,
								retry: vm.retryReject,
								viewHistory: vm.searchTransactionService,
								hideBackButton: true,
								hideViewRecentButton: true,
								hideViewHistoryButton: true,
								showOkButton: true
							},
						});
					} else if (response.data.errorCode == 'FAILED') {
						vm.transaction.transactionNo = response.data.attributes.transactionNo;
						vm.transaction.returnCode = response.data.attributes.returnCode;
						vm.transaction.returnMessage = response.data.attributes.returnMessage;
						vm.transaction.retriable = response.data.attributes.retriable;
						vm.transaction.version = response.data.attributes.version;
						vm.transaction.rejectReason = null;
						UIFactory.showFailDialog({
							data: {
								mode: 'transaction',
								headerMessage: action+' fail.',
								transaction: vm.transaction,
								retry: vm.retryReject,
								backAndReset: vm.backAndReset,
								viewRecent: vm.viewRecent,
								viewHistory: vm.searchTransactionService,
								hideBackButton: true,
								hideViewRecentButton: true,
								hideViewHistoryButton: true,
								showOkButton: true,
								showContactInfo: true
							},
						});
					}
				} else {
					UIFactory.showFailDialog({
						data: {
							mode: 'transaction',
							headerMessage: action+' fail',
							backAndReset: vm.backAndReset,
							viewHistory: vm.searchTransactionService,
							errorCode: response.data.errorCode,
							action: response.data.attributes.action,
							actionBy: response.data.attributes.actionBy
						},
					});
				}
			};

			vm.dataTable = {
				options: {
					displayRowNo: {
						idValueField: 'transactionNo',
						id: 'transaction-{value}-row-no-label'
					}
				},
				expansion: {
					expanded: true
				},
				columns: [{
					fieldName: 'sponsor',
					field: 'sponsorLogo',
					label: 'Sponsor',
					idValueField: 'transactionNo',
					id: 'transaction-{value}-sponsor-name-label',
					sortData: true,
					cssTemplate: 'text-center',
					dataRenderer: function (record) {
						return '<img style="height: 32px; width: 32px;" data-ng-src="data:image/png;base64,' + atob(record.sponsorLogo) + '"></img>';
					},
					hidden: function () {
						return hiddenSponsorPic
					}
				}, {
					fieldName: 'sponsor',
					field: 'sponsor',
					label: 'Sponsor',
					idValueField: 'transactionNo',
					id: 'transaction-{value}-sponsor-name-label',
					sortData: true,
					cssTemplate: 'text-center',
					hidden: function () {
						return hiddenSponsor
					}
				}, {
					fieldName: 'supplier',
					field: 'supplier',
					label: 'Supplier',
					idValueField: 'transactionNo',
					id: 'transaction-{value}-supplier-name-label',
					sortData: true,
					cssTemplate: 'text-center',
					hidden: function () {
						return hiddenSupplier
					}
				}, {
					fieldName: 'transactionDate',
					field: 'transactionDate',
					label: 'Transaction Date',
					idValueField: 'transactionNo',
					id: 'transaction-{value}-transaction-date-label',
					filterType: 'date',
					filterFormat: 'dd/MM/yyyy',
					sortData: true,
					cssTemplate: 'text-center'
				}, {
					fieldName: 'transactionNo',
					field: 'transactionNo',
					label: 'Transaction No',
					id: 'transaction-{value}-transaction-no-label',
					sortData: true,
					cssTemplate: 'text-center',
				}, {
					fieldName: 'drawdownAmount',
					field: 'transactionAmount',
					label: 'Drawdown Amount',
					idValueField: 'transactionNo',
					id: 'transaction-{value}-drawdown-amount-label',
					filterType: 'number',
					filterFormat: '2',
					sortData: true,
					cssTemplate: 'text-center',
				}, {
					fieldName: 'bankTransactionNo',
					field: 'bankTransactionNo',
					label: 'Bank Transaction No',
					idValueField: 'transactionNo',
					id: 'transaction-{value}-bank-transaction-no-label',
					sortData: true,
					cssTemplate: 'text-center'
				}, {
					fieldName: 'maturityDate',
					field: 'maturityDate',
					label: 'Maturity Date',
					idValueField: 'transactionNo',
					id: 'transaction-{value}-maturity-date-label',
					filterType: 'date',
					filterFormat: 'dd/MM/yyyy',
					sortData: true,
					cssTemplate: 'text-center'
				}, {
					fieldName: 'statusMessageKey',
					field: 'statusCode',
					label: 'Status',
					sortData: true,
					idValueField: 'transactionNo',
					id: 'status-{value}',
					filterType: 'translate',
					cssTemplate: 'text-center',
				}, {
					fieldName: 'action',
					field: 'action',
					label: 'Action',
					cssTemplate: 'text-center',
					sortData: false,
					cellTemplate: '<scf-button class="btn btn-sm" ng-disabled="!(ctrl.verify && (data.statusCode === ctrl.statusDocuments.waitForVerify))" id="transaction-{{data.transactionNo}}-verify-button" ng-click="ctrl.verifyTransaction(data)" title="Verify"><i class="fa fa-inbox" aria-hidden="true"></i></scf-button>' +
						'<scf-button id="transaction-{{data.transactionNo}}-approve-button" ng-disabled="!(ctrl.approve &&(data.statusCode === ctrl.statusDocuments.waitForApprove))" class="btn btn-sm"  ng-click="ctrl.approveTransaction(data)" title="Approve"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>' +
						'<scf-button class="btn btn-sm" id="transaction-{{data.transactionNo}}-view-button" ng-disabled="{{!ctrl.canView}}" ng-click="ctrl.view(data)" title="View"><span class="fa fa-search" aria-hidden="true"></span></scf-button>' +
						'<scf-button id="transaction-{{data.transactionNo}}-re-check-button" class="btn btn-sm" ng-disabled="{{!(data.retriable && ctrl.canRetry && data.statusCode != ctrl.statusDocuments.insufficientFunds)}}" ng-click="ctrl.retry(data)" title="Re-check"><span class="fa fa-repeat" aria-hidden="true"></span></scf-button>' +
						'<scf-button id="transaction-{{data.transactionNo}}-print-button"class="btn btn-sm" ng-disabled="ctrl.disabledPrint(data.returnStatus)" ng-click="ctrl.printEvidenceFormAction(data)" title="Print"><span class="fa fa-print" aria-hidden="true"></scf-button>' +
						'<scf-button id="transaction-{{data.transactionNo}}-reject-button"class="btn btn-sm" ng-disabled="ctrl.disabledReject(data)" ng-click="ctrl.confirmRejectPopup(data,\'clear\')" title="Reject"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>' +
						//'<scf-button id="transaction-{{data.transactionNo}}-resend-button"class="btn btn-sm" ng-disabled="ctrl.disabledResend(data)" ng-click="ctrl.resendLoan(data)" title="Resend"><i class="fa fa-share" aria-hidden="true"></i></scf-button>' + 
						'<scf-button class="btn btn-sm" id="transaction-{{data.transactionNo}}-adjust-status-button" ng-if="ctrl.showAdjustStatus(data)" ng-click="ctrl.adjustStatus(data)" title="Adjust status"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
				}]
			};
			vm.openCalendarDateFrom = function () {
				vm.openDateFrom = true;
			};

			vm.openCalendarDateTo = function () {
				vm.openDateTo = true;
			};

			var _criteria = {
				page: 0,
				pageSize: "20"
			}

			vm.searchTransaction = function (criteria) {
				vm.invalidDateCriteria = false;
				vm.invalidDateCriteriaMsg = '';
				var dateFrom = vm.dateModel.dateFrom;
				var dateTo = vm.dateModel.dateTo;

				vm.listTransactionModel.sponsorId = '';
				vm.listTransactionModel.supplierId = '';
				vm.listTransactionModel.dateFrom = SCFCommonService.convertDate(dateFrom);
				vm.listTransactionModel.dateTo = SCFCommonService.convertDate(dateTo);

				if (typeof vm.documentListModel.sponsor == 'object' && vm.documentListModel.sponsor != undefined) {
					vm.listTransactionModel.sponsorId = vm.documentListModel.sponsor.memberId;
					vm.listTransactionModel.sponsorInfo = {
						organizeId: vm.documentListModel.sponsor.memberId,
						organizeCode: vm.documentListModel.sponsor.memberCode,
						organizeName: vm.documentListModel.sponsor.memberName
					};
				} else {
					vm.listTransactionModel.sponsorInfo = null;
				}

				if (typeof vm.documentListModel.supplier == 'object' && vm.documentListModel.supplier != undefined) {
					vm.listTransactionModel.supplierId = vm.documentListModel.supplier.memberId;
					vm.listTransactionModel.supplierInfo = {
						organizeId: vm.documentListModel.supplier.memberId,
						organizeCode: vm.documentListModel.supplier.memberCode,
						organizeName: vm.documentListModel.supplier.memberName
					};
				} else {
					vm.listTransactionModel.supplierInfo = null;
				}

				if (criteria === undefined || criteria == null) {
					vm.pageModel.currentPage = '0';
					vm.pageModel.pageSizeSelectModel = '20';
					vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
					vm.listTransactionModel.order = '';
					vm.listTransactionModel.orderBy = '';
				} else {
					vm.pageModel.currentPage = criteria.page;
					vm.pageModel.pageSizeSelectModel = criteria.pageSize;
				}

				_criteria.page = vm.pageModel.currentPage;
				_criteria.pageSize = vm.pageModel.pageSizeSelectModel;

				if (angular.isUndefined(dateFrom)) {
					vm.invalidDateCriteria = true;
					vm.invalidDateCriteriaMsg = {
						message: 'Wrong date format data.'
					}
				}

				if (angular.isUndefined(dateTo)) {
					vm.invalidDateCriteria = true;
					vm.invalidDateCriteriaMsg = {
						message: 'Wrong date format data.'
					}
				}

				if (dateFrom != '' && dateFrom != null && dateTo != '' && dateTo != null) {

					var dateTimeFrom = new Date(dateFrom);
					var dateTimeTo = new Date(dateTo);

					if (dateTimeFrom > dateTimeTo) {
						vm.invalidDateCriteria = true;
						vm.invalidDateCriteriaMsg = {
							message: 'From date must be less than or equal to To date.'
						}
					}
				}

				if (!vm.invalidDateCriteria) {
					vm.searchTransactionService();
				}
			};

			var saveSearchCriteriaData = function () {
				vm.storeSearchCriteria = {
					dateFrom: vm.listTransactionModel.dateFrom,
					dateTo: vm.listTransactionModel.dateTo,
					dateType: vm.listTransactionModel.dateType,
					order: vm.listTransactionModel.order,
					page: vm.listTransactionModel.page,
					pageSize: vm.listTransactionModel.pageSize,
					sponsorId: vm.listTransactionModel.sponsorId,
					sponsorInfo: vm.listTransactionModel.sponsorInfo,
					statusCode: vm.listTransactionModel.statusCode,
					statusGroup: vm.listTransactionModel.statusGroup,
					supplier: vm.listTransactionModel.supplier,
					supplierCode: vm.listTransactionModel.supplierCode,
					supplierId: vm.listTransactionModel.supplierId,
					supplierInfo: vm.listTransactionModel.supplierInfo,
					transactionNo: vm.listTransactionModel.transactionNo
				}
			}

			vm.searchTransactionService = function () {
				saveSearchCriteriaData();
				var transactionModel = angular.extend(vm.listTransactionModel, {
					page: vm.pageModel.currentPage,
					pageSize: vm.pageModel.pageSizeSelectModel,
					transactionType: 'DRAWDOWN'
				});


				if (viewMode == mode.PARTNER) {
					transactionModel.sponsorId = organizeId;
				} else if (viewMode == mode.MY_ORGANIZE) {
					transactionModel.supplierId = organizeId;
				} else if (viewMode == mode.CUSTOMER) {

				}

				var transactionDifferd = ListTransactionService.getTransactionDocument(transactionModel);
				transactionDifferd.promise.then(function (response) {
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
					if (viewMode == mode.MY_ORGANIZE || viewMode == mode.PARTNER) {
						if (vm.listTransactionModel.statusGroup === 'INTERNAL_STEP' || vm.listTransactionModel.statusGroup === '') {
							var internalStepDeffered = ListTransactionService.summaryInternalStep(transactionModel);
							internalStepDeffered.promise.then(function (response) {
								var internalStemp = response.data;
								if (internalStemp.length > 0) {
									internalStemp.forEach(function (summary) {
										if (vm.summaryInternalStep[summary.statusMessageKey]) {
											vm.summaryInternalStep[summary.statusMessageKey].totalRecord = summary.totalRecord;
											vm.summaryInternalStep[summary.statusMessageKey].totalAmount = summary.totalAmount;
										}
									});
								}
							}).catch(function (response) {
								$log.error('Internal Error');
							});
						}
					} else if (viewMode == mode.CUSTOMER) {
						var summaryStatusGroupDeffered = TransactionService.summaryStatusGroup(transactionModel);
						summaryStatusGroupDeffered.promise.then(function (response) {
							var summaryStatusGroup = response.data;
							summaryStatusGroup.forEach(function (summary) {
								if (vm.summaryStatusGroup[summary.statusGroup]) {
									vm.summaryStatusGroup[summary.statusGroup].totalRecord = summary.totalRecord;
									vm.summaryStatusGroup[summary.statusGroup].totalAmount = summary.totalAmount;
								}
							});
						}).catch(function (response) {
							$log.error('Summary Group Status Error');
						});
					}
				}).catch(function (response) {
					$log.error('Cannot search document');
				});
			};

			$scope.sortData = function (order, orderBy) {
				vm.listTransactionModel.order = order;
				vm.listTransactionModel.orderBy = orderBy;
				vm.searchTransactionService();
			};

			vm.exportCSVFile = function () {
				var dateFrom = vm.dateModel.dateFrom;
				var dateTo = vm.dateModel.dateTo;

				vm.listTransactionModel.dateFrom = SCFCommonService.convertDate(dateFrom);
				vm.listTransactionModel.dateTo = SCFCommonService.convertDate(dateTo);

				var transactionModel = angular.extend(vm.listTransactionModel, {
					page: 0,
					pageSize: 0
				});

				var transactionDifferd = ListTransactionService.exportCSVFile(transactionModel, $translate);
			};
			vm.storeCriteria = function () {
				$cookieStore.put(listStoreKey, vm.storeSearchCriteria);
			}

			vm.verifyTransaction = function (data) {
				SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
				vm.storeCriteria();
				PageNavigation.gotoPage('/verify-transaction', {
					transactionModel: data
				}, {
					criteria: _criteria
				});
			}

			vm.view = function (data) {
				SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
				vm.storeCriteria();
				var isShowBackButton = true;
				var isShowBackButton = false;

				var params = {
					transactionModel: data,
					viewMode: viewMode,
					isShowViewHistoryButton: false,
					isShowBackButton: true,
					isAdjustStatus: false,
					criteria: _criteria
				}
				PageNavigation.gotoPage('/view-transaction', params, params)
			}
			
			vm.adjustStatus = function (data) {
				SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
				vm.storeCriteria();
				var isShowBackButton = true;

				var params = {
					transactionModel: data,
					viewMode: viewMode,
					isShowViewHistoryButton: false,
					isShowBackButton: true,
					isAdjustStatus: true,
					criteria: _criteria
				}
				PageNavigation.gotoPage('/adjust-status-transaction', params, params)
			}

			vm.disabledPrint = function (returnStatus) {
				if (!vm.canPrint || returnStatus !== vm.transactionStatus.book) {
					return true;
				} else {
					return false;
				}
			}

			vm.disabledReject = function (data) {
				var hasReject = vm.reject != undefined && vm.reject == true;
				var isWaitForDrawdownResult = data.statusCode == vm.statusDocuments.waitForDrawdownResult;
				var isAfterToday = TransactionService.isAfterToday(data, vm.serverTime);
				
				var hasRejectInsufficientFunds = vm.rejectInsufficientFunds != undefined && vm.rejectInsufficientFunds == true;
				var isInsufficientFunds = data.statusCode == vm.statusDocuments.insufficientFunds;
				
				if (hasReject && isWaitForDrawdownResult && isAfterToday) {
					return false;
				}else if(hasRejectInsufficientFunds && isInsufficientFunds){
					return false;
				} else {
					return true;
				}
			}
			
			vm.disabledResend = function (data) {
				var condition1 = vm.resend != undefined && vm.resend == true;
				var condition2 = data.statusCode == vm.statusDocuments.insufficientFunds;
				if (condition1 && condition2) {
					return false;
				} else {
					return true;
				}
			}
			
			vm.showAdjustStatus = function (data) {
				var condition1 = vm.canAdjustStatus != undefined && vm.canAdjustStatus == true;
				var condition2 = data.statusCode == vm.statusDocuments.incomplete
				if (condition1 && condition2) {
					return true;
				} else {
					return false;
				}
			}

			vm.initLoad = function () {
				var backAction = $stateParams.backAction;

				if (backAction === true) {
					vm.listTransactionModel = $cookieStore.get(listStoreKey);
					vm.dateModel.dateFrom = SCFCommonService.convertStringTodate(vm.listTransactionModel.dateFrom);
					vm.dateModel.dateTo = SCFCommonService.convertStringTodate(vm.listTransactionModel.dateTo);

					if (vm.listTransactionModel.sponsorInfo != undefined) {
						var sponsorInfo = prepareAutoSuggestLabel(vm.listTransactionModel.sponsorInfo, 'sponsor');
						vm.documentListModel.sponsor = sponsorInfo;
					}

					if (vm.listTransactionModel.supplierInfo != undefined) {
						var supplierInfo = prepareAutoSuggestLabel(vm.listTransactionModel.supplierInfo, 'supplier');
						vm.documentListModel.supplier = supplierInfo;
					}
				}

				vm.sponsorTxtDisable = false;
				vm.supplierTxtDisable = false;

				if (viewMode == mode.PARTNER) {
					vm.sponsorTxtDisable = true;
					initSponsorAutoSuggest();
					sponsorAutoSuggestServiceUrl = 'api/v1/buyers';
				} else if (viewMode == mode.MY_ORGANIZE) {

					vm.supplierTxtDisable = true;
					initSupplierAutoSuggest();
					sponsorAutoSuggestServiceUrl = 'api/v1/buyers?supplierId=' + organizeId;
					checkSupplierTP(organizeId);
				} else if (viewMode == mode.CUSTOMER) {
					sponsorAutoSuggestServiceUrl = 'api/v1/buyers';
				}

				if ($stateParams.backAction) {
					vm.searchTransaction($stateParams.criteria);
				} else {
					vm.searchTransaction();
				}


				$cookieStore.remove(listStoreKey);
			};


			var prepareAutoSuggestLabel = function (item, role) {
				item.identity = [role, '-', item.memberId, '-option'].join('');
				item.label = [item.memberCode, ': ', item.memberName].join('');
				return item;
			}

			var checkSupplierTP = function (organizeId) {
				var supplierTPDeferred = Service.doGet(sponsorAutoSuggestServiceUrl, {
					q: '',
					offset: 0,
					limit: 5
				});
				supplierTPDeferred.promise.then(function (response) {
					if (response.data.length == 1) {
						var sponsorInfo = response.data[0];
						sponsorInfo = prepareAutoSuggestLabel(sponsorInfo, 'sponsor');
						vm.documentListModel.sponsor = sponsorInfo;
						vm.searchDocument();
					}
				});
			}

			var organizeInfo = {
				memberId: $rootScope.userInfo.organizeId,
				memberCode: $rootScope.userInfo.organizeCode,
				memberName: $rootScope.userInfo.organizeName
			}

			var initSponsorAutoSuggest = function () {
				var sponsorInfo = {
		        			memberId : $rootScope.userInfo.organizeId,
		        		  memberCode : $rootScope.userInfo.organizeCode,
		        		  memberName : $rootScope.userInfo.organizeName
		        }
				sponsorInfo = prepareAutoSuggestLabel(sponsorInfo, 'sponsor');
				vm.documentListModel.sponsor = sponsorInfo;
			}

			var initSupplierAutoSuggest = function () {
				var supplierInfo = {
		        			memberId : $rootScope.userInfo.organizeId,
		        		  memberCode : $rootScope.userInfo.organizeCode,
		        		  memberName : $rootScope.userInfo.organizeName
				}
				supplierInfo = prepareAutoSuggestLabel(supplierInfo, 'supplier');
				vm.documentListModel.supplier = supplierInfo;
			}

			var convertFundingMemberToOrganize = function (fundingMember) {
				var organize = {
					memberId: fundingMember.memberId,
					memberCode: fundingMember.memberCode,
					memberName: fundingMember.memberName
				}
				return organize;
			}

			var querySponsorCode = function (value) {
				value = value = UIFactory.createCriteria(value);
				return $http.get(sponsorAutoSuggestServiceUrl, {
					params: {
						q: value,
						offset: 0,
						limit: 5
					}
				}).then(function (response) {
					return response.data.map(function (item) {
						item = convertFundingMemberToOrganize(item);
						item = prepareAutoSuggestLabel(item, 'sponsor');
						return item;
					});
				});
			};

			var querySupplierCode = function (value) {
				var viewMode = $stateParams.viewMode;
				var buyerId;
				if (viewMode == mode.CUSTOMER) {
					buyerId = null;
				} else {
					buyerId = vm.documentListModel.sponsor.organizeId;
				}
				var supplierCodeServiceUrl = 'api/v1/suppliers';
				value = value = UIFactory.createCriteria(value);

				return $http.get(supplierCodeServiceUrl, {
					params: {
						q: value,
						buyerId: buyerId,
						offset: 0,
						limit: 5
					}
				}).then(function (response) {
					return response.data.map(function (item) {
						item = convertFundingMemberToOrganize(item);
						item = prepareAutoSuggestLabel(item, 'supplier');
						return item;
					});
				});
			};

			var placeholder;
			if ($stateParams.viewMode == mode.CUSTOMER) {
				placeholder = 'Enter organization name or code';
			} else {
				placeholder = 'Please Enter organization name or code';
			}

			vm.sponsorAutoSuggestModel = UIFactory.createAutoSuggestModel({
				placeholder: placeholder,
				itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
				query: querySponsorCode
			});

			vm.supplierAutoSuggestModel = UIFactory.createAutoSuggestModel({
				placeholder: 'Enter organization name or code',
				itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
				query: querySupplierCode
			});

			vm.initLoad();
			vm.loadTransactionGroup();

			vm.approveTransaction = function (data) {
				vm.storeCriteria();
				var params = {
					transaction: data,
					criteria: _criteria
				};
				PageNavigation.gotoPage('/approve-transaction/approve', params, params)
			}

			vm.retry = function (data) {
				vm.transaction = {};
				if (angular.isUndefined(data)) {
					vm.transaction.transactionId = vm.transactionIdForRetry;
				} else {
					vm.transaction.transactionId = data.transactionId;
					vm.transaction.version = data.version;
					vm.transaction.statusCode = data.statusCode;
					vm.transactionIdForRetry = vm.transaction.transactionId;
				}
				vm.storeCriteria();

				var deffered = TransactionService.retry(vm.transaction);
				deffered.promise.then(function (response) {
					vm.searchTransactionService();
				}).catch(function (response) {
					$scope.response = response.data;
					$scope.response.showViewRecentBtn = false;
					$scope.response.showViewHistoryBtn = false;
					$scope.response.showCloseBtn = true;
					$scope.response.showBackBtn = false;
					var dialogUrl = TransactionService.getTransactionDialogErrorUrl($scope.response.errorCode, 'retry');
					ngDialog.open({
						template: dialogUrl,
						scope: $scope,
						disableAnimation: true
					});

				});
			}
			vm.viewRecent = function () {
				$timeout(function () {
					PageNavigation.gotoPage('/view-transaction', {
						transactionModel: vm.transaction,
						isShowViewHistoryButton: true
					});
				}, 10);
			}

			vm.printEvidenceFormAction = function (data) {
				TransactionService.generateEvidenceForm(data);
			}

			function printEvidence(transaction) {
				if (transaction.returnStatus === vm.transactionStatus.book) {
					return true;
				}
				return false;
			}


		})
	}
]);