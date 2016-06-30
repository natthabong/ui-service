angular.module('scfApp').controller('UploadDocumentController', ['$log', 'UploadDocumentService', '$scope', '$state', '$stateParams', function($log, UploadDocumentService, $scope, $state, $stateParams){
	var vm = this;
	var log = $log;
	vm.errorMsgKey = '';
	vm.showErrorMsg = false;
	vm.fileTypeDropdown = [];
	vm.uploadModel = {
		fileType: '',
		file: ''
	};
	
	vm.uploadResult = {};
	$scope.showUploadPopUp = false;
	
	vm.uploadAction = function(){
		vm.showErrorMsg = false;
		if(validateFileUpload(vm.uploadModel)){
			var deffered = UploadDocumentService.upload(vm.uploadModel);
			deffered.promise.then(function(response){
				$scope.showUploadPopUp = true;
				vm.uploadResult = response.data;
			}).catch(function(response){
				log.error('Upload file fail');
			});
		}else{
			vm.errorMsgKey = 'Upload Msg err';
			vm.showErrorMsg = true;
		}
		
	};
	
	vm.getFileType = function(){
		var deffered = UploadDocumentService.getFileType();
		deffered.promise.then(function(response){
			var fileTypeData = response.data;
			//Check size of fileType
			if(fileTypeData.length > 0){				
				fileTypeData.forEach(function(data){
					vm.fileTypeDropdown.push({
						label: Object.keys(data)[0],
						value: data[Object.keys(data)[0]]
					});				
				});
				//Initial value to fileType model
				vm.uploadModel.fileType = vm.fileTypeDropdown[0].value;
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
	
	function validateFileUpload(data){
		var validateResult = true;
		if(angular.equals(data.file, '')){
			validateResult = false;
		}
		return validateResult;
	}
}]);