angular.module('scfApp').controller('UploadDocumentController', ['$log', 'UploadDocumentService', '$scope', '$state', '$stateParams', function($log, UploadDocumentService, $scope, $state, $stateParams){
	var vm = this;
	var log = $log;
	vm.errorMsgKey = '';
	vm.showErrorMsg = false;
	vm.fileTypeDropdown = [];
	vm.storeFileTypeDatas = [];
	vm.acceptFileExtention = '';
	vm.errorFileFormat = '';
	vm.uploadModel = {
		fileTypeIndex: '',
		fileConfigId: '',
		file: ''
	};
	
	vm.uploadResult = {};
	$scope.showUploadPopUp = false;
		
	vm.getFileType = function(){
		var deffered = UploadDocumentService.getFileType();
		deffered.promise.then(function(response){
			vm.storeFileTypeDatas = response.data;
			//Check size of fileType
			if(vm.storeFileTypeDatas.length > 0){
				//Use index for find position of SponsorIntegrateFileConfig when send to api
				var index = 0;
				vm.storeFileTypeDatas.forEach(function(data){
					vm.fileTypeDropdown.push({
						label: data['displayName'],
						value: '\''+ index +'\''
					});
					index ++;
				});
				//Initial value to fileType model				
				vm.uploadModel.fileTypeIndex = vm.fileTypeDropdown[0].value;
				vm.acceptFileExtention = getFileExtentions(vm.storeFileTypeDatas[0].fileExtensions);
			}
		}).catch(function(response){
			log.error('Get file type fail');
		});
	};	
	vm.getFileType();
	
	vm.closeModal = function(){
		log.debug('close');
		$state.transitionTo($state.current, $stateParams, {reload: true, inherit: false, notify: false });
	};
	
	vm.filterExtentionAction = function(){
		var fileTypeIndex = vm.uploadModel.fileTypeIndex;
		vm.acceptFileExtention = getFileExtentions(vm.getFileTypeByIndex(fileTypeIndex).fileExtensions);
	}
	
	vm.getFileTypeByIndex = function(index){
		var fileTypeIndex = index.replace(new RegExp('\'', 'g'), '');
		return vm.storeFileTypeDatas[parseInt(fileTypeIndex)];
	}
	
	vm.uploadAction = function(){
		vm.showErrorMsg = false;
		//Validate Form befor send upload file
		if(validateFileUpload(vm.uploadModel, vm.acceptFileExtention)){
			var fileTypeConfigObject = vm.getFileTypeByIndex(vm.uploadModel.fileTypeIndex);
			vm.uploadModel.fileConfigId = fileTypeConfigObject.sponsorIntegrateFileConfigId;
			
			var deffered = UploadDocumentService.upload(vm.uploadModel);
			deffered.promise.then(function(response){
				$scope.showUploadPopUp = true;
				vm.uploadResult = response.data;
			}).catch(function(response){
				if(validateFileSize(response.data)){
					vm.errorMsgKey = 'Upload filesize err';
					vm.showErrorMsg = true;
					
				}
				log.error('Upload file fail');
			});
		}else{
			
			vm.showErrorMsg = true;
		}
		
	};
	
	function validateFileUpload(data, acceptFileExtention, errorMsgKey){
		var validateResult = true;
		if(angular.equals(data.file, '')){
			validateResult = false;
			vm.errorMsgKey = 'Upload Msg err';
		}else{
			var fileName = data.file.name;
			var fileSelectExtention = fileName.slice(fileName.lastIndexOf('.'), fileName.length);
			//Check file extention name exists in acceptFileExtention ?.
			if(acceptFileExtention.search(fileSelectExtention) < 0){
				validateResult = false;
				vm.errorMsgKey = 'File extention error';
				vm.errorFileFormat = acceptFileExtention;
			}
		}
		return validateResult;
	}
	
	function validateFileSize(data){
		if(data.search('maximum permitted size') >0){
			return true;
		}
		return false;
	}
	
	
	function getFileExtentions(data){
		var result = '';
		if(angular.isUndefined(data) || data === ''){
			return result;
		}		
		var nameExtentions = data.split(',');
		nameExtentions.forEach(function(nameExtention){
			result += '.'+nameExtention + ',';
		});
		return result.slice(0, result.length-1);
	}
}]);