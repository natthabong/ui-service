(function () {
    'use strict';

    var app = angular.module('scf-ui', []);

    app.controller('Controller', ['$scope', function ($scope) {
        this.model = {};

        }]);

    app.factory('Service', ['$http', '$q', function ($http, $q) {
        return {
            requestURL: requestURL
        }

        function requestURL(url, params) {
            var deffered = $q.defer();

            $http({
                method: 'GET',
                url: url,
                data: params
            }).success(function (response) {
                deffered.resolve(response)
            }).error(function (response) {
                deffered.reject(response);
            });
            return deffered;
        }
    }]);

//    app.directive('scfTable', [function () {
//        return {
//            restrict: 'E',
//            replace: true,
//            transclude: 'element',
//            scope: {
//                layoutSource: '@',
//                source: '@',
//                paging: '@',
//                showRowNo: '@'
//            },
//            link: function (scope, el, attr, ctrl, transclude) {
//                transclude(function (transEl, transScope) {
//                    console.log('transEl', transEl);
//                    console.log('transScope.parent', transScope);
//                })
//                console.log('el', el[0]);
//            },
//            controller: ['Service', '$scope', '$transclude', function (Service, $scope, $transclude) {
//
//                var vm = $scope;
//
//                vm.pageItems = [{
//                    label: '10',
//                    value: '10'
//                    }, {
//                    label: '20',
//                    value: '20'
//                    }, {
//                    label: '50',
//                    value: '50'
//                    }];
//                var layoutsource = Service.requestURL(vm.layoutSource);
//                layoutsource.promise.then(function (response) {
//                    vm.layoutItems = response;
//                }).catch();
//
//
//                vm.pageModel = {
//                        number: 0,
//                        size: 20,
//                        totalPages: 0,
//                        totalElements: 0,
//                    }
//                    // 1. Search
//                vm.search = function (pageModel) {
//                    var dataSource = Service.requestURL(vm.source, pageModel);
//                    dataSource.promise.then(function (response) {
//                        var data = response.data;
//                        vm.dataItems = data.content;
//                        vm.pageModel = {
//                                number: data.number,
//                                size: data.size,
//                                totalPages: data.totalPages,
//                                totalElements: data.totalElements,
//                            }
//                            // 2. Split Page
//                        vm.pageDisplay = vm.splitPage(vm.pageModel);
//                    }).catch();
//                }
//
//                vm.search(vm.pageModel);
//                vm.changePage = function (btnAction) {
//
//                    if (btnAction === 'first' || btnAction === 'changeSize') {
//                        vm.pageModel.number = 0;
//                    } else if (btnAction === 'back') {
//                        vm.pageModel.number += -1;
//                    } else if (btnAction === 'next') {
//                        vm.pageModel.number += 1;
//                    } else if (btnAction === 'last') {
//                        vm.pageModel.number = scope.totalPage - 1;
//                    }
//                    vm.search(vm.pageModel);
//                };
//                vm.splitPage = function (paging) {
//                    var pageSize = paging.size,
//                        currentPage = paging.number,
//                        totalRecord = paging.totalElements;
//                    var recordDisplay = '0 - '
//                    if (totalRecord > 0) {
//                        recordDisplay = (currentPage * pageSize + 1) + ' - ';
//                    }
//                    var endRecord = ((currentPage + 1) * pageSize);
//                    if (totalRecord < endRecord) {
//                        endRecord = totalRecord;
//                    }
//
//                    recordDisplay += '' + endRecord + ' of ' + totalRecord;
//
//                    return recordDisplay;
//                };
//
//                vm.renderNo = function (indexNo) {
//                    var rowNo = (vm.pageModel.number * vm.pageModel.size) + (indexNo + 1)
//                    return rowNo;
//                }
//            }],
//            templateUrl: '/js/app/components/templates/table.html'
//        };
//    }]);
//    app.directive('scfPagination', [function () {
//        return {
//            restrict: 'AE',
//            replace: true,
//            scope: {
//                currentPage: '=',
//                pageSizeModel: '=',
//                pageSizeList: '<',
//                totalPage: '=',
//                pageAction: '='
//            },
//            link: fieldLink,
//            template: fieldTemplate
//
//        };
//
//        function fieldLink(scope, element, attrs) {
//
//            scope.$watch('[totalPage, currentPage]', function (value) {
//                disableButton(scope, element);
//            });
//
//            scope.scfPaginationAction = function (btnAction) {
//                var pageModel = {
//                    page: scope.currentPage,
//                    pageSize: scope.pageSizeModel
//                };
//                if (btnAction === 'first' || btnAction === 'changeSize') {
//                    pageModel.page = 0;
//                } else if (btnAction === 'back') {
//                    pageModel.page += -1;
//                } else if (btnAction === 'next') {
//                    pageModel.page += 1;
//                } else if (btnAction === 'last') {
//                    pageModel.page = scope.totalPage - 1;
//                }
//                scope.pageAction(pageModel);
//            };
//
//            if (attrs.dropdownId != undefined) {
//                element[0].children[2].children[0].id = attrs.dropdownId
//            }
//        }
//
//        function disableButton(scope, element) {
//            var totalPage = +scope.totalPage;
//            var currentPage = +scope.currentPage;
//            /* check is first page*/
//            if (currentPage === 0) {
//                /* disable button First, Back page */
//                element[0].children[0].children[0].disabled = true;
//                element[0].children[1].children[0].disabled = true;
//            } else {
//                /* enable button First, Back page*/
//                element[0].children[0].children[0].disabled = false;
//                element[0].children[1].children[0].disabled = false;
//            }
//
//            if (currentPage === (totalPage - 1)) {
//                /* disable button Next, Last page */
//                element[0].children[3].children[0].disabled = true;
//                element[0].children[4].children[0].disabled = true;
//            } else {
//                /* enable button Next, Last page */
//                element[0].children[3].children[0].disabled = false;
//                element[0].children[4].children[0].disabled = false;
//            }
//        }
//
//        function fieldTemplate(element, attrs) {
//            var template = '<ul class="scf-paging form-inline">' + '<li><scf-button type="button" ng-click="scfPaginationAction(\'first\')" class="btn-sm" id="first-page-button"><span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span></scf-button></li>' + '<li><scf-button type="button" ng-click="scfPaginationAction(\'back\')" class="btn-sm" id="back-page-button"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></scf-button></li>' + '<li><scf-dropdown ng-model="pageSizeModel" ng-change="scfPaginationAction(\'changeSize\')" component-data="pageSizeList"></scf-dropdown</li>' + '<li><button type="button" ng-click="scfPaginationAction(\'next\')" class="btn btn-default btn-sm" id="next-page-button"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button></li>' + '<li><button type="button" ng-click="scfPaginationAction(\'last\')" class="btn btn-default btn-sm" id="last-page-button"><span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span></button></li>' + '</ul>';
//            return template;
//        }
//        }])
    app.directive('scfFormLabel', [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: '@'
            },
            templateUrl: '/js/app/components/templates/form-label.html'
        };
        }]);

    app.directive('scfFormTextbox', [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                required: '@',
                name: '@',
                value: '@'
            },
            controller: ['$scope', function ($scope) {
                $scope.model = $scope.$parent.ctrl.model;
                $scope.model[$scope.name] = $scope.value;
            }],
            templateUrl: '/js/app/components/templates/form-textbox.html'
        }
    }]);

})();