'use strict';

var app = angular.module('gecscf.ui');
app.directive('gecTable', [
	'$compile',
	'$parse',
	function($complie, $parse) {
		return {
			restrict : 'E',
			transclude : true,
			replace : false,
			scope : true,
			controller : 'DataTableController',
			templateUrl : function(elem, attr) {
				return attr.templateUrl
					|| '/js/app/shared/directives/data-table.html';
			}
		}
	} ]);
app
	.directive(
		'headerColumn',
		[
			'$compile',
			'$filter',
			function($compile, $filter) {
				return {
					restrict : 'A',
					replace : true,
					link : function(scope, elements, attrs) {
						scope
							.$watch(
								attrs.headerColumn,
								function(column) {

									var htmlText = column.labelEN;
									if (column.sortable) {
										htmlText = '<span sort by="{{column.field}}" reverse="reverse" order="orders" >'
											+ htmlText
											+ '</span>';
									}
									elements.html(htmlText);
									$compile(
										elements
											.contents())(scope);

								})
					}
				}
			} ])
app.controller('DataTableController', [ '$scope', '$element', '$attrs',
	function($scope, $element, $attrs) {
		var vm = $scope;
		vm.data = [];
		vm.paging = $attrs.paging || true;

		vm.$watch($attrs.model, function(model) {
			vm.columns = [];

			model.columns.forEach(function(column) {
				var colConfig = {
					fieldName : column['fieldName'],
					labelEN : column['labelEN'],
					labelTH : column['labelTH'],
					cellTemplate : column['cellTemplate'],
					sortable : column['sortable'] || false,
					filterType : column['filterType'],
					format : column['format'],
					idValueField : column['idValueField'] || '$rowNo',
					renderer : column['renderer']
				};
				vm.columns.push(colConfig);
			});

		});
	} ]);