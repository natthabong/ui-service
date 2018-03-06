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
        vm.manageAction = false;
        vm.mappingDataModel = $stateParams.mappingData || {
        	ownerId: $stateParams.organizeId,
        	accountingTransactionType: $stateParams.accountingTransactionType,
            mappingDataId: $stateParams.mappingDataId,
            mappingType: $stateParams.mappingType
        };
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
        
        vm.mappingDataItemModel = $stateParams.mappingDataItem || {
            code: '',
            display: '',
            signFlag: 1,
            mappingDataId: $stateParams.mappingDataId,
            mappingData: vm.mappingDataModel,
            defaultCode: 0
        }
        
        if(vm.mappingDataModel.mappingType == 'SIGN_FLAG_MAPPING'){
        	vm.isSignFlagMapping = true;
        }else{
        	vm.mappingDataItemModel.signFlag = null;
        }
        
        
        
        vm.signFlagTypes = [ {
			label : 'Negative',
			value : 1
		}, {
			label : 'Positive',
			value : 0
		} ]
        
        vm.cancel = function(){
        	var params = {
					mappingData : $stateParams.mappingData,
					organizeId : $stateParams.organizeId,
	                accountingTransactionType: $stateParams.accountingTransactionType,
                    mappingDataId: $stateParams.mappingDataId,
                    mappingType: $stateParams.mappingType
				};
				PageNavigation
						.gotoPage(
								'/sponsor-configuration/mapping-data/edit',
								params, {});
        }
        
        var _save = function(){
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
        		var params = {
    					mappingData : $stateParams.mappingData,
    					organizeId : $stateParams.organizeId,
    	                accountingTransactionType: $stateParams.accountingTransactionType,
                        mappingDataId: $stateParams.mappingDataId,
                        mappingType: $stateParams.mappingType
    				};
    				PageNavigation
    						.gotoPage(
    								'/sponsor-configuration/mapping-data/edit',
    								params, {});
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
							404 : "Code has been deleted.",
							409 : "Code has been modified."
						}
						UIFactory.showFailDialog({
							data : {
								headerMessage : vm.isNewMode? 'Add new code fail.': 'Edit code fail.' ,
								bodyMessage : msg[status] ? msg[status] : response.errorMessage
							},
							preCloseCallback : preCloseCallback
						});
					}else{
						$scope.errors = {};
						$scope.errors[response.data.code] = {
								message: response.data.message
						}
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
