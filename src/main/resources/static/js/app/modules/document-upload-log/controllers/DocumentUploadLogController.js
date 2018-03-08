'use strict';
var app = angular.module('gecscf.documentUploadLog');
app.controller('DocumentUploadLogController', ['$rootScope', '$scope', '$stateParams', '$log', '$http', 'PagingController', 'UIFactory',
     'docStatus', 'PageNavigation', 'docChannel', 'DocumentUploadLogService', 'scfFactory',
    function( $rootScope, $scope, $stateParams, $log, $http,  PagingController, UIFactory, docStatus, PageNavigation, docChannel, DocumentUploadLogService, scfFactory) {
        var vm = this;
        vm.getUserInfoSuccess = false;
        var deferred = scfFactory.getUserInfo();
        
        deferred.promise.then(function (response) {
        vm.getUserInfoSuccess = true;
        var log = $log;
        
        vm.criteria = $stateParams.criteria || {
        	viewMode: null,
        	fundingId: null,
        	organizeId: null,
            fileType: null,
            uploadDateFrom: null,
            uploadDateTo: null,
            channel: null,
            status: null
        };
        
        vm.organize = $stateParams.organize || undefined;
        
        vm.dateFormat = "dd/MM/yyyy";
        vm.openDateFrom = false;
        vm.openDateTo = false;
        vm.showSponsor = true;

        var sponsorAutoSuggestServiceUrl = 'api/v1/organizes';
        var pagingUrl = 'api/v1/upload-logs';
        vm.sponsorTxtDisable = false;
        vm.hideColSponsor = false;
        vm.fileTypeDropdowns = [];
        vm.fundingDropdowns = [];
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

        var viewMode = {
            MY_ORGANIZE : 'MY_ORGANIZE',
            FUNDING : 'FUNDING',
            ALLFUNDING : 'ALLFUNDING'
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
            item.identity = [ 'organize-', item.memberId, '-', item.memberCode, '-option' ].join('');
            item.label = [ item.memberCode, ': ', item.memberName ] .join('');
		return item;
        }

        var getFileType = function(ownerId, integrateType) {
            var fileType = [];
            fileType.push({
                label: 'All',
                value: null
            });
            var deffered = DocumentUploadLogService.getFileType(currentMode, ownerId, integrateType);
            deffered.promise.then(function(response) {
                response.data.forEach(function(type) {
                    fileType.push({
                        label: type,
                        value: type
                    });
                });
            }).catch(function(response) {
                log.error('Get file type fail');
            });

            return fileType;
        }
        
        var getFunding = function() {
            var funding = [];
            funding.push({
                label: 'All',
                value: null
            });
            var deffered = DocumentUploadLogService.getFunding();
            deffered.promise.then(function(response) {
                response.data.forEach(function(each) {
                	funding.push({
                        label: each.fundingName,
                        value: each.fundingId
                    });
                });
            }).catch(function(response) {
                log.error('Get funding fail');
            });

            return funding;
        }


        $scope.$watch('ctrl.organize', function() {
            if (vm.organize != '' && angular.isDefined(vm.organize) && angular.isObject(vm.organize)) {
                vm.fileTypeDropdowns = getFileType(vm.organize.memberId, "IMPORT");
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
            var sponsorObject = vm.organize;

            if (sponsorObject != undefined && (sponsorObject.memberId != undefined || sponsorObject == '')) {
                vm.criteria.organizeId = sponsorObject.memberId;
            }
            
            if (vm.criteria.fileType == undefined || vm.criteria.fileType == '') {
				vm.criteria.fileType = null;
            }
            
            if (vm.criteria.fundingId == undefined || vm.criteria.fundingId == '') {
				vm.criteria.fundingId = null;
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
            	vm.criteria.organizeId = $rootScope.userInfo.organizeId;
                vm.hideColSponsor = true;
                vm.sponsorTxtDisable = true;
                vm.viewMode = 'MY_ORGANIZE';
                vm.showSponsor = false;
                var owner = angular.copy($rootScope.userInfo);
                owner = prepareAutoSuggestLabel(owner);
                vm.organize = owner;
                vm.fileTypeDropdowns = getFileType(owner.memberId, "IMPORT");
                if(vm.criteria.fileType == null){
                	 vm.criteria.fileType = vm.fileTypeDropdowns[0].value;
                }
            } else if (currentMode == viewMode.FUNDING) {
            	vm.criteria.fundingId = $rootScope.userInfo.fundingId;
                vm.sponsorTxtDisable = false;
                vm.viewMode = 'FUNDING';
                vm.hideColSponsor = false;
                vm.showSponsor = true;
                vm.hideColFileType = true;
                if(vm.organize != undefined){
                	vm.organize = prepareAutoSuggestLabel(vm.organize);
                }
            } else if (currentMode == viewMode.ALLFUNDING) {
                vm.viewMode = 'ALLFUNDING';
                vm.fundingDropdowns = getFunding();
                console.log(vm.organize);
                if(vm.organize != undefined){
                	vm.organize = prepareAutoSuggestLabel(vm.organize);
                }
            }
            vm.criteria.viewMode = vm.viewMode;
            vm.searchLog();
        }();

        vm.viewLog = function(data) {
            var params = {
            	recordModel: data,
                viewMode: vm.viewMode
            }
            PageNavigation.nextStep('/document-upload-log/view-log', params, { criteria: vm.criteria ,organize: vm.organize})
        }

        vm.openCalendarDateFrom = function() {
            vm.openDateFrom = true;
        }

        vm.openCalendarDateTo = function() {
            vm.openDateTo = true;
        }
    })
  }]);
app.constant("docStatus", [{
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
app.constant("docChannel", [{
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