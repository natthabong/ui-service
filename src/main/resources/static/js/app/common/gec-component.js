(function() {
    'use strict';

    angular.module('ui/template/scftemplate', []).run(["$templateCache", function($templateCache) {
        $templateCache.put('ui/template/calendar.html',
            '<p class="input-group">' 
						   + '<input type="text" class="form-control" readonly ng-model="textModel" uib-datepicker-popup="{{dateFormat}}" is-open="isOpen" close-text="Close" min-date="minDate" max-date="maxDate"/>' 
						   + '<span class="input-group-btn">' + '<button type="button" class="btn btn-default" ng-click="openCalendar()">' 
						   + '<i class="glyphicon glyphicon-calendar"></i>' + '</button>' + "</span>" + '</p>');
		
		$templateCache.put('ui/template/data_table.html',
                           '<table st-table="componentDatas" class="table table-bordered">'
						   +'<thead><tr>'
						   +'<th ng-if="showCheckBox" ng-class="{\'{{checkBoxField.cssTemplate}}\': true}" render-html="checkBoxField.label"></th>'
                            +'<th ng-if="showRowNo" ng-class="{\'{{rowNoField.cssTemplate}}\': true}" ng-bind="rowNoField.label"></th>'
						    +'<th class="text-center" ng-repeat="column in tableColumns track by $index">'
							   +'<span ng-if="column.sortData" sort by="{{column.field}}" reverse="reverse" order="order">'
							     +'<span ng-bind="column.label"></span>'
							   +'</span>'
                                +'<span ng-if=""></span>'    
							   +'<span ng-if="!column.sortData"  render-html="column.label">'+'</span>'
							+'</th>'
						   +'</tr>'
							+'</thead>'
                
						   +'<tbody>'
						   +'<tr ng-repeat="data in componentDatas track by $index" ng-class-odd="\'tr-odd\'" ng-class-even="\'tr-even\'">'
						   	+'<td ng-if="showCheckBox" ng-class="{\'{{checkBoxField.cssTemplate}}\': true}" render-html="checkBoxField.cellTemplate"></td>'
                             +'<td ng-if="showRowNo" ng-class="{\'{{rowNoField.cssTemplate}}\': true}" ng-bind="(currentPage * perpage)+($index + 1)"></td>'
                
						     +'<td ng-repeat="column in tableColumns" ng-class="{\'{{column.cssTemplate}}\': true}">'
						        +'<span ng-switch on="column.cellTemplate">'
                                  +'<span ng-switch-when="undefined">'
                                    +'<scf-filter render="data[column.field]" filter-type="column.filterType" filter-format="column.filterFormat"></scf-filter>'
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
                    componentDisabled: '='                    
                },
                link: function(scope, element, attrs) {
                    if(attrs.textId != undefined){
                        element[0].children[0].id = attrs.textId;
                    }
                    if(scope.conponentDisabled === undefined){
                        scope.componentDisabled = false;
                    }
                },
                template: '<input type="text" class="form-control" ng-model="componentModel" ng-disabled="componentDisabled"/>'
            };
        }])
		.directive('scfInputPassword', [function() {
            return {
                restrict: 'AE',
                scope: {
                    componentModel: '='
                },
                link: function(scope, element, attrs){
                    if(attrs.textId != undefined){
                        element[0].children[0].id = attrs.textId;
                    }
                },
                template: '<input type="password" class="form-control" ng-model="componentModel"/>'
            };
        }])
		.directive('scfButton', [function() {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
				template: btnTemplate
            };
            
            function btnTemplate(element, attrs){
                var btnType = (typeof attrs.type === 'undefined') ? 'button': attrs.type;
                return '<button type="'+ btnType +'" class="btn btn-default">'
                + '<ng-transclude></ng-transclude>'
                + '</button>';
            }
        }])
        .directive('scfTextArea', [function() {
            return {
                restrict: 'AE',
                scope: {
                    componentModel: '=',
                    componentDisabled: '=',
                },
                link: function(scope, element, attrs) {
                    if(attrs.textId != undefined){
                        element[0].children[0].id = attrs.textId;
                    }
                    if(scope.componentDisabled === undefined){
                        scope.componentDisabled = false;
                    }
                },
                template: '<textarea class="form-control" style="resize:none;" rows="5" ng-model="componentModel" ng-disabled="componentDisabled"></textarea>'
            };
        }])
        .directive('scfDropdown', [function() {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    componentData: '<'
                },
                link: function(scope, element, attrs) {
                    
                },
                template: '<select class="form-control">' 
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
                    componentName: '@',
                    componentDisabled: '='
                },
                link: function(scope, element, attrs) {
                    if(attrs.radioId != undefined){
                        element[0].children[0].id = attrs.radioId;
                    }
                    if(scope.componentDisabled === undefined){
                        scope.componentDisabled = false;
                    }                    
                },
                template: '<input type="radio" name="{{componentName}}" ng-model="componentModel" value="{{componentValue}}" ng-disabled="componentDisabled"/>'
            };
        }])
		.directive('scfCheckbox', [function() {
            return {
                restrict: 'AE',
                replace: true,
                template: checkboxTemplate
            };
            
            function checkboxTemplate(element, attrs){
                return '<input type="checkbox"/>';
            }
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
                    if (attrs.textId != undefined) {
                    	element[0].children[0].children[0].id = attrs.textId;
                    }
                    
                    if(attrs.buttonId != undefined){                    	
                    	element[0].children[0].children[2].children[0].id = attrs.buttonId;
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
                    if (attrs.textId != undefined) {
                    	element[0].children[0].children[0].id = attrs.textId;
                    }
                    
                    if(attrs.buttonId != undefined){                    	
                    	element[0].children[0].children[2].children[0].id = attrs.buttonId;
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
                    if (attrs.textId != undefined) {
                    	element[0].children[0].children[0].id = attrs.textId;
                    }
                    
                    if(attrs.buttonId != undefined){                    	
                    	element[0].children[0].children[2].children[0].id = attrs.buttonId;
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
                    if(attrs.componentId != undefined){
                        element[0].children[0].id = attrs.componentId;
                    }
				},
				controller: ['$scope', '$element', '$attrs', '$window', '$document', function($scope, $element, $attrs, $window, $document){
					var vm = $scope;
					vm.tableColumns = [];
					vm.order = '';
					vm.reverse = false;
					vm.rowIndex = 1;
					vm.rowNoField ={};
                    vm.showRowNo = false;
					vm.showCheckBox = false;
					vm.checkBoxField = {};
                    vm.currentPage = $attrs.currentPage;
                    vm.totalPage = $attrs.totalPage;
                    vm.currentPage = 0;
                    vm.perpage = 10;
                    
                    
                    vm.$watch($attrs.componentConfig, function(dataConfig){
                        var tableOption = dataConfig.options;
//                        vm.pageScroll = (tableOption.tabelScroll === 'undefined') ? false: tableOption.tabelScroll;
//                        vm.fnSearch = tableOption.searchFunction;
                        dataConfig.columns.forEach(function(data){
                            if(data['showRowNo']){
                                 vm.showRowNo = true;
                                vm.rowNoField = {
										   label: data['label'],
                                    cssTemplate: data['cssTemplate']
										   };
                            }else if(data['showCheckBox']){
								vm.showCheckBox = true;
								vm.checkBoxField  = {
									label: data['label'],
									cssTemplate: data['cssTemplate'],
									cellTemplate: data['cellTemplate']
								}
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
                    
                    function paginationScroll(){
                        angular.element($window).bind('scroll', function(){
                                if($window.pageYOffset + $window.innerHeight >=$document[0].body.clientHeight){                                    
                                    if(vm.currentPage < vm.totalPage){
                                        var nextPage = parseInt(vm.currentPage) + 1;
                                        vm.fnSearch(nextPage);
                                    }
                                    
                                }
                            });
                    }
				}],
				templateUrl: 'ui/template/data_table.html'
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
        .directive('scfFilter', ['$compile', '$filter', function($compile, $filter){
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
		}])
    .directive('scfPagination', [function(){
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                currentPage: '=',
                pageSizeModel: '=',
                pageSizeList: '<',
                totalPage: '<',
                pageAction: '='
            },
            link: fieldLink,
            template: fieldTemplate
                
        };
        
        function fieldLink(scope, element, attrs){
            scope.$watch('currentPage', function(){
                disableButton(scope, element);
            });
            
            
            scope.scfPaginationAction = function(btnAction){
                var pageModel = {
                    page: scope.currentPage,
                    pageSize: scope.pageSizeModel
                };
                if(btnAction === 'first' || btnAction === 'changeSize'){
                    pageModel.page = 0;
                }else if(btnAction === 'back'){
                    pageModel.page += -1;
                }else if(btnAction === 'next'){
                    pageModel.page += 1;
                }else if(btnAction === 'last'){
                    pageModel.page = scope.totalPage;
                }
                scope.pageAction(pageModel);
            };
        }
        
        function disableButton(scope, element){
            /* check is first page*/
            if(scope.currentPage === 0){
                /* disable button First, Back page */
                element[0].children[0].children[0].disabled = true;                    
                element[0].children[1].children[0].disabled = true;
            }else{
                 /* enable button First, Back page*/
                element[0].children[0].children[0].disabled = false;                    
                element[0].children[1].children[0].disabled = false;
            } 
            
            if(scope.currentPage === scope.totalPage){
                /* disable button Next, Last page */
                 element[0].children[3].children[0].disabled = true;                    
                 element[0].children[4].children[0].disabled = true;                    
            }else{ 
                /* enable button Next, Last page */              
                element[0].children[3].children[0].disabled = false;                    
                element[0].children[4].children[0].disabled = false;
            }
        }
        
        function fieldTemplate(element, attrs){
            var template = '<ul class="scf-paging form-inline">'
                +'<li><scf-button type="button" ng-click="scfPaginationAction(\'first\')" class="btn-sm" id="first-page-button"><span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span></scf-button></li>'
                +'<li><scf-button type="button" ng-click="scfPaginationAction(\'back\')" class="btn-sm" id="back-page-button"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></scf-button></li>'
                +'<li><scf-dropdown ng-model="pageSizeModel" ng-change="scfPaginationAction(\'changeSize\')" component-data="pageSizeList"></scf-dropdown</li>'
                +'<li><button type="button" ng-click="scfPaginationAction(\'next\')" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button></li>'
                +'<li><button type="button" ng-click="scfPaginationAction(\'last\')" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span></button></li>'
                +'</ul>';
            return template;
        }
    }])
    .directive('scfModal', function () {
    return {
      template: '<div class="modal" data-keyboard="false" data-backdrop="static">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content" ng-transclude></div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });;

})();