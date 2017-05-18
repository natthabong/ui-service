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
    
	vm.useStartDateActive = angular.copy($scope.ngDialogData.useStartDateActive);
	vm.useCreditTerm = angular.copy($scope.ngDialogData.useCreditTerm);
	vm.usePaymentPeriod = angular.copy($scope.ngDialogData.usePaymentPeriod);
	vm.model = {
		creditterm : angular.copy($scope.ngDialogData.model)		
	}
	vm.paymentPeriods = angular.copy($scope.ngDialogData.paymentPeriods) || [];
	vm.configCreditTerm = angular.copy($scope.ngDialogData.configCreditTerm);
	
	vm.isErrorMonth = false;
	vm.isErrorCreditTerm = false;
	vm.isFromDocumentDate = false;
	vm.isAfterDocumentDate = false;
	vm.channelDropdown = ChannelDropdown;
	
	vm.backToSponsorConfigPage = function(){
		PageNavigation.gotoPreviousPage();
	}
	
	var sendRequest = function(uri, succcesFunc, failedFunc) {
        var serviceDiferred = Service.doGet(BASE_URI + uri);

        var failedFunc = failedFunc | function(response) {
            log.error('Load data error');
        };
        serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
    }
	
	vm.initLoad = function() {
        sendRequest('/channels/' + selectedItem.channelId, function(response) {
            vm.channelModel = response.data;
        });
    }
	
	var validSave = function(){
		var isValid = true;
		vm.isErrorMonth = false;
		vm.isErrorCreditTerm = false;
		
		if(vm.useCreditTerm){
			if(parseInt(vm.model.creditterm.term) <= 0){
				vm.isErrorCreditTerm = true;
				isValid = false;
			}
		}
		
		if(vm.model.creditterm.startDateType !== 'ON_DOCUMENT_DATE'){
			if(vm.model.creditterm.startMonthType !== 'CURRENT'){
				if(parseInt(vm.model.creditterm.startNumberOfNextMonth) <= 0){
					vm.isErrorMonth = true;
					isValid = false;
		    	}
		    }
		}
		
		return isValid;
	}
	
	vm.saveChannel = function(creditterm){
		if(validSave()){
			UIFactory.showConfirmDialog({
				data : {
				    headerMessage : 'Confirm save?'
				},
				confirm : $scope.confirmSave,
				onSuccess : function(response) {
				    blockUI.stop();
				    creditTerm = response;
				    var headerMessage = 'Add new credit term code success';
				    if(vm.editMode){
				    	headerMessage = 'Edit credit term code success';
				    }

				    ngDialog.open({
						template : '/js/app/common/dialogs/simulator-payment-date.html',
						scope : $scope,
						className : 'ngdialog-theme-default',
						controller : 'SimulatorPaymentDateController',
						controllerAs : 'ctrl',
						scope : $scope,
						data : {
							headerMessage : headerMessage,
							sponsorId : sponsorId,
							creditTerm: creditTerm,
							showSuccessIcon : true
						},
						disableAnimation : true,
						preCloseCallback : function(value) {
							if (angular.isDefined(value)) {
								if(value!='OK'){
									vm.configCreditTerm(value);
								}
							}
							return true;
						}
					});
				},
				onFail : function(response) {
				    console.log(response);
				    	blockUI.stop();
					var msg = {
						409 : 'Credit term has been deleted.',
						405 : 'Credit term has been used.'
					};
					UIFactory.showFailDialog({
						data : {
							headerMessage : 'Update credit term failed.',
							bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback : callback
					});
				}
		    });
		}
	}	
	
	$scope.confirmSave = function() { 
		var BASE_URI = 'api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP';
		var serviceUrl = '', httpMethod = 'POST';	
		
		if(!vm.useCreditTerm){
			vm.model.creditterm.term = 0;
			vm.model.creditterm.termType = 'DAY';
	    }
	    
	    if(!vm.usePaymentPeriod){
	    	vm.model.creditterm.paymentPeriods = null;
	    	vm.model.creditterm.periodType = null;
	    }
	 
		if(vm.editMode){

			var serviceUrl = BASE_URI+'/payment-date-formulas/' + formulaId + '/credit-terms/'+vm.model.creditterm.creditTermId;
			var deffered = $q.defer();
			var serviceDiferred =  $http({
				method : 'PUT',
				url : serviceUrl,
				headers: {
					'If-Match' : vm.model.creditterm.version
				},
				data: vm.model.creditterm
			}).then(function(response) {
				deffered.resolve(response.data)
			}).catch(function(response) {
				deffered.reject(response);
			});
			return deffered;
			
		}else{
			serviceUrl = BASE_URI+'/payment-date-formulas/' + formulaId + '/credit-terms';
			var paymentPeroidDeferred = Service.requestURL(serviceUrl, vm.model.creditterm, httpMethod);
			return paymentPeroidDeferred;
			
		}
    }
	
	vm.initLoad = function() {
		vm.changeStartDateType();
	}

	vm.initLoad();
	
} ]);