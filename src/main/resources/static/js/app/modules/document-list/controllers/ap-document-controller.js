'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('DocumentListController', [ '$scope', 'Service', '$stateParams', '$log', 'SCFCommonService', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http', 'DocumentListStatus',
	function($scope, Service, $stateParams, $log, SCFCommonService, PagingController, UIFactory, $q, $rootScope, $http, DocumentListStatus) {
		var vm = this;
		var log = $log;
		var organizeId = $rootScope.userInfo.organizeId;
		var sponsorAutoSuggestServiceUrl;
		var accountingTransactionType = 'PAYABLE';
		var displayMode = 'DOCUMENT';

		vm.submitted = false;
		vm.sponsorTxtDisable = false;
		vm.supplierTxtDisable = false;
		
		vm.deleteAuthority = false;

		vm.showInfomation = false;
		vm.documentNewStatus = "NEW";
		vm.splitePageTxt = '';

		vm.dateFormat = "dd/MM/yyyy";
		vm.openDateFrom = false;
		vm.openDateTo = false;
		vm.defaultPageSize = '20';
		vm.defaultPage = 0;

		var viewMode = '';
		var viewModeData = {
			myOrganize : 'MY_ORGANIZE',
			partner : 'PARTNER',
			customer : 'CUSTOMER'
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
			sponsor : undefined,
			supplier : undefined,
			supplierCode : undefined,
			uploadDateFrom : '',
			uploadDateTo : '',
			documentNo : undefined,
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
				identityField:'documentId',
			columns : []
		};
		
		vm.canDelete = function(data){
		    return data.documentStatus == 'NEW' && !($stateParams.viewMode == viewModeData.partner) && vm.deleteAuthority; 
		}
		
		var columRowNo = {
			fieldName: '$rowNo',
			labelEN : 'No.',
			labelTH : 'ลำดับที่',
			sortable : false,
			id : '$rowNo-{value}',
			filterType : 'translate',
			cssTemplate : 'text-center'
		};
		
		var columnSupplierName = {
			fieldName: 'supplierName',
			labelEN : 'Supplier name',
			labelTH : 'ชื่อคู่ค้า',
			sortable : false,
			id : 'supplierName-{value}',
			filterType : 'translate',
			cssTemplate : 'text-center'
		};
		
		var columnStatus = {
			fieldName : 'statusMessageKey',
			labelEN : 'Status',
			labelTH : 'สถานะ',
			sortable : false,
			id : 'status-{value}',
			filterType : 'translate',
			cssTemplate : 'text-center'
		};

		var columnLastUpload = {
			fieldName : 'lastUploadTime',
			labelEN : 'Last upload',
			labelTH : 'ปรับปรุงล่าสุด',
			sortable : false,
			id : 'lastUploadTime-{value}',
			filterType : 'date',
			filterFormat : 'dd/MM/yyyy',
			cssTemplate : 'text-center'
		};

		var columnAction = {
			fieldName : 'action',
			label : '',
			cssTemplate : 'text-center',
			sortData : false,
			cellTemplate : '<scf-button id="{{data.documentId}}-delete-button" class="btn-default gec-btn-action" ng-disabled="{{!ctrl.canDelete(data)}}" ng-click="ctrl.deleteDocument(data)" title="Delete a document"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
		};

		vm.loadDocumentDisplayConfig = function(sponsorId, accountingTransactionType, displayMode) {
			var docDisplayPromise = $q.defer();
			var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId, accountingTransactionType, displayMode);
			vm.dataTable.columns = [];
			displayConfig.promise.then(function(response) {

				vm.dataTable.columns.push(columRowNo);
				if(viewMode != viewModeData.partner){
					vm.dataTable.columns.push(columnSupplierName);
				}
				
				var configItems = response.items;
				configItems.forEach(function(data) {
					vm.dataTable.columns.push(data);
				});
				
				if (vm.dataTable.columns.indexOf(columnLastUpload) == -1) {
					vm.dataTable.columns.push(columnLastUpload);
					vm.dataTable.columns.push(columnStatus);
					vm.dataTable.columns.push(columnAction);
				}
				
				vm.documentListCriterial.sort = response.sort;
				
				return docDisplayPromise.resolve('Load display success');
			});
			return docDisplayPromise;
		}

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
			buyerId : '',
			supplierId : '',
			customerCode : '',
			uploadDateFrom : undefined,
			uploadDateTo : undefined,
			documentNo : '',
			documentStatus : undefined,
			accountingTransactionType: 'PAYABLE',
			showOverdue : true
		}

		vm.initLoad = function() {
			viewMode = $stateParams.viewMode;
			
			if (viewMode == viewModeData.myOrganize) {
				vm.sponsorTxtDisable = true;
				initSponsorAutoSuggest();
				sponsorAutoSuggestServiceUrl = 'api/v1/buyers';
			} else if (viewMode == viewModeData.partner) {
				vm.supplierTxtDisable = true;
				initSupplierAutoSuggest();
				sponsorAutoSuggestServiceUrl = 'api/v1/buyers?supplierId='+organizeId;
				checkSupplierTP(organizeId);
			} else if (viewMode == viewModeData.customer) {
				sponsorAutoSuggestServiceUrl = 'api/v1/buyers';
			}
		}

		function prepareCriteria() {
			var buyerCriteria = vm.documentListModel.sponsor.organizeId || null;
			
			if (angular.isDefined(vm.documentListModel.supplier)) {
				var supplierCriteria = vm.documentListModel.supplier.organizeId;
			}

			vm.documentListCriterial.buyerId = buyerCriteria;
			vm.documentListCriterial.supplierId = supplierCriteria;
			vm.documentListCriterial.customerCode = UIFactory.createCriteria(vm.documentListModel.supplierCode);

			if (angular.isDate(vm.documentListModel.uploadDateFrom)) {
				vm.documentListCriterial.uploadDateFrom = vm.documentListModel.uploadDateFrom
			}else{
				vm.documentListCriterial.uploadDateFrom = undefined;
			}

			if (angular.isDate(vm.documentListModel.uploadDateTo)) {
				vm.documentListCriterial.uploadDateTo = vm.documentListModel.uploadDateTo;
			}else{
				vm.documentListCriterial.uploadDateTo = undefined;
			}

			vm.documentListCriterial.documentNo = UIFactory.createCriteria(vm.documentListModel.documentNo);

			DocumentListStatus.forEach(function(status) {
				if (vm.documentListModel.documentStatus == status.value) {
					vm.documentListCriterial.documentStatus = status.valueObject;
				}
			});
			
			return vm.documentListCriterial;

		}

		vm.pagingController = PagingController.create('api/v1/documents', vm.documentListCriterial, 'GET');

		vm.searchDocument = function(pagingModel) {
			if (isValidateCriteriaPass()) {
				var criteria = prepareCriteria();
				var documentListDiferred = vm.pagingController.search(pagingModel, vm.getDocumentSummary);
				vm.showInfomation = true;
			}
		}

		var deleteDocument = function(document) {

			var serviceUrl = 'api/v1/documents/' + document.documentId
			var deferred = $q.defer();
			$http({
				method : 'POST',
				url : serviceUrl,
				headers : {
					'If-Match' : document.version,
					'X-HTTP-Method-Override': 'DELETE'
				},
				data: document
			}).then(function(response) {
				return deferred.resolve(response);
			}).catch(function(response) {
				return deferred.reject(response);
			});
			return deferred;
		}

		vm.deleteDocument = function(document) {
			var preCloseCallback = function(confirm) {
				vm.pagingController.reload(vm.getDocumentSummary);
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
						405 : 'Document has already been used.'
					};
					UIFactory.showFailDialog({
						data : {
							headerMessage : 'Delete document fail.',
							bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback : preCloseCallback
					});
				},
				onSuccess : function(response) {
					UIFactory.showSuccessDialog({
						data : {
							headerMessage : 'Delete document success.',
							bodyMessage : ''
						},
						preCloseCallback : preCloseCallback
					});
				}
			});
		}


		vm.getDocumentSummary = function(criteria) {
			var documentSummaryDiffered = Service.doGet('/api/documents/status-summary', criteria);
			documentSummaryDiffered.promise.then(function(response) {

			    vm.documentSummaryDisplay.documents[0].totalOutstandingAmount = 0;
				vm.documentSummaryDisplay.documents[1].totalOutstandingAmount = 0;

				response.data.forEach(function(data) {
					if (data.status == 'BOOKED') {
						vm.documentSummaryDisplay.documents[0].totalOutstandingAmount = data.totalOutstandingAmount;
					} else if (data.status == 'UNBOOK') {
						vm.documentSummaryDisplay.documents[1].totalOutstandingAmount = data.totalOutstandingAmount;
					}
				});
				vm.documentSummaryDisplay.totalDocumentAmount = summaryTotalDocumentAmount(vm.documentSummaryDisplay.documents);
	
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

		var querySponsorCode = function(value) {
			value = value = UIFactory.createCriteria(value);
			return $http.get(sponsorAutoSuggestServiceUrl, {
				params : {
					q : value,
					offset : 0,
					limit : 5
				}
			}).then(function(response) {
				return response.data.map(function(item) {
					item = prepareAutoSuggestLabel(item);
					return item;
				});
			});
		};

		vm.sponsorAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Please Enter organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySponsorCode
		});

		var querySupplierCode = function(value) {
			var buyerId = vm.documentListModel.sponsor.organizeId;
			var supplierCodeServiceUrl = 'api/v1/suppliers';

			value = value = UIFactory.createCriteria(value);
			
			return $http.get(supplierCodeServiceUrl, {
				params : {
					q : value,
					buyerId : buyerId,
					offset : 0,
					limit : 5
				}
			}).then(function(response) {
				return response.data.map(function(item) {
					item.identity = [ 'supplier-', item.organizeId, '-option' ].join('');
					item.label = [ item.organizeId, ': ', item.organizeName ].join('');
					return item;
				});
			});
		};
		vm.supplierAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Enter organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySupplierCode
		});

		vm.disableSupplierSuggest = function() {
			var isDisable = false;
			if (viewMode == viewModeData.customer) {
				if (angular.isUndefined(vm.documentListModel.sponsor)) {
					isDisable = true;
				} else {
					isDisable = false;
				}
			} else if (viewMode == viewModeData.partner) {
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

			if (!angular.isObject(vm.documentListModel.sponsor)) {
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
			
			if(!vm.wrongDateFormat){
                if (vm.documentListModel.uploadDateFrom != '' && vm.documentListModel.uploadDateTo != '') {
                    if (vm.documentListModel.uploadDateFrom > vm.documentListModel.uploadDateTo) {
                        vm.wrongDateFromLessThanDateTo = true;
                        isValidatePass = false;
                    }
                }
            }

			return isValidatePass;
		};

		$scope.$watch('ctrl.documentListModel.sponsor', function() {
			if (viewMode != viewModeData.myOrganize && angular.isDefined(vm.documentListModel.sponsor) && angular.isObject(vm.documentListModel.sponsor)) {
				vm.loadDocumentDisplayConfig(vm.documentListModel.sponsor.organizeId, accountingTransactionType, displayMode);
				
			}

			if(viewMode != viewModeData.partner){
				vm.documentListModel.supplier = undefined;
			}
			
		});

		var prepareAutoSuggestLabel = function(item) {
			item.identity = [ 'sponsor-', item.organizeId, '-option' ].join('');
			item.label = [ item.organizeId, ': ', item.organizeName ].join('');
			return item;
		}

		var initSponsorAutoSuggest = function() {
			var sponsorInfo = angular.copy($rootScope.userInfo);
			sponsorInfo = prepareAutoSuggestLabel(sponsorInfo);
			vm.documentListModel.sponsor = sponsorInfo;

			var loadDisplayConfigDiferred = vm.loadDocumentDisplayConfig(organizeId, accountingTransactionType, displayMode);
			loadDisplayConfigDiferred.promise.then(function() {
				vm.searchDocument();
			});
		}

		var initSupplierAutoSuggest = function() {
			var supplierInfo = angular.copy($rootScope.userInfo);
			supplierInfo = prepareAutoSuggestLabel(supplierInfo);			
			vm.documentListModel.supplier = supplierInfo;		
		}

		var checkSupplierTP = function(organizeId){
			var supplierTPDeferred = Service.doGet(sponsorAutoSuggestServiceUrl, {q:'',offset : 0, limit : 5});
			supplierTPDeferred.promise.then(function(response){
				if(response.data.length == 1){
					var sponsorInfo = response.data[0];
					sponsorInfo = prepareAutoSuggestLabel(sponsorInfo);
					vm.documentListModel.sponsor = sponsorInfo;
					vm.searchDocument();
				}
			});
		}
		vm.initLoad();

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
		valueObject : [ 'NEW', 'IN_PROGRESS', 'WAIT_FOR_BANK_PROCESSING' ]
	},
	{
		label : 'New',
		value : 'NEW',
		valueObject : 'NEW'
	},
	{
		label : 'Used',
		value : 'IN_PROGRESS',
		valueObject : 'IN_PROGRESS'
	},
	{
		label : 'Bank process',
		value : 'WAIT_FOR_BANK_PROCESSING',
		valueObject : 'WAIT_FOR_BANK_PROCESSING'
	},
]);