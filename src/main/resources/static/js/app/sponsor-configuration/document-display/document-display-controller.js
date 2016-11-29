angular
    .module('scfApp')
    .controller(
        'DocumentDisplayController', [
            '$log',
            '$scope',
            '$state',
            'SCFCommonService',
            '$stateParams',
            '$timeout',
            'ngDialog',
            'PageNavigation',
            'Service',
            '$q',
            '$rootScope',
            function($log, $scope, $state, SCFCommonService,
                $stateParams, $timeout, ngDialog,
                PageNavigation, Service, $q, $rootScope) {
            	
            	
                var vm = this;
                var log = $log;

                var sponsorId = $rootScope.sponsorId;
                var selectedItem = $stateParams.selectedItem;

                var BASE_URI = 'api/v1/organize-customers/'+ sponsorId +'/sponsor-configs/SFP';
                
                vm.dataModel = {
            	  displayName: null,
            	  items: [{
            		  documentField: null,
            		  sortType: null
            		  
            	  }]
                };
                
                vm.sortTypes = [   {
                	label: 'ASC',
                	value: 'ASC'
                }, {
                	label: 'DESC',
                	value: 'DESC'
                },{
                	label: '-',
                	value: null
                }]
                
                vm.documentFields = [{
                    value: null,
                    label: 'Please select'
                }];
                
                var sendRequest = function(uri, succcesFunc, failedFunc ){
                    var serviceDiferred = Service.doGet(BASE_URI + uri);

                    var successFunc = succcesFunc | function(response) {
                 	   vm.dataModel = response.data;
                    };
                    
                    var failedFunc = failedFunc | function(response) {
                        log.error('Load data error');
                    };
                    serviceDiferred.promise.then(successFunc).catch(failedFunc);
                }
                
                vm.setup = function(){
                	
                   sendRequest('/displays/' + selectedItem.documentDisplayId);
                   
                   sendRequest('/display-document-fields', function(response) {
                       response.data.forEach(function(obj) {
                           vm.documentFields.push(obj);
                       });
               	   });
                }
                
                vm.save = function(){
                	log.debug( vm.dataModel)
                }
                
                vm.setup();
            }
        ]);