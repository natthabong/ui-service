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
						'$q',
						function($log, $scope, $state, SCFCommonService,
								$stateParams, $timeout, ngDialog,
								PageNavigation, Service, $q) {
							var vm = this;
							var log = $log;

							vm.newFile = false;

							vm.fileLayoutModel = $stateParams.fileLayoutModel;

							vm.fileType = {
								fixedLength : 'fixedLength',
								delimited : 'delimited'
							}

							vm.delimitersDropdown = [];

							vm.fileEncodeDropdown = [];

							vm.dataTypeDropdown = [ {
								dataTypeDisplay : 'Please select'
							} ];
							
							vm.customerCodeGroupDropdown = [];

							// Model mapping whith page list
							vm.layoutInfoModel = {
								fileType : vm.fileType.delimited,
								delimiters : '',
								fileEncode : '',
								offsetRowNo : ''
							}

//							vm.configPopup = function() {
//								ngDialog
//										.open({
//											template : '/js/app/approve-transactions/confirm-dialog.html',
//											scope : $scope,
//											disableAnimation : true
//										});
//							};

							vm.preview = function(data) {
								SCFCommonService.parentStatePage()
										.saveCurrentState($state.current.name);
								var params = {}
								// PageNavigation.gotoPage('/sponsor-configuration/file-layouts/new-file-layout/config-detail-field',params,params)
							}

							vm.decodeBase64 = function(data) {
								if (angular.isUndefined(data)) {
									return '';
								}
								return atob(data);
							}
							
							vm.loadDataTypes = function() {
								var serviceURI = 'api/v1/configs/gecscf/layouts/file/data-types';
								var serviceDiferred = Service.doGet(serviceURI, {
									record_type:  'DETAIL'
								});		
								
								serviceDiferred.promise.then(function(response){
									response.data.forEach(function(obj) {
										vm.dataTypeDropdown.push(obj);
									});
					               
								}).catch(function(response){
									log.error('Load customer code group data error');
								});
							}

							vm.loadDelimiters = function() {
								var delimiterList = [ {
									delimiterName : 'Comma (,)',
									delimiterId : '1'
								}, {
									delimiterName : 'Colon (:)',
									delimiterId : '2'
								}, {
									delimiterName : 'Tab',
									delimiterId : '3'
								}, {
									delimiterName : 'Semicolon (;)',
									delimiterId : '4'
								}, {
									delimiterName : 'Other',
									delimiterId : '5'
								} ];

								delimiterList.forEach(function(obj) {
									var selectObj = {
										label : obj.delimiterName,
										value : obj.delimiterId
									}

									vm.delimitersDropdown.push(selectObj);
								});
							}

							vm.loadFileEncode = function() {
								var fileEncodeList = [ {
									fileEncodeName : 'UTF-8',
									fileEncodeId : '1'
								}, {
									fileEncodeName : 'TIS-620',
									fileEncodeId : '2'
								} ];

								fileEncodeList.forEach(function(obj) {
									var selectObj = {
										label : obj.fileEncodeName,
										value : obj.fileEncodeId
									}

									vm.fileEncodeDropdown.push(selectObj);
								});
							}

							vm.decodeBase64 = function(data) {
								return atob(data);
							}

							var newItem = {
								primaryKeyField : false,
								sponsorFieldName : '',
								dataType : null,
								length : 0,
								startIndex : 0
							};
							vm.layoutConfigItems = [ newItem ];

							vm.addNewConfigItem = function() {
								vm.layoutConfigItems.push(newItem);
							}
							
							vm.removeConfigItem = function(record) {
							  var index = vm.layoutConfigItems.indexOf(record);
								  vm.layoutConfigItems.splice(index, 1);  
							}
							
							vm.loadCustomerCodeGroup = function() {
								var diferred = $q.defer();
								vm.customerCodeGroupDropdown = [{
									label: 'Please select',
									value: ''
								}];
								
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
						            diferred.resolve(vm.customerCodeGroupDropdown);
						        }).catch(function(response) {
									$log.error('Load Customer Code Group Fail');
									diferred.reject();
						        });
						        
						        vm.customerCodeGroup = vm.customerCodeGroupDropdown[0].value;
						        return diferred;
						    };
							
							vm.openSetting = function(record) {
								var dataTypeConfig = record.dataType
								if(dataTypeConfig!=null){
									vm.requireCheckbox = false;
									vm.required = vm.requireCheckbox;
								    vm.disableText = true;
								    
									if(dataTypeConfig.dataTypeDisplay=="Customer code"){
										vm.loadCustomerCodeGroup();
									}
									
					                ngDialog.openConfirm({
					                    template: dataTypeConfig.configActionUrl,
					                    data: record,
					                    className: 'ngdialog-theme-default',
					                    scope: $scope
					                }).then(function (value) {
					                    console.log('Modal promise resolved. Value: ', value);
					                }, function (reason) {
					                    console.log('Modal promise rejected. Reason: ', reason);
					                });
								}
				            }
							
							vm.initLoad = function() {
								vm.fileLayoutName = vm.fileLayoutModel.displayName;
								vm.sponsorId = vm.fileLayoutModel.sponsorId;
								vm.loadDelimiters();
								vm.loadFileEncode();
								vm.loadDataTypes();
								vm.layoutInfoModel.offsetRowNo = 1;

							}

							vm.initLoad();

							vm.checkRequired = function() {
						        vm.required = !vm.required;
						        vm.disableText = !vm.required;
						    };
						    
						    vm.dataFormat = {};
						    vm.expectedValue = '';
						    
						    vm.newCustomerCodeGroup = function () {
						    	vm.newCustCodeDialog = ngDialog.open({
				                    template: '/configs/layouts/file/data-types/customer-code/new-customer-code',
				                    className: 'ngdialog-theme-default',
				                    scope: $scope
				                });
						    	vm.newCustCodeDialogId = vm.newCustCodeDialog.id;
				            };
				            
				            vm.customerCodeGroupRequest = {
				            	groupName: '',
				            	sponsorId: '',
				            	completed: ''
			            	}
				            
				            vm.saveNewCustomerGroup = function() {
				            	vm.customerCodeGroupRequest.groupName = vm.groupName;
				            	vm.customerCodeGroupRequest.sponsorId = vm.sponsorId;
				            	vm.customerCodeGroupRequest.completed = false;
				            		
				            	var serviceUrl = '/api/v1/organize-customers/'+vm.sponsorId+'/sponsor-configs/SFP/customer-code-groups';
						        var serviceDiferred = Service.requestURL(serviceUrl, vm.customerCodeGroupRequest, 'POST');		
						        serviceDiferred.promise.then(function(response) {
						            if (response !== undefined) {
						            	if(response.message !== undefined){
						            		vm.messageError = response.message;
						            	}else{
						            		var loadCustCodeDiferred = vm.loadCustomerCodeGroup();
						            		loadCustCodeDiferred.promise.then(function(){
						            			vm.customerCodeGroup = ''+response.groupId;
						            		});		
						            		ngDialog.close(vm.newCustCodeDialogId);
						            	}
						            }
						        }).catch(function(response) {
						        	$log.error('Save customer Code Group Fail');
						        });
						    };
						} ]);