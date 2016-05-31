(function() {
    'use strict';

    angular.module('ui/template/scftemplate', []).run(["$templateCache", function($templateCache) {
        $templateCache.put('ui/template/calendar.html',
            '<p class="input-group">' 
						   + '<input type="text" class="form-control" readonly ng-model="textModel" uib-datepicker-popup="{{dateFormat}}" is-open="isOpen" close-text="Close" min-date="minDate" max-date="maxDate"/>' 
						   + '<span class="input-group-btn">' + '<button type="button" class="btn btn-default" ng-click="openCalendarAction()">' 
						   + '<i class="glyphicon glyphicon-calendar"></i>' + '</button>' + "</span>" + '</p>');
		
		$templateCache.put('ui/template/data_table.html',
						'<table st-table="componentDatas" class="table table-bordered">'
						   +'<thead><tr><th class="text-center" scf-th="column" ng-repeat="column in tableColumns track by $index"></th>'
						   +'</tr>'
							+'</thead>'                
						   +'<tbody>'
						   +'<tr ng-repeat="data in componentDatas track by $id(data)" ng-class-odd="\'tr-odd\'" ng-class-even="\'tr-even\'">'
		                +'<td scf-td="data" ng-repeat="column in tableColumns" column-render="column" index-no="$parent.$index" page-options="pageOptions"></td>'
						   +'</tr>'
						   +'</tbody>'
						   +'</talbe>'
						  );
    }]);

    angular.module('scf-component', ['ui/template/scftemplate'])
        .directive('scfInputText', [function() {
            return {
                restrict: 'AE',
                replace: true,
                template: '<input type="text" class="form-control"/>'
            };
        }])
		.directive('scfInputPassword', [function() {
            return {
                restrict: 'AE',
                replace: true,
                template: '<input type="password" class="form-control"/>'
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
                replace: true,                
                template: '<textarea class="form-control" style="resize:none;" rows="5"></textarea>'
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
                replace: true,
                template: '<input type="radio"/>'
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
                replace: true,
                scope: {
                    textModel: '=',
                    dateFormat: '@',
                    isOpen: '=',
                    openCalendarAction: '&',
                },
                link: function(scope, element, attrs) {
                    if (attrs.textId !== undefined) {
                    	element[0].children[0].id = attrs.textId;
                    }
                    
                    if(attrs.buttonId !== undefined){                    	
                    	element[0].children[2].children[0].id = attrs.buttonId;
                    }
                },
                templateUrl: 'ui/template/calendar.html'

            };
        }])
		.directive('scfDatePickerFrom', ['$templateCache', '$compile', function($templateCache, $compile) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    textModel: '=',
                    dateFormat: '@',
                    isOpen: '=',
                    openCalendarAction: '&',
                    maxDate: '='

                },
                link: function(scope, element, attrs) {
                    scope.minDate = null;
                    if (attrs.textId !== undefined) {
                    	element[0].children[0].id = attrs.textId;
                    }
                    
                    if(attrs.buttonId !== undefined){                    	
                    	element[0].children[2].children[0].id = attrs.buttonId;
                    }
                },
                templateUrl: 'ui/template/calendar.html'
            };
        }])
		.directive('scfDatePickerTo', ['$templateCache', '$compile', function($templateCache, $compile) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    textModel: '=textModel',
                    dateFormat: '@',
                    isOpen: '=',
                    openCalendarAction: '&',
                    minDate: '='
                },
                link: function(scope, element, attrs) {
                    scope.maxDate = null;
                    if (attrs.textId !== undefined) {
                    	element[0].children[0].id = attrs.textId;
                    }
                    
                    if(attrs.buttonId !== undefined){                    	
                    	element[0].children[2].children[0].id = attrs.buttonId;
                    }
                },
                templateUrl: 'ui/template/calendar.html'
            };
        }])
		.directive('scfDataTable', ['$compile', '$parse', function($compile, $parse) {
			return {
				restrict: 'AE',
                transclude: true,
				replace: true,
                scope: true,
				controller: ['$scope', '$element', '$attrs', '$window', '$document', function($scope, $element, $attrs, $window, $document){
					var vm = $scope;
					vm.tableColumns = [];
					vm.order = '';
					vm.reverse = false;
					
                    vm.pageOptions = {currentPage: 0, recordPerPage: 20};
                    
                    vm.$watch($attrs.currentPage, function(data){
                        if(data !== undefined){
                            vm.pageOptions.currentPage = data;
                        }
                    });
                    
                    vm.$watch($attrs.recordPerPage, function(data){
                        if(data !== undefined){
                            vm.pageOptions.recordPerPage = data;
                        }
                    });
                    
                    vm.$watch($attrs.componentConfig, function(dataConfig){
                        var tableOption = dataConfig.options;                        
                        dataConfig.columns.forEach(function(data){
                            	var rowData = {field: data['field'],
                                               id:data['id'],
										   label: data['label'], 
										   cellTemplate: data['cellTemplate'],
										  sortData: data['sortData'],
										  cssTemplate: data['cssTemplate'],
                                          filterType: data['filterType'],
                                          filterFormat: data['filterFormat']};
                            vm.tableColumns.push(rowData);
                        });
                        
                        //Check option set to Show row number.
                        if(tableOption.displayRowNo !== undefined){
                            var rowData = {
                                    field: 'no',
                                    label: 'No.', 
                                    id:tableOption.displayRowNo['id'],
								    };
                            vm.tableColumns.splice(0, 0, rowData);
                        };
                        //Check option set to Show select box
                        if(tableOption.displaySelect !== undefined){
                            var rowData = {field: tableOption.displaySelect['field'],
                                               id:tableOption.displaySelect['id'],
										   label: tableOption.displaySelect['label'], 
										   cellTemplate: tableOption.displaySelect['cellTemplate']};
                            
                            if(tableOption.displaySelect['displayPosition'] === 'first'){
                                vm.tableColumns.splice(0, 0, rowData);
                            }else{
                                vm.tableColumns.push(rowData);
                            }
                        }
                    });                                    
                    
                    vm.$watch($attrs.componentDatas, function(data){                        
                        vm.componentDatas = data;
                    });

				}],
				templateUrl: 'ui/template/data_table.html'
                
        }}])
        .directive('scfTh', ['$compile', function($compile){
            return {
                restrict: 'A',
                replace: true,
                link: scfLink
            }
            
            function scfLink(scope, elements, attrs){
                scope.$watch(attrs.scfTh, function(column){
                    var htmlText = column.label;
                    if(column.sortData){
                       htmlText = '<span sort by="{{column.field}}" reverse="reverse" order="orders">'+column.label+'</span>';
                    }
                    elements.html(htmlText);
                    $compile(elements.contents())(scope);
                    
                });
                
            }
        }])
        .directive('scfTd', ['$compile', '$filter', function($compile, $filter){
            return {
                restrict: 'A',
                replace: true,
                link: scfLink
            }
            
            function scfLink(scope, elements, attrs){
                var pageOptions = scope.$eval(attrs.pageOptions);
                
                scope.$watch(attrs.scfTd, function(data){
                    var rowNo  = renderNo(scope, attrs, pageOptions);
                    var column = scope.$eval(attrs.columnRender);
                    var dataRender = '';
                    var colClass = column.cssTemplate || 'text-center';
                    
                    if(column.id !== undefined){
                        elements[0].id = addId(rowNo, column.id);
                    }
                    
                    if(column.field === 'no'){
                        elements.addClass(colClass);
                        elements.text(rowNo);
                        return;
                    }
                    
                    if(column.filterType !== undefined){
                        dataRender = filterData(column, data);
                    }else{
                        dataRender = data[column.field] || column.cellTemplate;
                    }
                    
                    elements.addClass(colClass);
                    elements.html(dataRender);
                    $compile(elements.contents())(scope);

                });
            }
            
            function renderNo(scope, attrs, pageOptions){
                var indexNo = scope.$eval(attrs.indexNo);
                var rowNo = (pageOptions.currentPage * pageOptions.recordPerPage)+(indexNo + 1)
                return rowNo;
            }
            
            function filterData(column, dataColumn){
                var filterType = column.filterType;
                var filterFormat = column.filterFormat;
                var data = dataColumn[column.field];
                
                var result = '';
                if(filterType === 'date'){
                    var pDate = Date.parse(data);
                    result = $filter(filterType)(new Date(pDate), filterFormat);
                }else{
                    result = $filter(filterType)(data, filterFormat);
                }
                return result;
            }
            
            function addId(rowNo, columnId){
                return columnId.replace('{{$index}}', rowNo -1);
            }
        }])
		.directive('sort', ['$compile', function($compile){
			return {
				
				restrict: 'A',
				transclude: true,
				scope: false,
				link: function(scope, element, attrs){
					scope.onClick = function () {
						var parent = scope.$parent;
						scope.by = attrs.by;
						if( parent.order === scope.by ) {							
						   parent.reverse = !parent.reverse;
							scope.orderBy = scope.orderBy ==='asc'?'desc':'asc';
						} else {
						  parent.order = scope.by;
						  parent.reverse = false;
						  scope.orderBy = 'asc';
						}
						scope.$parent.sortData(parent.order, scope.orderBy);
					}
				},
				template : 
				  '<a href="#" ng-click="onClick()">'+
					'<span ng-transclude></span>'+ 
					'<i class="glyphicon" ng-class="{\'glyphicon-menu-down\' : order === by && !reverse,  \'glyphicon-menu-up\' : order===by && reverse}"></i>'+
				  '</a>'
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
	                totalPage: '=',
	                pageAction: '='
	            },
	            link: fieldLink,
	            template: fieldTemplate
	                
	        };
        
	        function fieldLink(scope, element, attrs){
	            
	            scope.$watch('[totalPage, currentPage]',function(value){
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
	                    pageModel.page = scope.totalPage-1;
	                }
	                scope.pageAction(pageModel);
	            };
				
				if(attrs.dropdownId != undefined){
					element[0].children[2].children[0].id=attrs.dropdownId
				}
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
	            
	            if(scope.currentPage === (scope.totalPage -1)){
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
	                +'<li><button type="button" ng-click="scfPaginationAction(\'next\')" class="btn btn-default btn-sm" id="next-page-button"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button></li>'
	                +'<li><button type="button" ng-click="scfPaginationAction(\'last\')" class="btn btn-default btn-sm" id="last-page-button"><span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span></button></li>'
	                +'</ul>';
	            return template;
	        }
    }])
    .directive('scfModal', [function () {
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
	
	        scope.$watch(attrs.visible, function(value){
	          if(value == true)
	            $(element).modal('show');
	          else
	            $(element).modal('hide');
	        });
	
	        $(element).on('shown.bs.modal', function(){
	            scope.$parent[attrs.visible] = true;
	        });
	
	        $(element).on('hidden.bs.modal', function(){
	          scope.$apply(function(){
	            scope.$parent[attrs.visible] = false;
	          });
	        });
	      }
	    };
  }])
	.directive('scfCheckAll', [function(){
		function postLinkFn(scope, element, attrs){			
			
			element.bind('click', function(){
				var checkListModelData = scope.$eval(attrs.scfCheckAllListModel);
				var dataList = scope.$eval(attrs.scfDataList);
				var checked = element[0].checked;				
				scope.$parent[attrs.scfCheckAllListModel] = addRemoveValue(checkListModelData, dataList, checked);
				element[0].checked = checked;
			});
			
			scope.$watch(element[0].checked, function(){
				console.log('DataSelect');
			});
			
			scope.$watch(attrs.scfDataList, function(){
				var checkListModelData = scope.$eval(attrs.scfCheckAllListModel);
				var dataList = scope.$eval(attrs.scfDataList);
				console.log('DataList');
				var checked = elementCheckAll(checkListModelData, dataList);
				scope.$parent[attrs.scfCheckAllListModel] = addRemoveValue(checkListModelData, dataList, checked);
				element[0].checked = checked;
			});
		}
		
		function elementCheckAll(checkListModelData, dataList){
			var comparator = angular.equals;
			var countRecordData = 0;
			dataList.forEach(function(document){
				for(var index = checkListModelData.length; index--;){
					if(comparator(document, checkListModelData[index])){
						countRecordData ++;
						break;
					}
				}
			});
			if(countRecordData === dataList.length && countRecordData > 0){
				return true;
			}
			return false;
		}
		
		function addRemoveValue(checkListModelData, dataList, checked){
			var comparator = angular.equals;
			var documentSelectClone = angular.copy(checkListModelData);
			var documentSelects = [];
			if(checked){
				dataList.forEach(function(document){
					var foundDataSelect = false;
					for(var index = documentSelectClone.length; index--;){
						if(comparator(document, documentSelectClone[index])){
							foundDataSelect = true;
							break;
						}
					}
					
					if(!foundDataSelect){
						documentSelectClone.push(document);
					}
				});
				documentSelects = angular.copy(documentSelectClone);
			}else{
				dataList.forEach(function(document){
					for(var index = documentSelectClone.length; index--;){
						if(comparator(document, documentSelectClone[index])){
							documentSelectClone.splice(index, 1);
							break;
						}
					}
				});
				
				documentSelects = documentSelectClone;
			}
			return documentSelects;
		}
		
		return{
			restrict: 'A',
			terminal: true,
			scope: true,
			compile: function() {
				return postLinkFn
			},
		};
		
		
	}]);

})();