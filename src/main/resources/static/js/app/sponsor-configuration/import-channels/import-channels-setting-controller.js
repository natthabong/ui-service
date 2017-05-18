var app = angular.module('scfApp');
app.constant('ChannelDropdown',[
	{label:'Web', value: 'WEB'},
	{label:'FTP', value: 'FTP'}
	]);
app.controller('ChannelSettingController', [ '$log', '$scope', '$state', '$stateParams', 'ngDialog', 
    'ChannelDropdown', '$rootScope', 'SCFCommonService', 'UIFactory', 'Service', 'blockUI', 'PageNavigation','$q','$http',
	function($log, $scope, $state, $stateParams, ngDialog, ChannelDropdown, $rootScope, SCFCommonService, 
			UIFactory, Service, blockUI, PageNavigation, $q, $http) {
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
				$scope.errors.expiryDate = {
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
			    $scope.errors.expiryDate = {
		    		message : 'Expire date is required.'
			    }
		    }

		}
		
		return isValid;
	}
	
	var closeDialogFail = function(){
		dialogPopup.close();
	}
	
	vm.saveChannel = function(creditterm){
		if(validSave()){
			var preCloseCallback = function(confirm) {
				PageNavigation.gotoPreviousPage(true);
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
			    	blockUI.stop();
			    	dialogPopup = UIFactory.showFailDialog({
						data : {
							headerMessage : 'Update channel fail.',
							bodyMessage : 'Channel has been modified.'
						},
						buttons : [{
							id: 'close-button',
							label: 'Close',
							action:function(){
								closeDialogFail();
							}
						}],
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
        });
	}
	
	vm.initLoad = function() {
		vm.searchChannel();
    }
	
	vm.initLoad();
	
} ]);
scfApp.controller('TestConnectionResultController', [ '$scope', '$rootScope', function($scope, $rootScope) {
 var vm = this;
 vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
} ]);