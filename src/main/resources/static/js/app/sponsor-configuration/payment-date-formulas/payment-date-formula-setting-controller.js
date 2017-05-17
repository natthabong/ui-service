var app = angular.module('scfApp');
app.constant('FORMULA_TYPE_ITEM', [ {
	formulaTypeName : 'Credit term',
	formulaType : 'CREDIT_TERM'
} ]);
app.constant('PAGE_SIZE_ITEM', [ {
	label : '10',
	value : '10'
}, {
	label : '20',
	value : '20'
}, {
	label : '50',
	value : '50'
} ]);
app.constant('OCCURRENCE_WEEK', [ {
	occWeekName : 'First',
	occWeekId : 'FIRST'
}, {
	occWeekName : 'Second',
	occWeekId : 'SECOND'
}, {
	occWeekName : 'Third',
	occWeekId : 'THIRTH'
}, {
	occWeekName : 'Fourth',
	occWeekId : 'FOURTH'
}, {
	occWeekName : 'Last',
	occWeekId : 'LAST'
}, {
	occWeekName : 'Every',
	occWeekId : 'EVERY'
} ]);
app.constant('DAY_OF_WEEK', [ {
	dayOfWeekName : 'Monday',
	dayOfWeekId : 'MONDAY'
}, {
	dayOfWeekName : 'Tuesday',
	dayOfWeekId : 'TUESDAY'
}, {
	dayOfWeekName : 'Wednesday',
	dayOfWeekId : 'WEDNESDAY'
}, {
	dayOfWeekName : 'Thursday',
	dayOfWeekId : 'THURSDAY'
}, {
	dayOfWeekName : 'Friday',
	dayOfWeekId : 'FRIDAY'
} ]);
app.factory('DataTableFactory', [ '$q', '$http', '$sce', 'blockUI', function($q, $http, $sce, blockUI) {

	var create = function(config) {

		return {
			pageModel : {
				pageSizeSelectModel : '20',
				totalRecord : 0,
				currentPage : 0,
				clearSortOrder : false,
				page : 0,
				pageSize : 20
			},
			config : config
		}
	}

	return {
		create : create
	}

} ]);
app.controller('PaymentDateFormulaSettingController', [
	'SCFCommonService',
	'$log',
	'$scope',
	'$stateParams',
	'$timeout',
	'$rootScope',
	'PageNavigation',
	'Service',
	'$http',
	'blockUI',
	'ngDialog',
	'DataTableFactory',
	'FORMULA_TYPE_ITEM',
	'PAGE_SIZE_ITEM', '$q',
	function(SCFCommonService, $log, $scope, $stateParams, $timeout, $rootScope,
		PageNavigation, Service, $http, blockUI, ngDialog, DataTableFactory, FORMULA_TYPE_ITEM, PAGE_SIZE_ITEM, $q) {

		var vm = this;
		var log = $log;

		vm.manageAll=false;
		
		var sponsorId = $rootScope.sponsorId;

		var selectedItem = $stateParams.paymentDateFormulaModel;
		var formulaId = selectedItem.paymentDateFormulaId;

		var BASE_URI = 'api/v1/organize-customers/' + sponsorId
			+ '/sponsor-configs/SFP';

		vm.periodData = [];
		vm.creditTermData = [];

		vm.periodTable = DataTableFactory.create({
			options : {},
			columns : [ {
				fieldName : '$rowNo',
				labelEN : 'No.',
				cssTemplate : 'text-right'
			}, {
				labelEN : 'Period',
				idValueField : '$rowNo',
				id : 'payment-period-{value}',
				sortData : true,
				cssTemplate : 'text-left',
				cellTemplate : '{{data | period}}'
			}, {
				cssTemplate : 'text-center',
				sortData : false,
				cellTemplate : '<scf-button id="payment-period-{{data.paymentPeriodId}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.configPeriod(data)" title="Config a payment period" ng-disabled="!ctrl.manageAll"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
					'<scf-button id="payment-period-{{data.paymentPeriodId}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deletePeriod(data)" title="Delete  a payment period" ng-disabled="!ctrl.manageAll"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
			} ]
		});

		vm.creditTermTable = DataTableFactory.create({
			options : {},
			columns : [ {
				fieldName : '$rowNo',
				labelEN : 'No.',
				cssTemplate : 'text-right'
			}, {
				fieldName : 'creditTermCode',
				labelEN : 'Credit term code',
				idValueField : '$rowNo',
				id : 'credit-term-code-{value}',
				sortData : true,
				cssTemplate : 'text-left',
			}, {
				labelEN : 'Document date',
				idValueField : '$rowNo',
				id : 'document-date-{value}',
				sortData : true,
				cellTemplate : '{{data | documentDateRuleType}}',
				cssTemplate : 'text-left',
			},{
				labelEN : 'Formula',
				idValueField : '$rowNo',
				id : 'formula-{value}',
				sortData : true,
				cssTemplate : 'text-left',
				cellTemplate : '{{data | paymentDateFormula}}'
			}, {
				labelEN : 'Period',
				idValueField : '$rowNo',
				id : 'period-{value}',
				sortData : true,
				cssTemplate : 'text-left',
				cellTemplate : '{{data | paymentPeriod}}'
			}, {
				cssTemplate : 'text-center',
				sortData : false,
				cellTemplate : '<scf-button id="credit-term-{{data.creditTermId}}-simulate-button" class="btn-default gec-btn-action" ng-click="ctrl.simulatePaymentDate(data)" title="Simulate payment date" ><i class="fa fa-play-circle fa-lg" aria-hidden="true"></i></scf-button>'+
				'<scf-button id="credit-term-{{data.creditTermId}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.configCreditTerm(data)" title="Config a credit term" ng-disabled="!ctrl.manageAll"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
					'<scf-button id="credit-term-{{data.creditTermId}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteCreditTerm(data)" title="Delete a credit term" ng-disabled="!ctrl.manageAll"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
			} ]
		});

		vm.searchPeriod = function(pagingModel) {
			var serviceUrl = '/api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP/payment-date-formulas/' + formulaId + '/periods';
			
			if (pagingModel != undefined) {
				vm.periodTable.pageModel.pageSizeSelectModel = pagingModel.pageSize;
				vm.periodTable.pageModel.currentPage = pagingModel.page;
			}
			
			var serviceDiferred = Service.doGet(serviceUrl, {
				limit : vm.periodTable.pageModel.pageSizeSelectModel,
				offset : vm.periodTable.pageModel.currentPage
			});
			
			serviceDiferred.promise.then(function(response) {				
				vm.periodData = response.data;
				vm.periodTable.pageModel.totalRecord = response.headers('X-Total-Count');
				vm.periodTable.pageModel.totalPage = response.headers('X-Total-Page');
				vm.periodSplitePageTxt = SCFCommonService.splitePage(vm.periodTable.pageModel.pageSizeSelectModel, vm.periodTable.pageModel.currentPage, vm.periodTable.pageModel.totalRecord);
			}).catch(function(response) {
				log.error('Load payment period data error');
			});
		}

		vm.searchCreditTerm = function(pagingModel) {
			var serviceUrl = '/api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP/payment-date-formulas/' + formulaId + '/credit-terms';
			
			if (pagingModel != undefined) {
				vm.creditTermTable.pageModel.pageSizeSelectModel = pagingModel.pageSize;
				vm.creditTermTable.pageModel.currentPage = pagingModel.page;
			}
			
			var serviceDiferred = Service.doGet(serviceUrl, {
				limit : vm.creditTermTable.pageModel.pageSizeSelectModel,
				offset : vm.creditTermTable.pageModel.currentPage
			});

			serviceDiferred.promise.then(function(response) {
				vm.creditTermData = response.data;
				vm.creditTermTable.pageModel.totalRecord = response.headers('X-Total-Count');
				vm.creditTermTable.pageModel.totalPage = response.headers('X-Total-Page');
				vm.creditTermSplitePageTxt = SCFCommonService.splitePage(vm.creditTermTable.pageModel.pageSizeSelectModel, vm.creditTermTable.pageModel.currentPage, vm.creditTermTable.pageModel.totalRecord);
			}).catch(function(response) {
				log.error('Load payment period data error');
			});
		}

		vm.pageSizeList = PAGE_SIZE_ITEM;

		vm.formulaTypes = [];
		vm.model = {
			formulaType : 'CREDIT_TERM'
		}

		var sendRequest = function(uri, succcesFunc, failedFunc) {
			var serviceDiferred = Service.doGet(BASE_URI + uri);

			var failedFunc = failedFunc | function(response) {
				log.error('Load data error');
			};
			serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
		}

		var loadTypes = function() {
			FORMULA_TYPE_ITEM.forEach(function(obj) {
				var selectObj = {
					label : obj.formulaTypeName,
					value : obj.formulaType
				}

				vm.formulaTypes.push(selectObj);
			});
		}

		vm.initLoad = function() {
			loadTypes();
			if (selectedItem.paymentDateFormulaId) {
				var reqDataUrl = '/payment-date-formulas/' + formulaId;
				;
				sendRequest(reqDataUrl, function(response) {
					vm.model = response.data;

				});
				vm.searchCreditTerm();
				vm.searchPeriod();
			}

		}

		vm.initLoad();


		vm.backToSponsorConfigPage = function() {
			PageNavigation.gotoPreviousPage();
		}

		vm.save = function() {
			var serviceUrl = '/api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP/payment-date-formulas/' + formulaId;
			var serviceDiferred = Service.requestURL(serviceUrl, vm.model, 'PUT');
			blockUI.start();
			serviceDiferred.promise.then(function(response) {
				vm.backToSponsorConfigPage();
				blockUI.stop();
			});
		};
		
		var loadPaymentPeriod = function() {
			var diferred = $q.defer();
			var serviceUrl = '/api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP/payment-date-formulas/' + formulaId + '/periods';
			var serviceDiferred = Service.doGet(serviceUrl, {
				limit : 1000,
				offset : 0
			});

			serviceDiferred.promise.then(function(response) {
				diferred.resolve(response);
			});
			return diferred;
		}
		
		vm.configCreditTerm = function(creditTerm) {
			var editMode = angular.isDefined(creditTerm);

			var data = creditTerm || {
			};
			
			vm.useStartDateActive = true;
			vm.useCreditTerm = false;
			vm.usePaymentPeriod = false;

			var paymentPeriodsDeferred = loadPaymentPeriod();
			paymentPeriodsDeferred.promise.then(function(response) {
				if(angular.isDefined(data.term)){
					if(data.term!=0){
						vm.useCreditTerm = true;
					}
					if(data.periodType!=null){
						vm.usePaymentPeriod = true;
					}
				}

				ngDialog.open({
					template : '/js/app/sponsor-configuration/credit-terms/settings.html',
					scope : $scope,
					id: 'credit-term-dialog',
					controller : 'CreditTermsSettingController',
					controllerAs : 'ctrl',
					data : {
						model : data,
						editMode : editMode,
						paymentPeriods : response.data,
						paymentDateFormulaId : formulaId,
						sponsorId: sponsorId,
						useStartDateActive : vm.useStartDateActive,
						useCreditTerm : vm.useCreditTerm,
						usePaymentPeriod : vm.usePaymentPeriod,
						configCreditTerm: vm.configCreditTerm
					},
					disableAnimation : true,
					preCloseCallback : function(value) {
						vm.searchCreditTerm();
						vm.searchPeriod();
						return true;
					}
				});
			});
		};

		vm.deletePeriod = function(period) {
			ngDialog.open({
				template : '/js/app/common/dialogs/confirm-dialog.html',
				scope : $scope,
				data : period,
				disableAnimation : true,
				preCloseCallback : function(value) {
					if (value !== 0) {
						vm.confirmDeletePeriod(value);
					}
					return true;
				}
			});
		};

		vm.deleteCreditTerm = function(creditTerm) {
			ngDialog.open({
				template : '/js/app/common/dialogs/confirm-dialog.html',
				scope : $scope,
				data : creditTerm,
				disableAnimation : true,
				preCloseCallback : function(value) {
					if (value !== 0) {
						vm.confirmDeleteCreditTerm(value);
					}
					return true;
				}
			});
		};
		var failedFunc = function(reason) {
			blockUI.stop();
		}
		vm.confirmDeleteCreditTerm = function(creditTerm) {
			var serviceUrl = BASE_URI+'/payment-date-formulas/' + formulaId + '/credit-terms/'+creditTerm.creditTermId;		
			blockUI.start();			
			var serviceDiferred = $q.defer();
			$http({
				method : 'POST',
				url : serviceUrl,
				headers : {
					'If-Match' : creditTerm.version,
					'X-HTTP-Method-Override': 'DELETE'
				},
				data: creditTerm
			}).then(function(response) {
				return serviceDiferred.resolve(response);
			}).catch(function(response) {
				return serviceDiferred.reject(response);
			});
			
			serviceDiferred.promise.then(function(response) {
				vm.searchCreditTerm();
				blockUI.stop();
			}, failedFunc);
		};


		vm.confirmDeletePeriod = function(period) {						
			var serviceUrl = BASE_URI+'/payment-date-formulas/' + formulaId + '/periods/'+period.paymentPeriodId;
			blockUI.start();
			var serviceDiferred = $q.defer();
			$http({
				method : 'POST',
				url : serviceUrl,
				headers : {
					'If-Match' : period.version,
					'X-HTTP-Method-Override': 'DELETE'
				},
				data: period
			}).then(function(response) {
				return serviceDiferred.resolve(response);
			}).catch(function(response) {
				return serviceDiferred.reject(response);
			});			
			serviceDiferred.promise.then(function(response) {
				vm.searchPeriod();
				blockUI.stop();
			}, failedFunc);
		};

		vm.newPeriodDialogId = null;

		vm.configPeriod = function(data) {
			vm.headerMessage = 'New period';
			vm.period = {
				sponsorId : sponsorId,
				paymentDateFormulaId : formulaId,
				paymentPeriodType : 'EVERY_DAY',
				dateOfMonth : '',
				dayOfWeek : 'MONDAY',
				occurrenceWeek : 'FIRST'
			};

			if (data != null) {
				vm.headerMessage = 'Edit period';
				vm.period = {
					sponsorId : sponsorId,
					paymentPeriodId : data.paymentPeriodId,
					paymentDateFormulaId : formulaId,
					paymentPeriodType : data.paymentPeriodType,
					dateOfMonth : data.dateOfMonth,
					dayOfWeek : data.dayOfWeek != null ? data.dayOfWeek : 'MONDAY',
					occurrenceWeek : data.occurrenceWeek != null ? data.occurrenceWeek : 'FIRST'
				};
			}


			vm.newPeriodDialog = ngDialog.open({
				id : 'new-period-dialog',
				template : '/js/app/sponsor-configuration/periods/dialog-new-period.html',
				className : 'ngdialog-theme-default',
				controller : 'NewPaymentPeriodController',
				controllerAs : 'ctrl',
				scope : $scope,
				data : {
					period : vm.period,
					message : vm.headerMessage
				},
				cache : false,
				preCloseCallback : function(value) {
					vm.period = value;
					vm.refershPeriodsTable();
				}
			});

			vm.newPeriodDialogId = vm.newPeriodDialog.id;

			vm.refershPeriodsTable = function() {
				vm.searchPeriod();
			}
		};
		
		vm.pagingActionPaymentPeriod = function(pagingModel){
			
		};

		vm.simulatePaymentDate = function(data) {
			var systemInfo = ngDialog.open({
				id : 'service-information-dialog',
				template : '/js/app/common/dialogs/simulator-payment-date.html',
				className : 'ngdialog-theme-default',
				controller: 'SimulatorPaymentDateController',
				controllerAs: 'ctrl',
				scope : $scope,
				data : {
						sponsor: sponsorId,
						creditTerm : data,
						headerMessage : "Sponsor payment date simulation"
				},
				preCloseCallback : function(value) {
					if (angular.isDefined(value)) {
						vm.configCreditTerm(value);
					}
					return true;
				}
			});
		};

	} ]);

