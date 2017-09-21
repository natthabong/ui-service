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

        // <----------------------- initial varible start --------------------->
        var vm = this;
        var ownerId = $rootScope.sponsorId;

        if(angular.isUndefined(ownerId)){
            // back to main page
            PageNavigation.gotoPage('/settings/organizes');
        }
        
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

        var isCreate = true;

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
                        label: obj.displayFieldName
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
                displayHeaderColumn : false
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

        function loadFileLayout(layoutId) {
            var defferd = FileLayoutService.getFileLayout(ownerId, 'EXPORT_DOCUMENT', 'EXPORT', layoutId);
            defferd.promise.then(function (response) {
                isCreate = false;
                var model = null;
                if (response.data != null) {
                    model = response.data;
                }
                initialModel(model);
                loadSectionItem(ownerId,layoutId,'HEADER',vm.headerItem);
                loadSectionItem(ownerId,layoutId,'PAYMENT',vm.paymentItem);
                loadSectionItem(ownerId,layoutId,'DOCUMENT',vm.documentItem);
                loadSectionItem(ownerId,layoutId,'FOOTER',vm.footerItem);
            }).catch(function (response) {
            });
        }

        var initial = function () {
            var defferd = FileLayoutService.getFileLayouts(ownerId, 'EXPORT_DOCUMENT', 'EXPORT');
            defferd.promise.then(function (response) {
                if (response.data.length > 0) {
                    loadFileLayout(response.data[0].layoutConfigId);
                } else {
                    isCreate = true;
                    initialModel();
                    vm.addItem('DOCUMENT');
                }
                loadDocumentFields('HEADER', vm.headerGECDropdown);
                loadDocumentFields('FOOTER', vm.footerGECDropdown);
                loadDocumentFields('PAYMENT', vm.paymentGECDropdown);
                loadDocumentFields('DOCUMENT', vm.doucmentGECDropdown);
            }).catch(function (response) {

            });
        } ();

        //<---------------- founction for user action  ---------------->
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
            PageNavigation.gotoPreviousPage();
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
                    console.log(dataType);
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
                            dataTypeByIds: vm.dataTypeByIds

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
            console.log(sponsorLayout);
            var fileLayoutDiferred = null;
            if(isCreate){
                fileLayoutDiferred = FileLayoutService.createFileLayout(ownerId, 'EXPORT_DOCUMENT', 'EXPORT',sponsorLayout);
            }else{
                fileLayoutDiferred = FileLayoutService.updateFileLayout(ownerId, 'EXPORT_DOCUMENT', 'EXPORT',sponsorLayout.layoutConfigId,sponsorLayout);
            }
		    return fileLayoutDiferred;
        };

        vm.save = function () {
            var sponsorLayout = null;
            vm.model.completed = true;
            vm.model.processType = vm.processType;

            if (vm.model.fileType == 'CSV') {
                if (vm.delimeter == 'Other') {
                    vm.model.delimeter = vm.delimeterOther;
                } else {
                    vm.model.delimeter = vm.delimeter;
                }
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
                obj.dataType = dataType.dataType;
                obj.transient = dataType.transient;
                if (dataType.dataType == 'CUSTOMER_CODE') {
                    obj.validationType = 'IN_CUSTOMER_CODE_GROUP';
                }
            });

            UIFactory.showConfirmDialog({
                data: {
                    headerMessage: 'Confirm save?'
                },
                confirm: function () { return $scope.confirmSave(sponsorLayout) },
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
                },
                onFail: function (response) {
                    blockUI.stop();
                }
            });
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
            if(documentFieldId != null){
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
            watchCount++;
            if(vm.model.fileType != null){
                if(vm.model.fileType == vm.fileType.fixedLength){
                    vm.isDelimited = false;
                    vm.model.fileExtensions = 'txt';
                    vm.delimeter = ',';
                    vm.delimeterOther = '';

                }else if(vm.model.fileType == vm.fileType.delimited){
                    vm.isDelimited = true;

                    vm.headerSelected = false;
                    vm.clearSectionItem(vm.headerSelected,'HEADER');
                    if(watchCount > 2){
                        vm.paymentSelected = false;
                        vm.clearSectionItem(vm.paymentSelected,'PAYMENT');
                    }
                    vm.footerSelected = false;
                    vm.clearSectionItem(vm.footerSelected,'FOOTER');
                    vm.model.fileExtensions = 'csv';

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
                }
            }
        });
        //<---------------- founction for user action  ---------------->
    }
]);