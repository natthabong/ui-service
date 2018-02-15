var exportChannelModule = angular
        .module('gecscf.organize.configuration.channel.export');
exportChannelModule.constant('ChannelDropdown',[
	{label:'Web', value: 'WEB'},
	{label:'FTP', value: 'FTP'}
	]);
exportChannelModule.constant('EXPORT_DATA_TYPE_DROPDOWN',[
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
exportChannelModule.constant('POSTFIX_DROPDOWN',[
	{label:'YYYYMMDDHHMM', value: 'yyyyMMddHHmm'}
	]);
exportChannelModule.constant('EXTENSION_DROPDOWN',[
	{label:'.txt', value: 'TXT'},
   	{label:'.csv', value: 'CSV'}
   	]);
exportChannelModule.controller('ExportChannelController', [
			'$log','$scope','$state','$stateParams','Service','ChannelDropdown','EXPORT_DATA_TYPE_DROPDOWN','FileLayoutService',
			'PageNavigation','UIFactory','blockUI','$q','$http','PROTOCOL_DROPDOWN','FREQUENCY_DROPDOWN','ngDialog',
			'POSTFIX_DROPDOWN','EXTENSION_DROPDOWN',
	function($log , $scope , $state , $stateParams , Service , ChannelDropdown , EXPORT_DATA_TYPE_DROPDOWN , FileLayoutService ,
			 PageNavigation , UIFactory , blockUI , $q , $http , PROTOCOL_DROPDOWN , FREQUENCY_DROPDOWN , ngDialog ,
			 POSTFIX_DROPDOWN , EXTENSION_DROPDOWN) {

      var vm = this;
      var channelId = $stateParams.channelId;
      var organizeId = $stateParams.organizeId;
      var BASE_URI = 'api/v1/organize-customers/' + organizeId;
      vm.channelModel = {};
      vm.productTypes = {};
      vm.fundings = {};
      vm.remoteFilenamePrefix = '';
      vm.dateTimePattern = '';
      vm.fileExtension = '';
      vm.runTimes = [];
      vm.runTime = undefined;
      var dayOfWeekFrequency = {
    			SUNDAY : 1,
    			MONDAY : 2,
    			TUESDAY : 3,
    			WEDNESDAY : 4,
    			THURSDAY : 5,
    			FRIDAY : 6,
    			SATURDAY : 7
      }
      
      vm.compareProductType = function(obj1, obj2){
          return obj1.productType === obj2.productType;
      };
      
      vm.haveProductType = false;
      vm.fileLayouts = [];
      vm.channelDropdown = ChannelDropdown;
      vm.exportDataTypeDropdown = EXPORT_DATA_TYPE_DROPDOWN;
      vm.fileProtocolDropdown = PROTOCOL_DROPDOWN;
      vm.filenamePostfixDropdown = POSTFIX_DROPDOWN;
      vm.fileExtensionDropdown = EXTENSION_DROPDOWN;
  	  vm.frequencyDropdown = FREQUENCY_DROPDOWN;
      $scope.errors = {};
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
      
      vm.addRuntime = function(time) {
    	 if(angular.isUndefined(time)) {
      		$scope.errors.runtime = {
    				message : 'Time is required.'
    		}
      	 } else if (vm.runTimes.indexOf(time) !== -1) {
    		$scope.errors.runtime = {
  				message : 'Time already exists.'
  			}
    	 } else {
    		vm.runTimes.push(time);
    	 } 
      };
      
      vm.deleteRuntime = function(item) { 
    	  var index = vm.runTimes.indexOf(item);
    	  vm.runTimes.splice(index, 1);     
      };
      
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
	    		} 
	            
	            if(response.data.runtimeType == null){
	            	vm.channelModel.runtimeType =  'INTERVAL';
				}
	            
	            if(vm.channelModel.channelType == 'FTP'){
					vm.isSetupFTP = true;
					vm.channelModel.fileProtocol = 'SFTP';
					
					var isNotHasJob = angular.isUndefined(response.data.jobInformation) || response.data.jobInformation == null || response.data.jobInformation.jobId == null;
					
					if(isNotHasJob){
						
						vm.channelModel.jobInformation = {
								jobId: undefined,
								jobName: organizeId+' Export Payment Result', 
								jobGroup: organizeId,
								suspend: false,
								triggerInformations:[],
								ftpDetail:{},
								jobData:{}								
						};
						
						vm.channelModel.filenamePattern = 'yyyyMMddHHmm';
						vm.channelModel.fileExtension = 'txt';
						vm.channelModel.jobInformation.ftpDetail.remotePort = '22';
						vm.channelModel.jobInformation.ftpDetail.encryptType = 'NONE';
						vm.channelModel.jobInformation.frequencyType = 'DAILY';
						vm.channelModel.monday = true;
						vm.channelModel.tuesday = true
						vm.channelModel.wednesday = true
						vm.channelModel.thursday = true
						vm.channelModel.friday = true
						vm.channelModel.saturday = true
						vm.channelModel.sunday = true
						
					} else {

						vm.channelModel.jobInformation.frequencyType = 'DAILY';
						
						var daysOfWeek = response.data.jobInformation.triggerInformations[0].daysOfWeek.replace("[","").replace("]","").split(",");
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
						
						if(vm.channelModel.runtimeType == 'INTERVAL'){
							var triggerInformation = response.data.jobInformation.triggerInformations[0];
							var hour = triggerInformation.startHour.length == 1 ? "0"+ triggerInformation.startHour : triggerInformation.startHour;
			 				var minute = triggerInformation.startMinute.length == 1 ? "0"+triggerInformation.startMinute : triggerInformation.startMinute;
							vm.channelModel.intervalBeginTime = hour + ':' + minute;
							
							hour = triggerInformation.endHour.length == 1 ? "0"+ triggerInformation.endHour : triggerInformation.endHour;
			 				minute = triggerInformation.endMinute.length == 1 ? "0"+triggerInformation.endMinute : triggerInformation.endMinute;
							vm.channelModel.intervalEndTime = hour + ':' + minute;
							vm.channelModel.delayedInterval = triggerInformation.intervalInMinutes;
						} else {
							if(response.data.jobInformation.triggerInformations.length > 0){
								console.log(response.data.jobInformation.triggerInformations);
								response.data.jobInformation.triggerInformations.forEach(function(data){
									if(data.startHour != null && data.startMinute != null){
						 				var hour = data.startHour.length == 1 ? "0"+data.startHour : data.startHour;
						 				var minute = data.startMinute.length == 1 ? "0"+data.startMinute : data.startMinute;
										var time = hour + ":" +minute;
						 				vm.runTimes.push(time);
									}
					 			});
							}
						}
					}
					
					vm.channelModel.filenamePattern = 'yyyyMMddHHmm';
					vm.channelModel.jobInformation.ftpDetail.remotePassword = null;
					vm.channelModel.jobInformation.ftpDetail.encryptPassword = null;
					
				}
  			});
      }
      
      vm.searchFileLayout = function(){
    	  var deffered = FileLayoutService.getFileLayouts(organizeId, 'EXPORT_DOCUMENT', 'EXPORT');
    	  deffered.promise.then(function(response){
    		  vm.fileLayouts = [];
    		  var _fileLayouts = response.data;
          	  if (angular.isDefined(_fileLayouts)) {
          		if (vm.channelModel.layoutConfigId == null){
       			 var pleaseSelectObj = {
                            label: '---Please select---',
                            value: null
                    }
	       			 vm.fileLayouts.push(pleaseSelectObj);
	       		 }				  
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
     
     vm.searchFundings = function(){
    	 var serviceDiferred = Service.doGet('api/v1/fundings');
         var failedFunc = function(response) {
             log.error('Load data error');
         };
         var successFunc = function(response) {
        	 vm.fundings = response.data;
         };
         serviceDiferred.promise.then(successFunc).catch(failedFunc);
     }

     var setupPrepareData = function(){
    	 if(vm.channelModel.channelType == 'FTP'){
 			var daysOfWeek = '';
 			if(vm.channelModel.sunday){
 				daysOfWeek += dayOfWeekFrequency.SUNDAY + ',';
 			}
 			if(vm.channelModel.monday){
 				daysOfWeek += dayOfWeekFrequency.MONDAY + ',';
 			}
 			if(vm.channelModel.tuesday){
 				daysOfWeek += dayOfWeekFrequency.TUESDAY + ',';
 			}
 			if(vm.channelModel.wednesday){
 				daysOfWeek += dayOfWeekFrequency.WEDNESDAY + ',';
 			}
 			if(vm.channelModel.thursday){
 				daysOfWeek += dayOfWeekFrequency.THURSDAY + ',';
 			}
 			if(vm.channelModel.friday){
 				daysOfWeek += dayOfWeekFrequency.FRIDAY + ',';
 			}
 			if(vm.channelModel.saturday){
 				daysOfWeek += dayOfWeekFrequency.SATURDAY + ',';
 			}
 			
 			vm.channelModel.jobInformation.daysOfWeek = daysOfWeek;
 			
 			if(vm.channelModel.runtimeType == 'INTERVAL'){
				var beginTime = '';
				var endTime = '';
				var triggerInformation = {};
				if(vm.channelModel.intervalBeginTime != null && vm.channelModel.intervalBeginTime != ''){
					beginTime = vm.channelModel.intervalBeginTime.split(":");
					triggerInformation.startHour = beginTime[0];
					triggerInformation.startMinute = beginTime[1];
				}
	
				if(vm.channelModel.intervalEndTime != null && vm.channelModel.intervalEndTime != ''){
					endTime = vm.channelModel.intervalEndTime.split(":");
					triggerInformation.endHour = endTime[0].toString();
					triggerInformation.endMinute = endTime[1].toString();
				}
				triggerInformation.intervalInMinutes = vm.channelModel.delayedInterval;
 				triggerInformation.daysOfWeek = daysOfWeek;
				
				vm.channelModel.jobInformation.triggerInformations = [];
				vm.channelModel.jobInformation.triggerInformations.push(triggerInformation);

			} else {
				daysOfWeek = daysOfWeek.substring(0,daysOfWeek.length-1);
	 			vm.channelModel.jobInformation.daysOfWeek = daysOfWeek;
				vm.channelModel.jobInformation.triggerInformations = [];
	 			vm.runTimes.forEach(function(data){
	 				var triggerInformation = {};
	 				var beginTime = data.split(":");
	 				triggerInformation.startHour = beginTime[0];
	 				triggerInformation.startMinute = beginTime[1];
	 				var endTime = parseInt(beginTime[1])+1 == 60 ? 0 : parseInt(beginTime[1])+1;
	 				var endHour = parseInt(beginTime[1])+1 == 60 ? parseInt(beginTime[0])+1 : parseInt(beginTime[0]);
	 				triggerInformation.endHour = endHour.toString();
	 				triggerInformation.endMinute = endTime.toString();
	 				triggerInformation.intervalInMinutes = 120;
	 				triggerInformation.daysOfWeek = daysOfWeek;
	 				
	 				vm.channelModel.jobInformation.triggerInformations.push(triggerInformation);
	 			});
			}
 			
 		}
 		if(!vm.isUseExpireDate){
 			vm.channelModel.expiryDate = null;
 		}
        if(vm.channelModel.exportDataType == 'ALL'){
            vm.channelModel.productTypes.length = 0;
        }
        if(vm.channelModel.suspend == false){
            vm.channelModel.status = 'ACTIVE';
        } else {
        	vm.channelModel.status = 'SUSPEND';
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

 		if(vm.channelModel.exportDataType == 'SPECIFIED'){
 			if(vm.channelModel.productTypes.length == 0){
 				isValid = false;
	 			$scope.errors.productTypes = {
	 					message : 'Product type is required.'
	 			}			
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
 		
 		if(vm.channelModel.channelType == 'FTP'){
 			vm.channelModel.jobInformation.suspend = vm.channelModel.suspend;
 			vm.channelModel.jobInformation.jobName = vm.channelModel.displayName;
 			vm.channelModel.jobInformation.jobType = 'UPLOAD_FTP_JOB';
			var jobInformation = vm.channelModel.jobInformation;
			var jobFtpDetail = vm.channelModel.jobInformation.ftpDetail;
			var jobData = vm.channelModel.jobInformation.jobData;
			
			if(jobFtpDetail.remoteHost == null || jobFtpDetail.remoteHost ==""){
				isValid = false;
				$scope.errors.hostName = {
					message : 'Host name is required.'
				}
			}

			if(jobFtpDetail.remotePort == null || jobFtpDetail.remotePort ==""){
				isValid = false;
				$scope.errors.portNumber = {
					message : 'Port number is required.'
				}
			}

			if(jobFtpDetail.remoteUsername == null || jobFtpDetail.remoteUsername == ""){
				isValid = false;
				$scope.errors.remoteUsername = {
					message : 'FTP user is required.'
				}
			}

			if(jobFtpDetail.remotePath == null || jobFtpDetail.remotePath == ""){
				isValid = false;
				$scope.errors.remoteDirectory = {
					message : 'Remote directory is required.'
				}
			}

			if(vm.channelModel.prefixFileName == null || vm.channelModel.prefixFileName == ""){
				isValid = false;
				$scope.errors.remoteFilenamePattern = {
					message : 'File name prefix is required.'
				}
			}
			
			if(vm.channelModel.fileExtension == null || vm.channelModel.fileExtension == ""){
				isValid = false;
				$scope.errors.remoteFilenamePattern = {
					message : 'File name extension is required.'
				}
			}

			if(jobInformation.daysOfWeek == null || jobInformation.daysOfWeek == ''){
				isValid = false;
				$scope.errors.daysOfWeek = {
					message : 'Frequency is required.'
				}
			}
			
			if($scope.createForm.beginTime.$error.pattern){
				isValid = false;
				$scope.errors.beginTime = {
					message : 'Wrong time format data.'
			    }

			}else if(jobInformation.triggerInformations[0].startHour == null || jobInformation.triggerInformations[0].startMinute == null){
				isValid = false;
				$scope.errors.beginTime = {
					message : 'Begin time is required.'
			    }
			}

			if($scope.createForm.endTime.$error.pattern){
				isValid = false;
				$scope.errors.endTime = {
					message : 'Wrong time format data.'
			    }

			}else if(jobInformation.triggerInformations[0].endHour == null || jobInformation.triggerInformations[0].endMinute == null){
				isValid = false;
				$scope.errors.endTime = {
					message : 'End time is required.'
			    }
			}

			if(jobInformation.triggerInformations[0].intervalInMinutes == null || jobInformation.triggerInformations[0].intervalInMinutes == ''){
				isValid = false;
				$scope.errors.intervalInMinutes = {
					message : 'Delayed interval (sec) is required.'
				}
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
    	console.log(vm.channelModel);
    	console.log(vm.runTimes);
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
		
		if(angular.isDefined(vm.channelModel.jobInformation) && angular.isDefined(vm.channelModel.jobInformation.ftpDetail.remoteUsername)){
			vm.username = vm.channelModel.jobInformation.ftpDetail.remoteUsername;
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
					vm.channelModel.jobInformation.ftpDetail.remoteUsername = value.username;
					vm.channelModel.jobInformation.ftpDetail.remotePassword = value.password;
				}
				return true;
			}
		});
	 }

	 vm.setupEncryptInfo = function(){
		vm.encryptType = null;
		vm.encryptPassword = null;
		vm.decryptPrivateKey = null;
			 
		if(angular.isDefined(vm.channelModel.jobInformation.ftpDetail.encryptType)){
			vm.encryptType = vm.channelModel.jobInformation.ftpDetail.encryptType;
		}
		
		if(angular.isDefined(vm.channelModel.jobInformation.ftpDetail.encryptPassword)){
			vm.encryptPassword = vm.channelModel.jobInformation.ftpDetail.encryptPassword;
		}
		
		if(angular.isDefined(vm.channelModel.jobInformation.ftpDetail.decryptPrivateKey)){
			vm.decryptPrivateKey = vm.channelModel.jobInformation.ftpDetail.decryptPrivateKey;
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
					vm.channelModel.jobInformation.ftpDetail.encryptType = value.encryptType;
					vm.channelModel.jobInformation.ftpDetail.encryptPassword = value.encryptPassword;
					vm.channelModel.jobInformation.ftpDetail.decryptPrivateKey = value.decryptPrivateKey;
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
	 
	 vm.changeExportData();
	 
	 vm.initLoad = function() {
	 	vm.searchFileLayout();
	 	vm.searchProductTypes();
	 	vm.searchFundings();
	 	vm.searchChannel();
	 	console.log(vm.channelModel.productTypes);
	 	console.log(vm.channelModel.fundings);
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
		 
//		 if(vm.encryptInfo.encryptType == 'PGP'){
//			 if(vm.encryptInfo.encryptPassword == null|| vm.encryptInfo.encryptPassword ==''){
//				 vm.showPasswordMessageError = true;
//				 vm.passwordMessageError = "PGP Password Require";
//				 isValid = false;
//			 }
//		 }
		 
		 if(isValid){
			 $scope.closeThisDialog(vm.encryptInfo);
		 }
	 }
} ]);