(function() {
	'use strict';

	var app = angular.module('scf-ui', []);

	app.controller('Controller', [ '$scope', function($scope) {
		this.model = {};

	} ]);

	app.factory('Service', [ '$http', '$q', function($http, $q) {
		return {
			requestURL : requestURL,
			doGet : doGet,
			doPut : doPut,
			doPost : doPost
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
		
		function doGet(url, params) {
			var deffered = $q.defer();
			$http({
				method : 'GET',
				url : url,
				params : params
			}).success(function(data, status, headers, config) {
				 
				deffered.resolve({data:data, headers:headers})
			}).error(function(response) {
				deffered.reject(response);
			});
			return deffered;
		}
		
		function doPut(url, params) {
			var deffered = $q.defer();

			$http({
				method : 'PUT',
				url : url,
				data : params
			}).success(function(data, status, headers, config) {
				 
				deffered.resolve({data:data, headers:headers})
			}).error(function(response) {
				deffered.reject(response);
			});
			return deffered;
		}
		
		function doPost(url, params) {
			var deffered = $q.defer();

			$http({
				method : 'POST',
				url : url,
				data : params
			}).success(function(data, status, headers, config) {
				deffered.resolve({data:data, headers:headers})
			}).error(function(response) {
				deffered.reject(response);
			});
			return deffered;
		}
	} ]);
	
	app.service('PageNavigation', [
	    '$filter',
	    '$http',
	    '$log',
	    '$q',
	    '$state',
	    function($filter, $http, $log, $q, $state) {
	        var vm = this;
	        var log = $log;

	        var homePage = '/';

	        var previousPages = new Array();
	        var steps = new Array();

	        vm.gotoPage = function(page, params, keepStateObject) {
	            var currentState = $state.current.name == '' ? '/' : $state.current.name;
	            previousPages.push({
	                page: currentState,
	                stateObject: keepStateObject
	            });
	            if (params === undefined) {
	                params = {};
	            }
	            params.backAction = false;
	            $state.go(page, params);
	        }

	        vm.gotoPreviousPage = function(reset) {
	            var previousPage = previousPages.pop();
	            if (previousPage != null) {
	                if (previousPage.stateObject === undefined) {
	                    previousPage.stateObject = {};
	                }
	                previousPage.stateObject.backAction = true;
	                $state.go(previousPage.page, reset ? {} : previousPage.stateObject, {
	                    reload: reset
	                });
	            } else {
	                $state.go(homePage);
	            }
	        }

	        vm.nextStep = function(nextPage, params, keepStateObject) {
	            steps.push({
	                page: $state.current.name,
	                stateObject: keepStateObject
	            });

	            params.backAction = false;

	            $state.go(nextPage, params);
	        }

	        vm.backStep = function(reset) {
	            var previousStep = steps.pop();
	            if (previousStep != null) {
	                previousStep.stateObject.backAction = true;
	                $state.go(previousStep.page, reset ? {} : previousStep.stateObject, {
	                    reload: reset
	                });
	            }
	        }

	    }
	]);

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

    app.directive('scfComponentTable', [function() {
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