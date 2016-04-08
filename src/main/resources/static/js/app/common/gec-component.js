(function() {
    'use strict';

    angular.module('ui/template/scftemplate', []).run(["$templateCache", function($templateCache) {
        $templateCache.put('ui/template/calendar.html',
            '<p class="input-group">' 
						   + '<input type="text" id="{{componentId}}" class="form-control" readonly ng-model="textModel" uib-datepicker-popup="{{dateFormat}}" is-open="isOpen" close-text="Close" min-date="minDate" max-date="maxDate"/>' 
						   + '<span class="input-group-btn">' + '<button type="button" class="btn btn-default" ng-click="openCalendar()">' 
						   + '<i class="glyphicon glyphicon-calendar"></i>' + '</button>' + "</span>" + '</p>');
		
		$templateCache.put('ui/template/data_table.html',
                           '<table st-table="componentDatas" class="table table-bordered">'
						   +'<thead><tr>'
                            +'<th ng-if="showRowNo" ng-class="{\'{{rowNoField.cssTemplate}}\': true}" ng-bind="rowNoField.label"></th>'
						    +'<th class="text-center" ng-repeat="column in tableColumns track by $index">'
							   +'<span ng-if="column.sortData" sort by="{{column.field}}" reverse="reverse" order="order">'
							     +'<span ng-bind="column.label"></span>'
							   +'</span>'
							   +'<span ng-if="!column.sortData"  ng-bind="column.label">'+'</span>'
							+'</th>'
						   +'</tr>'
							+'</thead>'
                
						   +'<tbody>'
						   +'<tr ng-repeat="data in componentDatas track by $index">'
                             +'<td ng-if="showRowNo" ng-class="{\'{{rowNoField.cssTemplate}}\': true}" ng-bind="$index + 1"></td>'
                
						     +'<td ng-repeat="column in tableColumns" ng-class="{\'{{column.cssTemplate}}\': true}">'
						        +'<span ng-switch on="column.cellTemplate">'
                                  +'<span ng-switch-when="undefined">'
                                    +'<gec-filter render="data[column.field]" filter-type="column.filterType" filter-format="column.filterFormat"></gec-filter>'
                                  +'</span>'
						          +'<span ng-switch-default render-html="column.cellTemplate"></span>'
						        +'</span>'                            
						     +'</td>'
						   +'</tr>'
						   +'</tbody>'
						   +'</talbe>'
						  );
    }]);

    angular.module('scf-component', ['ui/template/scftemplate'])
        .directive('scfInputText', [function() {
            return {
                restrict: 'AE',
                scope: {
                    componentModel: '=',
                    componentDisabled: '=',
                    componentId: '@'
                },
                link: function(scope, element, attrs) {                    
                    if(scope.conponentDisabled === undefined){
                        scope.componentDisabled = false;
                    }
                },
                template: '<input type="text" class="form-control" ng-model="componentModel" id="{{componentId}}" ng-disabled="componentDisabled"/>'
            };
        }])
		.directive('scfInputPassword', [function() {
            return {
                restrict: 'AE',
                scope: {
                    componentModel: '=',
                    componentId: '@'
                },
                template: '<input type="password" class="form-control" ng-model="componentModel" id="{{componentId}}"/>'
            };
        }])
		.directive('scfButton', [function() {
            return {
                restrict: 'AE',
                transclude: true,
				scope: {
                    componentDisabled: '=',
                    componentId: '@',
                    componentLabel: '@label'
                },
                link: function(scope, element, attrs) {
                                
                    if(scope.componentDisabled === undefined){
                        scope.componentDisabled = false;
                    }
                },
//                template: '<button type="button" class="btn btn-default btn-md" id="{{textId}}" ng-click="componentClick()">' + '{{label}}' + '</button>'
				template: '<button type="button" class="btn btn-default btn-md" id="{{componentId}}" ng-disabled="componentDisabled">'
                + '<ng-transclude></ng-transclude>&nbsp;'
                + '{{componentLabel}}' + '</button>'
            };
        }])
        .directive('scfTextArea', [function() {
            return {
                restrict: 'AE',
                scope: {
                    componentModel: '=',
                    componentDisabled: '=',
                    componentId: '@'
                },
                link: function(scope, element, attrs) {
                                        
                    if(scope.componentDisabled === undefined){
                        scope.componentDisabled = false;
                    }
                },
                template: '<textarea class="form-control" style="resize:none;" rows="5" ng-model="componentModel" id="{{componentId}}" ng-disabled="componentDisabled"></textarea>'
            };
        }])
        .directive('scfDropdown', [function() {
            return {
                restrict: 'AE',
                scope: {
                    componentModel: '=',
                    componentData: '<',
                    componentId: '@'
                },
                link: function(scope, element, attrs) {
                    scope.textId = 'select1';
                    if (attrs.id != undefined) {
                        scope.textId = attrs.id;
                    }
                },
                template: '<select ng-model="componentModel" class="form-control" id="{{componentId}}">' 
                + '<option ng-repeat="option in componentData track by option.value" value="{{option.value}}">{{option.label}}</option>' 
                + '</select>'
            };
        }])
        .directive('scfRadio', [function() {
            return {
                restrict: 'AE',
                scope: {
                    componentModel: '=',
                    componentValue: '<',
                    componentId: '@',
                    componentName: '@',
                    componentDisabled: '='
                },
                link: function(scope, element, attrs) {
                    if(scope.componentDisabled === undefined){
                        scope.componentDisabled = false;
                    }                    
                },
                template: '<input type="radio" name="{{componentName}}" id="{{componentId}}" ng-model="componentModel" value="{{componentValue}}" ng-disabled="componentDisabled"/>'
            };
        }])
		.directive('scfCheckbox', ['$compile', function($compile) {
            return {
                restrict: 'AE',
                scope: {
                    componentModel: '=',
                    componentValue: '<',
                    componentChecked: '=',
                    componentId: '@',
                    componentDisabled: '='
                },
                link: function(scope, element, attrs) {
                    
                    var htmlTag = '<input type="checkbox" id="{{componentId}}" value="{{componentValue}}" ng-checked="{{componentChecked}}" ng-disabled="componentDisabled"';
                    
                    if(scope.componentModel !== undefined){
                        htmlTag += ' ng-model="componentModel"';
                    }
                    htmlTag += ' />';
                    
                    element.html(htmlTag);
                    $compile(element.contents())(scope);
                    
                },
//                template: '<input type="checkbox" id="{{componentId}}" value="{{componentValue}}" ng-checked="{{componentChecked}}"/>'


            };
        }])
        .directive('scfDatePicker', ['$templateCache', '$compile', function($templateCache, $compile) {
            return {
                restrict: 'AE',
                scope: {
                    textModel: '=',
                    dateFormat: '@',
                    isOpen: '=',
                    openCalendar: '&',
                },
                link: function(scope, element, attrs) {
                    if (attrs.id != undefined) {
                        scope.componentId = attrs.id;
                    }
                },
                templateUrl: 'ui/template/calendar.html'

            };
        }])
		.directive('scfDatePickerFrom', ['$templateCache', '$compile', function($templateCache, $compile) {
            return {
                restrict: 'AE',
                scope: {
                    textModel: '=',
                    dateFormat: '@',
                    isOpen: '=',
                    openCalendar: '&',
                    maxDate: '='

                },
                link: function(scope, element, attrs) {
                    scope.minDate = null;
                    if (attrs.id != undefined) {
                        scope.componentId = attrs.id;
                    }


                },
                templateUrl: 'ui/template/calendar.html'
            };
        }])
		.directive('scfDatePickerTo', ['$templateCache', '$compile', function($templateCache, $compile) {
            return {
                restrict: 'AE',

                scope: {
                    textModel: '=textModel',
                    dateFormat: '@',
                    isOpen: '=',
                    openCalendar: '&',
                    minDate: '='
                },
                link: function(scope, element, attrs) {
                    scope.maxDate = null;
                    if (attrs.id != undefined) {
                        scope.componentId = attrs.id;
                    }
                },
                templateUrl: 'ui/template/calendar.html'
            };
        }])
		.directive('scfDataTable', ['$compile', '$parse', function($compile, $parse) {
			return {
				restrict: 'AE',
                transclude: true,
                scope: true,               
				link: function(scope, element, attrs){    
										
				},
				controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){
					var vm = $scope;
					vm.tableColumns = [];
					vm.order = '';
					vm.reverse = false;
					vm.rowIndex = 1;
					vm.rowNoField ={};
                    vm.showRowNo = false;
                    
                    vm.$watch($attrs.componentConfig, function(dataConfig){
                        dataConfig.columns.forEach(function(data){
                            if(data['showRowNo']){
                                 vm.showRowNo = true;
                                vm.rowNoField = {
										   label: data['label'],
                                    cssTemplate: data['cssTemplate']
										   };
                            }else{
                            var rowData = {field: data['field'], 
										   label: data['label'], 
										   cellTemplate: data['cellTemplate'],
										  sortData: data['sortData'],
										  cssTemplate: data['cssTemplate'],
                                          filterType: data['filterType'],
                                          filterFormat: data['filterFormat']};
                            vm.tableColumns.push(rowData);
                            }
                        });
                    });
                    
                    vm.$watch($attrs.componentDatas, function(data){
                        vm.componentDatas = data;
                    });					
				}],
				templateUrl: 'ui/template/data_table.html'
//				template: '<table st-table="componentDatas" class="table table-bordered">'
//						   +'<thead><tr>'
//                            +'<th ng-if="showRowNo" ng-class="{\'{{rowNoField.cssTemplate}}\': true}" ng-bind="rowNoField.label"></th>'
//						    +'<th class="text-center" ng-repeat="column in tableColumns track by $index">'
//							   +'<span ng-if="column.sortData" sort by="{{column.field}}" reverse="reverse" order="order">'
//							     +'<span ng-bind="column.label"></span>'
//							   +'</span>'
//							   +'<span ng-if="!column.sortData"  ng-bind="column.label">'+'</span>'
//							+'</th>'
//						   +'</tr>'
//							+'</thead>'
//                
//						   +'<tbody>'
//						   +'<tr ng-repeat="data in componentDatas track by $index">'
//                             +'<td ng-if="showRowNo" ng-class="{\'{{rowNoField.cssTemplate}}\': true}" ng-bind="$index + 1"></td>'
//                
//						     +'<td ng-repeat="column in tableColumns" ng-class="{\'{{column.cssTemplate}}\': true}">'
//						        +'<span ng-switch on="column.cellTemplate">'
//                                  +'<span ng-switch-when="undefined">'
//                                    +'<gec-filter render="data[column.field]" filter-type="column.filterType" filter-format="column.filterFormat"></gec-filter>'
//                                  +'</span>'
//						          +'<span ng-switch-default render-html="column.cellTemplate"></span>'
//						        +'</span>'                            
//						     +'</td>'
//						   +'</tr>'
//						   +'</tbody>'
//						   +'</talbe>'
			};
        }])
		.directive('sort', ['$compile', function($compile){
			return {
				
				restrict: 'A',
				transclude: true,
				scope: false,
				link: function(scope, element, attrs){
					scope.onClick = function () {						
						var parent = scope.$parent.$parent;
						scope.by = attrs.by;
						if( parent.order === scope.by ) {							
						   parent.reverse = !parent.reverse;
							scope.orderBy = scope.orderBy ==='asc'?'desc':'asc';
						} else {
						  parent.order = scope.by;
						  parent.reverse = false;
							scope.orderBy = 'asc';
						}
						
						 scope.$parent.sortData(scope.order, scope.orderBy);
					}
				},
				template : 
				  '<a ng-click="onClick()" class="gec-pointer">'+
					'<span ng-transclude></span>'+ 
					'<i class="glyphicon" ng-class="{\'glyphicon-menu-down\' : order === by && !reverse,  \'glyphicon-menu-up\' : order===by && reverse}"></i>'+
				  '</a>'
				};
		}])
        .directive('gecFilter', ['$compile', '$filter', function($compile, $filter){
            return{
                restrict: 'E',
                replace: true,
                scope: {
                    filterData: '=render',
                    filterType: '=',
                    filterFormat: '='
                },
                link: function(scope, element, attrs){
                    var filterData = scope.filterData;
                    var filterType = scope.filterType;
                    var filterFormat = scope.filterFormat;
                    
                    if(filterType === undefined){
                        element.html(filterData);
                    }else{                        
                        var data = '';
                        if(filterType === 'date'){
                            var pDate = Date.parse(filterData);
                            data = $filter(filterType)(new Date(pDate), filterFormat);
                        }else{
                            data = $filter(filterType)(filterData, filterFormat);
                        }
                        
                        element.html(data);
                    }
                    $compile(element.contents())(scope);
                },
            }
        }])
        .directive('renderHtml', ['$compile', function ($compile) {
			return {
				restrict: 'A',
				replace: true,
				scope:false,
				
				link: function postLink(scope, element, attrs) {
					scope.$watch(attrs.renderHtml, function(html) {
						element.html(html);
						$compile(element.contents())(scope);
					  });
				  }
			};
		}]);

})();