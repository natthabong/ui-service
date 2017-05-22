var app = angular.module('scfApp');
app.constant('ChannelDropdown',[
	{label:'Web', value: 'WEB'},
	{label:'FTP', value: 'FTP'}
	]);
app.constant('PROTOCAL_DROPDOWN',[
	{label:'SFTP', value: 'SFTP'}
	]);
app.constant('POST_PROCESS_DROPDOWN',[
	{label:'None', value: 'None'},
	{label:'Delete', value: 'Delete'},
	{label:'Backup', value: 'Backup'}
	]);
app.constant('BACKUP_PATH_PATTERN_DROPDOWN',[
	{label:'/', value: '/'},
	{label:'/YYYYMMDD', value: '/YYYYMMDD'},
	{label:'/DDMMYYYY', value: '/DDMMYYYY'}
	]);
app.constant('FREQUENCY_DROPDOWN',[
	{label:'Daily', value: 'Daily'}
	]);
app.constant('ENCRYPT_TYPE_DROPDOWN',[
   	{label:'None', value: null},
   	{label:'PGP', value: 'PGP'}
   	]);
app.controller('ChannelSettingController', [ '$log', '$scope', '$state', '$stateParams', 'ngDialog', 
    'ChannelDropdown', '$rootScope', 'SCFCommonService', 'UIFactory', 'Service', 'blockUI', 'PageNavigation',
	'$q','$http','PROTOCAL_DROPDOWN','POST_PROCESS_DROPDOWN', 'BACKUP_PATH_PATTERN_DROPDOWN','FREQUENCY_DROPDOWN',
	function($log, $scope, $state, $stateParams, ngDialog, ChannelDropdown, $rootScope, SCFCommonService, 
			UIFactory, Service, blockUI, PageNavigation, $q, $http, PROTOCAL_DROPDOWN, POST_PROCESS_DROPDOWN, BACKUP_PATH_PATTERN_DROPDOWN, FREQUENCY_DROPDOWN) {
	var vm = this;
	
	vm.manageAll=false;
	
    var sponsorId = $rootScope.sponsorId;
    var selectedItem = $stateParams.selectedItem;
	
    var BASE_URI = 'api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP';
    
    vm.channelModel = {};
    $scope.errors = {};
	
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
	
	vm.fileProtocalDropdown = PROTOCAL_DROPDOWN;

	vm.postProcessDropdown = POST_PROCESS_DROPDOWN;

	vm.backupPathPatternDropdown = BACKUP_PATH_PATTERN_DROPDOWN;

	vm.frequencyDropdown = FREQUENCY_DROPDOWN;
	
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
	
	var validSave = function(){
		$scope.errors = {};
		var isValid = true;

		if (!angular.isDefined(vm.channelModel.activeDate)) {
			isValid = false;
		    $scope.errors.activeDate = {
	    		message : 'Wrong date format data.'
		    }
		}else if(vm.channelModel.activeDate == null|| vm.channelModel.activeDate ==''){
			isValid = false;
		    $scope.errors.activeDate = {
	    		message : 'Active date is required.'
		    }
		}
		
		if (vm.isUseExpireDate) {
		    if (!angular.isDefined(vm.channelModel.expiryDate)) {
		    	isValid = false;
				$scope.errors.activeDate = {
				    message : 'Wrong date format data.'
				}
		    } else if (angular.isDefined(vm.channelModel.activeDate)
				    && vm.channelModel.expiryDate < vm.channelModel.activeDate) {
		    	isValid = false;
				$scope.errors.activeDate = {
				    message : 'Active date must be less than or equal to expire date.'
				}
		    }else if(vm.channelModel.expiryDate == null|| vm.channelModel.expiryDate ==''){				    	
		    	isValid = false;
			    $scope.errors.activeDate = {
		    		message : 'Expire date is required.'
			    }
		    }

		}
		
		return isValid;
	}

	vm.saveChannel = function(){
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
						if(vm.channelModel.jobTrigger.jobDetail.encryptType == null || vm.channelModel.jobTrigger.jobDetail.encryptType == ''){
							vm.channelModel.jobTrigger.jobDetail.encryptType = 'None';
						}
						
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
		if(vm.channelModel.jobTrigger.jobDetail.encryptType == 'None'){
			vm.channelModel.jobTrigger.jobDetail.encryptType = null;
		}
		
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
            console.log(vm.channelModel);
            
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
			
			vm.channelModel.fileProtocal = 'SFTP';

			vm.channelModel.jobTrigger = {
				jobDetail: {
					encryptType: null,
					encryptPassword: null,
					decryptPrivateKey: null
				}
			}
			
            console.log(vm.channelModel);
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
					console.log('encryptType');
					console.log(value.encryptType);
					if(vm.channelModel.jobTrigger.jobDetail.encryptType == null || vm.channelModel.jobTrigger.jobDetail.encryptType == ''){
						vm.channelModel.jobTrigger.jobDetail.encryptType = 'None';
					}
					console.log(vm.channelModel.jobTrigger.jobDetail.encryptType);
					
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
	 console.log(vm.encryptType);
	 if(vm.encryptType == 'None'){
		 vm.encryptType = null;
	 }
	 
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