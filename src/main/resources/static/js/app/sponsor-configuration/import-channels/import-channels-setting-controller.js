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
	{label:'/', value: 'None'},
	{label:'Delete', value: 'Delete'},
	{label:'Backup', value: 'Backup'}
	]);
app.constant('FREQUENCY_DROPDOWN',[
	{label:'Daily', value: 'Daily'}
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
    
    var channelModel = {};
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
        });
	}
	
	vm.viewSystemInfo = function(data){
		vm.userInfo = {
			username : data.remoteUsername,
			password : data.remotePassword
		}
		
		var userInfo = ngDialog.open({
			id : 'user-info-dialog',
			template : '/js/app/sponsor-configuration/import-channels/dialog-user-info.html',
			className : 'ngdialog-theme-default',
			controller: 'ViewServiceInformationController',
			controllerAs: 'ctrl',
			scope : $scope,
			data : {
			serviceInfo : vm.serviceInfo
			}
		});
	}
	
	vm.initLoad = function() {
		vm.searchChannel();
    }
	
	vm.initLoad();
	
} ]);
scfApp.controller('SetupFTPUserController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	 var vm = this;
	 vm.ftpUserInfo = angular.copy($scope.ngDialogData.ftpUserInfo);
} ]);