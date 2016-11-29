angular.module('scfApp').controller('DocumentDisplayConfigController', ['Service',
    '$log',
    '$scope',
    'PageNavigation',
    function(Service, $log, $scope, PageNavigation) {
        var vm = this;
        var log = $log;

        vm.pageModel = {
            pageSizeSelectModel: '20',
            totalRecord: 0,
            currentPage: 0,
            clearSortOrder: false,
            page: 0,
            pageSize: 20,
            totalPage: 1
        };

        vm.pageSizeList = [{
            label: '10',
            value: '10'
        }, {
            label: '20',
            value: '20'
        }, {
            label: '50',
            value: '50'
        }];

        vm.dataTable = {
            options: {},
            columns: [{
                field: 'displayName',
                label: 'Document display name',
                idValueField: 'template',
                id: 'doc-display-config-{value}-layout-name-label',
                sortData: false,
                cssTemplate: 'text-left',
            }, {
                field: '',
                label: '',
                cssTemplate: 'text-center',
                sortData: false,
                cellTemplate: '<scf-button id="document-display-{{data.documentDisplayId}}-setup-button" class="btn-default gec-btn-action" ng-click="docDisplayCtrl.setupDisplayDocument(data)" title="Config a file layout" ng-hide="!data.completed"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
                    '<scf-button id="document-display-{{data.documentDisplayId}}-warning-setup-button" class="btn-default gec-btn-action" ng-click="docDisplayCtrl.setupDisplayDocument(data)" title="Config a file layout" ng-hide="data.completed"><img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/></scf-button>'

            }]
        };

        //        vm.data = [{
        //            displayName: 'AP document display',
        //            documentDisplayId: 1,
        //            completed: false
        //        }];
        vm.data = [];

        vm.splitePageTxt = '0 - 0 of 0';
        vm.loadDocumentDisplayConfig = function() {
            var requestUrl = '/api/v1/organize-customers/' + $scope.sponsorId + '/sponsor-configs/SFP/displays';

            var docDisplayConfDiferred = Service.requestURL(requestUrl, {
                    offset: 0,
                    limit: 20
                },
                'GET');

            docDisplayConfDiferred.promise.then(function(response) {
                vm.data = response;
                vm.pageModel.totalRecord = response.headers('X-Total-Count');
                vm.pageModel.totalPage = response.headers('X-Total-Page');
                vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
            }).catch(function(response) {
                log.error('Get Document display config error');
            });
        };

        vm.onload = function() {
            vm.loadDocumentDisplayConfig();
        };

        vm.onload();

        vm.setupDisplayDocument = function(displayDocConf) {
            var params = {
                displayDocumentConfigModel: displayDocConf
            };
            //            PageNavigation.gotoPage('/sponsor-configuration/file-layouts/new-file-layout', params)
        };
    }
]);