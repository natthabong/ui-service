var importChannelModule = angular.module('gecscf.organize.configuration.channel.import');
importChannelModule.constant('ChannelDropdown',[
	{label:'Web', value: 'WEB'},
	{label:'FTP', value: 'FTP'}
	]);
importChannelModule.constant('PROTOCOL_DROPDOWN',[
	{label:'SFTP', value: 'SFTP'}
	]);
importChannelModule.constant('POST_PROCESS_DROPDOWN',[
	{label:'None', value: 'NONE'},
	{label:'Delete', value: 'DELETE'},
	{label:'Backup', value: 'BACKUP'}
	]);
importChannelModule.constant('BACKUP_PATH_PATTERN_DROPDOWN',[
	{label:'/', value: '/'},
	{label:'/YYYYMMDD', value: '/YYYYMMdd'},
	{label:'/DDMMYYYY', value: '/ddMMYYYY'}
	]);
importChannelModule.constant('FREQUENCY_DROPDOWN',[
	{label:'Daily', value: 'DAILY'}
	]);
importChannelModule.constant('ENCRYPT_TYPE_DROPDOWN',[
   	{label:'None', value: 'NONE'},
   	{label:'PGP', value: 'PGP'}
   	]);
importChannelModule.controller('ImportChannelController', [ '$log', '$scope', '$state', 'ngDialog', 
    'ChannelDropdown', '$rootScope', 'SCFCommonService', 'UIFactory', 'Service', 'blockUI', 'PageNavigation',
	'FileLayoutService', '$q','$http','PROTOCOL_DROPDOWN','POST_PROCESS_DROPDOWN', 'BACKUP_PATH_PATTERN_DROPDOWN','FREQUENCY_DROPDOWN',
	function($log, $scope, $state, ngDialog, ChannelDropdown, $rootScope, SCFCommonService, 
			UIFactory, Service, blockUI, PageNavigation, FileLayoutService, $q, $http, PROTOCOL_DROPDOWN, POST_PROCESS_DROPDOWN, BACKUP_PATH_PATTERN_DROPDOWN, FREQUENCY_DROPDOWN) {
	var vm = this;
	
	vm.manageAll=false;
	vm.postProcessBackup = false;
	var dayOfWeekFrequency = {
		SUNDAY : 1,
		MONDAY : 2,
		TUESDAY : 3,
		WEDNESDAY : 4,
		THURSDAY : 5,
		FRIDAY : 6,
		SATURDAY : 7
	}
	
	var parameters = PageNavigation.getParameters();
    var organizeId = parameters.organizeId;
    vm.isSetupFTP = false;
    vm.runTimes = [];
    vm.runTime = undefined;
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
    
    vm.fundings = [];
	vm.searchFundings = function(){
		 var deffered = FileLayoutService.getFundings();
		 deffered.promise.then(function(response){
			 vm.fundings = [];
        	 var _fundings = response.data;
        	 if (angular.isDefined(_fundings)) {
        		 _fundings.forEach(function (fundings) {
                    vm.fundings.push(fundings);
                 });
        	  }
		 });
		
	};
    
    vm.fileLayouts = [];
	vm.searchFileLayout = function(){
		 var deffered = FileLayoutService.getFileLayouts(organizeId, parameters.processType, 'IMPORT');
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
	
	
	
    var BASE_URI = 'api/v1/organize-customers/' + organizeId + '/process-types/'+ parameters.processType;
    
    vm.channelModel = {};
    $scope.errors = {};
	$scope.timeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
	
    vm.openActiveDate = false;
    vm.openCalendarActiveDate = function() {
    	vm.openActiveDate = true;
    };
    
    vm.openExpireDate = false;
    vm.openCalendarExpireDate = function() {
    	vm.openExpireDate = true;
    };
    vm.isUseExpireDate = false;
    
	vm.channelDropdown = ChannelDropdown;
	
	vm.fileProtocolDropdown = PROTOCOL_DROPDOWN;

	vm.postProcessDropdown = POST_PROCESS_DROPDOWN;

	vm.backupPathPatternDropdown = BACKUP_PATH_PATTERN_DROPDOWN;

	vm.frequencyDropdown = FREQUENCY_DROPDOWN;

	vm.changePostProcess = function() {
		if (vm.channelModel.jobInformation.ftpDetail.postProcessType == 'BACKUP') {
			vm.postProcessBackup = true;
		} else {
			vm.postProcessBackup = false;
			vm.channelModel.jobInformation.ftpDetail.remoteBackupFolderPattern = '/';
		}
	}
	
	vm.backToSponsorConfigPage = function(){
		 PageNavigation.gotoPage('/sponsor-configuration',  {
	        	organizeId:  organizeId
	     });
	}
	
	var isRequire = function(data) {
		return (data == '' || data == null);
    }
	
	var sendRequest = function(uri, succcesFunc, failedFunc) {
        var serviceDiferred = Service.doGet(BASE_URI + uri);

        var failedFunc = failedFunc | function(response) {
            log.error('Load data error');
        };
        serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
    }

	var formattedNumber = function(data) {
		return ("0" + data).slice(-2);
	}

	var setupPrepareData = function(){
		if(vm.channelModel.channelType == 'FTP'){
			vm.channelModel.jobInformation.suspend = vm.channelModel.suspend;
			
			vm.channelModel.jobInformation.startHour = null;
			vm.channelModel.jobInformation.startMinute = null;
			vm.channelModel.jobInformation.endHour = null;
			vm.channelModel.jobInformation.endMinute = null;

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
			
			if(vm.channelModel.runtimeType == 'INTERVAL'){
				vm.channelModel.jobInformation.triggerInformations[0].daysOfWeek = daysOfWeek.replace("[","").replace("]","");
				if(vm.channelModel.beginTime != null && vm.channelModel.beginTime != ''){
					var beginTime = vm.channelModel.beginTime.split(":");
					vm.channelModel.jobInformation.triggerInformations[0].startHour = beginTime[0];
					vm.channelModel.jobInformation.triggerInformations[0].startMinute = beginTime[1];
				}
	
				if(vm.channelModel.endTime != null && vm.channelModel.endTime != ''){
					var endTime = vm.channelModel.endTime.split(":");
					vm.channelModel.jobInformation.triggerInformations[0].endHour = endTime[0];
					vm.channelModel.jobInformation.triggerInformations[0].endMinute = endTime[1];
				}
				vm.channelModel.jobInformation.triggerInformations[0].daysOfWeek = daysOfWeek;
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
		
		if (parameters.processType == 'AR_DOCUMENT'){
			if(vm.channelModel.layoutConfigId == null || vm.channelModel.layoutConfigId ==""){
				isValid = false;
				$scope.errors.layout = {
						message : 'File layout is required.'
				}			
			}
		}

		if(vm.channelModel.channelType == 'FTP'){
			vm.channelModel.jobInformation.frequencyType = 'DAILY';
			var jobInformation = vm.channelModel.jobInformation;
			var ftpDetail = vm.channelModel.jobInformation.ftpDetail;
			
			if(ftpDetail.remoteHost == null || ftpDetail.remoteHost ==""){
				isValid = false;
				$scope.errors.hostName = {
					message : 'Host name is required.'
				}
			}

			if(ftpDetail.remotePort == null || ftpDetail.remotePort ==""){
				isValid = false;
				$scope.errors.portNumber = {
					message : 'Port number is required.'
				}
			}

			if(ftpDetail.remoteUsername == null || ftpDetail.remoteUsername == ""){
				isValid = false;
				$scope.errors.remoteUsername = {
					message : 'FTP user is required.'
				}
			}

			if(ftpDetail.remotePath == null || ftpDetail.remotePath == ""){
				isValid = false;
				$scope.errors.remoteDirectory = {
					message : 'Remote directory is required.'
				}
			}

			if(ftpDetail.remoteFilenamePattern == null || ftpDetail.remoteFilenamePattern == ""){
				isValid = false;
				$scope.errors.remoteFilenamePattern = {
					message : 'File name pattern is required.'
				}
			}

			if(ftpDetail.limitedFileSize == null || ftpDetail.limitedFileSize == ""){
				isValid = false;
				$scope.errors.limitedFileSize = {
					message : 'Limited file size (MB) is required.'
				}
			}

			if(ftpDetail.connectionRetry == null || ftpDetail.connectionRetry == ""){
				isValid = false;
				$scope.errors.connectionRetry = {
					message : 'Retry is required.'
				}
			}

			if(ftpDetail.connectionRetryInterval == null || ftpDetail.connectionRetryInterval == ""){
				isValid = false;
				$scope.errors.connectionRetryInterval = {
					message : 'Delayed interval (sec) is required.'
				}
			}

			if(vm.postProcessBackup && (ftpDetail.remoteBackupPath == null || ftpDetail.remoteBackupPath == "")){
				isValid = false;
				$scope.errors.remoteBackupPath = {
					message : 'Remote backup directory is required.'
				}
			}

			if(jobInformation.triggerInformations[0].daysOfWeek == null || jobInformation.triggerInformations[0].daysOfWeek == ''){
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
	
	$scope.confirmSave = function() {
		console.log(vm.channelModel);
		if(vm.channelModel.channelType == 'FTP'){
			
			vm.channelModel.jobInformation.ownerId = parameters.organizeId;
		}

		var serviceUrl = BASE_URI+'/channels/' + vm.channelModel.channelId;
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

	vm.searchChannel = function(){
		sendRequest('/channels/' + parameters.channelId, function(response) {
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
							ftpDetail:{
								remotePort: '22',
								remoteFilenamePattern: '*.*',
								limitedFileSize: '5',
								encryptType : 'NONE',
								connectionRetry: '3',
								connectionRetryInterval: '60',
								postProcessType: 'NONE',
								remoteBackupPath: '/backup',
								remoteBackupFolderPattern : '/'
							},
							jobData:{}								
					};			
					
	 				var triggerInformation = {};
	 				vm.channelModel.jobInformation.triggerInformations.push(triggerInformation);
				}

				vm.channelModel.jobInformation.jobType = 'DOWNLOAD_FTP_JOB';
				
				if(response.data.jobInformation.ftpDetail.postProcessType == 'BACKUP'){
					vm.postProcessBackup = true;
				}

				if(response.data.jobInformation.frequencyType == null){
					vm.channelModel.jobInformation.frequencyType = 'DAILY';
				}

				if(response.data.jobInformation.triggerInformations[0].intervalInMinutes == null){
					vm.channelModel.jobInformation.triggerInformations[0].intervalInMinutes = '300';
				}else{
					vm.channelModel.intervalInMinutes = response.data.jobInformation.triggerInformations[0].intervalInMinutes;
				}
				
				if(response.data.jobInformation.triggerInformations[0].daysOfWeek == null || response.data.jobInformation.triggerInformations[0].daysOfWeek == ''){
					vm.channelModel.monday = true;
					vm.channelModel.tuesday = true
					vm.channelModel.wednesday = true
					vm.channelModel.thursday = true
					vm.channelModel.friday = true
					vm.channelModel.saturday = true
					vm.channelModel.sunday = true

				}else {

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
				}

				if(response.data.jobInformation.triggerInformations[0].startHour == null || response.data.jobInformation.triggerInformations[0].startMinute == null){
					vm.channelModel.beginTime = "00:00";
				}else{
					vm.channelModel.beginTime = formattedNumber(response.data.jobInformation.triggerInformations[0].startHour) + ":" + formattedNumber(response.data.jobInformation.triggerInformations[0].startMinute);
				}	

				if(response.data.jobInformation.triggerInformations[0].endHour == null || response.data.jobInformation.triggerInformations[0].endMinute == null){
					vm.channelModel.endTime = "23:59";

				}else{
					vm.channelModel.endTime = formattedNumber(response.data.jobInformation.triggerInformations[0].endHour) + ":"+ formattedNumber(response.data.jobInformation.triggerInformations[0].endMinute);
				}	

				response.data.jobInformation.ftpDetail.remotePassword = null;
				response.data.jobInformation.ftpDetail.encryptPassword = null;

			}
        });
	}
	
	vm.setupUserInfo = function(){
		vm.username = '';
		
		if(angular.isDefined(vm.channelModel.jobInformation) && angular.isDefined(vm.channelModel.jobInformation.ftpDetail.remoteUsername)){
			vm.username = vm.channelModel.jobInformation.ftpDetail.remoteUsername;
		}
		
		var userInfo = ngDialog.open({
			id : 'user-info-dialog',
			template : '/js/app/modules/organize/configuration/channel/import/dialog-user-info.html',
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
			template : '/js/app/modules/organize/configuration/channel/import/dialog-encrypt-info.html',
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
	
	vm.initLoad = function() {
		vm.searchChannel();
		vm.searchFileLayout();
		vm.searchFundings();
    }();
	
	
} ]);
importChannelModule.controller('SetupFTPUserController', [ '$scope', '$rootScope', function($scope, $rootScope) {
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
importChannelModule.controller('SetupFileEncryptionController', [ '$scope', '$rootScope', 'ENCRYPT_TYPE_DROPDOWN', function($scope, $rootScope, ENCRYPT_TYPE_DROPDOWN) {
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