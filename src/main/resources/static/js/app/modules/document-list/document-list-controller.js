'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('DocumentListController', [ '$scope', 'Service', '$stateParams', '$log', 'SCFCommonService', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http', 'DocumentListStatus',
	function($scope, Service, $stateParams, $log, SCFCommonService, PagingController, UIFactory, $q, $rootScope, $http, DocumentListStatus) {
		var vm = this;
		var log = $log;
		var organizeId = $rootScope.userInfo.organizeId;

		vm.submitted = false;
		vm.sponsorTxtDisable = false;
		vm.supplierTxtDisable = false;

		vm.showInfomation = false;
		vm.documentNewStatus = "NEW";
		vm.splitePageTxt = '';

		vm.dateFormat = "dd/MM/yyyy";
		vm.openDateFrom = false;
		vm.openDateTo = false;
		vm.defaultPageSize = '20';
		vm.defaultPage = 0;

		var currentParty = '';
		var partyRole = {
			sponsor : 'sponsor',
			supplier : 'supplier',
			bank : 'bank'
		}

		vm.documentStatusDrpodowns = DocumentListStatus;

		vm.documentSummaryDisplay = {
			totalDocumentAmount : 0,
			documents : [ {
				'status' : 'BOOKED',
				'totalOutstandingAmount' : 0
			}, {
				'status' : 'UNBOOK',
				'totalOutstandingAmount' : 0
			} ]
		};

		vm.pageModel = {
			pageSizeSelectModel : vm.defaultPageSize,
			totalRecord : 0,
			totalPage : 0,
			currentPage : vm.defaultPage,
			clearSortOrder : false
		};

		vm.documentListModel = {
			sponsorIdName : '',
			sponsorId : '',
			supplierIdName : '',
			supplierId : '',
			supplierCode : '',
			uploadDateFrom : '',
			uploadDateTo : '',
			documentNo : '',
			documentStatus : vm.documentStatusDrpodowns[0].value
		}

		vm.pageSizeList = [ {
			label : '10',
			value : '10'
		}, {
			label : '20',
			value : '20'
		}, {
			label : '50',
			value : '50'
		} ];

		vm.dataTable = {
			//		options : {
			//			displaySelect : {
			//				label : '<input type="checkbox" ng-show="false" id="select-all-checkbox" ng-model="ctrl.checkAllModel" ng-click="ctrl.checkAllDocument()"/>',
			//				cssTemplate : 'text-center',
			//				cellTemplate : '<input type="checkbox" ng-show="false" checklist-model="ctrl.documentSelects" checklist-value="data" ng-click="ctrl.selectDocument()"/>',
			//				displayPosition : 'first',
			//				idValueField : 'template',
			//				id : 'document-{value}-checkbox'
			//			}
			//		},
			columns : []
		};

		var columnStatus = {
			fieldName : 'statusMessageKey',
			labelEN : 'Status',
			labelTH : 'สถานะ',
			sortable : true,
			idValueField : 'transactionNo',
			id : 'status-{value}',
			filterType : 'translate',
			cssTemplate : 'text-center'
		};

		var columnLastUpload = {
			fieldName : '',
			labelEN : 'Last update date',
			labelTH : 'ปรับปรุงล่าสุด',
			sortable : true,
			id : 'last-upload-date-{value}-label',
			cssTemplate : 'text-center'
		};

		var columnAction = {
			field : '',
			label : '',
			cssTemplate : 'text-center',
			sortData : false,
			cellTemplate : '<scf-button id="document-{{data.documentId}}-delete-button" class="btn-default gec-btn-action" ng-disabled="{{vm.supplierTxtDisable}}" ng-click="ctrl.deleteDocument(data)" title="Delete a document"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
		};

		vm.loadDocumentDisplayConfig = function(sponsorId) {
			var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId);
			displayConfig.promise.then(function(response) {
				vm.dataTable.columns = response.items;
				vm.dataTable.columns.push(columnLastUpload);
				vm.dataTable.columns.push(columnStatus);
				vm.dataTable.columns.push(columnAction);
			});
		}

		vm.loadSponsorDisplayName = function() {
			var organizeDisplayName = '';
			var sponsorCodesDeffered = Service.requestURL('/api/me', null, 'GET');
			sponsorCodesDeffered.promise.then(function(response) {
				var organizeName = response.organizeName;
				var organizeId = response.organizeId;
				vm.documentListModel.sponsorIdName = organizeId + ":" + organizeName;
				vm.documentListModel.sponsorId = organizeId;

				vm.loadDocumentDisplayConfig(organizeId);

			}).catch(function(response) {
				log.error('Sponsor error');
			});
		}

		vm.loadSupplierDisplayName = function() {
			var organizeDisplayName = '';
			var sponsorCodesDeffered = Service.requestURL('/api/me', null, 'GET');
			sponsorCodesDeffered.promise.then(function(response) {
				var organizeName = response.organizeName;
				var organizeId = response.organizeId;
				vm.documentListModel.supplierIdName = organizeId + ":" + organizeName;
				vm.documentListModel.supplierId = organizeId;
			}).catch(function(response) {
				log.error('Supplier error');
			});
		}

		vm.initLoad = function() {
			currentParty = $stateParams.party;

			if (currentParty == partyRole.sponsor) {
				vm.sponsorTxtDisable = true;
				vm.loadSponsorDisplayName();
			} else if (currentParty == partyRole.supplier) {
				vm.supplierTxtDisable = true;
				vm.loadSupplierDisplayName();
			}
		}

		vm.initLoad();

		vm.documentListModel = {
			sponsor : undefined,
			supplier : undefined,
			supplierCode : undefined,
			uploadDateFrom : '',
			uploadDateTo : '',
			documentNo : undefined,
			documentStatus : vm.documentStatusDrpodowns[0].value
		}

		vm.documentListCriterial = {
			sponsorId : '',
			supplierId : '',
			supplierCode : '',
			uploadDateFrom : undefined,
			uploadDateTo : undefined,
			documentNo : '',
			documentStatus : ''
		}

		function prepareCriteria() {
			var sponsorCriteria = vm.documentListModel.sponsor.sponsorId || null;

			if (angular.isDefined(vm.documentListModel.supplier)) {
				var supplierCriteria = vm.documentListModel.supplier.supplierId;
			}

			vm.documentListCriterial.sponsorId = sponsorCriteria;
			vm.documentListCriterial.supplierId = supplierCriteria;
			vm.documentListCriterial.supplierCode = vm.documentListModel.supplierCode;
			console.log(vm.documentListModel.uploadDateFrom)
			if(angular.isDate(vm.documentListModel.uploadDateFrom)){
				vm.documentListCriterial.uploadDateFrom = vm.documentListModel.uploadDateFrom
			}
			
			if(angular.isDate(vm.documentListModel.uploadDateTo.length)){
				vm.documentListCriterial.uploadDateTo = vm.documentListModel.uploadDateTo;
			}
			
			vm.documentListCriterial.documentNo = vm.documentListModel.documentNo;

			DocumentListStatus.forEach(function(status) {
				if (vm.documentListModel.documentStatus == status.value) {
					vm.documentListCriterial.documentStatus = status.valueObject;
				}
			});

		}

		vm.pagingCongroller = PagingController.create('api/v1/documents', vm.documentListCriterial, 'GET');

		vm.searchDocument = function(pagingModel) {
			if (isValidateCriteriaPass()) {
				prepareCriteria();
				var documentListDiferred = vm.pagingCongroller.search(pagingModel);
				documentListDiferred.promise.then(function(response) {
					vm.getDocumentSummary();
				}).catch(function(response) {
					log.error("Search error");
				});
				vm.showInfomation = true;
			}
		}

		var deleteDocument = function(document) {

			var serviceUrl = 'api/v1/documemnts/' + document.documentId
			var deferred = $q.defer();
			$http({
				method : 'DELETE',
				url : serviceUrl,
				headers : {
					'If-Match' : document.version
				}
			}).then(function(response) {
				return deferred.resolve(response);
			}).catch(function(response) {
				return deferred.reject(response);
			});
			return deferred;
		}

		vm.deleteDocument = function(document) {
			var preCloseCallback = function(confirm) {
				vm.pagingController.reload();
			}

			UIFactory.showConfirmDialog({
				data : {
					headerMessage : 'Confirm delete?'
				},
				confirm : function() {
					return deleteDocument(document);
				},
				onFail : function(response) {
					var msg = {
						409 : 'Document has already been deleted.',
						405 : 'Document has already been used.',
						405 : 'Document has already been used.'
					};
					UIFactory.showFailDialog({
						data : {
							headerMessage : 'Delete document failed.',
							bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback : preCloseCallback
					});
				},
				onSuccess : function(response) {
					UIFactory.showSuccessDialog({
						data : {
							headerMessage : 'Delete document code completed.',
							bodyMessage : ''
						},
						preCloseCallback : preCloseCallback
					});
				}
			});

		}


		vm.getDocumentSummary = function() {
			var documentSummaryDiffered = Service.requestURL('/api/documents/status-summary/get', vm.documentListCriterial, 'POST');
			documentSummaryDiffered.promise.then(function(response) {
				if (response.length == 0) {
					vm.documentSummaryDisplay.documents[0].totalOutstandingAmount = 0;
					vm.documentSummaryDisplay.documents[1].totalOutstandingAmount = 0;
				}
				response.forEach(function(data) {
					if (data.status == 'BOOKED') {
						vm.documentSummaryDisplay.documents[0].totalOutstandingAmount = data.totalOutstandingAmount;
					} else if (data.status == 'UNBOOK') {
						vm.documentSummaryDisplay.documents[1].totalOutstandingAmount = data.totalOutstandingAmount;
					}
				});
				vm.documentSummaryDisplay.totalDocumentAmount = summaryTotalDocumentAmount(vm.documentSummaryDisplay.documents);
			//			if(response.length > 0){
			//				vm.documentSummaryDisplay.documents = response;
			//				vm.documentSummaryDisplay.totalDocumentAmount = summaryTotalDocumentAmount(vm.documentSummaryDisplay.documents);
			//			}			
			}).catch(function(response) {
				log.error("Document summary error");
			});
		}

		vm.openCalendarDateFrom = function() {
			vm.openDateFrom = true;
		}

		vm.openCalendarDateTo = function() {
			vm.openDateTo = true;
		}



		function summaryTotalDocumentAmount(documents) {
			var summaryAmount = 0;
			documents.forEach(function(document) {
				summaryAmount += document.totalOutstandingAmount;
			});

			return summaryAmount;
		}

		var sponsorCodeServiceUrl = '/api/v1/trading-partners/' + organizeId + '/sponsors';
		var querySponsorCode = function(value) {
			return $http.get(sponsorCodeServiceUrl, {
				params : {
					q : value,
					offset : 0,
					limit : 5
				}
			}).then(function(response) {
				return response.data.map(function(item) {
					item.identity = [ 'sponsor-', item.supplierId, '-option' ].join('');
					item.label = [ item.sponsorName, ': ', item.sponsorId ].join('');
					return item;
				});
			});
		};

		vm.sponsorAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Please Enter Organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySponsorCode
		});

		var querySupplierCode = function(value) {
			var sponsorId = vm.documentListModel.sponsor.sponsorId;
			var supplierCodeServiceUrl = '/api/v1/trading-partners/' + organizeId + '/sponsors/' + sponsorId;

			return $http.get(supplierCodeServiceUrl, {
				params : {
					q : value,
					offset : 0,
					limit : 5
				}
			}).then(function(response) {
				return response.data.map(function(item) {
					item.identity = [ 'supplier-', item.supplierId, '-option' ].join('');
					item.label = [ item.supplierName, ': ', item.supplierId ].join('');
					return item;
				});
			});
		};
		vm.supplierAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Enter Organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySupplierCode
		});

		vm.disableSupplierSuggest = function() {
			var isDisable = false;
			if (currentParty == partyRole.bank) {
				if (angular.isUndefined(vm.documentListModel.sponsor)) {
					isDisable = true;
				} else {
					isDisable = false;
				}
			} else if (currentParty == partyRole.supplier) {
				isDisable = true;
			}
			return isDisable;
		};

		var isValidateCriteriaPass = function() {
			var isValidatePass = true;

			vm.requireSponsor = false;
			vm.wrongDateFormat = false;

			if (vm.submitted && $scope.documentListSponsorForm.sponsorCode.$error.required) {
				vm.requireSponsor = true;
				isValidatePass = false;
			}
			
			if(!angular.isObject(vm.documentListModel.sponsor)){
				vm.requireSponsor = true;
				isValidatePass = false;
			}

			if (angular.isUndefined(vm.documentListModel.uploadDateFrom)) {
				vm.wrongDateFormat = true;
				isValidatePass = false;
			}

			if (angular.isUndefined(vm.documentListModel.uploadDateTo)) {
				vm.wrongDateFormat = true;
				isValidatePass = false;
			}

			return isValidatePass;
		};

		$scope.$watch('ctrl.documentListModel.sponsor', function() {
			if (angular.isDefined(vm.documentListModel.sponsor) && angular.isObject(vm.documentListModel.sponsor)) {
				vm.loadDocumentDisplayConfig(vm.documentListModel.sponsor.sponsorId);
			}
		});

	} ]);
scfApp.constant("DocumentListStatus", [
	{
		label : 'All',
		value : '',
		valueObject : null
	},
	{
		label : 'Booked',
		value : 'BOOKED',
		valueObject : 'BOOKED'
	},
	{
		label : 'Not book',
		value : 'NOTBOOK',
		valueObject : [ 'NEW', 'USED', 'WAIT_FOR_BANK_PROCESSING' ]
	},
	{
		label : 'New',
		value : 'NEW',
		valueObject : 'NEW'
	},
	{
		label : 'Used',
		value : 'USED',
		valueObject : 'USED'
	},
	{
		label : 'Bank process',
		value : 'WAIT_FOR_BANK_PROCESSING',
		valueObject : 'WAIT_FOR_BANK_PROCESSING'
	},
]);