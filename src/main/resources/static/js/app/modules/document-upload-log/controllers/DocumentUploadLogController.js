'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('DocumentUploadLogController', ['$rootScope', '$scope', '$stateParams', '$log', '$http', 'PagingController', 'UIFactory',
     'docStatus', 'PageNavigation', 'docChannel', 'DocumentUploadLogService',
    function( $rootScope, $scope, $stateParams, $log, $http,  PagingController, UIFactory, docStatus, PageNavigation, docChannel, DocumentUploadLogService) {
        var vm = this;
        var log = $log;

        vm.dateFormat = "dd/MM/yyyy";
        vm.openDateFrom = false;
        vm.openDateTo = false;
        vm.showSponsor = true;

        var sponsorAutoSuggestServiceUrl = 'api/v1/organizes';
        var pagingUrl = 'api/v1/upload-logs';
        vm.sponsorTxtDisable = false;
        vm.hideColSponsor = false;
        vm.fileTypeDropdowns = [];
        vm.docStatusDropdowns = docStatus;
        vm.docChannelDropdowns = docChannel;

        vm.criteria = $stateParams.criteria || {
            oraganizeId: null,
            fileType: null,
            uploadDateFrom: null,
            uploadDateTo: null,
            channel: null,
            status: null,
            isBankDoc: false
        };
        var viewMode = {
            MY_ORGANIZE: 'MY_ORGANIZE',
            CUSTOMER: 'CUSTOMER'
        }
        var currentMode = $stateParams.viewMode;
        vm.headerName = currentMode == viewMode.MY_ORGANIZE ? "Upload document logs" : "Customer document upload log";

        vm.documentUploadLogModel = {
            sponsor: undefined,
            role: undefined
        }

        var querySponsorCode = function(value) {
            value = value = UIFactory.createCriteria(value);
            return $http.get(sponsorAutoSuggestServiceUrl, {
                params: {
                    q: value,
                    offset: 0,
                    limit: 5
                }
            }).then(function(response) {
                return response.data.map(function(item) {
                    item = prepareAutoSuggestLabel(item);
                    return item;
                });
            });
        };

        vm.sponsorAutoSuggestModel = UIFactory.createAutoSuggestModel({
            placeholder: 'Enter organization name or code',
            itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
            query: querySponsorCode
        });

        var prepareAutoSuggestLabel = function(item) {
            item.identity = ['sponsor-', item.organizeId, '-option'].join('');
            item.label = [item.organizeId, ': ', item.organizeName].join('');
            return item;
        }

        var getFileType = function(ownerId, integrateType) {
            var fileType = [];
            fileType.push({
                label: 'All',
                value: null
            });
            var deffered = DocumentUploadLogService.getFileType(ownerId, integrateType);
            deffered.promise.then(function(response) {
                response.data.forEach(function(type) {
                    fileType.push({
                        label: type,
                        value: type
                    });
                });
                if (fileType.length > 0) {
                    vm.hiddenColumn = false;
                } else {
                    vm.hiddenColumn = true;
                }
            }).catch(function(response) {
                log.error('Get file type fail');
                vm.hiddenColumn = true;
                vm.pagingController = PagingController.create(pagingUrl, vm.criteria, 'GET');
                if (currentMode == viewMode.MY_ORGANIZE) {
                    vm.searchLog();
                }
            });

            return fileType;
        }


        $scope.$watch('ctrl.documentUploadLogModel.sponsor', function() {
            if (vm.documentUploadLogModel.sponsor != '' && angular.isDefined(vm.documentUploadLogModel.sponsor) && angular.isObject(vm.documentUploadLogModel.sponsor)) {
                vm.fileTypeDropdowns = getFileType(vm.documentUploadLogModel.sponsor.organizeId, "IMPORT");
            } else {
                var docType = [];
                docType.push({
                    label: 'All',
                    value: null
                });
                vm.fileTypeDropdowns = docType;
                vm.criteria.fileType = docType[0].value;
            }
        });


        var isValid = function() {
            var valid = true;
            vm.wrongDateFormat = false;
            vm.wrongDateFromTo = false;

            // Wrong date format
            if (angular.isUndefined(vm.criteria.uploadDateFrom) && !angular.isDate(vm.criteria.uploadDateFrom)) {
                valid = false;
            } else if (angular.isUndefined(vm.criteria.uploadDateTo) && !angular.isDate(vm.criteria.uploadDateTo)) {
                valid = false;
            }

            if (!valid) {
                vm.wrongDateFormat = true;
            } else {
                // Wrong date from to
                if (angular.isDate(vm.criteria.uploadDateFrom) && angular.isDate(vm.criteria.uploadDateTo)) {

                    var datetimeFrom = new Date(vm.criteria.uploadDateFrom.getFullYear(),
                        vm.criteria.uploadDateFrom.getMonth(),
                        vm.criteria.uploadDateFrom.getDate(),
                        0, 0, 0);

                    var datetimeTo = new Date(vm.criteria.uploadDateTo.getFullYear(),
                        vm.criteria.uploadDateTo.getMonth(),
                        vm.criteria.uploadDateTo.getDate(),
                        0, 0, 0);

                    if (datetimeFrom > datetimeTo) {
                        valid = false;
                        vm.wrongDateFormat = false;
                        vm.wrongDateFromTo = true;
                    }
                }
            }
            return valid;
        }

        vm.searchLog = function(pagingModel) {
            var sponsorObject = vm.documentUploadLogModel.sponsor;

            if (sponsorObject != undefined && (sponsorObject.organizeId != undefined || sponsorObject == '')) {
                vm.criteria.oraganizeId = sponsorObject.organizeId;
            }

            if (isValid()) {
                vm.pagingController.search(pagingModel || ($stateParams.backAction ? {
                    offset: vm.criteria.offset,
                    limit: vm.criteria.limit
                } : undefined));
                $stateParams.backAction = false;
            }
        }

        vm.pagingController = PagingController.create(pagingUrl, vm.criteria, 'GET');

        var initLoad = function() {
            if (currentMode == viewMode.MY_ORGANIZE) {
                vm.hideColSponsor = true;
                vm.sponsorTxtDisable = true;
                vm.documentUploadLogModel.roleType = ' ';
                vm.showSponsor = false;
                var owner = angular.copy($rootScope.userInfo);
                owner = prepareAutoSuggestLabel(owner);
                vm.documentUploadLogModel.sponsor = owner;
                vm.fileTypeDropdowns = getFileType(owner.organizeId, "IMPORT");
                if(vm.criteria.fileType == null){
                	 vm.criteria.fileType = vm.fileTypeDropdowns[0].value;
                }
               
            } else if (currentMode == viewMode.CUSTOMER) {
                vm.sponsorTxtDisable = false;
                vm.documentUploadLogModel.roleType = 'sponsor';
                vm.hideColSponsor = false;
                vm.showSponsor = true;
                vm.hideColFileType = true;
            }
            vm.searchLog();
        }();

        vm.dataTable = {
            columns: [{
                    fieldName: 'startUploadTime',
                    labelEN: 'Upload date',
                    labelTH: 'Upload date',
                    idValueField: '$rowNo',
                    id: 'upload-date-{value}',
                    sortable: false,
                    filterType: 'date',
                    format: 'dd/MM/yyyy HH:mm',
                    cssTemplate: 'text-center'
                },
                {
                    fieldName: 'organizeLogo',
                    labelEN: 'Customer',
                    labelTH: 'Customer',
                    idValueField: '$rowNo',
                    id: 'module-{value}',
                    sortable: false,
                    cssTemplate: 'text-center',
                    dataRenderer: function(data) {
                        return '<img style="height: 32px; width: 32px;" data-ng-src="data:image/png;base64,' + atob(data.organizeLogo) + '"></img>';
                    },
                    hiddenColumn: vm.hideColSponsor
                },
                {
                    fieldName: 'channel',
                    labelEN: 'Channel',
                    labelTH: 'Channel',
                    idValueField: '$rowNo',
                    id: 'channel-{value}',
                    filterType: 'translate',
                    sortable: false,
                    cssTemplate: 'text-center'
                },
                {
                    fieldName: 'fileType',
                    labelEN: 'File type',
                    labelTH: 'File type',
                    idValueField: '$rowNo',
                    id: 'file-type-{value}',
                    filterType: 'translate',
                    sortable: false,
                    cssTemplate: 'text-left',
                    hiddenColumn: vm.hideColFileType
                },
                {
                    fieldName: 'fileName',
                    labelEN: 'File name',
                    labelTH: 'File name',
                    idValueField: '$rowNo',
                    id: 'file-name-{value}',
                    sortable: false,
                    cssTemplate: 'text-left'
                }, {
                    fieldName: 'success',
                    labelEN: 'Success',
                    labelTH: 'Success',
                    idValueField: '$rowNo',
                    id: 'success-{value}',
                    sortable: false,
                    cssTemplate: 'text-right'
                }, {
                    fieldName: 'fail',
                    labelEN: 'Fail',
                    labelTH: 'Fail',
                    idValueField: '$rowNo',
                    id: 'fail-{value}',
                    sortable: false,
                    cssTemplate: 'text-right',
                    dataRenderer: function(data) {
                        if (data != undefined) {
                            if (data.fail == null) {
                                return 'N/A';
                            } else {
                                return data.fail;
                            }
                        }
                    }
                }, {
                    fieldName: 'total',
                    labelEN: 'Total',
                    labelTH: 'Total',
                    idValueField: '$rowNo',
                    id: 'total-{value}',
                    sortable: false,
                    cssTemplate: 'text-right',
                    dataRenderer: function(data) {
                        if (data != undefined) {
                            if (data.fail == null) {
                                return 'N/A';
                            } else {
                                return data.fail + data.success;
                            }
                        }
                    }
                },
                {
                    fieldName: 'status',
                    labelEN: 'Status',
                    labelTH: 'Status',
                    idValueField: '$rowNo',
                    id: 'status-{value}',
                    sortable: false,
                    filterType: 'translate',
                    cssTemplate: 'text-center'
                },
                {
                    fieldName: 'action',
                    labelEN: 'Action',
                    labelTH: 'Action',
                    cellTemplate: '<scf-button id="document-upload-log-{{$parent.$index + 1}}-view-button" class="btn-default gec-btn-action" ng-click="ctrl.viewLog(data)" title="View log details"><i class="glyphicon glyphicon-search" ></i></scf-button>'
                }
            ]
        };

        vm.viewLog = function(data) {
            var params = {
                documentUploadLogModel: data,
                roleType: vm.documentUploadLogModel.roleType
            }
            PageNavigation.nextStep('/document-upload-log/view-log', params, { criteria: vm.criteria })
        }

        vm.openCalendarDateFrom = function() {
            vm.openDateFrom = true;
        }

        vm.openCalendarDateTo = function() {
            vm.openDateTo = true;
        }

    }
]);
scfApp.constant("docStatus", [{
        label: 'All',
        value: '',
        valueObject: null
    },
    {
        label: 'Fail',
        value: 'FAILED',
        valueObject: 'FAILED'
    },
    {
        label: 'Success',
        value: 'SUCCESS',
        valueObject: 'SUCCESS'

    }
]);
scfApp.constant("docChannel", [{
    label: 'All',
    value: '',
    valueObject: null
}, {
    label: 'FTP',
    value: 'FTP',
    valueObject: 'FTP'
}, {
    label: 'Web',
    value: 'WEB',
    valueObject: 'WEB'
}]);