app.controller('NewPaymentPeriodController', [ '$scope', '$rootScope', 'Service', 'ngDialog', 'OCCURRENCE_WEEK', 'DAY_OF_WEEK', function($scope, $rootScope, Service, ngDialog, OCCURRENCE_WEEK, DAY_OF_WEEK) {
	var vm = this;

	vm.period = angular.copy($scope.ngDialogData.period);
	vm.sponsorId = angular.copy($scope.ngDialogData.period.sponsorId);
	vm.paymentDateFormulaId = angular.copy($scope.ngDialogData.period.paymentDateFormulaId);
	vm.headerMessage = angular.copy($scope.ngDialogData.message);

	vm.periodType = {
		everyDay : 'EVERY_DAY',
		DateOfMonth : 'DATE_OF_MONTH',
		dayOfWeek : 'DAY_OF_WEEK'
	}

	vm.occWeekTypes = [];
	var loadOccurrenceWeek = function() {
		OCCURRENCE_WEEK.forEach(function(obj) {
			var selectObj = {
				label : obj.occWeekName,
				value : obj.occWeekId
			}

			vm.occWeekTypes.push(selectObj);
		});
	}

	vm.dayOfWeekTypes = [];
	var loadDayOfWeek = function() {
		DAY_OF_WEEK.forEach(function(obj) {
            var selectObj = {
                label: obj.dayOfWeekName,
                value: obj.dayOfWeekId
            }

            vm.dayOfWeekTypes.push(selectObj);
        });
    }

	vm.initLoad = function() {
		loadOccurrenceWeek();
		loadDayOfWeek();
	}

	vm.initLoad();

	vm.saveNewPeriod = function() {
		if(vm.period.paymentPeriodType==='EVERY_DAY'){
			vm.period.dateOfMonth = null;
			vm.period.dayOfWeek = null;
			vm.period.occurrenceWeek = null;
		}else if(vm.period.paymentPeriodType==='DATE_OF_MONTH'){
			vm.period.dayOfWeek = null;
			vm.period.occurrenceWeek = null;
		}else if(vm.period.paymentPeriodType==='DAY_OF_WEEK'){
			vm.period.dateOfMonth = null;
		}
		
		var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/payment-date-formulas/'+vm.paymentDateFormulaId+'/periods';
		var method = 'POST';
		if(vm.period.paymentPeriodId!=null){
			serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/payment-date-formulas/'+vm.paymentDateFormulaId+'/periods/'+vm.period.paymentPeriodId;	
			method = 'PUT';
		}
		
		var serviceDiferred = Service.requestURL(serviceUrl, vm.period, method);
		serviceDiferred.promise.then(function(response) {
			ngDialog.close('new-period-dialog',response);
		}); 
	};
} ]);

app.controller('SimulatorPaymentDateController', [ '$scope', '$rootScope', 'PaymentDateFormulaSettingService', function($scope, $rootScope, PaymentDateFormulaSettingService) {
	var vm = this;
	vm.creditTerm = angular.copy($scope.ngDialogData.creditTerm);
	vm.headerMessage = angular.copy($scope.ngDialogData.headerMessage);
	var sponsor = angular.copy($scope.ngDialogData.sponsor);

	vm.paymentDate = null;

	vm.openCalendar = false;
	vm.selectDate = null;
	
	vm.openCalendarDate = function() {
		vm.openCalendar = true;
	}

	vm.simulate = function(){
		console.log(vm.selectDate)
	}
} ]);