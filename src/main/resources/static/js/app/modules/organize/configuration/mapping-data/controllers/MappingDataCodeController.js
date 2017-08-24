'use strict';
var mappingDataModule = angular.module('gecscf.organize.configuration');
mappingDataModule.controller('MappingDataCodeController', [
    '$scope',
    '$rootScope',
    '$stateParams',
    'UIFactory',
    'PageNavigation',
    'PagingController',
    'MappingDataService',
    function($scope, $rootScope, $stateParams, UIFactory,
            PageNavigation, PagingController,
            MappingDataService){

        var vm = this;
        vm.mappingDataModel = $stateParams.mappingData;
        vm.isNewMode = false;
        vm.isSignFlagMapping = false;
        var mode = {
        	NEW: "newCode",
        	EDIT: "editCode"
        }
        
        var currentMode = $stateParams.mode;
        if(currentMode == mode.NEW){
        	vm.isNewMode = true;
        }
        
        if(vm.mappingDataModel.mappingType == 'SIGN_FLAG_MAPPING'){
        	vm.isSignFlagMapping = true;
        }
        
        vm.mappingDataItemModel = {
            code: '',
            display: '',
            signFlag: 1,
            mappingDataId: vm.mappingDataModel.mappingDataId,
            mappingData: vm.mappingDataModel
        }
        
        vm.signFlagTypes = [ {
			label : 'Negative',
			value : 1
		}, {
			label : 'Positive',
			value : 0
		} ]
        
        vm.cancel = function(){
        	PageNavigation.gotoPreviousPage(false);
        }
        
        var _save = function(){
        	console.log(vm.mappingDataModel);
        	var deferred = MappingDataService.createMappingDataItem(vm.mappingDataModel, vm.mappingDataItemModel, vm.isNewMode);
			deferred.promise.then(function(response){}).catch(function(response){
			    if (response) {
					if(Array.isArray(response.data)){
					   response.data.forEach(function(error){
					      $scope.errors[error.code] = {
					    	message : error.message
					      };
					   });
				     }
				}
			    deferred.resolve(response);
			});
			return deferred;
        }
        
        vm.save = function(){
        	var preCloseCallback = function(confirm) {
				PageNavigation.gotoPreviousPage(true);
			}
        	
        	if(_validate(vm.mappingDataItemModel)){
        		
        		UIFactory.showConfirmDialog({
    			data : {
    				headerMessage : 'Confirm save?'
    			},
    			confirm : function() {
    				return _save(vm.mappingDataItemModel);
    			},
    			onFail : function(response) {
    				var status = response.status;
					if (status != 400) {
						var msg = {
							404 : "Code has been deleted."
						}
						UIFactory.showFailDialog({
							data : {
								headerMessage : vm.isNewMode? 'Add new code fail.': 'Edit code fail.' ,
								bodyMessage : msg[status] ? msg[status] : response.errorMessage
							},
							preCloseCallback : preCloseCallback
						});
					}
    			},
    			onSuccess : function(response) {
    				UIFactory.showSuccessDialog({
    						data : {
    							headerMessage : vm.isNewMode? 'Add new code success.':'Edit code complete.',
    							bodyMessage : ''
    						},
    						preCloseCallback : preCloseCallback
    					});
    				}
    		    });
        	}
        	
        }
        
        var isRequire = function(data) {
			return (data == '' || data == null);
		}
        
        var _validate = function(mappingDataItem){
        	$scope.errors = {};
        	var valid = true;
        	if(isRequire(mappingDataItem.code)){
        		valid = false;
			    $scope.errors.code = {
			    		message : 'Code is required.'
			    }
        	}
        	
        	if(isRequire(mappingDataItem.display)){
        		valid = false;
			    $scope.errors.display = {
			    		message : 'Display is required.'
			    }
        	}
        	
        	return valid;
        }
    }
]);
