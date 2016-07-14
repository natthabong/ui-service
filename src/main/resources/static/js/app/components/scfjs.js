(function() {
	'use strict';

	var app = angular.module('scf-ui', []);

	app.controller('Controller', [ '$scope', function($scope) {
		this.model = {};

	} ]);

	app.factory('Service', [ '$http', '$q', function($http, $q) {
		return {
			requestURL : requestURL
		}

		function requestURL(url, params) {
			var deffered = $q.defer();

			$http({
				method : 'GET',
				url : url,
				data : params
			}).success(function(response) {
				deffered.resolve(response)
			}).error(function(response) {
				deffered.reject(response);
			});
			return deffered;
		}
	} ]);

	app.directive('scfFormLabel', [ '$filter', function($filter) {
		return {
			restrict : 'E',
			replace : true,
			scope : {
				label : '@',
				displayColon : '@',
				bold : '@',
				displayInForm : '@'
			},
			link : function(scope, element, attrs, ctrl) {
				if (scope.displayColon === undefined) {
					scope.hasColon = true;
				} else {
					scope.hasColon = scope.displayColon === 'true';
				}
				if (scope.displayInForm === undefined) {
					scope.isFormItem = true;
				} else {
					scope.isFormItem = scope.displayInForm === 'true';
				}
				scope.isBold = scope.bold === 'true';
			},
			templateUrl : 'js/app/components/templates/form-label.html'
		};
	} ]);

	app.directive('scfFormTextbox', [ function() {
		return {
			restrict : 'E',
			replace : true,
			scope : {
				required : '@',
				name : '@',
				value : '@'
			},
			controller : [ '$scope', function($scope) {
				$scope.model = $scope.$parent.ctrl.model;
				$scope.model[$scope.name] = $scope.value;
			} ],
			templateUrl : '/js/app/components/templates/form-textbox.html'
		}
	} ]);

    app.directive('scfTable', [function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: 'element',
            scope: {
                layoutSource: '<',
                source: '@',
                paging: '@',
                showRowNo: '@',
                actionSets: '=',
                showAction: '@',
				name: '@'
            },
            controller: ['Service', '$scope', '$transclude', function(Service, $scope, $transclude) {
                var vm = $scope;
				var parentModel = vm.$parent.ctrl.model;
				var parentController = vm.$parent.ctrl;
				
				parentController[vm.name] = {};
				var table = parentController[vm.name];
				table.isDirty = false;
				
				if(angular.isArray(vm.layoutSource)){
					vm.layoutItems = vm.layoutSource;
				}else{
					var layoutsource = Service.requestURL(layoutsource);
					layoutsource.promise.then(function(response) {
                    	vm.layoutItems = response;
                	}).catch();
				}
                
                vm.order = '';
                vm.reverse = false;
                vm.initSort = function() {
                    vm.order = '';
                    vm.reverse = false;
                }
                
                vm.pageModel = {
                        number: 0,
                        size: '20',
                        totalPages: 0,
                        totalElements: 0,
                        order: '',
                        orderBy: ''
                    }
                    // 1. Search
                vm.search = function(pageModel) {
					vm.pageModel.size = pageModel.size;
					vm.pageModel.number = pageModel.number;
					
					var parentModel = angular.extend(vm.$parent.ctrl.model, vm.pageModel);
                    var dataSource = Service.requestURL(vm.source, parentModel);
                    dataSource.promise.then(function(response) {
                        var data = response;
                        vm.dataItems = data.content;
                        vm.pageModel = {
                                number: data.number,
                                size: data.size,
                                totalPages: data.totalPages,
                                totalElements: data.totalElements,
                            }
                            // 2. Split Page
                        vm.pageDisplay = vm.splitPage(vm.pageModel);
						table.isDirty = true;
						
                    }).catch();
                }
				
				table.search = function(){
					vm.pageModel = {
                        number: 0,
                        size: '20',
                        totalPages: 0,
                        totalElements: 0,
                        order: '',
                        orderBy: ''
                    }
					vm.search(vm.pageModel);
				}

				vm.splitPage = function(paging) {
                    var pageSize = paging.size,
                        currentPage = paging.number,
                        totalRecord = paging.totalElements;
                    var recordDisplay = '0 - '
                    if (totalRecord > 0) {
                        recordDisplay = (currentPage * pageSize + 1) + ' - ';
                    }
                    var endRecord = ((currentPage + 1) * pageSize);
                    if (totalRecord < endRecord) {
                        endRecord = totalRecord;
                    }

                    recordDisplay += '' + endRecord + ' of ' + totalRecord;

                    return recordDisplay;
                };

                vm.renderNo = function(indexNo) {
                    var rowNo = (vm.pageModel.number * vm.pageModel.size) + (indexNo + 1)
                    return rowNo;
                }

                vm.sortOrder = function(sort) {
                    vm.pageModel.order = sort.order;
                    vm.pageModel.orderBy = sort.orderBy;
                    console.log(vm.pageModel);
                    vm.search(vm.pageModel);
                };
            }],
            templateUrl: '/js/app/components/templates/table.html'
        };
    }]);

    app.directive('scfPagination', [function() {
        return {
            restrict: 'AE',
            replace: true,
            require: '^scfTable',
            scope: {
                number: '<',
                size: '<',
                totalPages: '<'
            },
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var vm = $scope;
                vm.pageModelParentSize = vm.$parent.pageModel.size;
                vm.pageItems = [{
                    label: '10',
                    value: '10'
                }, {
                    label: '20',
                    value: '20'
                }, {
                    label: '50',
                    value: '50'
                }];
                vm.$watch('[totalPages, number]', function(value) {
                    disableButton(vm, $element);
                });

                vm.scfPaginationAction = function(btnAction) {
                    var pageModel = {
                        number: vm.number,
                        size: vm.pageModelParentSize
                    };
                    if (btnAction === 'first' || btnAction === 'changeSize') {
                        pageModel.number = 0;
                    } else if (btnAction === 'back') {
                        pageModel.number += -1;
                    } else if (btnAction === 'next') {
                        pageModel.number += 1;
                    } else if (btnAction === 'last') {
                        pageModel.number = vm.totalPages - 1;
                    }
                    // Call Action search
                    vm.$parent.search(pageModel);
                };
            }],
            link: function(scope, element, attrs) {
                if (attrs.dropdownId != undefined) {
                    element[0].children[2].children[0].id = attrs.dropdownId
                }
            },
            template: fieldTemplate
        };

        function disableButton(scope, element) {
            var totalPage = +scope.totalPages;
            var currentPage = +scope.number;

            /* check is first page*/
            if (currentPage === 0) {
                /* disable button First, Back page */
                element[0].children[0].children[0].disabled = true;
                element[0].children[1].children[0].disabled = true;
            } else {
                /* enable button First, Back page*/
                element[0].children[0].children[0].disabled = false;
                element[0].children[1].children[0].disabled = false;
            }

            if (currentPage === (totalPage - 1)) {
                /* disable button Next, Last page */
                element[0].children[3].children[0].disabled = true;
                element[0].children[4].children[0].disabled = true;
            } else {
                /* enable button Next, Last page */
                element[0].children[3].children[0].disabled = false;
                element[0].children[4].children[0].disabled = false;
            }
        }

        function fieldTemplate(element, attrs) {
            var template = '<ul class="scf-paging form-inline">' + '<li>' + '<button type="button" ng-click="scfPaginationAction(\'first\')" class="btn btn-default btn-sm" id="first-page-button">' + '<span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span>' + '</button>' + '</li>' + '<li>' + '<button type="button" ng-click="scfPaginationAction(\'back\')" class="btn btn-default btn-sm" id="back-page-button">' + '<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>' + '</button>' + '</li>' + '<li>' + '<select data-ng-model="pageModelParentSize" class="form-control" data-ng-change="scfPaginationAction(\'changeSize\')">' + '<option data-ng-repeat="item in pageItems track by $index" value="{{item.value}}">{{item.label}}</option>' + '</select>' + '</li>' + '<li>' + '<button type="button" ng-click="scfPaginationAction(\'next\')" class="btn btn-default btn-sm" id="next-page-button">' + '<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>' + '</button>' + '</li>' + '<li>' + '<button type="button" ng-click="scfPaginationAction(\'last\')" class="btn btn-default btn-sm" id="last-page-button">' + '<span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span>' + '</button>' + '</li>' + '</ul>';
            return template;
        }
    }]);

    app.directive('scfTh', ['$compile', function($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: scfLink
        }

        function scfLink(scope, elements, attrs) {
            scope.$watch(attrs.scfTh, function(column) {
                var htmlText = column.label;
                if (column.sortable) {
                    htmlText = '<span sort by="{{column.field}}" reverse="reverse" order="orders">' + column.label + '</span>';
                }
                elements.html(htmlText);
                $compile(elements.contents())(scope);

            });

        }
    }]);
	
	app.directive('sort', ['$compile', function($compile) {
        return {
            restrict: 'A',
            transclude: true,
			require: '^scfTable',
            scope: false,
            link: function(scope, element, attrs, controller) {
			    scope.onClick = function() {
                    var parent = scope.$parent;
                    scope.by = attrs.by;
                    if (parent.order === scope.by) {
                        parent.reverse = !parent.reverse;
                        scope.orderBy = scope.orderBy === 'asc' ? 'desc' : 'asc';
                    } else {
                        parent.order = scope.by;
                        parent.reverse = false;
                        scope.orderBy = 'asc';
                    }
					var sortOrder = {
						order: parent.order,
						orderBy: scope.orderBy
					}
                    scope.$parent.sortOrder(sortOrder);
                }
            },
            template: '<a href="#" class="gec-table-sort" ng-click="onClick()">' +
                '<span ng-transclude></span>' +
                '<i class="glyphicon" ng-class="{\'glyphicon-menu-down\' : order === by && !reverse,  \'glyphicon-menu-up\' : order===by && reverse}"></i>' +
                '</a>'
        };
    }]);

})();