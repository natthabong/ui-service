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
				link : function(scope, elements, attrs) {
					scope.fileName = '';
					scope.$watch('fileUpload', function() {
						if (!angular.isUndefined(scope.fileUpload)) {
							scope.fileName = scope.fileUpload.name || '';
						}
					});
					scope.$watch('acceptFileExtention', function() {
						scope.acceptFileExtention = scope.acceptFileExtention || '';
					});
				},
				template : '<div class="input-group">'
					+ '<scf-input-text id="{{inputTextId}}" ng-model="fileName" maxlength="n/a" readOnly="true"></scf-input-text>'
					+ '<div class="fileUpload btn input-group-addon btn-primary">'
					+ '<span>Select</span>'
					+ '<input type="file" accept="{{acceptFileExtention}}" file-model="fileUpload" id="{{browseFileId}}" class="upload"/>'
					+ '</div>'
					+ '</div>'
			}
		} ])
		.directive('fileModel', [ '$parse', function($parse) {
			return {
				restrict : 'A',
				link : function(scope, elements, attrs) {
					var model = $parse(attrs.fileModel);
					var modelSetter = model.assign;
					
					elements.bind('change', function() {
						scope.$apply(function() {
							modelSetter(scope, elements[0].files[0]);
						});
					});
				}
			}
		} ])
		