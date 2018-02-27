'use strict';
angular.module('gecscf.organize.configuration.exportPayment').controller('ViewExportPaymentController', [
	'$log',
	'$stateParams',
	'FileLayoutService',
	'PageNavigation',
	'DELIMITER_TYPE_ITEM',
	'FILE_TYPE_ITEM',
	function ($log, $stateParams, FileLayoutService, PageNavigation, DELIMITER_TYPE_ITEM, FILE_TYPE_ITEM) {
		var vm = this;
		var log = $log;
		var organizeId = $stateParams.organizeId;
		var layoutConfigId = $stateParams.layoutConfigId;
		var sections = {
			HEADER: 'HEADER',
			PAYMENT: 'PAYMENT',
			DOCUMENT: 'DOCUMENT',
			FOOTER: 'FOOTER'
		}

		vm.model = undefined;

		// File type radio button
		vm.fileType = FILE_TYPE_ITEM;

		// Row format check box
		vm.headerSelected = false;
		vm.paymentSelected = false;
		vm.documentSelected = false;
		vm.footerSelected = false;

		// Section
		vm.items = [];
		vm.headerItems = [];
		vm.paymentItems = [];
		vm.documentItems = [];
		vm.footerItems = [];

		function getDelimiterObject(item) {
			return item.delimiterId == vm.model.delimeter;
		}

		function loadSectionItem(organizeId, layoutConfigId, section, data) {
			var deferred = FileLayoutService.getFileLayoutItems(organizeId, layoutConfigId, section);
			deferred.promise.then(function (response) {
				if (response.data != null && response.data.length > 0) {
					if (section == sections.HEADER) {
						vm.headerSelected = true;
					} else if (section == sections.PAYMENT) {
						vm.paymentSelected = true;
					} else if (section == sections.DOCUMENT) {
						vm.documentSelected = true;
					} else if (section == sections.FOOTER) {
						vm.footerSelected = true;
					}
					response.data.forEach(function (obj) {
						data.push(obj);
					});
				}
			}).catch(function (response) {
				log.error('Fail to load file layout items.');
			});
		}

		function loadFileLayout(organizeId, layoutConfigId) {
			var deferred = FileLayoutService.getFileLayout(organizeId, 'EXPORT_DOCUMENT', 'EXPORT', layoutConfigId);
			deferred.promise.then(function (response) {
				if (response.data != null) {
					vm.model = response.data;
				}

				loadSectionItem(organizeId, layoutConfigId, sections.HEADER, vm.headerItems);
				loadSectionItem(organizeId, layoutConfigId, sections.PAYMENT, vm.paymentItems);
				loadSectionItem(organizeId, layoutConfigId, sections.DOCUMENT, vm.documentItems);
				loadSectionItem(organizeId, layoutConfigId, sections.FOOTER, vm.footerItems);
			}).catch(function (response) {
				log.error('Fail to load file layout.');
			});
			return deferred;
		}

		vm.getDelimiterName = function () {
			if (vm.model != undefined) {
				var obj = DELIMITER_TYPE_ITEM.filter(getDelimiterObject);
				if (obj.length == 0) {
					var delimeter = 'Other';
					if (vm.model.delimeter != null) {
						return delimeter + ' (' + vm.model.delimeter + ')';
					}
					return delimeter;
				} else {
					return obj[0].delimiterName;
				}
			} else {
				return '';
			}
		}

		vm.getSpecificName = function () {
			return 'Specific 1';
		}

		vm.isFileTypeDelimited = function () {
			if (vm.model != undefined && vm.fileType != null) {
				return vm.model.fileType == vm.fileType.delimited;
			} else {
				return false;
			}
		}

		vm.isFileTypeSpecific = function () {
			if (vm.model != undefined && vm.fileType != null) {
				return vm.model.fileType == vm.fileType.specific;
			} else {
				return false;
			}
		}

		vm.gotoPreviousPage = function () {
			var params = {
				organizeId: organizeId
			};
			PageNavigation.gotoPage("/sponsor-configuration", params);
		}

		function init() {
			loadFileLayout(organizeId, layoutConfigId);
		}
		init();
	}
]);