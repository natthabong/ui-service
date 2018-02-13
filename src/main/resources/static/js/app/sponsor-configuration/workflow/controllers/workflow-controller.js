angular.module('gecscf.sponsorConfiguration.workflow').controller('WorkflowController', ['SCFCommonService', '$log', '$scope', '$rootScope',
    '$stateParams', '$timeout', 'PageNavigation', 'Service', 'PagingController', function (SCFCommonService, $log
        , $scope, $rootScope, $stateParams, $timeout, PageNavigation, Service, PagingController) {
        var vm = this;
        var log = $log;

        vm.pagingController = {
            tableRowCollection: null
        }
        
        var organizeId = $stateParams.organizeId;
		
		vm.hiddenFundingColumn = true;
		vm.disableConfigButton = true;

        vm.setup = function (data) {
            $timeout(function () {
                PageNavigation.gotoPage('/sponsor-configuration/workflow/setup', {
                    organizeId : organizeId,
                    workflowModel: data
                });
            }, 10);
        }

        var initLoad = function () {
            if (!angular.isUndefined(organizeId) && organizeId != null) {
                var owner = organizeId;
                var getWorkflowUrl = "/api/v1/organizes/" + owner + "/workflows";
                var deferred = Service.requestURL(getWorkflowUrl, {}, 'GET');
                deferred.promise.then(function (response) {
                    vm.pagingController.tableRowCollection = response;
                }).catch(function (response) {
                    log.error('Cannot load workflow');
                });
            }
        } ();
        
        vm.decodeBase64 = function (data) {
			return (data ? atob(data) :
				UIFactory.constants.NOLOGO);
		};
    }]);