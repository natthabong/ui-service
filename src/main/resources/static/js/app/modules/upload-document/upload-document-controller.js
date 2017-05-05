angular.module('scfApp').controller('UploadDocumentController', ['$log', 'UploadDocumentService', '$scope', 
	'$state', '$stateParams', '$timeout', 'PageNavigation', 'SCFCommonService', 'Service', 
	function($log, UploadDocumentService, $scope, $state, $stateParams, $timeout, PageNavigation, SCFCommonService, Service) {
    var vm = this;
    var log = $log;
    
    var currentParty = '';
    var partyRole = {
			sponsor : 'sponsor',
			bank : 'bank'
	}
    
    vm.errorMsgKey = '';
    vm.showErrorMsg = false;
    vm.fileTypeDropdown = [];
    vm.storeFileTypeDatas = [];
    vm.acceptFileExtention = '';
    vm.errorFileFormat = '';
    vm.showConfirmBtn = true;
    vm.isShowConfirmation = false;
    vm.tableUploadErrorRowCollection = [];
    vm.uploadDocumentDisplayError = [];
    vm.splitePageTxt = '';
    
    vm.showSuccessTotalAmount = true;
    vm.uploadConfirmPayload = {};
    

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
    vm.uploadModel = {
        fileTypeIndex: '',
        fileConfigId: '',
        file: ''
    };

    vm.pageModel = {
        currentPage: 0,
        pageSizeSelectModel: '20',
        totalRecord: 0,
        currentPage: 0
    };

    vm.uploadResult = {
        fileName: '',
        totalRecords: 0,
        totalSuccess: 0,
        totalFail: 0
    };
    $scope.showUploadPopUp = false;
   
    vm.getFileType = function(sponsorConfigId) {
        var deffered = Service.doGet('/api/upload-document/file-types', {sponsorConfigId: sponsorConfigId});
        deffered.promise.then(function(response) {
            vm.storeFileTypeDatas = response.data;
            // Check size of fileType
            if (vm.storeFileTypeDatas.length > 0) {
                // Use index for find position of SponsorIntegrateFileConfig
				// when send to api
                var index = 0;
                vm.storeFileTypeDatas.forEach(function(data) {
                    vm.fileTypeDropdown.push({
                        label: data['displayName'],
                        value: '\'' + index + '\''
                    });
                    index++;
                });
                // Initial value to fileType model
                vm.uploadModel.fileTypeIndex = vm.fileTypeDropdown[0].value;
                vm.acceptFileExtention = getFileExtentions(vm.storeFileTypeDatas[0].fileExtensions);
            }
        }).catch(function(response) {
            log.error('Get file type fail');
        });
    };

    vm.closeModal = function() {
        $timeout(function() {
            $state.reload();
        }, 10);
    };

    vm.filterExtentionAction = function() {
        var fileTypeIndex = vm.uploadModel.fileTypeIndex;
        vm.acceptFileExtention = getFileExtentions(vm.getFileTypeByIndex(fileTypeIndex).fileExtensions);
    }

    vm.getFileTypeByIndex = function(index) {
        var fileTypeIndex = index.replace(new RegExp('\'', 'g'), '');
        return vm.storeFileTypeDatas[parseInt(fileTypeIndex)];
    }

    vm.uploadNextPage = function(pagingModel) {
		
        if (pagingModel !== undefined) { 
            vm.pageModel.currentPage = pagingModel.page;
            vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
        }
        var pagingObject = SCFCommonService.clientPagination(vm.uploadResult.errors, vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage);
        vm.uploadDocumentDisplayError = pagingObject.content;
        vm.pageModel.totalPage = pagingObject.totalPages;
        vm.pageModel.totalRecord =vm.uploadResult.errors.length;
        
        vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);

    };

    vm.uploadAction = function() {
	vm.isShowConfirmation = false;
        vm.showErrorMsg = false;
        // Validate Form before send upload file
        if (validateFileUpload(vm.uploadModel, vm.acceptFileExtention)) {
            var fileTypeConfigObject = vm.getFileTypeByIndex(vm.uploadModel.fileTypeIndex);
            vm.uploadModel.fileConfigId = fileTypeConfigObject.layoutConfigId;

            var deffered = UploadDocumentService.upload(vm.uploadModel);
            deffered.promise.then(function(response) {

				vm.uploadResult = response.data;
                if ( vm.uploadResult.complete) {
                    $scope.showUploadPopUp = true;
                } else {
                    vm.isShowConfirmation = true;
                    if (vm.uploadResult.success == null || vm.uploadResult.success == 0) {
                        vm.showConfirmBtn = false;
                    }else{
                    	vm.showConfirmBtn = true;
                    }
					vm.uploadNextPage();
                }
                
            }).catch(function(response) {
                log.error('Upload file fail');
            });
        } else {
            vm.showErrorMsg = true;
        }

    };

    vm.dataTable = {
        columns: [{
            field: 'errorLineNo',
            label: 'Line No.',
            cssTemplate: 'text-center',
            idValueField: 'template',
            cellTemplate: '<span ng-bind="data.errorLineNo == null ? \'N/A\': data.errorLineNo">N/A</span>',
			id: 'file-upload-confirmation-line-no-{value}-label'
        }, {
            field: 'errorMessage',
            label: 'Description',
            cssTemplate: 'text-left',
			idValueField: 'template',
			id: 'file-upload-confirmation-description-{value}-label'
        }]
    }

    vm.cancelUpload = function() {
        $state.reload();
    };
	
	vm.confirmUpload = function(){
		
		vm.uploadConfirmPayload.processNo = vm.uploadResult.information.processNo;
		
		var deffered = UploadDocumentService.confirmUpload(vm.uploadConfirmPayload);
		deffered.promise.then(function(response){
			vm.uploadResult = response.data;
                $scope.showUploadPopUp = true;
		}).catch(function(response){
			log.error('Confirm upload fail');
		});
	};
	
	vm.initial = function(){
		currentParty = $stateParams.party;
		var sponsorConfigId = 'SFP';
		if(currentParty == partyRole.bank){
			sponsorConfigId = 'MASTER';
			vm.showSuccessTotalAmount = false;
		}
		vm.getFileType(sponsorConfigId);
	}

    function validateFileUpload(data, acceptFileExtention, errorMsgKey) {
        var validateResult = true;
        if (angular.equals(data.file, '')) {
            validateResult = false;
            vm.errorMsgKey = 'Upload Msg err';
        }else if(data.file.size > 1024*1024){
            log.error('Upload file fail');
            vm.errorMsgKey = 'Upload filesize err';
            validateResult = false;
        } 
        else {
            var fileName = data.file.name;
            var fileSelectExtention = fileName.slice(fileName.lastIndexOf('.'), fileName.length);
            // Check file extention name exists in acceptFileExtention ?.
            if (acceptFileExtention.search(fileSelectExtention) < 0) {
                validateResult = false;
                vm.errorMsgKey = 'File extension error';
                vm.errorFileFormat = acceptFileExtention.slice(acceptFileExtention.lastIndexOf('.')+1, acceptFileExtention.length);
            }
        }
        return validateResult;
    }

    function getFileExtentions(data) {
        var result = '';
        if (angular.isUndefined(data) || data === '') {
            return result;
        }
        var nameExtentions = data.split(',');
        nameExtentions.forEach(function(nameExtention) {
            result += '.' + nameExtention + ',';
        });
        return result.slice(0, result.length - 1);
    }
    
    vm.initial();
}]);