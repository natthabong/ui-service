var app = angular.module('scfApp');
app.constant('ChannelDropdown',[
	{label:'Web', value: 'WEB'},
	{label:'FTP', value: 'FTP'}
	]);
app.constant('PROTOCOL_DROPDOWN',[
	{label:'SFTP', value: 'SFTP'}
	]);
app.constant('POST_PROCESS_DROPDOWN',[
	{label:'None', value: 'NONE'},
	{label:'Delete', value: 'DELETE'},
	{label:'Backup', value: 'BACKUP'}
	]);
app.constant('BACKUP_PATH_PATTERN_DROPDOWN',[
	{label:'/', value: '/'},
	{label:'/YYYYMMDD', value: '/YYYYMMdd'},
	{label:'/DDMMYYYY', value: '/ddMMYYYY'}
	]);
app.constant('FREQUENCY_DROPDOWN',[
	{label:'Daily', value: 'DAILY'}
	]);
app.constant('ENCRYPT_TYPE_DROPDOWN',[
   	{label:'None', value: 'NONE'},
   	{label:'PGP', value: 'PGP'}
   	]);
app.controller('ChannelSettingController', [ '$log', '$scope', '$state', '$stateParams', 'ngDialog', 
    'ChannelDropdown', '$rootScope', 'SCFCommonService', 'UIFactory', 'Service', 'blockUI', 'PageNavigation',
	'$q','$http','PROTOCOL_DROPDOWN','POST_PROCESS_DROPDOWN', 'BACKUP_PATH_PATTERN_DROPDOWN','FREQUENCY_DROPDOWN',
	function($log, $scope, $state, $stateParams, ngDialog, ChannelDropdown, $rootScope, SCFCommonService, 
			UIFactory, Service, blockUI, PageNavigation, $q, $http, PROTOCOL_DROPDOWN, POST_PROCESS_DROPDOWN, BACKUP_PATH_PATTERN_DROPDOWN, FREQUENCY_DROPDOWN) {
	var vm = this;
	
	vm.manageAll=false;
	vm.isSetupFTP = false;
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
	
    var sponsorId = $rootScope.sponsorId;
    var selectedItem = $stateParams.selectedItem;
	
	if(selectedItem.channelType == 'FTP'){
		vm.isSetupFTP = true;
	}
	
    var BASE_URI = 'api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP';
    
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
		if(vm.channelModel.jobTrigger.jobDetail.postProcessType == 'BACKUP'){
			vm.postProcessBackup = true;
		}else{
			vm.postProcessBackup = false;
			vm.channelModel.jobTrigger.jobDetail.remoteBackupFolderPattern = '/';
		}
	}
	
	vm.backToSponsorConfigPage = function(){
		PageNavigation.gotoPreviousPage();
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

	var formattedNumber = function(data){
		return ("0" + data).slice(-2);
	}

	var setupPrepareFTPData = function(){
		if(vm.isSetupFTP){
			vm.channelModel.jobTrigger.startHour = null;
			vm.channelModel.jobTrigger.startMinute = null;
			vm.channelModel.jobTrigger.endHour = null;
			vm.channelModel.jobTrigger.endMinute = null;

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
			daysOfWeek = daysOfWeek.substring(0,daysOfWeek.length-1);
			vm.channelModel.jobTrigger.daysOfWeek = daysOfWeek;

			if(vm.channelModel.beginTime != null && vm.channelModel.beginTime != ''){
				var beginTime = vm.channelModel.beginTime.split(":");
				vm.channelModel.jobTrigger.startHour = beginTime[0];
				vm.channelModel.jobTrigger.startMinute = beginTime[1];
			}

			if(vm.channelModel.endTime != null && vm.channelModel.endTime != ''){
				var endTime = vm.channelModel.endTime.split(":");
				vm.channelModel.jobTrigger.endHour = endTime[0];
				vm.channelModel.jobTrigger.endMinute = endTime[1];
			}

		}
	}
	
	var validSave = function(){
		$scope.errors = {};
		var isValid = true;
		var channel = vm.channelModel;
		var jobTrigger = vm.channelModel.jobTrigger;
		var jobDetail = vm.channelModel.jobTrigger.jobDetail;

		if(vm.isSetupFTP){

			if(jobDetail.remoteHost == null || jobDetail.remoteHost ==""){
				isValid = false;
				$scope.errors.hostName = {
					message : 'Host name is required.'
				}
			}

			if(jobDetail.remotePort == null || jobDetail.remotePort ==""){
				isValid = false;
				$scope.errors.portNumber = {
					message : 'Port number is required.'
				}
			}

			if(jobDetail.remoteUsername == null || jobDetail.remoteUsername == ""){
				isValid = false;
				$scope.errors.remoteUsername = {
					message : 'FTP user is required.'
				}
			}

			if(jobDetail.remotePath == null || jobDetail.remotePath == ""){
				isValid = false;
				$scope.errors.remoteDirectory = {
					message : 'Remote directory is required.'
				}
			}

			if(jobDetail.remoteFilenamePattern == null || jobDetail.remoteFilenamePattern == ""){
				isValid = false;
				$scope.errors.remoteFilenamePattern = {
					message : 'File name pattern is required.'
				}
			}

			if(jobDetail.limitedFileSize == null || jobDetail.limitedFileSize == ""){
				isValid = false;
				$scope.errors.limitedFileSize = {
					message : 'Limited file size (MB) is required.'
				}
			}

			if(jobDetail.connectionRetry == null || jobDetail.connectionRetry == ""){
				isValid = false;
				$scope.errors.connectionRetry = {
					message : 'Retry is required.'
				}
			}

			if(jobDetail.connectionRetryInterval == null || jobDetail.connectionRetryInterval == ""){
				isValid = false;
				$scope.errors.connectionRetryInterval = {
					message : 'Delayed interval (sec) is required.'
				}
			}

			if(vm.postProcessBackup && (jobDetail.remoteBackupPath == null || jobDetail.remoteBackupPath == "")){
				isValid = false;
				$scope.errors.remoteBackupPath = {
					message : 'Remote backup directory is required.'
				}
			}

			if(jobTrigger.daysOfWeek == null || jobTrigger.daysOfWeek == ''){
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

			}else if(jobTrigger.startHour == null || jobTrigger.startMinute == null){
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

			}else if(jobTrigger.endHour == null || jobTrigger.endMinute == null){
				isValid = false;
				$scope.errors.endTime = {
					message : 'End time is required.'
			    }
			}

			if(jobTrigger.intervalInMinutes == null || jobTrigger.intervalInMinutes == ''){
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
		setupPrepareFTPData();
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
							headerMessage : 'Update channel success.',
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
							headerMessage : 'Update channel failed.',
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
		vm.channelModel.jobTrigger.ownerId = selectedItem.organizeId;

		var serviceUrl = BASE_URI+'/channels/' + vm.channelModel.channelId;
		var deffered = $q.defer();
		var serviceDiferred =  $http({
			method : 'PUT',
			url : serviceUrl,
			headers: {
				'If-Match' : vm.channelModel.version
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
		sendRequest('/channels/' + selectedItem.channelId, function(response) {
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
			
			if(vm.isSetupFTP){
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
	
	vm.setupUserInfo = function(){
		vm.username = '';
		
		if(angular.isDefined(vm.channelModel.jobTrigger.jobDetail.remoteUsername)){
			vm.username = vm.channelModel.jobTrigger.jobDetail.remoteUsername;
		}
		
		var userInfo = ngDialog.open({
			id : 'user-info-dialog',
			template : '/js/app/sponsor-configuration/import-channels/dialog-user-info.html',
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
			template : '/js/app/sponsor-configuration/import-channels/dialog-encrypt-info.html',
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
	
	vm.initLoad = function() {
		vm.searchChannel();
    }
	
	vm.initLoad();
	
} ]);
app.controller('SetupFTPUserController', [ '$scope', '$rootScope', function($scope, $rootScope) {
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
app.controller('SetupFileEncryptionController', [ '$scope', '$rootScope', 'ENCRYPT_TYPE_DROPDOWN', function($scope, $rootScope, ENCRYPT_TYPE_DROPDOWN) {
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