var exportChannelModule = angular
        .module('gecscf.organize.configuration.channel.export');
exportChannelModule.constant('ChannelDropdown',[
	{label:'Web', value: 'WEB'},
	{label:'FTP', value: 'FTP'}
	]);
exportChannelModule.constant('ExportDataTypeDropdown',[
	{label:'All Product type', value: 'ALL'},
	{label:'Specified product type', value: 'SPECIFIED'}
	]);
exportChannelModule.constant('PROTOCOL_DROPDOWN',[
	{label:'SFTP', value: 'SFTP'}
	]);
exportChannelModule.constant('ENCRYPT_TYPE_DROPDOWN',[
   	{label:'None', value: 'NONE'},
   	{label:'PGP', value: 'PGP'}
   	]);
exportChannelModule.constant('FREQUENCY_DROPDOWN',[
	{label:'Daily', value: 'DAILY'}
	]);
exportChannelModule.controller('ExportChannelController', [
			'$log','$scope','$state','$stateParams','Service','ChannelDropdown','ExportDataTypeDropdown','FileLayoutService',
			'PageNavigation','UIFactory','blockUI','$q','$http','PROTOCOL_DROPDOWN','FREQUENCY_DROPDOWN',
	function($log , $scope , $state , $stateParams , Service , ChannelDropdown , ExportDataTypeDropdown , FileLayoutService ,
			 PageNavigation , UIFactory , blockUI , $q , $http , PROTOCOL_DROPDOWN , FREQUENCY_DROPDOWN) {

      var vm = this;
      var channelId = $stateParams.channelId;
      var organizeId = $stateParams.organizeId;
      var BASE_URI = 'api/v1/organize-customers/' + organizeId;
      vm.channelModel = {};
      vm.productTypes = {};
      vm.runTimes = {};
      vm.haveProductType = false;
      vm.fileLayouts = [];
      vm.channelDropdown = ChannelDropdown;
      vm.exportDataTypeDropdown = ExportDataTypeDropdown;
      vm.fileProtocolDropdown = PROTOCOL_DROPDOWN;
  	  vm.frequencyDropdown = FREQUENCY_DROPDOWN;
      $scope.errors = {};
      vm.manageAll=false;
      vm.isSetupFTP = false;
      vm.openActiveDate = false;
      vm.openCalendarActiveDate = function() {
      	vm.openActiveDate = true;
      };
      vm.openExpireDate = false;
      vm.openCalendarExpireDate = function() {
      	vm.openExpireDate = true;
      };
      vm.isUseExpireDate = false;
      vm.isAllProductType = false;
      
      vm.backToSponsorConfigPage = function(){
 		 PageNavigation.gotoPage('/sponsor-configuration',  {
 	        	organizeId:  organizeId
 	     });
      }
      
      var sendRequest = function(uri, succcesFunc, failedFunc) {
          var serviceDiferred = Service.doGet(BASE_URI + uri);

          var failedFunc = failedFunc | function(response) {
              log.error('Load data error');
          };
          serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
      }
      
      vm.searchChannel = function(){
  			sendRequest('/export-channels/' + channelId, function(response) {
	            vm.channelModel = response.data;
	              
	            if(response.data.activeDate != null){
	              	vm.channelModel.activeDate =  new Date(response.data.activeDate);
	  			}else {
	  				vm.channelModel.activeDate = null;
	  			}
	              
	            if(response.data.expiryDate != null){
	              	vm.channelModel.expiryDate =  new Date(response.data.expiryDate);
	  				vm.isUseExpireDate = true;
	  			}else{
	  				vm.channelModel.expiryDate = null;
	  			}
	            
	            if(response.data.exportDataType == 'ALL'){
	             	vm.isAllProductType = true;
	    		} else {
	    			vm.isAllProductType = false;
	    		}
	            
	            if(vm.channelModel.channelType == 'FTP'){
					vm.isSetupFTP = true;
					vm.channelModel.fileProtocol = 'SFTP';

					if(response.data.jobTrigger.jobDetail.remotePort == null){
						vm.channelModel.jobTrigger.jobDetail.remotePort = '22';
					}

					if(response.data.jobTrigger.jobDetail.remoteFilenamePattern == null){
						vm.channelModel.jobTrigger.jobDetail.remoteFilenamePattern = '*.*';
					}

					if(response.data.jobTrigger.jobDetail.limitedFileSize == null){
						vm.channelModel.jobTrigger.jobDetail.limitedFileSize = '5';
					}
					if(response.data.jobTrigger.jobDetail.encryptType == null){
						vm.channelModel.jobTrigger.jobDetail.encryptType = 'NONE';
					}

					if(response.data.jobTrigger.jobDetail.connectionRetry == null){
						vm.channelModel.jobTrigger.jobDetail.connectionRetry = '3';
					}

					if(response.data.jobTrigger.jobDetail.connectionRetryInterval == null){
						vm.channelModel.jobTrigger.jobDetail.connectionRetryInterval = '60';
					}

					if(response.data.jobTrigger.jobDetail.postProcessType == null){
						vm.channelModel.jobTrigger.jobDetail.postProcessType = 'NONE';
					}

					if(response.data.jobTrigger.jobDetail.postProcessType == 'BACKUP'){
						vm.postProcessBackup = true;

					}else if(response.data.jobTrigger.jobDetail.remoteBackupPath == null){
						vm.channelModel.jobTrigger.jobDetail.remoteBackupPath = '/backup'
					}

					if(response.data.jobTrigger.jobDetail.remoteBackupFolderPattern == null){
						vm.channelModel.jobTrigger.jobDetail.remoteBackupFolderPattern = '/';
					}

					if(response.data.jobTrigger.frequencyType == null){
						vm.channelModel.jobTrigger.frequencyType = 'DAILY';
					}

					if(response.data.jobTrigger.intervalInMinutes == null){
						vm.channelModel.jobTrigger.intervalInMinutes = '300';
					}
					if(response.data.jobTrigger.daysOfWeek == null || response.data.jobTrigger.daysOfWeek == ''){
						vm.channelModel.monday = true;
						vm.channelModel.tuesday = true
						vm.channelModel.wednesday = true
						vm.channelModel.thursday = true
						vm.channelModel.friday = true
						vm.channelModel.saturday = true
						vm.channelModel.sunday = true

					}else {

						var daysOfWeek = response.data.jobTrigger.daysOfWeek.split(",");
						daysOfWeek.forEach(function(data){
							if(data == dayOfWeekFrequency.SUNDAY){
								vm.channelModel.sunday = true
							}
							if(data == dayOfWeekFrequency.MONDAY){
								vm.channelModel.monday = true;
							}
							if(data == dayOfWeekFrequency.TUESDAY){
								vm.channelModel.tuesday = true
							}
							if(data == dayOfWeekFrequency.WEDNESDAY){
								vm.channelModel.wednesday = true
							}
							if(data == dayOfWeekFrequency.THURSDAY){
								vm.channelModel.thursday = true
							}
							if(data == dayOfWeekFrequency.FRIDAY){
								vm.channelModel.friday = true
							}
							if(data == dayOfWeekFrequency.SATURDAY){
								vm.channelModel.saturday = true
							}
						});
					}

					if(response.data.jobTrigger.startHour == null || response.data.jobTrigger.startMinute == null){
						vm.channelModel.beginTime = "00:00";
					}else{
						vm.channelModel.beginTime = formattedNumber(response.data.jobTrigger.startHour) + ":" + formattedNumber(response.data.jobTrigger.startMinute);
					}	

					if(response.data.jobTrigger.endHour == null || response.data.jobTrigger.endMinute == null){
						vm.channelModel.endTime = "23:59";

					}else{
						vm.channelModel.endTime = formattedNumber(response.data.jobTrigger.endHour) + ":"+ formattedNumber(response.data.jobTrigger.endMinute);
					}	

					response.data.jobTrigger.jobDetail.remotePassword = null;
					response.data.jobTrigger.jobDetail.encryptPassword = null;
				}
  			});
      }
      
      vm.searchFileLayout = function(){
    	  var deffered = FileLayoutService.getFileLayouts(organizeId, 'EXPORT_DOCUMENT', 'EXPORT');
    	  deffered.promise.then(function(response){
    		  vm.fileLayouts = [];
    		  var _fileLayouts = response.data;
          	  if (angular.isDefined(_fileLayouts)) {
          		 _fileLayouts.forEach(function (fileLayout) {
                      var selectObj = {
                          label: fileLayout.displayName,
                          value: fileLayout.layoutConfigId
                      }
                      vm.fileLayouts.push(selectObj);
                   });
          	  }
    	  });
     };
     
     vm.searchProductTypes = function(){
    	 sendRequest('/product-types', function(response) {
    		 vm.productTypes = response.data;
	         if(response.data != null){
	           	vm.haveProductType =  true;
	         }
    	 });
     }

     var setupPrepareData = function(){
 		if(!vm.isUseExpireDate){
 			vm.channelModel.expiryDate = null;
 		}
 	 }     

     var validSave = function(){
 		$scope.errors = {};
 		var isValid = true;
 		var channel = vm.channelModel;

 		if(vm.channelModel.displayName == null || vm.channelModel.displayName ==""){
 			isValid = false;
 			$scope.errors.displayName = {
 					message : 'Display name is required.'
 			}			
 		} 		
 		
 		if(vm.channelModel.layoutConfigId == null || vm.channelModel.layoutConfigId ==""){
 			isValid = false;
 			$scope.errors.layout = {
 					message : 'File layout is required.'
 			}			
 		}

 		if (!angular.isDefined(channel.activeDate)) {
 			isValid = false;
 		    $scope.errors.activeDate = {
 	    		message : 'Wrong date format data.'
 		    }
 		}else if(channel.activeDate == null|| channel.activeDate ==''){
 			isValid = false;
 		    $scope.errors.activeDate = {
 	    		message : 'Active date is required.'
 		    }
 		}
 		
 		if (vm.isUseExpireDate) {
 		    if (!angular.isDefined(channel.expiryDate)) {
 		    	isValid = false;
 				$scope.errors.expiryDate = {
 				    message : 'Wrong date format data.'
 				}
 		    }else if(channel.expiryDate == null|| channel.expiryDate ==''){				    	
 		    	isValid = false;
 			    $scope.errors.expiryDate = {
 		    		message : 'Expire date is required.'
 			    }
 		    }else if (angular.isDefined(channel.activeDate)
 				    && channel.expiryDate < channel.activeDate) {
 		    	isValid = false;
 				$scope.errors.activeDate = {
 				    message : 'Active date must be less than or equal to expire date.'
 				}
 			}
 		}
 		return isValid;
 	 }     
     
     $scope.confirmSave = function() {
 		var serviceUrl = BASE_URI+'/export-channels/' + vm.channelModel.channelId;
 		var deffered = $q.defer();
 		var serviceDiferred =  $http({
 			method : 'POST',
 			url : serviceUrl,
 			headers: {
 				'If-Match' : vm.channelModel.version,
 				'X-HTTP-Method-Override': 'PUT'
 			},
 			data: vm.channelModel
 		}).then(function(response) {
 			deffered.resolve(response.data)
 		}).catch(function(response) {
 			deffered.reject(response);
 		});
 		return deffered;
     }
     
     vm.saveChannel = function(){
    	setupPrepareData();
    	if(validSave()){
	    	var preCloseCallback = function(confirm) {
	    		vm.backToSponsorConfigPage();
	        }
	    	
	    	UIFactory.showConfirmDialog({
	    		data : {
	    		    headerMessage : 'Confirm save?'
	    		},
		    	confirm : $scope.confirmSave,
		    	onSuccess : function(response) {
		    		blockUI.stop();
		    		UIFactory.showSuccessDialog({
		    			data : {
		    				headerMessage : 'Edit channel complete.',
		    				bodyMessage : ''
		    			},
		    			preCloseCallback : preCloseCallback
		    		});
		    	},
		    	onFail : function(response) {
		    		var msg = {
							405 : 'Channel has been modified.'
					};
			    	blockUI.stop();
			    	UIFactory.showFailDialog({
						data : {
								headerMessage : 'Edit channel fail.',
								bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback : null
		    		});
		    	}
	    	});
    	}
     }    	 
      
 	vm.setupUserInfo = function(){
		vm.username = '';
		
		if(angular.isDefined(vm.channelModel.jobTrigger) && angular.isDefined(vm.channelModel.jobTrigger.jobDetail.remoteUsername)){
			vm.username = vm.channelModel.jobTrigger.jobDetail.remoteUsername;
		}
		
		var userInfo = ngDialog.open({
			id : 'user-info-dialog',
			template : '/js/app/modules/organize/configuration/channel/export/templates/dialog-user-info.html',
			className : 'ngdialog-theme-default',
			scope : $scope,
			data : {
				username : vm.username
			},
			preCloseCallback : function(value) {
				if (angular.isDefined(value)) {
					vm.channelModel.jobTrigger.jobDetail.remoteUsername = value.username;
					vm.channelModel.jobTrigger.jobDetail.remotePassword = value.password;
				}
				return true;
			}
		});
	 }

	 vm.setupEncryptInfo = function(){
		vm.encryptType = null;
		vm.encryptPassword = null;
		vm.decryptPrivateKey = null;
			 
		if(angular.isDefined(vm.channelModel.jobTrigger.jobDetail.encryptType)){
			vm.encryptType = vm.channelModel.jobTrigger.jobDetail.encryptType;
		}
		
		if(angular.isDefined(vm.channelModel.jobTrigger.jobDetail.encryptPassword)){
			vm.encryptPassword = vm.channelModel.jobTrigger.jobDetail.encryptPassword;
		}
		
		if(angular.isDefined(vm.channelModel.jobTrigger.jobDetail.decryptPrivateKey)){
			vm.decryptPrivateKey = vm.channelModel.jobTrigger.jobDetail.decryptPrivateKey;
		}
		
		var decryptInfo = ngDialog.open({
			id : 'user-info-dialog',
			template : '/js/app/modules/organize/configuration/channel/export/templates/dialog-encrypt-info.html',
			className : 'ngdialog-theme-default',
			scope : $scope,
			data : {
				encryptType : vm.encryptType,
				encryptPassword : vm.encryptPassword,
				decryptPrivateKey : vm.decryptPrivateKey
			},
			preCloseCallback : function(value) {
				if (angular.isDefined(value)) {
					vm.channelModel.jobTrigger.jobDetail.encryptType = value.encryptType;
					vm.channelModel.jobTrigger.jobDetail.encryptPassword = value.encryptPassword;
					vm.channelModel.jobTrigger.jobDetail.decryptPrivateKey = value.decryptPrivateKey;
				}
				return true;
			}
		});
	 }
	
	 vm.changeExportData = function(){
        if(vm.channelModel.exportDataType == 'ALL'){
         	vm.isAllProductType = true;
		} else {
			vm.isAllProductType = false;
		}
	 }
	 
	 vm.initLoad = function() {
	   	vm.searchChannel();
	 	vm.searchFileLayout();
	 	vm.searchProductTypes();
	 }();
	 
}]);
exportChannelModule.controller('SetupFTPUserController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	 var vm = this;
	 vm.username = angular.copy($scope.ngDialogData.username);
	 vm.userInfo = {
		 username: vm.username,
		 password: ''
	 }

	 vm.validate = function(){
		 var isValid = true;
		 vm.showUserNameMessageError = false;
		 vm.showPasswordMessageError = false;
		 
		 if(vm.userInfo.username == null|| vm.userInfo.username ==''){
			 vm.showUserNameMessageError = true;
			 vm.usernameMessageError = "Username Require";
			 isValid = false;
		 }
		 
		 if(vm.userInfo.password == null|| vm.userInfo.password ==''){
			 vm.showPasswordMessageError = true;
			 vm.passwordMessageError = "Password Require";
			 isValid = false;
		 }
		 
		 if(isValid){
			 $scope.closeThisDialog(vm.userInfo);
		 }
	 }
} ]);
exportChannelModule.controller('SetupFileEncryptionController', [ '$scope', '$rootScope', 'ENCRYPT_TYPE_DROPDOWN', function($scope, $rootScope, ENCRYPT_TYPE_DROPDOWN) {
	 var vm = this;
	 vm.encryptType = angular.copy($scope.ngDialogData.encryptType);
	 vm.encryptPassword = angular.copy($scope.ngDialogData.encryptPassword);
	 vm.decryptPrivateKey = angular.copy($scope.ngDialogData.decryptPrivateKey);
	 vm.encryptInfo = {
		 encryptType: vm.encryptType,
		 encryptPassword: null,
		 decryptPrivateKey: vm.decryptPrivateKey
	 }
	 
	 vm.encryptTypeDropdown = ENCRYPT_TYPE_DROPDOWN;
	 vm.isShowPGPInfo = false; 
	 
	 vm.encryptTypeChange = function(){
		 vm.showPasswordMessageError = false;
		 if(vm.encryptInfo.encryptType == 'PGP'){
			 vm.isShowPGPInfo = true; 
		 }else{
			 vm.isShowPGPInfo = false; 
		 }
	 }
	 
	 vm.encryptTypeChange();
	 
	 vm.validate = function(){
		 var isValid = true;
		 vm.showPasswordMessageError = false;
		 
		 if(vm.encryptInfo.encryptType == 'PGP'){
			 if(vm.encryptInfo.encryptPassword == null|| vm.encryptInfo.encryptPassword ==''){
				 vm.showPasswordMessageError = true;
				 vm.passwordMessageError = "PGP Password Require";
				 isValid = false;
			 }
		 }
		 
		 if(isValid){
			 $scope.closeThisDialog(vm.encryptInfo);
		 }
	 }
} ]);