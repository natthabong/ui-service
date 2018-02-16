'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('CustomerCodeGroupSettingController', ['$q', '$scope', '$stateParams', 'Service', 'UIFactory', 'CustomerCodeStatus', 'PageNavigation', 'PagingController', '$http', 'ngDialog', '$rootScope', 'scfFactory',
    function($q, $scope, $stateParams, Service, UIFactory,
        CustomerCodeStatus, PageNavigation, PagingController, $http, ngDialog, $rootScope, scfFactory) {
        var vm = this;

        vm.getUserInfoSuccess = false;
        var defered = scfFactory.getUserInfo();
        defered.promise.then(function(response) {
            vm.getUserInfoSuccess = true;
            vm.manageAll = false;
            //vm.manageMyOrg = false;
            //	var selectedItem;

            //	var mode = {
            //			ALL: 'all',
            //			PERSONAL: 'personal'
            //	}

            var accountingTransactionType = $stateParams.accountingTransactionType;
            var isSetSupplierCode = accountingTransactionType == 'PAYABLE' ? true : false;

            vm.hiddenFundingColumn = false;
            var viewMode = $stateParams.viewMode;
            var ownerId = viewMode == 'MY_ORGANIZE' ? $rootScope.userInfo.organizeId : $stateParams.organizeId;
            //	var groupId = null;
            vm.criteria = {};

            vm.statusDropdown = CustomerCodeStatus;

            vm.backToSponsorConfigPage = function() {
                var params = { organizeId: ownerId };
                PageNavigation.gotoPage("/sponsor-configuration", params);
            }

            vm.customerCodeName = "Supplier";
            if (!isSetSupplierCode) {
            	vm.customerCodeName = "Buyer";
            }

            var deleteCustomerCode = function(customerCode) {
                var serviceUrl = '/api/v1/organize-customers/' + ownerId + '/accounting-transactions/' + accountingTransactionType + '/customers/' + customerCode.organizeId + '/customer-codes/' + customerCode.customerCode;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: serviceUrl,
                    headers: {
                        'If-Match': customerCode.version,
                        'X-HTTP-Method-Override': 'DELETE'
                    },
                    data: customerCode
                }).then(function(response) {
                    return deferred.resolve(response);
                }).catch(function(response) {
                    return deferred.reject(response);
                });
                return deferred;
            }

            /* Edit a customer code group name */
            //	vm.edit = function(model) {
            //		
            //		vm.editCustCodeDialog = ngDialog.open({
            //			id : 'new-customer-code-setting-dialog',
            //			template : '/js/app/modules/organize/configuration/customer-code/templates/dialog-edit-customer-code-group.html',
            //			className : 'ngdialog-theme-default',
            //			scope : $scope,
            //			controller : 'CustomerCodeGroupDiaglogController',
            //			controllerAs : 'ctrl',
            //			data : {
            //				sponsorId : $scope.sponsorId,
            //				model: vm.model
            //			}
            //		});
            //	}

            vm.deleteCustomerCode = function(customerCode) {
                var preCloseCallback = function(confirm) {
                    vm.search();
                }

                UIFactory.showConfirmDialog({
                    data: {
                        headerMessage: 'Confirm delete?'
                    },
                    confirm: function() {
                        return deleteCustomerCode(customerCode);
                    },
                    onFail: function(response) {
                        var msg = { 404: vm.customerCodeName + ' code has been deleted.', 405: vm.customerCodeName + ' code has been used.', 409: vm.customerCodeName + ' code has been modified.' };
                        UIFactory.showFailDialog({
                            data: {
                                headerMessage: 'Delete ' + vm.customerCodeName.toLowerCase() + ' code fail.',
                                bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
                            },
                            preCloseCallback: preCloseCallback
                        });
                    },
                    onSuccess: function(response) {
                        UIFactory.showSuccessDialog({
                            data: {
                                headerMessage: 'Delete ' + vm.customerCodeName.toLowerCase() + ' code success.',
                                bodyMessage: ''
                            },
                            preCloseCallback: preCloseCallback
                        });
                    }
                });

            }

            vm.searchCriteria = {
                customerCode: '',
                suspend: '',
                status: '',
                organizeId: ''
            }
            var prepareSearchCriteria = function() {


                    vm.searchCriteria.customerCode = vm.criteria.customerCode || '';

                    if (angular.isDefined(vm.criteria.customer)) {
                        if (accountingTransactionType == "PAYABLE") {
                            vm.searchCriteria.organizeId = vm.criteria.customer.supplierId;
                        } else {
                            vm.searchCriteria.organizeId = vm.criteria.customer.sponsorId;
                        }
                    } else {
                        vm.searchCriteria.organizeId = '';
                    }
                    CustomerCodeStatus.forEach(function(item) {
                        if (item.value == vm.criteria.status) {
                            if (item.valueObject == null) {
                                vm.searchCriteria.suspend = undefined;
                                vm.searchCriteria.status = undefined;
                            } else {
                                vm.searchCriteria.suspend = item.valueObject.suspend;
                                vm.searchCriteria.status = item.valueObject.status;
                            }
                        }
                    });
                }
                // vm.pagingController = PagingController.create(customerCodeURL,
                // vm.searchCriteria, 'GET');

            var queryCustomerCode = function(value) {

                var serviceUrl = 'api/v1/organize-customers/' + ownerId + '/trading-partners'
                return $http.get(serviceUrl, {
                    params: {
                        q: value,
                        offset: 0,
                        limit: 5,
                        accountingTransactionType: accountingTransactionType
                    }
                }).then(function(response) {
                    if (accountingTransactionType == "PAYABLE") {
                        return response.data.map(function(item) {
                            item.identity = ['customer-', item.supplierId, '-option'].join('');
                            item.label = [item.supplierId, ': ', item.supplierName].join('');
                            return item;
                        });
                    } else {
                        return response.data.map(function(item) {
                            item.identity = ['customer-', item.sponsorId, '-option'].join('');
                            item.label = [item.sponsorId, ': ', item.sponsorName].join('');
                            return item;
                        });
                    }
                });
            }

            vm.customerAutoSuggestModel = UIFactory.createAutoSuggestModel({
                placeholder: 'Enter organization name or code',
                itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
                query: queryCustomerCode
            });

            vm.search = function(pageModel) {
                prepareSearchCriteria();
                var criteria = vm.criteria;
                vm.pagingController.search(pageModel, function (criteria, response) {
    				var data = response.data;
    				var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
    				var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
    				var i = 0;
    				var baseRowNo = pageSize * currentPage;
    				angular.forEach(data, function (value, idx) {
    					++i;
    					value.rowNo = baseRowNo + i;
    				});
    			});
            };

            vm.initialPage = function() {

                //		groupId = selectedItem.groupId;
                //	    vm.model = selectedItem;
                //	    vm.sponsorId = selectedItem.ownerId;
                var customerCodeURL = '/api/v1/organize-customers/' + ownerId + '/accounting-transactions/' + accountingTransactionType + '/customer-codes';
                vm.pagingController = PagingController.create(customerCodeURL, vm.searchCriteria, 'GET');
                vm.search();
            }

            vm.initialPage();

            //	if(currentMode == mode.PERSONAL){
            //		vm.personalMode = true;
            //		var serviceUrl = '/api/v1/organize-customers/' + organizeId + '/accounting-transactions/'+accountingTransactionType+'/customer-code-groups';
            //		var serviceDiferred = Service.doGet(serviceUrl, {
            //			limit : 1,
            //			offset : 0
            //		});
            //		serviceDiferred.promise.then(function(response) {
            //			selectedItem = response.data[0];
            //			vm.initialPage(selectedItem);
            //
            //		}).catch(function(response) {
            //			log.error('Load customer code group data error');
            //		});
            //		
            //	}else{
            //		vm.personalMode = false;
            //		selectedItem = $stateParams.selectedItem;
            //		vm.initialPage(selectedItem);
            //	}

            var saveCustomerCode = function(customerCode) {
                var saveCustomerDiferred = '';
                if (vm.isNewCusotmerCode) {
                    //			customerCode.groupId = groupId;		
                    var newCustCodeURL = '/api/v1/organize-customers/' + ownerId + '/accounting-transactions/' + accountingTransactionType + '/customer-codes';
                    saveCustomerDiferred = Service.requestURL(newCustCodeURL, customerCode);
                } else {
                    var editCustCodeURL = '/api/v1/organize-customers/' + ownerId + '/accounting-transactions/' + accountingTransactionType + '/customer-codes/' + vm.oldCustomerCode;
                    var putHeader = {
                        'X-HTTP-Method-Override': 'PUT'
                    }
                    saveCustomerDiferred = Service.requestURL(editCustCodeURL, customerCode, 'POST', putHeader);
                }
                return saveCustomerDiferred;
            }

            var dialogSuccess, dialogFail = ''
            vm.confirmSaveCustomerCode = function(customerCode) {
                var preCloseCallback = function(confirm) {
                    vm.search();
                }

                var addMoreBtn = {
                    label: "Add more",
                    id: "add-more-button",
                    action: function() {
                        closeDialogSucccess();

                        vm.customerCodeSetup({
                            organizeId: customerCode.organizeId
                        });
                    }
                };

                var okBtn = {
                    label: "OK",
                    id: "ok-button",
                    action: function() {
                        closeDialogSucccess();
                    }
                };
                var dialogSuccessBtn = [];

                if (vm.isNewCusotmerCode) {
                    dialogSuccessBtn.push(addMoreBtn);
                    dialogSuccessBtn.push(okBtn);
                } else {
                    dialogSuccessBtn.push(okBtn);
                }

                UIFactory.showConfirmDialog({
                    data: {
                        headerMessage: 'Confirm save?'
                    },
                    confirm: function() {
                        return saveCustomerCode(customerCode);
                    },
                    onFail: function(response) {
                        var msg = { 400: 'Customer is not trading partner with this sponsor.', 404: vm.customerCodeName + ' code has been deleted.', 405: vm.customerCodeName + ' code has been used.', 409: vm.customerCodeName + ' code has been modified.' };
                        dialogFail = UIFactory.showFailDialog({
                            data: {
                                headerMessage: vm.isNewCusotmerCode ? 'Add new ' + vm.customerCodeName.toLowerCase() + ' code fail.' : 'Edit ' + vm.customerCodeName.toLowerCase() + ' code fail.',
                                bodyMessage: msg[response.status] ? msg[response.status] : response.message
                            },
                            preCloseCallback: function() {
                                preCloseCallback();
                            }
                        });
                    },
                    onSuccess: function(response) {
                        closeCustomerCodeSetup();
                        dialogSuccess = UIFactory.showSuccessDialog({
                            data: {
                                headerMessage: vm.isNewCusotmerCode == true ? 'Add new ' + vm.customerCodeName.toLowerCase() + ' code success.' : 'Edit ' + vm.customerCodeName.toLowerCase() + ' code complete.',
                                bodyMessage: ''
                            },
                            preCloseCallback: function() {
                                preCloseCallback();
                                if (!vm.isNewCusotmerCode) {
                                    closeCustomerCodeSetup();
                                }
                            },
                            buttons: dialogSuccessBtn
                        });
                    }
                });
            };

            vm.customerCodeSetup = function(model) {
                vm.isAddMoreCustomerCode = false;
                vm.isNewCusotmerCode = angular.isUndefined(model);
                if (!vm.isNewCusotmerCode) {
                    vm.isNewCusotmerCode = angular.isUndefined(model.customerCode);
                    vm.isAddMoreCustomerCode = vm.isNewCusotmerCode;
                    if (!vm.isNewCusotmerCode) {
                        vm.oldCustomerCode = model.customerCode;
                    }
                }

                vm.newCustCodeDialog = ngDialog.open({
                    template: '/js/app/modules/organize/configuration/customer-code/templates/dialog-new-customer-code.html',
                    className: 'ngdialog-theme-default modal-width-60',
                    scope: $scope,
                    controller: 'CustomerCodeDiaglogController',
                    controllerAs: 'ctrl',
                    data: {
                        sponsorId: ownerId,
                        model: model,
                        isNewCusotmerCode: vm.isNewCusotmerCode,
                        isAddMoreCustomerCode: vm.isAddMoreCustomerCode,
                        accountingTransactionType: accountingTransactionType
                    },
                    preCloseCallback: function(value) {
                        if (angular.isDefined(value)) {
                            vm.confirmSaveCustomerCode(value);
                            return false;
                        }
                        return true;
                    }
                });
            }

            var closeCustomerCodeSetup = function() {
                vm.newCustCodeDialog.close();
            }
            var closeDialogSucccess = function() {
                dialogSuccess.close();
            }
            var closeDialogFail = function() {
                dialogFail.close();
            }

            vm.unauthen = function() {
                if (vm.manageAll) {
                    return false;
                } else {
                    return true;
                }
            }
        })
    }
]);
scfApp.constant('CustomerCodeStatus', [{
        label: 'All',
        value: '',
        valueObject: null
    },
    {
        label: 'Active',
        value: '1',
        valueObject: {
            suspend: 0,
            status: 'ACTIVE'
        }
    },
    {
        label: 'Suspend',
        value: '2',
        valueObject: {
            suspend: 1,
            status: undefined
        }
    },
    {
        label: 'Expired',
        value: '3',
        valueObject: {
            suspend: 0,
            status: 'EXPIRED'
        }
    },
    {
        label: 'Pending',
        value: '4',
        valueObject: {
            suspend: 0,
            status: 'PENDING'
        }
    }
]);