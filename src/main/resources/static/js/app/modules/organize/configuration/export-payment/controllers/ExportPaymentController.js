'use strict';
var module = angular.module('gecscf.organize.configuration.exportPayment');
module.controller('ExportPaymentController', [
    '$log',
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    'ngDialog',
    'UIFactory',
    'PageNavigation',
    'blockUI', 'FileLayoutService',
    'FILE_TYPE_ITEM',
    'DELIMITER_TYPE_TEM',
    'CHARSET_ITEM',
    'SCFCommonService',
    function (log, $rootScope, $scope, $state, $stateParams, ngDialog, UIFactory, PageNavigation,
        blockUI, FileLayoutService, FILE_TYPE_ITEM, DELIMITER_TYPE_TEM, CHARSET_ITEM, SCFCommonService) {

        // <----------------------- initial variable start --------------------->
        var vm = this;
        var ownerId = $stateParams.organizeId;
        var layoutConfigId = $stateParams.layoutConfigId;

        vm.manageAll = false;

        var defaultDropDown = {
            value: null,
            label: 'Please select'
        }

        vm.fileType = FILE_TYPE_ITEM;
        vm.fileEncodeDropdown = [];
        vm.delimitersDropdown = [];
        vm.specificsDropdown = [];

        //Section
        vm.items = [];
        vm.headerItem = [];
        vm.documentItem = [];
        vm.paymentItem = [];
        vm.footerItem = [];

        vm.delimeter = null;
        vm.delimeterOther = null;
        vm.isDelimited = false;

        // GECSCF dropdown
        vm.headerGECDropdown = [];
        vm.footerGECDropdown = [];
        vm.paymentGECDropdown = [];
        vm.doucmentGECDropdown = [];

        vm.model = [];
        vm.model.fileType = null;

        // dropdown data type
        vm.dataTypes = {
            HEADER: null,
            PAYMENT: null,
            DOCUMENT: null,
            FOOTER: null
        }

        // select section
        vm.headerSelected = false;
        vm.paymentSelected = false;
        vm.footerSelected = false;

        vm.dataTypeByIds = {};
        var watchCount = 0;

        // <----------------------- initial varible end --------------------->
        
        var loadDocumentFields = function (sectionType, dropDownData) {
            var deffered = SCFCommonService.getDocumentFields('EXPORT', sectionType, null);
            deffered.promise.then(function (response) {
                dropDownData.push(defaultDropDown);
                vm.dataTypes[sectionType] = response.data;
                response.data.forEach(function (obj) {
                    vm.dataTypeByIds[obj.documentFieldId] = obj;
                    var item = {
                        value: obj.documentFieldId,
                        label: obj.displayFieldName,
                        dataType: obj.dataType
                    }
                    dropDownData.push(item);
                });
            }).catch(function (response) {
                log.error('Load data error');
            });

        }

        var loadFileEncode = function () {
            CHARSET_ITEM.forEach(function (obj) {
                var selectObj = {
                    label: obj.fileEncodeName,
                    value: obj.fileEncodeId
                }

                vm.fileEncodeDropdown.push(selectObj);
            });
        }();

        var loadDelimiters = function () {
            DELIMITER_TYPE_TEM.forEach(function (obj) {
                var selectObj = {
                    label: obj.delimiterName,
                    value: obj.delimiterId
                }

                vm.delimitersDropdown.push(selectObj);
            });
        }();

        var loadFileSpecificsData = function () {
            var deffered = FileLayoutService.getSpecificData();
            deffered.promise.then(function (response) {

                var specificModels = response.data;
                if (specificModels !== undefined) {
                    specificModels.forEach(function (obj) {
                        var selectObj = {
                            label: obj.specificName,
                            value: obj.specificName,
                            item: obj.specificItem
                        }
                        vm.specificsDropdown.push(selectObj);
                    });
                }

                deffered.resolve(vm.specificModels);
            }).catch(function (response) {
                log.error('Load relational operators format Fail');
                deffered.reject();
            });
        }();

        var initialModel = function (model) {
            vm.model = model != null ? model : {
                charsetName: 'TIS-620',
                delimeter: null,
                fileType: 'FIXED_LENGTH',
                sponsorId: ownerId,
                displayName: 'Export file layout',
                sponsorConfigId: 'BFP',
                fileExtensions: 'txt',
                integrateType: 'EXPORT',
                checkBinaryFile: false,
                processType: "EXPORT_DOCUMENT",
                completed: false,
                displayHeaderColumn : false,
                layoutConfigId : layoutConfigId
            };

            vm.delimeter = ',';
            vm.delimeterOther = '';

            vm.specificModel = 'Specific 1';
        }

        var _convertToHumanize = function (str) {
            str = str.toLowerCase().split('_');

            for (var i = 0; i < str.length; i++) {
                str[i] = str[i].split('');
                str[i][0] = str[i][0].toUpperCase();
                str[i] = str[i].join('');
            }
            return str.join('');
        }

        var loadSectionItem = function (owner,layoutId,section,data) {
            var deferred = FileLayoutService.getFileLayoutItems(owner,layoutId,section);
            deferred.promise.then(function(response){
                if(response.data.length > 0){
                    if(section == 'HEADER'){
                        vm.headerSelected = true;
                    }else if(section == 'PAYMENT'){
                        vm.paymentSelected = true;
                    }else if(section == 'FOOTER'){
                        vm.footerSelected = true;
                    }
                    response.data.forEach(function(obj){
                        data.push(obj);
                    });
                }
                
            }).catch(function(response){

            });
        }

        function loadFileLayout(layoutConfigId) {
            var defferd = FileLayoutService.getFileLayout(ownerId, 'EXPORT_DOCUMENT', 'EXPORT', layoutConfigId);
            defferd.promise.then(function (response) {
                var model = null;
                if (response.data != null) {
                    model = response.data;
                }
                initialModel(model);
                loadSectionItem(ownerId,layoutConfigId,'HEADER',vm.headerItem);
                loadSectionItem(ownerId,layoutConfigId,'PAYMENT',vm.paymentItem);
                loadSectionItem(ownerId,layoutConfigId,'DOCUMENT',vm.documentItem);
                loadSectionItem(ownerId,layoutConfigId,'FOOTER',vm.footerItem);
            }).catch(function (response) {
            });
            return defferd;
        }

        var initial = function () {        	
        	var defferd = loadFileLayout(layoutConfigId);
        	defferd.promise.then(function (response) {
              loadDocumentFields('HEADER', vm.headerGECDropdown);
              loadDocumentFields('FOOTER', vm.footerGECDropdown);
              loadDocumentFields('PAYMENT', vm.paymentGECDropdown);
              loadDocumentFields('DOCUMENT', vm.doucmentGECDropdown);        		
        	});
        } ();

        //<---------------- function for user action  ---------------->
        vm.addItem = function (section) {
            var itemConfig = {
                primaryKeyField: false,
                documentFieldId: null,
                dataType: null,
                dataLength: null,
                startIndex: null,
                endIndex: null,
                isTransient: false,
                recordType: section
            };

            if(section == 'HEADER'){
                vm.headerItem.push(itemConfig);
            }else if(section == 'PAYMENT'){
                vm.paymentItem.push(itemConfig)
            }else if(section == 'DOCUMENT'){
                vm.documentItem.push(itemConfig)
            }else if(section == 'FOOTER'){
                vm.footerItem.push(itemConfig)
            }
        }

        vm.clearItem = function(section){
            if(section == 'HEADER'){
                vm.headerItem = [];
            }else if(section == 'PAYMENT'){
                vm.paymentItem = [];
            }else if(section == 'FOOTER'){
                vm.footerItem = [];
            }
        }

        vm.backToSponsorConfigPage = function () {
        	var params = {organizeId: ownerId};
			PageNavigation.gotoPage("/sponsor-configuration",params);
        }

        vm.openSetting = function (index, record) {
            var documentFieldId = record.documentFieldId;
            var recordType = record.recordType;
            var dataTypeDropdowns = [];

            if (recordType == "HEADER") {
                dataTypeDropdowns = vm.dataTypes["HEADER"];
            } else if (recordType == "PAYMENT") {
                dataTypeDropdowns = vm.dataTypes["PAYMENT"];
            } else if (recordType == "DOCUMENT") {
                dataTypeDropdowns = vm.dataTypes["DOCUMENT"];
            } else if (recordType == "FOOTER") {
                dataTypeDropdowns = vm.dataTypes["FOOTER"];
            }

            dataTypeDropdowns.forEach(function (obj) {
                if (documentFieldId == obj.documentFieldId) {
                    var dataType = obj.dataType;
                    var dialog = ngDialog.open({
                        id: 'layout-setting-dialog-' + index,
                        template: obj.configUrl,
                        className: 'ngdialog-theme-default',
                        controller: _convertToHumanize(dataType) + 'ExportLayoutConfigController',
                        controllerAs: 'ctrl',
                        scope: $scope,
                        data: {
                            processType: vm.processType,
                            owner: ownerId,
                            record: record,
                            index: index,
                            config: obj,
                            headerItems: vm.headerItems,
                            paymentItems: vm.paymentItems,
                            documentItems: vm.items,
                            footerItems: vm.footerItems,
                            dataTypeByIds: vm.dataTypeByIds,
                            isDelimited: vm.isDelimited

                        },
                        cache: false,
                        preCloseCallback: function (value) {
                            if (value != null) {
                                angular.copy(value, record);
                                record.completed = true;
                            }
                        }
                    });
                }
            });
        }

        var addSectionItems = function(section){
            var sectionItem = null;
            if(section == 'HEADER'){
                sectionItem = vm.headerItem;
            }else if(section == 'PAYMENT'){
                sectionItem = vm.paymentItem;
            }else if(section == 'DOCUMENT'){
                sectionItem = vm.documentItem;
            }else if(section == 'FOOTER'){
                sectionItem = vm.footerItem;
            }

            if(sectionItem.length > 0){
                sectionItem.forEach(function(obj){
                    vm.items.push(obj)
                });
            }
        }

        $scope.confirmSave = function (sponsorLayout) {
            var fileLayoutDiferred = FileLayoutService.updateFileLayout(ownerId, 'EXPORT_DOCUMENT', 'EXPORT',sponsorLayout.layoutConfigId,sponsorLayout);
		    return fileLayoutDiferred;
        };
        
		var onFail = function (errors) {
			$scope.errors = errors;
		}

        vm.save = function () {
            var sponsorLayout = null;
            vm.model.completed = true;
            vm.model.processType = vm.processType;
            $scope.errors = [];
            
            if (vm.model.displayName == '') {
                var errors = {
                    requireLayoutName: true
                }
                onFail(errors)
            }else{
	            if (vm.model.fileType == 'CSV') {
	                if (vm.delimeter == 'Other') {
	                    vm.model.delimeter = vm.delimeterOther;
	                } else {
	                    vm.model.delimeter = vm.delimeter;
	                }
	                vm.model.wrapper = '"';
	                vm.model.headerRecordType = null;
					vm.model.detailRecordType = null;
					vm.model.footerRecordType = null;
	            }
	            sponsorLayout = angular.copy(vm.model);
	
	            vm.items = [];
	            addSectionItems('HEADER');
	            addSectionItems('PAYMENT');
	            addSectionItems('DOCUMENT');
	            addSectionItems('FOOTER');
	            sponsorLayout.items = angular.copy(vm.items);
	
	            sponsorLayout.items.forEach(function (obj, index) {
	                var dataType = vm.dataTypeByIds[obj.documentFieldId];
	                if(angular.isDefined(dataType)){
	                    obj.dataType = dataType.dataType;
	                    obj.transient = dataType.transient;
	                    if (dataType.dataType == 'CUSTOMER_CODE') {
	                        obj.validationType = 'IN_CUSTOMER_CODE_GROUP';
	                    }
	                }
	            });
	
	            UIFactory.showConfirmDialog({
	                data: {
	                    headerMessage: 'Confirm save?'
	                },
	                confirm: function () { 
	                	blockUI.start();
	                	return $scope.confirmSave(sponsorLayout) 
	                },
	                onSuccess: function (response) {
	                    UIFactory.showSuccessDialog({
	                        data: {
	                            headerMessage: 'Edit file layout complete.',
	                            bodyMessage: ''
	                        },
	                        preCloseCallback: function () {
	                            vm.backToSponsorConfigPage();
	                        }
	                    });
	                    blockUI.stop();
	                },
	                onFail: function (response) {
						if (response.status != 400) {
							var msg = {};
							UIFactory.showFailDialog({
								data : {
									headerMessage : 'Edit file layout fail.',
									bodyMessage : msg[response.status] ? msg[response.status]
											: response.data.message
								},preCloseCallback: function () {
                                   
                                }
							});
						} else {
							$scope.errors = {};
							$scope.errors[response.data.reference] = {
								message : response.data.errorMessage
							}
							
							var errors = {
								duplicateLayoutName : true
							}
							
							onFail(errors)
						}
						blockUI.stop();
	                }
	            });
            }
        }

        vm.clearSectionItem = function(selected,section){
            if(selected){
                vm.clearItem(section);
                vm.addItem(section);
            }else{
                vm.clearItem(section);
            }
        }

        vm.removeDataItem = function(index,section){
            if(section == 'HEADER'){
                vm.headerItem.splice(index,1);
            }else if(section == 'PAYMENT'){
                vm.paymentItem.splice(index,1);
            }else if(section == 'DOCUMENT'){
                vm.documentItem.splice(index,1);
            }else if(section == 'FOOTER'){
                vm.footerItem.splice(index,1);
            }
        }
        
        vm.clearPaddingCharacter = function(sectionObjectItems){
        	sectionObjectItems.forEach(function (rowItem) {
        		var dataType = rowItem.dataType.toUpperCase();
        		if(dataType == 'NUMERIC' || dataType == 'COUNT' || dataType == 'SUMMARY'){
        			rowItem.paddingCharacter = "";
        		}
			});
		}
		
		vm.setPaddingCharacter = function(sectionObjectItems, pad){
        	sectionObjectItems.forEach(function (rowItem) {
        		var dataType = rowItem.dataType.toUpperCase();
        		if(dataType == 'NUMERIC' || dataType == 'COUNT' || dataType == 'SUMMARY'){
        			rowItem.paddingCharacter = pad;
        		}
			});
		}
		
		vm.isChangeDataType = function (recordChanged, dropdownItems){
			
			function findByFieldId(item) {
    			return item.value == recordChanged.documentFieldId;
			}

			function getChangedDataType() {
    			return dropdownItems.find(findByFieldId).dataType;
			}	
			
			var dataType = getChangedDataType();
			if(!isDataTypeNumeric(dataType.toUpperCase())){
				recordChanged.paddingCharacter = "";
			}else if(isDataTypeNumeric(dataType.toUpperCase()) && (recordChanged.paddingCharacter == undefined || recordChanged.paddingCharacter.length == 0)){
				recordChanged.paddingCharacter = "0";
			}
		}
		
		function isDataTypeNumeric(dataType){
			var dataTypeUpperCase = dataType.toUpperCase();
			if(dataTypeUpperCase == 'COUNT' || dataTypeUpperCase == 'NUMERIC' || dataTypeUpperCase == 'SUMMARY' ){
				return true;
			}
			
			return false;
		}

        vm.disableSetting = function(record){
            var disable = false;
            var documentFieldId = record.documentFieldId;
            var recordType = record.recordType;
            var dataTypeDropdowns = [];

            if (recordType == "HEADER") {
                dataTypeDropdowns = vm.dataTypes["HEADER"];
            } else if (recordType == "PAYMENT") {
                dataTypeDropdowns = vm.dataTypes["PAYMENT"];
            } else if (recordType == "DOCUMENT") {
                dataTypeDropdowns = vm.dataTypes["DOCUMENT"];
            } else if (recordType == "FOOTER") {
                dataTypeDropdowns = vm.dataTypes["FOOTER"];
            }
            if(documentFieldId != null && dataTypeDropdowns != null){
                var index = dataTypeDropdowns.findIndex(i => i.documentFieldId == documentFieldId);
                if(index >=0 ){
                    if(dataTypeDropdowns[index].configUrl == '' || dataTypeDropdowns[index].configUrl == null){
                        disable = true;
                    }
                }else{
                    disable = true;
                }
            }else{
                disable = true;
            }
            return disable;
        }

        $scope.$watch('ctrl.model.fileType', function () {
            if(vm.model.fileType != null){
                if(vm.model.fileType == vm.fileType.fixedLength){
                    vm.isDelimited = false;
                    vm.model.fileExtensions = 'txt';
                    vm.delimeter = ',';
                    vm.delimeterOther = '';
                    vm.model.displayHeaderColumn = false;
                    vm.setPaddingCharacter(vm.documentItem, '0');        

                }else if(vm.model.fileType == vm.fileType.delimited){
                    vm.isDelimited = true;

                    vm.headerSelected = false;
                    vm.clearSectionItem(vm.headerSelected,'HEADER');
                    vm.paymentSelected = false;
                    vm.clearSectionItem(vm.paymentSelected,'PAYMENT');
                    vm.footerSelected = false;
                    vm.clearSectionItem(vm.footerSelected,'FOOTER');
                    vm.model.fileExtensions = 'csv';
                    vm.clearPaddingCharacter(vm.documentItem);

                    if(vm.model.delimeter != null){
                        var index = vm.delimitersDropdown.findIndex(i => i.value == vm.model.delimeter);
                        if(index < 0){
                            vm.delimeter = 'Other';
                            vm.delimeterOther = vm.model.delimeter;
                        }
                    }
                    
                    
                }else if(vm.model.fileType == vm.fileType.specific){
                    vm.isDelimited = false;
                    vm.delimeter = ',';
                    vm.delimeterOther = '';
                    vm.model.displayHeaderColumn = false;
                }
            }
        });
        //<---------------- function for user action  ---------------->
    }
]);