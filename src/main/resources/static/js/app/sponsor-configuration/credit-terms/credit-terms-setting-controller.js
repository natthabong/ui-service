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
app.constant('StartMonthTypeDropdown',[
	{label:'this month', value: 'CURRENT'},
	{label:'next month', value: 'NEXT'},
	{label:'previous month', value: 'PREVIOUS'}
	]);
app.constant('TermTypeDropdown',[
	{label:'days', value: 'DAY'},
	{label:'week(s)', value: 'WEEK'}
	]);

app.controller('CreditTermsSettingController', [ '$scope', 'ngDialog', 'DocumentDatePeriodDropdown', 
	'StartDayOfWeekDropdown', 'StartMonthTypeDropdown', 'TermTypeDropdown', 'SCFCommonService', 
	function($scope, ngDialog, DocumentDatePeriodDropdown, StartDayOfWeekDropdown, 
			StartMonthTypeDropdown, TermTypeDropdown, SCFCommonService) {
	var vm = this;
	vm.documentDateType = {
		'EVERY_DAY' : 'EVERY_DAY',
		'RANGE' : 'RANGE'
	};

	vm.startDateType = {
		'ON_DOCUMENT_DATE' : 'ON_DOCUMENT_DATE',
		'AFTER_DOCUMENT_DATE' : 'AFTER_DOCUMENT_DATE'
	};
	
	vm.periodType = {
		'SPECIFIC': 'SPECIFIC',
		'EVERY_PERIOD': 'EVERY_PERIOD'
	};

	vm.model = {
		creditterm : angular.copy($scope.ngDialogData.model)		
	}
	vm.paymentPeriods = angular.copy($scope.ngDialogData.paymentPeriods) || [];
	
	vm.editMode = $scope.ngDialogData.editMode;
	if (!vm.editMode) {
		var credittermModel = {
			paymentDateFormulaId : angular.copy($scope.ngDialogData.paymentDateFormulaId),
			documentDateType : vm.documentDateType.EVERY_DAY,
			startDateType: vm.startDateType.ON_DOCUMENT_DATE,
			documentDateStartPeriod: null,
			documentDateEndPeriod: null,
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

	vm.dateDropdown = DocumentDatePeriodDropdown;
	vm.startDayOfWeekDropdown = StartDayOfWeekDropdown;
	vm.startMonthTypeDropdown = StartMonthTypeDropdown;
	vm.termTypeDropdown = TermTypeDropdown;
	
	
	
	
} ]);