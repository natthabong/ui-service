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
	
    var channelModel = {
		paymentDateFormulaId : channelId,
		channelType: ChannelDropdown[0].value,
		documentDateStartPeriod: DocumentDatePeriodDropdown[0].value,
		documentDateEndPeriod: DocumentDatePeriodDropdown[0].value,
		startDayOfWeek: null,
		startDateOfMonth: DocumentDatePeriodDropdown[0].value,
		startMonthType: StartMonthTypeDropdown[0].value,
		startNumberOfNextMonth: 0,
		term: 0,
		termType: TermTypeDropdown[0].value,
		periodType: vm.periodType.EVERY_PERIOD,
		paymentPeriods:[]
	}
    
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
	
	vm.changeChannelType = function(){
	    if(vm.model.creditterm.startDateType === 'ON_DOCUMENT_DATE'){
	    	vm.isFromDocumentDate = false;
	    	vm.isAfterDocumentDate = false;
	    }else if(vm.model.creditterm.startDateType === 'FROM_DOCUMENT_DATE'){
	    	vm.isFromDocumentDate = true;
	    	vm.isAfterDocumentDate = false;
	    }else if(vm.model.creditterm.startDateType === 'AFTER_DOCUMENT_DATE'){
	    	vm.isFromDocumentDate = false;
	    	vm.isAfterDocumentDate = true;
	    }
	}
	
	vm.changeMonth = function(){
	    if(vm.model.creditterm.startMonthType === 'CURRENT'){
	    	vm.model.creditterm.startNumberOfNextMonth = '0';
	    }else{
	    	if(vm.model.creditterm.startNumberOfNextMonth == '0'){
	    		vm.model.creditterm.startNumberOfNextMonth = '1';
	    	}
	    }
	}
	
	var loadPeriod = function(){
		vm.paymentPeriods = [];
		var serviceUrl = '/api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP/payment-date-formulas/' + formulaId + '/periods';
		var deffered = Service.doGet(serviceUrl);
        deffered.promise.then(function(response) {
        	response.data.forEach(function(obj) {
    			vm.paymentPeriods.push(obj);
		    });
		        	
		}).catch(function(response) {
		    log.error('Get period fail');
		});	
	}
	
	vm.configPeriod = function(callback){
		vm.headerMessage = 'New payment period';
		vm.period = {
			sponsorId : sponsorId,
			paymentDateFormulaId : formulaId,
			paymentPeriodType : 'DATE_OF_MONTH',
			dateOfMonth : '1',
			dayOfWeek : 'MONDAY',
			occurrenceWeek : 'FIRST'
		};
		
		vm.newPeriodDialog = ngDialog.open({
			id : 'new-period-dialog',
			template : '/js/app/sponsor-configuration/periods/dialog-new-period.html',
			className : 'ngdialog-theme-default',
			controller : 'NewPaymentPeriodController',
			controllerAs : 'ctrl',
			scope : $scope,
			data : {
				period : vm.period,
				message : vm.headerMessage,
				callback : callback
			},
			cache : false,
			preCloseCallback : function(value) {
				if(value != 0){
					loadPeriod();
				}
			}
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
	
	vm.saveCreditterm = function(creditterm, callback){
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
								callback();
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