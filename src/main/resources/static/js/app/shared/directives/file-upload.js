'use strict';

var app = angular.module('gecscf.ui');

app.directive('scfFileUpload', [ function() {
			return {
				restrict : 'E',
				scope : {
					fileUpload : '=',
					inputTextId : '@',
					browseFileId : '@',
					acceptFileExtention : '='
				},
				link : function(scope, element, attrs) {
					var inputTextChild = element[0].children[0].children[0];
					scope.$watch('fileUpload', function() {
						if (!angular.isUndefined(scope.fileUpload)) {
							inputTextChild.value = scope.fileUpload.name || '';
						}
					});
					scope.$watch('acceptFileExtention', function() {
						scope.acceptFileExtention = scope.acceptFileExtention || '';
					});
				},
				template : '<div class="input-group">'
					+ '<scf-input-text id="{{inputTextId}}" maxlength="n/a" readOnly="true"></scf-input-text>'
					+ '<div class="fileUpload btn input-group-addon">'
					+ '<span>Select</span>'
					+ '<input type="file" accept="{{acceptFileExtention}}" file-model="fileUpload" id="{{browseFileId}}" class="upload"/>'
					+ '</div>'
					+ '</div>'
			}
		} ])
		.directive('fileModel', [ '$parse', function($parse) {
			return {
				restrict : 'A',
				link : function(scope, element, attrs) {
					var model = $parse(attrs.fileModel);
					var modelSetter = model.assign;
					element.bind('change', function() {
						scope.$apply(function() {
							modelSetter(scope, element[0].files[0]);
						});
					});
				}
			}
		} ])
		