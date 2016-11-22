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
						function($log, $scope, $state, SCFCommonService,
								$stateParams, $timeout, ngDialog,
								PageNavigation, Service) {
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

							// Model mapping whith page list
							vm.layoutInfoModel = {
								fileType : vm.fileType.delimited,
								delimiters : '',
								fileEncode : '',
								offsetRowNo : ''
							}

							vm.configPopup = function() {
								ngDialog
										.open({
											template : '/js/app/approve-transactions/confirm-dialog.html',
											scope : $scope,
											disableAnimation : true
										});
							};

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
							
							vm.openSetting = function(record) {
								var dataTypeConfig = record.dataType
								if(dataTypeConfig!=null){
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
								vm.loadDelimiters();
								vm.loadFileEncode();
								vm.loadDataTypes();
								vm.layoutInfoModel.offsetRowNo = 1;

							}

							vm.initLoad();

						} ]);