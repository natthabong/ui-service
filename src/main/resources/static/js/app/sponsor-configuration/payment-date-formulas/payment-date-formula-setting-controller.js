var app = angular.module('scfApp');
app.constant('FORMULA_TYPE_ITEM', [{
    formulaTypeName: 'Credit term',
    formulaType: 'CREDIT_TERM'
}]);
app.controller('PaymentDateFormulaSettingController', [
		'SCFCommonService',
		'$log',
		'$scope',
		'$stateParams',
		'$timeout',
		'$rootScope',
		'PageNavigation',
		'Service',
		'FORMULA_TYPE_ITEM',
		function(SCFCommonService, $log, $scope, $stateParams, $timeout,$rootScope,
				PageNavigation, Service, FORMULA_TYPE_ITEM) {

			var vm = this;
			var log = $log;
			
			var sponsorId = $rootScope.sponsorId;
			
			var selectedItem = $stateParams.paymentDateFormulaModel;
			
			var BASE_URI = 'api/v1/organize-customers/' + sponsorId
			+ '/sponsor-configs/SFP';
			
			vm.formulaTypes = [];
			vm.model = {
			   formulaType: 'CREDIT_TERM'
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
                        label: obj.formulaTypeName,
                        value: obj.formulaType
                    }

                    vm.formulaTypes.push(selectObj);
                });
            }
			
			vm.initLoad = function() {
				loadTypes();
				if(selectedItem.paymentDateFormulaId){
					var reqDataUrl = '/payment-date-formulas/'+ selectedItem.paymentDateFormulaId;
					sendRequest(reqDataUrl, function(response) {
	                    vm.model = response.data;
	                });
				}
				
			}

			vm.initLoad();
			
			
			vm.backToSponsorConfigPage = function(){
				PageNavigation.gotoPreviousPage();
			}
			
			vm.save = function() {
    			var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/payment-date-formulas';
    			var serviceDiferred = Service.requestURL(serviceUrl, vm.model, 'PUT');
    			serviceDiferred.promise.then(function(response) {
    				vm.backToSponsorConfigPage();
				}); 
    			return promise;
    		};
			
		} ]);