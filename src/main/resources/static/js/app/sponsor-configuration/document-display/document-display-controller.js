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

                    var failedFunc = failedFunc | function(response) {
                        log.error('Load data error');
                    };
                    serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
                }
                
                vm.setup = function(){
                	
                   sendRequest('/displays/' + selectedItem.documentDisplayId, function(response) {
                	   vm.dataModel = response.data;
                	   if(vm.dataModel.items.length < 1){
                		   vm.addItem();
                	   }
               	   });
                   
                   sendRequest('/display-document-fields', function(response) {
                       response.data.forEach(function(obj) {
                    	   var item =  {
                               value: obj.docFieldName,
                               label: obj.displayName
                           };
                           vm.documentFields.push(item);
                       });
               	   });
                }
                
                vm.addItem = function(){
                	vm.dataModel.items.push({
               		  documentField: null,
               		  sortType: null
               	   });
                }
                
                vm.save = function(){
                	log.debug( vm.dataModel)
                }
                
                vm.setup();
            }
        ]);