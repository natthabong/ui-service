var app = angular.module('scfApp');

app.constant('OCCURRENCE_WEEK', [{
    occWeekName: 'First',
    occWeekId: 'FIRST'
}, {
	occWeekName: 'Second',
	occWeekId: 'SECOND'
}, {
	occWeekName: 'Third',
	occWeekId: 'THIRTH'
}, {
	occWeekName: 'Fourth',
	occWeekId: 'FOURTH'
}, {
	occWeekName: 'Last',
	occWeekId: 'LAST'
}, {
	occWeekName: 'Every',
	occWeekId: 'EVERY'
}]);

//app.controller('NewPaymentPeriodController', [
//		'SCFCommonService',
//		'$log',
//		'$scope',
//		'$stateParams',
//		'$timeout',
//		'$rootScope',
//		'PageNavigation',
//		'Service',
//		'OCCURRENCE_WEEK',
//		function(SCFCommonService, $log, $scope, $stateParams, $timeout, $rootScope,
//				PageNavigation, Service, OCCURRENCE_WEEK) {
//
//			var vm = this;
//			var log = $log;
//			
//			vm.model = angular.copy($scope.ngDialogData.record);
//			
//			var sponsorId = $rootScope.sponsorId;
//			
//			var BASE_URI = 'api/v1/organize-customers/' + sponsorId
//			+ '/sponsor-configs/SFP';
//
//			vm.periodType = {
//				everyDay : 'EVERY_DAY',
//				DateOfMonth : 'DATE_OF_MONTH',
//				dayOfWeek : 'DAY_OF_WEEK'
//			}
//
//			var loadOccurrenceWeek = function() {
//				OCCURRENCE_WEEK.forEach(function(obj) {
//                    var selectObj = {
//                        label: obj.occWeekName,
//                        value: obj.occWeekId
//                    }
//
//                    vm.occWeek.push(selectObj);
//                });
//            }
//			
//			vm.newPeriodDialogId = null;
//			
//    		vm.openNewPeriod = function(){
//            	
//	           	vm.period = {
//	           			sponsorId: sponsorId,
//	                	paymentDateFormulaId: paymentDateFormulaId,	
//	                	paymentPeriodType: 'EVERY_DAY',
//	                	dateOfMonth: '',
//	                	dayOfWeek: '',
//	                	occurrenceWeek: ''
//	            };
//	           	
//	           	 vm.newPeriodDialog = ngDialog.open({
//	                   id: 'new-period-dialog',
//	                   template: '/js/app/sponsor-configuration/file-layouts/dialog-new-period.html',
//	                   className: 'ngdialog-theme-default',
//	                   controller: 'NewPaymentPeriodController',
//	                   controllerAs: 'ctrl',
//	                   scope: $scope,
//	                   data: {
//	                	   period: vm.period
//	                   },
//	                   cache: false,
//	                   preCloseCallback: function(value) {
//	                   	vm.period = value;
//	                   	vm.refershOccWeekDropDown();
//	                   }
//	               });	
//	           	
//	           	vm.newPeriodDialogId = vm.newPeriodDialog.id;
//           };
//		} ]);
//
//app.controller('NewPaymentPeriodController', [ '$scope', '$rootScope','Service','ngDialog', function($scope, $rootScope, Service, ngDialog) {
//	var vm = this;
//
//	vm.period = angular.copy($scope.ngDialogData.period);
//	vm.sponsorId  = angular.copy($scope.ngDialogData.period.sponsorId);
//	vm.paymentDateFormulaId  = angular.copy($scope.ngDialogData.period.paymentDateFormulaId);
//	
//	vm.saveNewPeriod = function() {
//		var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/payment-date-formulas/'+paymentDateFormulaId+'/periods';
//		var serviceDiferred = Service.requestURL(serviceUrl, vm.period, 'POST');
//		serviceDiferred.promise.then(function(response) {
//			ngDialog.close('new-period-dialog',response);
//		}); 
//	};
//} ]);