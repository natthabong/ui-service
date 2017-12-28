'use strict';
var displayListCtrl = function(PageNavigation, PagingController, UIFactory, ConfigurationUtils) {

  var vm = this;

  var parameters = PageNavigation.getParameters();

  var ownerId = parameters.organizeId;

  var _criteria = {};

  vm.pagingController = null;
  vm.loadData = function() {
    vm.pagingController.search();
  }

  vm.init = function(type, mode) {
    vm.mode = mode;
    var reqUrl = ['/api/v1/organize-customers', ownerId,
        'accounting-transactions', type, 'display-modes', mode, 'displays']
            .join('/');
    vm.pagingController = PagingController.create(reqUrl, _criteria, 'GET');

    vm.loadData();

  };

  vm.addNewDocumentDisplay = function(type, mode) {
	  ConfigurationUtils.showCreateNewCreateDisplayDialog({
			data : { 
				showAll: true ,
				ownerId : ownerId,
				accountingTransactionType : type,
				displayMode : mode
			}, preCloseCallback : function() {
				vm.init(processType, integrateType);
			}
		});
  }

  vm.editDocumentDisplay = function(record) {
    setting({
      accountingTransactionType: record.accountingTransactionType,
      displayMode: record.displayMode,
      organizeId: ownerId,
      documentDisplayId: record.documentDisplayId
    })
  }

  vm.deleteDocumentDisplay = function(record) {

  }

  var setting = function(params) {
    if (vm.mode == 'TRANSACTION_DOCUMENT') {
      PageNavigation.gotoPage(
              '/sponsor-configuration/create-transaction-displays/settings',
              params);
    } else if (vm.mode == 'DOCUMENT') {
      PageNavigation.gotoPage(
              '/sponsor-configuration/document-display/settings', params);
    }
  }
}
angular.module('gecscf.organize.configuration.display').controller(
        'DisplayListController',
        ['PageNavigation', 'PagingController', 'UIFactory','ConfigurationUtils', displayListCtrl]);