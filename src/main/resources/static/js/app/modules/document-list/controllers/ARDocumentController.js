var docMod = angular.module('gecscf.document');
docMod.controller('ARDocumentController', ['$rootScope', '$scope', '$log',
    '$stateParams', 'SCFCommonService', 'PageNavigation', 'UIFactory', 'ngDialog', '$timeout',
    'DocumentService', 'ARDocumentStatus', 'PagingController', '$http','$q','Service',
    function ($rootScope, $scope, $log, $stateParams, SCFCommonService,
        PageNavigation, UIFactory, ngDialog, $timeout, DocumentService,
        ARDocumentStatus, PagingController, $http,$q,Service) {

        var vm = this;
        var log = $log;
        var organizeId = $rootScope.userInfo.organizeId;
        var accountingTransactionType = 'RECEIVABLE';
        var displayMode = 'DOCUMENT';
        vm.deleteAuthority = false;

        vm.submitted = false;
        vm.supplierTxtDisable = false;
        vm.showInfomation = false;
        vm.dateFormat = "dd/MM/yyyy";
        vm.openDateFrom = false;
        vm.openDateTo = false;

        var viewMode = '';
        var viewModeData = {
            myOrganize: 'MY_ORGANIZE',
            partner: 'PARTNER',
            customer: 'CUSTOMER'
        }

        vm.documentStatusDrpodowns = ARDocumentStatus;

        vm.canDelete = function(data){
		    return data.documentStatus == 'NEW' && !($stateParams.viewMode == viewModeData.partner) && vm.deleteAuthority; 
		}

        vm.dataTable = {
            identityField: 'documentId',
            columns: []
        };

        var columRowNo = {
            fieldName: '$rowNo',
            labelEN: 'No.',
            labelTH: 'ลำดับที่',
            sortable: false,
            id: '$rowNo-{value}',
            filterType: 'translate',
            cssTemplate: 'text-center'
        };

        var columnSupplierName = {
            fieldName: 'buyerName',
            labelEN: 'Buyer name',
            labelTH: 'ชื่อคู่ค้า',
            sortable: false,
            id: 'supplierName-{value}',
            filterType: 'translate',
            cssTemplate: 'text-center'
        };

        var columnLastUpload = {
            fieldName: 'lastUploadTime',
            labelEN: 'Last upload',
            labelTH: 'ปรับปรุงล่าสุด',
            sortable: false,
            id: 'lastUploadTime-{value}',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy',
            cssTemplate: 'text-center'
        };

        var columnStatus = {
            fieldName: 'statusMessageKey',
            labelEN: 'Status',
            labelTH: 'สถานะ',
            sortable: false,
            id: 'status-{value}',
            filterType: 'translate',
            cssTemplate: 'text-center'
        };

        var columnAction = {
            fieldName: 'action',
            label: '',
            cssTemplate: 'text-center',
            sortData: false,
            cellTemplate: '<scf-button id="{{data.documentId}}-delete-button" class="btn-default gec-btn-action" ng-disabled="{{!ctrl.canDelete(data)}}" ng-click="ctrl.deleteDocument(data)" title="Delete a document"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
        };

        vm.documentListModel = {
            buyer: undefined,
            supplier: undefined,
            buyerCode: undefined,
            uploadDateFrom: '',
            uploadDateTo: '',
            documentNo: undefined,
            documentStatus: vm.documentStatusDrpodowns[0].value
        }

        vm.documentListCriterial = {
            buyerId: '',
            supplierId: '',
            customerCode: '',
            uploadDateFrom: undefined,
            uploadDateTo: undefined,
            documentNo: '',
            documentStatus: undefined,
            accountingTransactionType: 'RECEIVABLE',
            showOverdue: true
        }

        var querySupplierCode = function (value) {
            var serviceUrl = 'api/v1/suppliers';
            value = value = UIFactory.createCriteria(value);
            var buyer = null;
            if(angular.isDefined(vm.documentListModel.buyer) && vm.documentListModel.buyer != null){
                buyer = vm.documentListModel.buyer.organizeId;
            }
            return $http.get(serviceUrl, {
                params: {
                    q: value,
                    buyerId : buyer,
                    offset: 0,
                    limit: 5
                }
            }).then(function (response) {
                return response.data.map(function (item) {
                    item.identity = ['supplier-', item.organizeId, '-option'].join('');
                    item.label = [item.organizeId, ': ', item.organizeName].join('');
                    return item;
                });
            });
        };

        vm.supplierAutoSuggestModel = UIFactory.createAutoSuggestModel({
            placeholder: 'Please Enter organize name or code',
            itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
            query: querySupplierCode
        });

        var queryBuyerCode = function (value) {
            var serviceUrl = 'api/v1/buyers';
            value = value = UIFactory.createCriteria(value);
            return $http.get(serviceUrl, {
                params: {
                    q: value,
                    supplierId: vm.documentListModel.supplier.organizeId,
                    offset: 0,
                    limit: 5
                }
            }).then(function (response) {
                return response.data.map(function (item) {
                    item.identity = ['buyer-', item.organizeId, '-option'].join('');
                    item.label = [item.organizeId, ': ', item.organizeName].join('');
                    return item;
                });
            });
        };

        vm.buyerAutoSuggestModel = UIFactory.createAutoSuggestModel({
            placeholder: 'Enter organize name or code',
            itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
            query: queryBuyerCode
        });

        var isValidateCriteriaPass = function () {
            var isValidatePass = true;

            vm.requireSupplier = false;
            vm.wrongDateFormat = false;
            vm.wrongDateFromLessThanDateTo = false;

            if (vm.submitted && $scope.documentList.supplierCode.$error.required) {
                vm.requireSupplier = true;
                isValidatePass = false;
            }

            // if (!angular.isObject(vm.documentListModel.buyer)) {
            //     vm.requireSupplier = true;
            //     isValidatePass = false;
            // }

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

        function prepareCriteria() {
            if (angular.isDefined(vm.documentListModel.buyer)) {
                var buyerCriteria = vm.documentListModel.buyer.organizeId || null;
            }

            var supplierCriteria = vm.documentListModel.supplier.organizeId;


            vm.documentListCriterial.buyerId = buyerCriteria;
            vm.documentListCriterial.supplierId = supplierCriteria;
            vm.documentListCriterial.customerCode = UIFactory.createCriteria(vm.documentListModel.buyerCode);

            if (angular.isDate(vm.documentListModel.uploadDateFrom)) {
                vm.documentListCriterial.uploadDateFrom = vm.documentListModel.uploadDateFrom
            } else {
                vm.documentListCriterial.uploadDateFrom = undefined;
            }

            if (angular.isDate(vm.documentListModel.uploadDateTo)) {
                vm.documentListCriterial.uploadDateTo = vm.documentListModel.uploadDateTo;
            } else {
                vm.documentListCriterial.uploadDateTo = undefined;
            }

            vm.documentListCriterial.documentNo = UIFactory.createCriteria(vm.documentListModel.documentNo);

            ARDocumentStatus.forEach(function (status) {
                if (vm.documentListModel.documentStatus == status.value) {
                    vm.documentListCriterial.documentStatus = status.valueObject;
                }
            });

            return vm.documentListCriterial;

        }


        vm.pagingController = PagingController.create('api/v1/documents', vm.documentListCriterial, 'GET');

        vm.searchDocument = function (pagingModel) {
            // vm.pagingController = PagingController.create('api/v1/documents', vm.documentListCriterial, 'GET');
            if (isValidateCriteriaPass()) {
                var criteria = prepareCriteria();
                var documentListDiferred = vm.pagingController.search(pagingModel, vm.getDocumentSummary);
                vm.showInfomation = true;
            }
        }

        vm.loadDocumentDisplayConfig = function (sponsorId, accountingTransactionType, displayMode) {
            var docDisplayPromise = $q.defer();
            var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId, accountingTransactionType, displayMode);
            vm.dataTable.columns = [];
            displayConfig.promise.then(function (response) {

                vm.dataTable.columns.push(columRowNo);
                if (viewMode != viewModeData.partner) {
                    vm.dataTable.columns.push(columnSupplierName);
                }

                var configItems = response.items;
                configItems.forEach(function (data) {
                    vm.dataTable.columns.push(data);
                });

                if (vm.dataTable.columns.indexOf(columnLastUpload) == -1) {
                    vm.dataTable.columns.push(columnLastUpload);
                    vm.dataTable.columns.push(columnStatus);
                    vm.dataTable.columns.push(columnAction);
                }

                vm.documentListCriterial.sort = response.sort;
                vm.pagingController = PagingController.create('api/v1/documents', vm.documentListCriterial, 'GET');
                return docDisplayPromise.resolve('Load display success');
            });
            return docDisplayPromise;
        }

        var initBuyerAutoSuggest = function () {
            var buyerInfo = angular.copy($rootScope.userInfo);
            buyerInfo = DocumentService.prepareAutoSuggestLabel(buyerInfo);
            vm.documentListModel.buyer = buyerInfo;
        }

        var initSupplierAutoSuggest = function () {
            var supplierInfo = angular.copy($rootScope.userInfo);
            supplierInfo = DocumentService.prepareAutoSuggestLabel(supplierInfo);
            vm.documentListModel.supplier = supplierInfo;

            var loadDisplayConfigDiferred = vm.loadDocumentDisplayConfig(organizeId, accountingTransactionType, displayMode);
            loadDisplayConfigDiferred.promise.then(function () {
                vm.searchDocument();
            });
        }

        var checkBuyerTP = function (organizeId,serviceUrl) {
            var supplierTPDeferred = Service.doGet(serviceUrl, { q: '', offset: 0, limit: 5 });
            supplierTPDeferred.promise.then(function (response) {
                console.log(response.data);
                if (response.data.length == 1) {
                    var supplierInfo = response.data[0];
                    supplierInfo = prepareAutoSuggestLabel(supplierInfo);
                    vm.documentListModel.supplier = supplierInfo;
                    vm.searchDocument();
                }
            });
        }
        

        var initLoad = function () {
            viewMode = $stateParams.viewMode;

            if (viewMode == viewModeData.myOrganize) {
                vm.supplierTxtDisable = true;
                initSupplierAutoSuggest();
            } else if (viewMode == viewModeData.partner) {
                initBuyerAutoSuggest();
                var serviceUrl = 'api/v1/suppliers?buyerId='+organizeId;
                checkBuyerTP(organizeId,serviceUrl);
            } else if (viewMode == viewModeData.customer) {

            }
        } ();

        //<----------- function call by page ---------->

        vm.openCalendarDateFrom = function () {
            vm.openDateFrom = true;
        }

        vm.openCalendarDateTo = function () {
            vm.openDateTo = true;
        }

        vm.disableBuyerSuggest = function () {
            var isDisable = false;
            if (viewMode == viewModeData.customer) {
                if (angular.isUndefined(vm.documentListModel.supplier)) {
                    isDisable = true;
                } else {
                    isDisable = false;
                }
            } else if (viewMode == viewModeData.partner) {
                isDisable = true;
            }
            return isDisable;
        };

        $scope.$watch('ctrl.documentListModel.supplier', function () {
            if (viewMode != viewModeData.myOrganize && angular.isDefined(vm.documentListModel.supplier) && angular.isObject(vm.documentListModel.supplier)) {
                vm.loadDocumentDisplayConfig(vm.documentListModel.supplier.organizeId, accountingTransactionType, displayMode);
            }

            if (viewMode != viewModeData.partner) {
                vm.documentListModel.buyer = undefined;
            }
        });

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
		
		vm.getDocumentSummary = function(criteria) {
        	vm.totalNetAmount = 0;
        	
			var documentSummaryDiffered = Service.doGet('/api/documents/status-summary', criteria);
			documentSummaryDiffered.promise.then(function(response) {
			    response.data.forEach(function(data) {
			    	vm.totalNetAmount += data.totalOutstandingAmount;
				});
			    
			}).catch(function(response) {
				log.error("Document summary error");
			});
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

        //<-------------------------------------------->
    }]);
docMod.constant("ARDocumentStatus", [
    {
        label: 'All',
        value: '',
        valueObject: null
    },
    {
        label: 'Approve to pay',
        value: 'WAIT_FOR_BANK_PROCESSING',
        valueObject: 'WAIT_FOR_BANK_PROCESSING'
    },
    {
        label: 'Billed',
        value: 'NEW',
        valueObject: 'NEW'
    },
    {
        label: 'In process',
        value: 'IN_PROGRESS',
        valueObject: 'IN_PROGRESS'
    },
    {
        label: 'Paid',
        value: 'PAID',
        valueObject: 'PAID'
    },
]);