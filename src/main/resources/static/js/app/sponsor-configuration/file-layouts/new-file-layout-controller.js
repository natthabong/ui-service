angular
		.module('scfApp')
		.controller(
				'NewFileLayoutController',
				[
						'$log',
						'$scope',
						'$state',
						'SCFCommonService',
						'$stateParams',
						'$timeout',
						'ngDialog',
						'PageNavigation',
						'Service',
						function($log, $scope, $state, SCFCommonService, $stateParams, $timeout, 
								ngDialog, PageNavigation, Service) {
							var vm = this;
							var log = $log;
							
							vm.newFile = false;
							
							vm.fileLayoutModel = $stateParams.fileLayoutModel;
							
							vm.fileType = {
					            fixedLength: 'fixedLength',
					            delimited: 'delimited'
					        }
							
							vm.delimitersDropdown = [];
							
							vm.fileEncodeDropdown = [];
							
							vm.customerCodeGroupDropdown = [{
								label: 'Please select',
								value: ''
							}];
							
							// Model mapping whith page list
							vm.layoutInfoModel = {
								fileType: vm.fileType.delimited,
								delimiters: '',
					            fileEncode: '',
					            offsetRowNo: ''
					        }

							vm.configPopup = function() {
								vm.requireCheckbox = false;
								vm.required = vm.requireCheckbox;
							    vm.disableText = true;
							    
								ngDialog.open({
									templateUrl: '/js/app/sponsor-configuration/file-layouts/dialog-text-field-format.html',
						            scope: $scope,
						            disableAnimation: true
						        });
					        };
					        
					        vm.configCustCodeGroupPopup = function() {
								vm.requireCheckbox = false;
								vm.required = vm.requireCheckbox;
							    vm.disableText = true;
							    
							    vm.loadCustomerCodeGroup();
								
							    ngDialog.open({
									templateUrl: '/js/app/sponsor-configuration/file-layouts/customer-code-group-field-format.html',
						            scope: $scope,
						            disableAnimation: true
						        });
					        };
					        
							vm.preview = function(data){		
								SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
								var params = { 
							        }
//								PageNavigation.gotoPage('/sponsor-configuration/file-layouts/new-file-layout/config-detail-field',params,params)
							}
							
							vm.decodeBase64 = function(data){
								if(angular.isUndefined(data)){
									return '';
								}
								return atob(data);
							}
							
							vm.loadDelimiters = function(){
								var delimiterList = [{
									delimiterName: 'Comma (,)',
									delimiterId: '1'
								},{
									delimiterName: 'Colon (:)',
									delimiterId: '2'
								},{
									delimiterName: 'Tab',
									delimiterId: '3'
								},{
									delimiterName: 'Semicolon (;)',
									delimiterId: '4'
								},{
									delimiterName: 'Other',
									delimiterId: '5'
								}];
								
								delimiterList.forEach(function(obj) {
				                    var selectObj = {
				                        label: obj.delimiterName,
				                        value: obj.delimiterId
				                    }
				                    
				                    vm.delimitersDropdown.push(selectObj);
				                });
						    }
							
							vm.loadFileEncode = function(){
								var fileEncodeList = [{
									fileEncodeName: 'UTF-8',
									fileEncodeId: '1'
								},{
									fileEncodeName: 'TIS-620',
									fileEncodeId: '2'
								}];
								
								fileEncodeList.forEach(function(obj) {
				                    var selectObj = {
				                        label: obj.fileEncodeName,
				                        value: obj.fileEncodeId
				                    }
				                    
				                    vm.fileEncodeDropdown.push(selectObj);
				                });
						    }
							
							vm.loadCustomerCodeGroup = function() {
								var serviceUrl = '/api/v1/organize-customers/'+vm.sponsorId+'/sponsor-configs/SFP/customer-code-groups';
						        var serviceDiferred = Service.doGet(serviceUrl, {
						        	offset: 0,
						        	limit:  20
								});		
						        serviceDiferred.promise.then(function(response) {
						            var customerCodeGroupList = response.data;
						            if (customerCodeGroupList !== undefined) {
						            	customerCodeGroupList.forEach(function(obj) {
						                    var selectObj = {
						                        label: obj.groupName,
						                        value: obj.groupId
						                    }
						                    vm.customerCodeGroupDropdown.push(selectObj);
						                });
						            }
						        }).catch(function(response) {
									$log.error('Load Customer Code Group Fail');
						        });
						    };

							vm.decodeBase64 = function(data) {
								return atob(data);
							}
							
							vm.initLoad = function() {
				                vm.fileLayoutName = vm.fileLayoutModel.displayName;
				                vm.sponsorId = vm.fileLayoutModel.sponsorId
				                vm.loadDelimiters();
				                vm.loadFileEncode();
				                vm.layoutInfoModel.offsetRowNo = 1;
							}

							vm.initLoad();
							
							vm.checkRequired = function() {
						        vm.required = !vm.required;
						        vm.disableText = !vm.required;
						    };
						    
						    vm.dataFormat = {};
						    vm.expectedValue = '';
						    
						    vm.updateValue = function() {
						    	var requiredFormat = "No";
						    	if(vm.requireCheckbox){
						    		requiredFormat = "Yes";
						    	}
						    	
						    	vm.dataFormat = {
							    	required: requiredFormat,
							    	expectedValue: vm.expectedValue,
							    	customerCodeGroupName: vm.customerCodeGroup.value
							    };
						    }
						} ]);