(function () {
	'use strict';

	angular.module('ui/template/scftemplate', []).run(["$templateCache", function ($templateCache) {
		$templateCache.put('ui/template/calendar.html',
			'<p class="input-group">' + '<input type="text" name="{{textName}}" datepicker-options="{\'minDate\': minDate , \'maxDate\':maxDate , \'dateDisabled\':disabledWeekendFunc}" ng-required="textRequired" placeholder="DD/MM/YYYY" ng-model-options="{timezone: \'UTC+0700\'}" show-weeks="false" class="form-control" ng-disabled="ngDisabled" ng-model="textModel" uib-datepicker-popup="{{dateFormat}}" is-open="isOpen" close-text="Close" min-date="minDate" max-date="maxDate"/>' + '<span class="input-group-btn">' + '<button type="button" ng-disabled="ngDisabled" class="btn btn-default" ng-click="openCalendarAction()">' + '<i class="fa fa-calendar"></i>' + '</button>' + "</span>" + '</p>');

		$templateCache.put('ui/template/timepicker.html',
			'<p class="input-group">' + '<div uib-timepicker="true" show-spinners="false" show-meridian="false"></div>' + '</p>');

		$templateCache.put('ui/template/data_table.html',
			'<table st-table="componentDatas" class="table table-hover table-bordered table-striped">'
			+ '<thead><tr><th class="text-center" scf-th="column" ng-repeat="column in tableColumns track by $index"></th>'
			+ '</tr>'
			+ '</thead>'
			+ '<tbody>'
			+ '<tr ng-repeat="data in componentDatas track by $id(data)">'
			+ '<td scf-td="data" ng-repeat="column in tableColumns" column-render="column" index-no="$parent.$index" page-options="pageOptions"></td>'
			+ '</tr>'
			+ '</tbody>'
			+ '</talbe>'
		);
		$templateCache.put('ui/template/data_table_collapse.html',
			'<table class="table table-hover table-bordered table-striped">'
			+ '<thead><tr><th scf-table-th="column" ng-repeat="column in tableColumns track by $index"></th>'
			+ '</tr>'
			+ '</thead>'
			+ '<tbody>'
			+ '<tr ng-repeat-start="data in componentDatas track by $id(data)">'
			+ '<td scf-table-td="data" ng-repeat="column in tableColumns" column-render="column" index-no="$parent.$index" page-options="pageOptions"></td>'
			+ '</tr>'
			+ '<tr ng-repeat-end>'
			+ '<td colspan="{{tableColumns.length - exceptedMergeColumn}}" scf-td-collapes="data" ng-repeat="column in tableCollapseColumns" column-render="column" index-no="$parent.$index" page-options="pageOptions">'
			+ '</td>'
			+ '</tr>'
			+ '</tbody>'
			+ '</talbe>'
		);

		$templateCache.put('ui/template/table_template.html',
			'<table class="table table-hover table-bordered table-striped">'
			+ '<thead><tr><th scf-table-th="column" ng-repeat="column in tableColumns track by $index"></th>'
			+ '</tr>'
			+ '</thead>'
			+ '<tbody>'
			+ '<tr ng-repeat="data in componentDatas track by $id(data)">'
			+ '<td scf-table-td="data" ng-repeat="column in tableColumns" column-render="column" index-no="$parent.$index" page-options="pageOptions"></td>'
			+ '</tr>'
			+ '</tbody>'
			+ '</talbe>'
		);
	}]);

	angular.module('scf-component', ['ui/template/scftemplate'])
		.directive('scfInputPassword', [function () {
			return {
				restrict: 'AE',
				replace: true,
				template: '<input type="password" class="form-control" />'
			};
		}])
		.directive('scfInputNumber', [function () {
			return {
				restrict: 'AE',
				replace: true,
				template: '<input type="text" class="form-control" />',
				require: 'ngModel',
				link: function (scope, element, attr, ngModelCtrl) {
					function fromUser(text) {
						if (text) {
							var transformedInput = text.replace(/[^0-9]/g, '');

							if (transformedInput !== text) {
								ngModelCtrl.$setViewValue(transformedInput);
								ngModelCtrl.$render();
							}
							return transformedInput;
						}
						return undefined;
					}
					ngModelCtrl.$parsers.push(fromUser);
				}
			};
		}])
		.directive('scfButton', [function () {
			return {
				restrict: 'AE',
				transclude: true,
				replace: true,
				template: btnTemplate,
				ngDisabled: '='
			};

			function btnTemplate(element, attrs) {
				var btnType = (typeof attrs.type === 'undefined') ? 'button' : attrs.type;
				return '<button type="' + btnType + '" ng-disabled="" class="btn">' + '<ng-transclude></ng-transclude>' + '</button>';
			}
		}])
		.directive('scfTextArea', [function () {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					maxLength: '='
				},
				template: '<textarea class="form-control" style="resize:none;" rows="3" ng-change="textChange()"></textarea>',
				controller: textAreaController
			};

			function textAreaController($scope, $element, $attrs) {
				var vm = $scope;
				if ($scope.maxLength == 'max') {
					$element.maxlength = undefined;
				}
				else {
					$element.maxlength = $scope.maxLength;
				}
				vm.textChange = function () {
					if ($scope.maxLength == 'max') {
						var textInput = $element[0].value;
						$element[0].value = textAreaNewLine(textInput);
					}
				}

				function textAreaNewLine(text) {
					var textLength = text.length;
					text = text.replace(/(\r\n|\n|\r)/gm, '');
					var textArray = [];
					var textResult = '';
					if (textLength <= 85) {
						return text;
					} else if (textLength <= 170) {
						textResult += text.substring(0, 85);
						textResult += '\n';
						textResult += text.substring(85, 170);
					} else {
						textResult += text.substring(0, 85);
						textResult += '\n';
						textResult += text.substring(85, 170);
						textResult += '\n';
						textResult += text.substring(170, 255);
					}
					return textResult;
				}
			}
		}])
		.directive('scfDropdown', [function () {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					componentData: '<'
				},
				link: function (scope, element, attrs) {
					scope.translateLable = attrs.translateLabel;
				},
				template: ['<select class="form-control">',
					'<option ng-repeat="option in componentData track by $id(option)" value="{{option.value}}">{{translateLable? (option.label | translate) :  option.label}}</option>',
					'</select>'].join()
			};
		}])
		.directive('scfDropdownAccount', [function () {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					componentData: '<'
				},
				link: function (scope, element, attrs) {
					scope.translateLable = attrs.translateLabel;
				},
				template: ['<select class="form-control">',
					'<option ng-repeat="option in componentData track by $id(option)" value="{{option.value}}">{{option.label | accountFormat}}</option>',
					'</select>'].join()
			};
		}])
		.directive('convertToNumber', function () {
			return {
				require: 'ngModel',
				link: function (scope, element, attrs, ngModel) {
					ngModel.$parsers.push(function (val) {
						return val != '' ? parseInt(val, 10) : null;
					});
					ngModel.$formatters.push(function (val) {
						return val != null ? '' + val : null;
					});
				}
			};
		})
		.directive('scfAccountNo', [function () {
			return {
				restrict: 'AE',
				replace: true,
				template: '<input type="text" ui-mask="999-9-99999-9" ui-mask-placeholder="" class="form-control" />',
				require: 'ngModel'
			};
		}])
		.directive('scfRadio', [function () {
			return {
				restrict: 'AE',
				replace: true,
				template: '<input type="radio"/>'
			};
		}])
		.directive('scfCheckbox', [function () {
			return {
				restrict: 'AE',
				replace: true,
				template: checkboxTemplate
			};

			function checkboxTemplate(element, attrs) {
				return '<input type="checkbox"/>';
			}
		}])
		.directive('scfDatePicker', ['$templateCache', '$compile', function ($templateCache, $compile) {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					textModel: '=',
					dateFormat: '@',
					isOpen: '=',
					minDate: '=',
					maxDate: '=',
					openCalendarAction: '&',
					defaultValue: '@',
					ngDisabled: '=',
					disabledWeekend: '='
				},
				link: function (scope, element, attrs) {
					if (attrs.textId !== undefined) {
						element[0].children[0].id = attrs.textId;
					}
					if (attrs.buttonId !== undefined) {
						element[0].children[2].children[0].id = attrs.buttonId;
					}

					if (scope.defaultValue != undefined) {
						var momentObj = moment(scope.defaultValue, 'DD/MM/YYYY').toDate();
						scope.textModel = momentObj;
					}
					
					if (scope.disabledWeekend !== undefined && scope.disabledWeekend === true){
						scope.disabledWeekendFunc =  function (data) {
						    var date = data.date,
						      mode = data.mode;
						    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
						}
					}else{
						disabledWeekendFunc = function (data) {
							return null;
						}
					}
				},
				templateUrl: 'ui/template/calendar.html'
			};
		}])
		.directive('scfTimePickerFrom', [function () {
			return {
				restrict: 'AE',
				replace: true,
				templateUrl: 'ui/template/timepicker.html'
				//template: '<div uib-timepicker="true" show-spinners="false" show-meridian="false"></div>'
				//template : '<input type="time" class="form-control" placeholder="HH:MM" min="00:00:00" max="23:59:59"></input>'
			};
		}])
		.directive('scfDatePickerFrom', ['$templateCache', '$compile', function ($templateCache, $compile) {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					textModel: '=',
					dateFormat: '@',
					isOpen: '=',
					openCalendarAction: '&',
					maxDate: '=',
					textName: '@',
					defaultValue: '@',
					textRequired: "@",
					ngDisabled: '=',
					disabledWeekend: '='
				},
				link: function (scope, element, attrs) {
					if (angular.isDefined(scope.defaultValue)) {
						scope.textModel = scope.defaultValue;
					}
					scope.minDate = null;
					if (attrs.textId !== undefined) {
						element[0].children[0].id = attrs.textId;
					}

					if (attrs.buttonId !== undefined) {
						element[0].children[2].children[0].id = attrs.buttonId;
					}
					if (angular.isDefined(scope.textRequired)) {
						scope.textRequired = true;
					}
					if (scope.disabledWeekend !== undefined && scope.disabledWeekend === true){
						scope.disabledWeekendFunc =  function (data) {
						    var date = data.date,
						      mode = data.mode;
						    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
						}
					}else{
						disabledWeekendFunc = function (data) {
							return null;
						}
					}
				},
				templateUrl: 'ui/template/calendar.html'
			};
		}])
		.directive('scfDatePickerTo', ['$templateCache', '$compile', function ($templateCache, $compile) {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					textModel: '=textModel',
					dateFormat: '@',
					isOpen: '=',
					openCalendarAction: '&',
					minDate: '=',
					ngDisabled: '=',
					disabledWeekend: '='
				},
				link: function (scope, element, attrs) {
					if (angular.isUndefined(scope.ngDisable)) {
						scope.ngDisable = false;
					}
					scope.maxDate = null;
					if (attrs.textId !== undefined) {
						element[0].children[0].id = attrs.textId;
					}

					if (attrs.buttonId !== undefined) {
						element[0].children[2].children[0].id = attrs.buttonId;
					}
					if (scope.disabledWeekend !== undefined && scope.disabledWeekend === true){
						scope.disabledWeekendFunc =  function (data) {
						    var date = data.date,
						      mode = data.mode;
						    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
						}
					}else{
						disabledWeekendFunc = function (data) {
							return null;
						}
					}
				},
				templateUrl: 'ui/template/calendar.html'
			};
		}])
		.directive('scfDataTable', ['$compile', '$parse', function ($compile, $parse) {
			return {
				restrict: 'E',
				priority: 1001,
				transclude: true,
				replace: true,
				scope: true,
				controller: ['$scope', '$element', '$attrs', '$window', '$document', function ($scope, $element, $attrs, $window, $document) {
					var vm = $scope;
					vm.tableColumns = [];
					vm.initSort = function () {
						vm.order = '';
						vm.reverse = false;
					}

					vm.$watch($attrs.clearSortOrder, function (data) {
						vm.initSort();
					});
					vm.pageOptions = {
						currentPage: 0,
						recordPerPage: 20
					};

					vm.$watch($attrs.currentPage, function (data) {
						if (data !== undefined) {
							vm.pageOptions.currentPage = data;
						}
					});

					vm.$watch($attrs.recordPerPage, function (data) {
						if (data !== undefined) {
							vm.pageOptions.recordPerPage = data;
						}
					});

					vm.$watch($attrs.componentConfig, function (dataConfig) {
						var tableOption = dataConfig.options || {};
						vm.expansion = dataConfig.expansion || {};

						// Clear value begin add column;
						vm.tableColumns = [];
						dataConfig.columns.forEach(function (data) {
							var rowData = {
								fieldName: data['fieldName'],
								field: data['field'],
								idValueField: data['idValueField'],
								id: data['id'],
								label: data['label'],
								cellTemplate: data['cellTemplate'],
								headerId: data['headerId'],
								sortable: data['sortable'],
								cssTemplate: data['cssTemplate'],
								filterType: data['filterType'],
								filterFormat: data['filterFormat'],
								renderer: data['renderer'],
								dataRenderer: data['dataRenderer'],
								hidden: data['hidden'] || function () { return false; }
							};
							if (!rowData.hidden()) {
								vm.tableColumns.push(rowData);
							}
						});

						// Check option set to Show row number.
						if (tableOption.displayRowNo !== undefined) {
							var rowData = {
								field: 'no',
								label: '<span ng-bind="\'numbero\' | translate"></span>',
								id: tableOption.displayRowNo['id'],
								idValueField: tableOption.displayRowNo['idValueField'],
								cssTemplate: tableOption.displayRowNo['cssTemplate']
							};
							vm.tableColumns.splice(0, 0, rowData);
						}
						;
						// Check option set to Show checkBox
						if (tableOption.displaySelect !== undefined) {
							var rowData = {
								field: tableOption.displaySelect['field'],
								id: tableOption.displaySelect['id'],
								label: tableOption.displaySelect['label'],
								cellTemplate: tableOption.displaySelect['cellTemplate'],
								idValueField: tableOption.displaySelect['idValueField']
							};

							if (tableOption.displaySelect['displayPosition'] === 'first') {
								vm.tableColumns.splice(0, 0, rowData);
							} else {
								vm.tableColumns.push(rowData);
							}
						}
					}, true);

					vm.$watch($attrs.componentDatas, function (data) {
						vm.componentDatas = data;
					});

				}],
				templateUrl: function (elem, attr) {
					return attr.templateUrl || 'ui/template/data_table.html';
				}
			}
		}])
		.directive('scfTh', ['$compile', '$filter', '$translate', function ($compile, $filter, $translate) {
			return {
				restrict: 'A',
				replace: true,
				link: scfLink
			}

			function scfLink(scope, elements, attrs) {
				scope.$watch(attrs.scfTh, function (column) {
					renderTableHeader(scope, elements, column, $translate.use());
				});
			}

			function scfTableThController($scope, $rootScope, $element, $attrs) {
				$rootScope.$on('$translateChangeSuccess', function (translateChangeSuccess, currentLange) {
					var column = $scope.$eval($attrs.scfTh);
					renderTableHeader($scope, $element, column, currentLange.language);
				});
			}

			function renderTableHeader(scope, elements, column, currentLange) {
				var htmlText = column.label;

				if (column.sortable) {
					htmlText = '<span sort by="{{column.field}}" reverse="reverse" order="orders" >' + htmlText + '</span>';
				}

				var colClass = column.cssTemplateHeader || 'text-center';
				elements.addClass(colClass)
				elements.html(htmlText);
				$compile(elements.contents())(scope);

				if (column.fieldName != 'selectBox') {
					if (angular.isDefined(elements[0].childNodes[0])) {
						if (angular.isDefined(column.field) && column.field != 'no') {
							if (column.headerId != null) {
								elements[0].childNodes[0].id = column.headerId;
							}
							else {
								elements[0].childNodes[0].id = column.fieldName + '-header-label';
							}

						} else if (angular.isDefined(column.field) && column.field == 'no') {
							elements[0].childNodes[0].id = '$rowNo-header-label';
						}
					}
				}
			}
		}])
		.directive('scfTd', ['$compile', '$filter', '$log', function ($compile, $filter, $log) {
			var log = $log;
			return {
				scope: false,
				restrict: 'A',
				replace: true,
				link: scfLink
			}

			function scfLink(scope, elements, attrs) {
				var pageOptions = scope.$eval(attrs.pageOptions);

				scope.$watch(attrs.scfTd, function (data) {
					var rowNo = renderNo(scope, attrs, pageOptions);
					var column = scope.$eval(attrs.columnRender);
					var dataRender = '';
					var colClass = typeof column.cssTemplate === 'function' ? column.cssTemplate(data) : column.cssTemplate || 'text-center';

					if (column.field === 'no') {
						elements.addClass(colClass);
						elements.html(rowNo);
						dataRender = rowNo;
						// return;
					}

					if (column.filterType !== undefined && column.filterType !== null) {
						dataRender = filterData(column, data);
					} else {
						if (angular.isDefined(column.cellTemplate) && column.cellTemplate !== null) {
							dataRender = column.cellTemplate;

						}
						else if (angular.isDefined(column.dataRenderer) && column.dataRenderer !== null) {
							dataRender = column.dataRenderer(data);
						}
						else {
							dataRender = data[column.field];
						}
					}
					elements.addClass(colClass);
					elements.html(dataRender);
					$compile(elements.contents())(scope);

					if (column.id !== null && column.id !== undefined) {
						// Check add id is rowNo for checkBox
						if (column.idValueField === 'template') {
							if (elements[0].children.length > 0) {
								elements[0].children[0].id = addId(rowNo, column.id, column.renderer);
							} else {
								elements[0].id = addId(rowNo, column.id, column.renderer);
							}
						} else {
							elements[0].id = addId(data[column.idValueField != null ? column.idValueField : column.field], column.id, column.renderer);
						}
					}

				});
			}

			function renderNo(scope, attrs, pageOptions) {
				var indexNo = scope.$eval(attrs.indexNo);
				var rowNo = (pageOptions.currentPage * pageOptions.recordPerPage) + (indexNo + 1)
				return rowNo;
			}

			function filterData(column, dataColumn) {
				var filterType = column.filterType;
				var filterFormat = column.filterFormat;
				var data = dataColumn[column.field];

				var result = '';
				if (filterType === 'date') {
					var pDate = Date.parse(data);

					result = $filter(filterType)(data, filterFormat, 'UTC+0700');
				} else {
					result = $filter(filterType)(data, filterFormat);
				}
				// result = $filter(filterType)(data, filterFormat);
				return result;
			}

			function addId(rowNo, columnId, renderer) {
				if (renderer != null) {
					rowNo = renderer(rowNo);
				}
				return columnId.replace('{value}', rowNo);
			}
		}]).directive('scfTdCollapes', ['$compile', '$filter', '$log', '$translate', function ($compile, $filter, $log, $translate)  {
			return {
				scope: false,
				restrict: 'A',
				replace: true,
				link: scfLink
			}
			
			

			function scfLink(scope, elements, attrs) {
				var pageOptions = scope.$eval(attrs.pageOptions);
				
				scope.$watch(attrs.scfTdCollapes, function (data) {
					var rowNo = renderNo(scope, attrs, pageOptions);
					scope['$rowNo'] = rowNo;
					
					var column = scope.$eval(attrs.columnRender);
					
					var dataRender = '';
					var colClass = column.cssTemplate || 'text-center';
					
					if(column.component){
						if (angular.isDefined(column.cellTemplate) && column.cellTemplate !== null) {
							dataRender = column.cellTemplate;
						} else if (angular.isDefined(column.dataRenderer) && column.dataRenderer !== null) {
							dataRender = column.dataRenderer(data);
						} else {
							dataRender = data[column.fieldName];
						}
						
						if (column.renderer != null) {
							dataRender = column.renderer(dataRender, data);
						}
						
						elements.addClass(colClass);
						elements.html(dataRender);
						$compile(elements.contents())(scope);
						
					}else{
						
						renderLabel(scope, elements, column, $translate.use());
						
					}
				});
			}
			
			function renderLabel(scope, elements, column, currentLange) {
				var htmlText = '';
				htmlText = getDisplayLanguage(currentLange, column);

				if(column.border){
					htmlText = '<b><span>' + htmlText + '</span></b>';
				}
				
				var colClass = column.cssTemplate || 'text-center';
				elements.addClass(colClass)
				elements.html(htmlText);
				$compile(elements.contents())(scope);
			}
			
			function getDisplayLanguage(currentLange, column) {
				var htmlText = '';
				if (column.fieldName !== 'reasonCode') {
					if (currentLange == 'en_EN') {
						htmlText = column.labelEN;
					} else {
						htmlText = column.labelTH;
					}
				}
				return htmlText;
			}
			
			function renderNo(scope, attrs, pageOptions) {
				var indexNo = scope.$eval(attrs.indexNo);
				var rowNo = (pageOptions.currentPage * pageOptions.recordPerPage) + (indexNo + 1)
				return rowNo;
			}
			
//			function addId(rowNo, columnId, renderer, fieldName) {
//				if (angular.isDefined(renderer) && renderer != null) {
//					rowNo = renderer(rowNo);
//				}
//
//				if (fieldName != 'selectBox') {
//					return columnId.replace('{value}', rowNo) + "-label";
//				} else {
//					return columnId.replace('{value}', rowNo);
//				}
//			}
		}])
		.directive('sort', ['$compile', function ($compile) {
			return {
				restrict: 'A',
				transclude: true,
				scope: false,
				link: function (scope, element, attrs) {
					scope.onClick = function () {
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
						scope.$parent.sortData(parent.order, scope.orderBy);
					}
				},
				template: '<a class="gec-table-sort" ng-click="onClick()">' +
				'<span ng-transclude></span>' +
				'<i class="glyphicon" ng-class="{\'glyphicon-menu-down\' : order === by && !reverse,  \'glyphicon-menu-up\' : order===by && reverse}"></i>' +
				'</a>'
			};
		}])
		.directive('scfPagination', [function () {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					currentPage: '=',
					pageSizeModel: '=',
					pageSizeList: '<',
					totalPage: '=',
					pageAction: '=',
					name: '@',
					firstPageButtonId: '@',
					backPageButtonId: '@',
					nextPageButtonId: '@',
					lastPageButtonId: '@',
					dropdownPageLimitId: '@'
				},
				link: fieldLink,
				template: fieldTemplate
			};

			function fieldLink(scope, element, attrs) {
				var prefixId = scope.name ? scope.name + '-' : '';
				scope.firstPageButtonId = angular.isUndefined(scope.firstPageButtonId) ? prefixId + 'first-page-button' : scope.firstPageButtonId;
				scope.backPageButtonId = angular.isUndefined(scope.backPageButtonId) ? prefixId + 'back-page-button' : scope.backPageButtonId;
				scope.nextPageButtonId = angular.isUndefined(scope.nextPageButtonId) ? prefixId + 'next-page-button' : scope.nextPageButtonId;
				scope.lastPageButtonId = angular.isUndefined(scope.lastPageButtonId) ? prefixId + 'last-page-button' : scope.lastPageButtonId;
				scope.dropdownPageLimitId = angular.isUndefined(scope.dropdownPageLimitId) ? prefixId + 'page-limit-dropdown' : scope.dropdownPageLimitId;
				scope.$watch('[totalPage, currentPage]', function (value) {
					disableButton(scope, element);
				});

				scope.scfPaginationAction = function (btnAction) {
					var pageModel = {
						page: scope.currentPage,
						pageSize: scope.pageSizeModel
					};
					if (btnAction === 'first' || btnAction === 'changeSize') {
						pageModel.page = 0;
					} else if (btnAction === 'back') {
						pageModel.page--;
					} else if (btnAction === 'next') {
						pageModel.page++;
					} else if (btnAction === 'last') {
						pageModel.page = scope.totalPage - 1;
					}
					scope.pageAction(pageModel);
				};

				if (attrs.dropdownId != undefined) {
					element[0].children[2].children[0].id = attrs.dropdownId
				}
			}

			function disableButton(scope, element) {
				var totalPage = +scope.totalPage;
				var currentPage = +scope.currentPage;
				/* check is first page */
				if (currentPage === 0) {
					/* disable button First, Back page */
					element[0].children[0].children[0].disabled = true;
					element[0].children[1].children[0].disabled = true;
				} else {
					/* enable button First, Back page */
					element[0].children[0].children[0].disabled = false;
					element[0].children[1].children[0].disabled = false;
				}

				if (currentPage >= (totalPage - 1)) {
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
				var template = '<ul class="scf-paging form-inline">' + '<li class="paginate_button"><button  ng-click="scfPaginationAction(\'first\')" class="btn page-link" id="{{firstPageButtonId}}"><span class="fa fa-angle-double-left" aria-hidden="true"></span></button></li>' + '<li class="paginate_button"><button ng-click="scfPaginationAction(\'back\')" class="btn page-link" id="{{backPageButtonId}}"><span class="fa fa-angle-left" aria-hidden="true"></span></button></li>' + '<li class="paginate_button"><scf-dropdown ng-model="pageSizeModel" ng-change="scfPaginationAction(\'changeSize\')" component-data="pageSizeList" id="{{dropdownPageLimitId}}" class="page-link"></scf-dropdown</li>' + '<li><button  ng-click="scfPaginationAction(\'next\')" class="btn page-link" id="{{nextPageButtonId}}"><span class="fa fa-angle-right" aria-hidden="true"></span></button></li>' + '<li><button ng-click="scfPaginationAction(\'last\')" class="btn page-link" id="{{lastPageButtonId}}"><span class="fa fa-angle-double-right" aria-hidden="true"></span></button></li>' + '</ul>';
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
				replace: true,
				scope: true,
				link: function postLink(scope, element, attrs) {

					scope.$watch(attrs.visible, function (value) {
						if (value == true)
							$(element).modal('show');
						else
							$(element).modal('hide');
					});

					$(element).on('shown.bs.modal', function () {
						scope.$parent[attrs.visible] = true;
					});

					$(element).on('hidden.bs.modal', function () {
						scope.$apply(function () {
							scope.$parent[attrs.visible] = false;
						});
					});
				}
			};
		}])
		.directive('scfCheckAll', [function () {
			function postLinkFn(scope, element, attrs) {
				element.bind('click', function () {
					var checkListModelData = scope.$eval(attrs.scfCheckAllListModel);
					var dataList = scope.$eval(attrs.scfDataList);
					var checked = element[0].checked;
					scope.$parent[attrs.scfCheckAllListModel] = addRemoveValue(checkListModelData, dataList, checked);
					element[0].checked = checked;
				});

				scope.$watch(element[0].checked, function () { });

				scope.$watch(attrs.scfDataList, function () {
					var checkListModelData = scope.$eval(attrs.scfCheckAllListModel);
					var dataList = scope.$eval(attrs.scfDataList);
					var checked = elementCheckAll(checkListModelData, dataList);
					scope.$parent[attrs.scfCheckAllListModel] = addRemoveValue(checkListModelData, dataList, checked);
					element[0].checked = checked;
				});
			}

			function elementCheckAll(checkListModelData, dataList) {
				var comparator = angular.equals;
				var countRecordData = 0;
				dataList.forEach(function (document) {
					for (var index = checkListModelData.length; index--;) {
						if (comparator(document, checkListModelData[index])) {
							countRecordData++;
							break;
						}
					}
				});
				if (countRecordData === dataList.length && countRecordData > 0) {
					return true;
				}
				return false;
			}

			function addRemoveValue(checkListModelData, dataList, checked) {
				var comparator = angular.equals;
				var documentSelectClone = angular.copy(checkListModelData);
				var documentSelects = [];
				if (checked) {
					dataList.forEach(function (document) {
						var foundDataSelect = false;
						for (var index = documentSelectClone.length; index--;) {
							if (comparator(document, documentSelectClone[index])) {
								foundDataSelect = true;
								break;
							}
						}

						if (!foundDataSelect) {
							documentSelectClone.push(document);
						}
					});
					documentSelects = angular.copy(documentSelectClone);
				} else {
					dataList.forEach(function (document) {
						for (var index = documentSelectClone.length; index--;) {
							if (comparator(document, documentSelectClone[index])) {
								documentSelectClone.splice(index, 1);
								break;
							}
						}
					});

					documentSelects = documentSelectClone;
				}
				return documentSelects;
			}

			return {
				restrict: 'A',
				terminal: true,
				scope: true,
				compile: function () {
					return postLinkFn
				},
			};


		}])
		.directive('focus',
		function ($timeout) {
			return {
				scope: {
					trigger: '@focus'
				},
				link: function (scope, element) {
					scope.$watch('trigger', function (value) {
						if (value === "true") {
							$timeout(function () {
								element[0].focus();
							});
						}
					});
				}
			};
		}).directive('scfLayoutTable', ['$compile', '$parse', function ($complie, $parse) {
			return {
				restrict: 'E',
				transclude: true,
				replace: true,
				scope: true,
				controller: ['$scope', '$element', '$attrs', scfTableController],
				templateUrl: function (elem, attr) {
					return attr.templateUrl || 'ui/template/data_table_collapse.html';
				}
			}

			function scfTableController($scope, $element, $attrs) {
				var vm = $scope;
				vm.tableColumns = [];
				vm.initSort = function () {
					vm.order = '';
					vm.reverse = false;
				}

				vm.$watch($attrs.clearSortOrder, function (data) {
					vm.initSort();
				});

				vm.pageOptions = {
					currentPage: 0,
					recordPerPage: 20
				};

				vm.$watch($attrs.currentPage, function (data) {
					if (data !== undefined) {
						vm.pageOptions.currentPage = data;
					}
				});

				vm.$watch($attrs.recordPerPage, function (data) {
					if (data !== undefined) {
						vm.pageOptions.recordPerPage = data;
					}
				});

				vm.$watch($attrs.componentConfig, function (dataConfig) {
					var tableOption = dataConfig.options || {};
					var expansion = dataConfig.expansion || {};

					// Clear value begin add column;
					vm.tableColumns = [];
					var identityField = dataConfig.identityField || '$rowNo';
					dataConfig.columns.forEach(function (data) {
						if (data['hiddenColumn'] != true) {
							var rowData = {
								fieldName: data.documentField.documentFieldName,
								labelEN: data['labelEN'] ? data['labelEN'] : data['label'],
								labelTH: data['labelTH'] ? data['labelTH'] : data['label'],
								cellTemplate: data['cellTemplate'],
								sortable: data['sortable'] || false,
								cssTemplateHeader: getCssConfigHeader(data),
								cssTemplate: getCssConfig(data),
								filterType: data['filterType'],
								format: data['format'],
								idValueField: identityField || data['idValueField'],
								idTemplate: data.id || generateIdTemplate(data),
								renderer: data['renderer'],
								dataRenderer: data['dataRenderer'],
								headerId: data['headerId'],
								component: data['component']
							};
							vm.tableColumns.push(rowData);
						}
					});

					// Check option set to Show checkBox
					if (tableOption.displaySelect !== undefined) {
						var rowData = {
							label: tableOption.displaySelect['label'],
							fieldName: 'selectBox',
							idTemplate: tableOption.displaySelect['id'],
							cellTemplate: tableOption.displaySelect['cellTemplate'],
							idValueField: tableOption.displaySelect['idValueField']
						};

						if (tableOption.displaySelect['displayPosition'] === 'first') {
							vm.tableColumns.splice(0, 0, rowData);
						} else {
							vm.tableColumns.push(rowData);
						}
					}
					
					// show Collapse
					vm.tableCollapseColumns = [];
					if(expansion.expanded){
						expansion.columns.forEach(function(data){
							if (data['hiddenColumn'] != true) {
								var rowData = {
									fieldName: data.fieldName,
									labelEN: data['labelEN'] ? data['labelEN'] : data['label'],
									labelTH: data['labelTH'] ? data['labelTH'] : data['label'],
									cellTemplate: data['cellTemplate'],
									sortable: data['sortable'] || false,
									cssTemplateHeader: getCssConfigHeader(data),
									cssTemplate: getCssConfig(data),
									filterType: data['filterType'],
									format: data['format'],
									idValueField: data['idValueField'],
									idTemplate: data.id || generateIdTemplate(data),
									renderer: data['renderer'],
									dataRenderer: data['dataRenderer'],
									headerId: data['headerId'],
									border: data['border'],
									component: data['component'],
								};
								vm.tableCollapseColumns.push(rowData);
							}
						});
					}
					
					vm.exceptedMergeColumn = 0;
					if(expansion.exceptedMergeColumn !== undefined){
						vm.exceptedMergeColumn = expansion.exceptedMergeColumn;
					}
					
				}, true);
				vm.$watch($attrs.componentDatas, function (data) {
					vm.componentDatas = data;
				});
			}

			function getCssConfig(data) {
				var result = '';
				if (angular.isDefined(data.cssTemplate)) {
					result = data.cssTemplate;
				}

				if (angular.isDefined(data.alignment)) {
					var alignment = data.alignment;
					if (alignment == 'RIGHT') {
						result += ' text-right';
					} else if (alignment == 'CENTER') {
						result += ' text-center';
					} else {
						result += ' text-left';
					}
				}
				return result;
			}

			function getCssConfigHeader(data) {
				var result = 'text-center';
				if (angular.isDefined(data.cssTemplate)) {
					result += ' ' + data.cssTemplate;
				}
				return result;
			}

			function generateIdTemplate(data) {
				if (angular.isDefined(data.documentField.documentFieldName)) {
					return data.documentField.documentFieldName + '-{value}';
				}
				return undefined;
			}
		}]).directive('scfTable', ['$compile', '$parse', function ($complie, $parse) {
			return {
				restrict: 'E',
				transclude: true,
				replace: true,
				scope: true,
				controller: ['$scope', '$element', '$attrs', scfTableController],
				templateUrl: function (elem, attr) {
					return attr.templateUrl || 'ui/template/table_template.html';
				}
			}

			function scfTableController($scope, $element, $attrs) {
				var vm = $scope;
				vm.tableColumns = [];
				vm.initSort = function () {
					vm.order = '';
					vm.reverse = false;
				}

				vm.$watch($attrs.clearSortOrder, function (data) {
					vm.initSort();
				});

				vm.pageOptions = {
					currentPage: 0,
					recordPerPage: 20
				};

				vm.$watch($attrs.currentPage, function (data) {
					if (data !== undefined) {
						vm.pageOptions.currentPage = data;
					}
				});

				vm.$watch($attrs.recordPerPage, function (data) {
					if (data !== undefined) {
						vm.pageOptions.recordPerPage = data;
					}
				});

				vm.$watch($attrs.componentConfig, function (dataConfig) {
					if(!angular.isUndefined(dataConfig)){
						var tableOption = dataConfig.options || {};
	
						// Clear value begin add column;
						vm.tableColumns = [];
						var identityField = dataConfig.identityField || '$rowNo';
						dataConfig.columns.forEach(function (data) {
							if (data['hiddenColumn'] != true) {
								var rowData = {
									fieldName: data['fieldName'],
									labelEN: data['labelEN'] ? data['labelEN'] : data['label'],
									labelTH: data['labelTH'] ? data['labelTH'] : data['label'],
									cellTemplate: data['cellTemplate'],
									sortable: data['sortable'] || false,
									cssTemplateHeader: getCssConfigHeader(data),
									cssTemplate: getCssConfig(data),
									filterType: data['filterType'],
									format: data['format'],
									idValueField: identityField || data['idValueField'],
									idTemplate: data.id || generateIdTemplate(data),
									renderer: data['renderer'],
									dataRenderer: data['dataRenderer'],
									headerId: data['headerId']
								};
								vm.tableColumns.push(rowData);
							}
						});
	
						// Check option set to Show checkBox
						if (tableOption.displaySelect !== undefined) {
							var rowData = {
								label: tableOption.displaySelect['label'],
								fieldName: 'selectBox',
								idTemplate: tableOption.displaySelect['id'],
								cellTemplate: tableOption.displaySelect['cellTemplate'],
								idValueField: tableOption.displaySelect['idValueField']
							};
	
							if (tableOption.displaySelect['displayPosition'] === 'first') {
								vm.tableColumns.splice(0, 0, rowData);
							} else {
								vm.tableColumns.push(rowData);
							}
						}
					}
				}, true);
				vm.$watch($attrs.componentDatas, function (data) {
					vm.componentDatas = data;
				});
			}

			function getCssConfig(data) {
				var result = '';
				if (angular.isDefined(data.cssTemplate)) {
					result = data.cssTemplate;
				}

				if (angular.isDefined(data.alignment)) {
					var alignment = data.alignment;
					if (alignment == 'RIGHT') {
						result += ' text-right';
					} else if (alignment == 'CENTER') {
						result += ' text-center';
					} else {
						result += ' text-left';
					}
				}
				return result;
			}

			function getCssConfigHeader(data) {
				var result = 'text-center';
				if (angular.isDefined(data.cssTemplate)) {
					result += ' ' + data.cssTemplate;
				}
				return result;
			}

			function generateIdTemplate(data) {
				if (angular.isDefined(data.fieldName)) {
					return data.fieldName + '-{value}';
				}
				return undefined;
			}
		}])
		.directive('scfTableTh', ['$compile', '$filter', '$translate', function ($compile, $filter, $translate) {
			return {
				restrict: 'A',
				replace: true,
				link: scfLink,
				controller: ['$scope', '$rootScope', '$element', '$attrs', scfTableThController]
			}

			function scfLink(scope, elements, attrs) {
				scope.$watch(attrs.scfTableTh, function (column) {
					renderTableHeader(scope, elements, column, $translate.use());
				});
			}

			function scfTableThController($scope, $rootScope, $element, $attrs) {
				$rootScope.$on('$translateChangeSuccess', function (translateChangeSuccess, currentLange) {
					var column = $scope.$eval($attrs.scfTableTh);
					renderTableHeader($scope, $element, column, currentLange.language);
				});
			}

			function renderTableHeader(scope, elements, column, currentLange) {
				var htmlText = '';

				htmlText = getDisplayLanguage(currentLange, column);

				if (column.sortable) {
					htmlText = '<span sort by="{{column.fieldName}}" reverse="reverse" order="orders" >' + htmlText + '</span>';
				}

				var colClass = column.cssTemplateHeader || 'text-center';
				elements.addClass(colClass)
				elements.html(htmlText);
				$compile(elements.contents())(scope);

				if (column.fieldName != 'selectBox') {
					if (angular.isDefined(elements[0].childNodes[0])) {
						if (angular.isDefined(column.headerId)) {
							elements[0].childNodes[0].id = column.headerId;
						}
						else if (angular.isDefined(column.fieldName)) {
							elements[0].childNodes[0].id = column.fieldName + '-header-label';
						}
					}
				}
			}

			function getDisplayLanguage(currentLange, column) {
				var htmlText = '';
				if (column.fieldName == 'selectBox') {
					htmlText = column.label;
				} else {
					if (currentLange == 'en_EN') {
						htmlText = column.labelEN;
					} else {
						htmlText = column.labelTH;
					}
				}
				return htmlText;
			}
		}])
		.directive('scfTableTd', ['$compile', '$filter', '$log', function ($compile, $filter, $log) {
			var log = $log;
			return {
				scope: false,
				restrict: 'A',
				replace: true,
				link: scfLink
			}

			function scfLink(scope, elements, attrs) {
				var pageOptions = scope.$eval(attrs.pageOptions);
				
				scope.$watch(attrs.scfTableTd, function (data) {

					var rowNo = renderNo(scope, attrs, pageOptions);
					scope['$rowNo'] = rowNo;
					var column = scope.$eval(attrs.columnRender);

					var dataRender = '';
					var colClass = column.cssTemplate || 'text-center';

					if (column.fieldName === '$rowNo') {
						elements.addClass(colClass);
						elements.html(rowNo);
						dataRender = rowNo;
					}

					if (angular.isDefined(column.filterType) && column.filterType !== null) {
						dataRender = filterData(column, data);
					} else {
						if (angular.isDefined(column.cellTemplate) && column.cellTemplate !== null) {
							dataRender = column.cellTemplate;
						} else if (angular.isDefined(column.dataRenderer) && column.dataRenderer !== null) {
							dataRender = column.dataRenderer(data);
						} else {
							dataRender = data[column.fieldName];
						}
					}

					if (column.renderer != null) {
						dataRender = column.renderer(dataRender, data);
					}
					elements.addClass(colClass);
					elements.html(dataRender);
					$compile(elements.contents())(scope);

					if (angular.isDefined(column.idTemplate) && column.idTemplate !== null) {
						// Check add id is rowNo for checkBox
						if (column.idValueField === '$rowNo') {
							
							if (elements[0].children.length > 0) {
								elements[0].children[0].id = addId(rowNo, column.idTemplate, column.renderer, column.fieldName);


							} else {
								
								elements[0].id = addId(rowNo, column.idTemplate, column.renderer, column.fieldName);

							}
							
						} else {
							if (elements[0].children.length > 0) {
								elements[0].children[0].id = addId(data[column.idValueField != null ? column.idValueField : column.field], column.idTemplate, column.renderer, column.fieldName);
							} else {
								//comment for import channel
								//								elements[0].id = addId(rowNo, column.idTemplate, column.renderer, column.fieldName);	
								elements[0].id = addId(data[column.idValueField != null ? column.idValueField : column.field], column.idTemplate, column.renderer, column.fieldName);
							}
						}
					}

				});
			}

			function renderNo(scope, attrs, pageOptions) {
				var indexNo = scope.$eval(attrs.indexNo);
				var rowNo = (pageOptions.currentPage * pageOptions.recordPerPage) + (indexNo + 1)
				return rowNo;
			}

			function filterData(column, dataColumn) {

				var filterType = column.filterType;
				var filterFormat = column.format;
				var data = dataColumn[column.fieldName];
				var result = '';
				if (filterType === 'date') {
					var pDate = Date.parse(data);
					filterFormat = filterFormat || 'dd/MM/yyyy';
					result = $filter(filterType)(data, filterFormat, 'UTC+0700');
				} else if (filterType === 'number') {
					result = $filter(filterType)(data, 2);
				} else {
					result = $filter(filterType)(data, filterFormat);
				}
				return result;
			}

			function addId(rowNo, columnId, renderer, fieldName) {
				if (angular.isDefined(renderer) && renderer != null) {
					rowNo = renderer(rowNo);
				}

				if (fieldName != 'selectBox') {
					return columnId.replace('{value}', rowNo) + "-label";
				} else {
					return columnId.replace('{value}', rowNo);
				}
			}
			
			
		}])
		.directive('scfShowOnMobile', ['$compile', function ($compile) {
			return {
				scope: false,
				restrict: 'A',
				replace: true,
				link: scfShowOnMobileLink
			}
			function scfShowOnMobileLink(scope, elements, attrs) {
				var isShowOnMobile = scope.$eval(attrs.scfShowOnMobile);
				if (!isShowOnMobile) {
					elements.addClass('hidden-sm-down');
				}
				else{
				  elements.addClass('hidden-md-up');
				}
			}
		}])
		.directive('scfEnter', [function () {
			return function (scope, elements, attrs) {
				elements.bind('keypress', function (event) {
					if (event.keyCode == 13) {
						scope.$apply(function () {
							scope.$eval(attrs.ngEnter, { 'event': event })
						});
					}
				});
			}
		}])
		.constant('formatFactory', {
			currency: {
				pattern: /^[\(\-\+]?\d*,?\d*\.?\d+[\)]/,
				patternError: 'This field must be formatted as Currency.<br/>A sample valid input looks like: 1000.00',
				replaceDollar: /[\$]/g,
				replaceComma: /[,]/g
			}
		}).directive('format', function ($filter, formatFactory) {
			return {
				scope: {},
				restrict: 'A',
				require: ['ngModel'],
				link: function (scope, element, attrs, ctrls) {
					var ngModelCtrl = ctrls[0],
						thisFormat = formatFactory[attrs.format];

					var ctrl = ctrls[1];

					// This is the toModel routine
					var parser = function (value) {
						var removeParens;
						if (!value) {
							return undefined;
						}
						// get rid of currency indicators
						value = value.toString().replace(thisFormat.replaceComma, '');
						
						// Check for parens, currency filter (5) is -5
						removeParens = value.replace(/[\(\)]/g, '');
						
						// having parens indicates the number is negative
						if (value.length !== removeParens.length) {
							value = -removeParens;
						}
						return value || undefined;
					},
					
					// This is the toView routine
					formatter = function (value) {
							// the currency filter returns undefined if parse error
							value = $filter(attrs.format)(parser(value)) || '';
							value = value.toString().replace(thisFormat.replaceDollar, '');
							
							var defaultValue = '';
							if(attrs.formatDefaultValue != null && attrs.formatDefaultValue != undefined){
								defaultValue = $filter(attrs.format)(parser(attrs.formatDefaultValue)) || '';
								defaultValue = defaultValue.toString().replace(thisFormat.replaceDollar, '');
							}
							
							var parsedValue = parser(value);
							if(parsedValue < 0 && attrs.formatOnlyPositive){
								value = defaultValue;
							}
							
							if(parsedValue == 0 && attrs.formatNotBeZero){
								value = defaultValue;
							}
							
							if(value == '' && defaultValue != ''){
								value = defaultValue;
							}
							
							return value;
						};

					// This sets the format/parse to happen on blur/focus
					element.on("blur", function () {
						ngModelCtrl.$setViewValue(formatter(this.value));
						ngModelCtrl.$render();
					}).on("focus", function () {
						ngModelCtrl.$setViewValue(parser(this.value));
						ngModelCtrl.$render();
					});

					// Model Formatter
					ngModelCtrl.$formatters.push(formatter);
					// Model Parser
					ngModelCtrl.$parsers.push(parser);
				}
			}
		});

})();