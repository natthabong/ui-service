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
	{label: '11st', value: '11'},
	{label: '12th', value: '12'},
	{label: '13rd', value: '13'},
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
app.controller('CreditTermsSettingController', [ '$scope', 'ngDialog', 'DocumentDatePeriodDropdown', function($scope, ngDialog, DocumentDatePeriodDropdown) {
	var vm = this;
	vm.documentDateType = {
		'EVERY_DAY' : 'EVERY_DAY',
		'RANGE' : 'RANGE'
	};

	vm.startDateType = {
		'ON_DOCUMENT_DATE' : 'ON_DOCUMENT_DATE',
		'AFTER_DOCUMENT_DATE' : 'AFTER_DOCUMENT_DATE'
	};

	vm.model = {
		creditterm : angular.copy($scope.ngDialogData.creditterm)
	}

	vm.editMode = $scope.ngDialogData.editMode;
	if (!vm.editMode) {
		var credittermModel = {
			paymentDateFormulaId : angular.copy($scope.ngDialogData.paymentDateFormulaId),
			documentDateType : vm.documentDateType.EVERY_DAY,
			startDateType: vm.startDateType.ON_DOCUMENT_DATE
		}

		vm.model.creditterm = credittermModel;
	}
	vm.headerMsgLabel = vm.editMode == true ? 'Edit credit term code' : 'New credit term code';

	vm.documentDatePeriodDropdown = DocumentDatePeriodDropdown;

} ]);