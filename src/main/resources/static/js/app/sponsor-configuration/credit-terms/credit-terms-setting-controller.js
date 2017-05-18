var app = angular.module('scfApp');
app.constant('DocumentDatePeriodDropdown', [
	{label: '1st', value: '1'},
	{label: '2nd', value: '2'},
	{label: '3rd', value: '3'},
	{label: '4th', value: '4'},
	{label: '5th', value: '5'},
	{label: '6th', value: '6'},
	{label: '7th', value: '7'},
	{label: '8th', value: '8'},
	{label: '9th', value: '9'},
	{label: '10th', value: '10'},
	{label: '11th', value: '11'},
	{label: '12th', value: '12'},
	{label: '13th', value: '13'},
	{label: '14th', value: '14'},
	{label: '15th', value: '15'},
	{label: '16th', value: '16'},
	{label: '17th', value: '17'},
	{label: '18th', value: '18'},
	{label: '19th', value: '19'},
	{label: '20th', value: '20'},
	{label: '21st', value: '21'},
	{label: '22nd', value: '22'},
	{label: '23rd', value: '23'},
	{label: '24th', value: '24'},
	{label: '25th', value: '25'},
	{label: '26th', value: '26'},
	{label: '27th', value: '27'},
	{label: '28th', value: '28'},
	{label: '29th', value: '29'},
	{label: '30th', value: '30'},
	{label: '31st', value: '31'},
	{label: 'End of month', value: '99'}
]);
app.constant('StartDayOfWeekDropdown',[
	{label:'Monday', value: 'MONDAY'},
	{label:'Tuesday', value: 'TUESDAY'},
	{label:'Wednesday', value: 'WEDNESDAY'},
	{label:'Thursday', value: 'THURSDAY'},
	{label:'Friday', value: 'FRIDAY'},
	{label:'Saturday', value: 'SATURDAY'},
	{label:'Sunday', value: 'SUNDAY'}
	]);
app.constant('StartDateDropdown',[
	{label:'On document date', value: 'ON_DOCUMENT_DATE'},
	{label:'From document date', value: 'FROM_DOCUMENT_DATE'},
	{label:'After period of document date', value: 'AFTER_DOCUMENT_DATE'}
	]);
app.constant('StartMonthTypeDropdown',[
	{label:'this month', value: 'CURRENT'},
	{label:'next month', value: 'NEXT'},
	{label:'previous month', value: 'PREVIOUS'}
	]);
app.constant('TermTypeDropdown',[
	{label:'Day(s)', value: 'DAY'},
	{label:'Week(s)', value: 'WEEK'}
	]);

app.controller('CreditTermsSettingController', [ '$scope', 'ngDialog', 'DocumentDatePeriodDropdown', 'StartDateDropdown',
	'StartDayOfWeekDropdown', 'StartMonthTypeDropdown', 'TermTypeDropdown', 'SCFCommonService', 'UIFactory',
	'Service', 'blockUI', 'PageNavigation','$q','$http',
	function($scope, ngDialog, DocumentDatePeriodDropdown, StartDateDropdown, StartDayOfWeekDropdown, 
			StartMonthTypeDropdown, TermTypeDropdown, SCFCommonService, UIFactory, Service, blockUI, PageNavigation, $q, $http) {
	var vm = this;
	vm.documentDateType = {
		'EVERY_DAY' : 'EVERY_DAY',
		'RANGE' : 'RANGE'
	};
	
	vm.periodType = {
		'SPECIFIC': 'SPECIFIC',
		'EVERY_PERIOD': 'EVERY_PERIOD'
	};
	
	var sponsorId = angular.copy($scope.ngDialogData.sponsorId);
	var formulaId = angular.copy($scope.ngDialogData.paymentDateFormulaId);
	vm.useStartDateActive = angular.copy($scope.ngDialogData.useStartDateActive);
	vm.useCreditTerm = angular.copy($scope.ngDialogData.useCreditTerm);
	vm.usePaymentPeriod = angular.copy($scope.ngDialogData.usePaymentPeriod);
	vm.model = {
		creditterm : angular.copy($scope.ngDialogData.model)		
	}
	vm.paymentPeriods = angular.copy($scope.ngDialogData.paymentPeriods) || [];
	vm.configCreditTerm = angular.copy($scope.ngDialogData.configCreditTerm);
	
	vm.editMode = $scope.ngDialogData.editMode;
	if (!vm.editMode) {
		var credittermModel = {
			paymentDateFormulaId : formulaId,
			documentDateType : vm.documentDateType.EVERY_DAY,
			startDateType: StartDateDropdown[0].value,
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
		vm.model.creditterm = credittermModel;
	}
		
	vm.headerMsgLabel = vm.editMode == true ? 'Edit credit term code' : 'New credit term code';
	vm.isErrorMonth = false;
	vm.isErrorCreditTerm = false;
	vm.isFromDocumentDate = false;
	vm.isAfterDocumentDate = false;
	vm.dateDropdown = DocumentDatePeriodDropdown;
	vm.startDateDropdown = StartDateDropdown;
	vm.startDayOfWeekDropdown = StartDayOfWeekDropdown;
	vm.startMonthTypeDropdown = StartMonthTypeDropdown;
	vm.termTypeDropdown = TermTypeDropdown;
	
	vm.checkCreditTerm = function(){
	    if(vm.useCreditTerm){
	    	if(vm.model.creditterm.term == '0'){
	    		vm.model.creditterm.term = '2';
	    	}
	    }
	}
	
	vm.checkPaymentPeriod = function(){
		
	    if(vm.usePaymentPeriod){
	    	if(vm.model.creditterm.periodType == null){
	    		vm.model.creditterm.periodType = 'EVERY_PERIOD';
	    	}
	    }
	}
	
	vm.changeStartDateType = function(){
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
		vm.mode = 'NEW';
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
				mode : vm.mode,
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