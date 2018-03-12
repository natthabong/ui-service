angular.module('scfApp').controller('JourneyNewDocumentPaymentController', [
    '$scope',
    'PageNavigation',
    'SCFCommonService',
    'Service',
    function ($scope, PageNavigation, SCFCommonService, Service) {
        var vm = this;
        var compositParent = $scope.$parent;
        var dashboarParent = compositParent.$parent;
        var dahsboarItemParent = dashboarParent.dashboardItem;
        vm.headerLabel = dahsboarItemParent.headerLabel;

        vm.totalDocument = 0;
        vm.payableAmount = '0';

        vm.load = function () {
            var newDocumentDeferred = Service.doGet('/api/v1/view-summary-ar-document');
            newDocumentDeferred.promise.then(function (response) {

                if (response.data != "") {
                    vm.totalDocument = response.data.totalDocument;
                    vm.payableAmount = SCFCommonService.shortenLargeNumber(response.data.totalPayableAmount);
                }
            }).catch(function (response) {

            });
        }

        vm.documentList = function () {
            PageNavigation.gotoPage('/my-organize/create-payment');
        }
    }
]);