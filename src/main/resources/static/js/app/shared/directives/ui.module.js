'use strict';

angular
	.module('gecscf.ui', [ 'ngDialog' ])
	.run(
		[
			"$templateCache",
			function($templateCache) {
			    $templateCache
				    .put(
					    'ui/template/calendar.html',
					    '<p class="input-group">'
						    + '<input type="text" placeholder="DD/MM/YYYY" show-weeks="false" class="form-control" ng-model="textModel" uib-datepicker-popup="{{dateFormat}}" is-open="isOpen" close-text="Close" min-date="minDate" max-date="maxDate"/>'
						    + '<span class="input-group-btn">'
						    + '<button type="button" class="btn btn-default" ng-click="openCalendarAction()">'
						    + '<i class="glyphicon glyphicon-calendar"></i>'
						    + '</button>' + "</span>"
						    + '</p>');

			    $templateCache
				    .put(
					    'ui/template/autoSuggest.html',
					    '<input type="text" id="{{id}}" ng-disabled="{{disable}}" placeholder="{{model.placeholder}}"'
						    + ' class="form-control" uib-typeahead="data as data.label for data in model.query($viewValue)"'
						    + ' ng-model="ngModel" typeahead-template-url="{{model.itemTemplateUrl}}"/>');

			    $templateCache
				    .put(
					    'ui/template/autoSuggestTemplate.html',
					    [
						    '<a>',
						    '<span id="{{match.model.identity}}" ',
						    'ng-bind-html="match.label | uibTypeaheadHighlight:query"></span>',
						    '</a>' ].join(''));

			} ])
	.config([ 'ngDialogProvider', function(ngDialogProvider) {
	    ngDialogProvider.setDefaults({
		className : 'ngdialog-theme-default',
		plain : false,
		showClose : false,
		closeByDocument : false,
		closeByEscape : false,
		appendTo : false,
		disableAnimation : true
	    });
	} ])
	.factory(
		'UIFactory',
		[
			'$q',
			'ngDialog',
			function($q, ngDialog) {
			    var BASE_TEMPLATE_URL = '/js/app/shared/templates/';
			    var createTableModel = function(config) {
				config.tableState = {
				    sort : {},
				    search : {},
				    pagination : {
					start : 0,
					totalItemCount : 0
				    }
				};
				return config;
			    }

			    var createAutoSuggestModel = function(config) {
				if (angular.isUndefined(config)) {
				    config = {
					placeholder : '',
					query : function(value) {
					},
					itemTemplateUrl : 'uib/template/typeahead/typeahead-match.html'
				    }
				}
				return config;
			    }

			    var showConfirmDialog = function(config) {
				ngDialog
					.open({
					    template : BASE_TEMPLATE_URL + 'confirm-dialog.html',
					    data: config.data,
					    preCloseCallback : function(confirm) {
						if (confirm) {
						    var deffered = config
							    .confirm()
						    return deffered.promise.then(function(response){config.onSuccess(response);deffered.resolve(response)}).catch(function(response){config.onFail(response);deffered.reject(response)});
						} else {
						    return true;
						}
					    }
					});
			    }
			    
			    var showSuccessDialog = function(config) {
				ngDialog
					.open({
					    template : BASE_TEMPLATE_URL + 'success-dialog.html',
					    preCloseCallback : config.preCloseCallback,
					    data: config.data
					});
			    }
			    
			    var showFailDialog = function(config) {
				ngDialog
					.open({
					    template : BASE_TEMPLATE_URL + 'fail-dialog.html',
					    preCloseCallback : config.preCloseCallback,
					    data: config.data
					});
			    }

			    return {
				createTableModel : createTableModel,
				createAutoSuggestModel : createAutoSuggestModel,
				showConfirmDialog : showConfirmDialog,
				showSuccessDialog :showSuccessDialog,
				showFailDialog : showFailDialog
			    }

			} ]);