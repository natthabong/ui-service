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
        
        vm.decodeBase64 = function(data) {
            return (data ? atob(data) : UIFactory.constants.NOLOGO);
        };
        
        var isSameProcessNo = function (processNo, data, index) {
			if (index == 0) {
				return false;
			} else {
				return processNo == data[index - 1].processNo;
			}
		}

        vm.criteria = $stateParams.criteria || {
        	organizeId: null,
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

        var prepareAutoSuggestLabel = function(item) {  //TODO AutoSuggest && File type
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
                vm.criteria.organizeId = sponsorObject.organizeId;
            }

            if (isValid()) {
            	vm.pagingController.search(pagingModel, function (criteria, response) {
    				var data = response.data;
    				var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
    				var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
    				var i = 0;
    				var baseRowNo = pageSize * currentPage; 
    				angular.forEach(data, function (value, idx) {		        						
    					if (isSameProcessNo(value.processNo, data, idx)) {
    						value.isSameProcessNo = true;
    					}
    					++i;
    					value.rowNo = baseRowNo+i;
    				});
    			});
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
        value: null,
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