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

		function requestURL(url, params, method) {
			var deffered = $q.defer();

			$http({
				method : method || 'POST',
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
})();