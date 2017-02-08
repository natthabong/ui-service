'use strict';

angular.module('gecscf.ui', []).run([ "$templateCache", function($templateCache) {
		$templateCache.put('ui/template/calendar.html',
			'<p class="input-group">' + '<input type="text" placeholder="DD/MM/YYYY" show-weeks="false" class="form-control" ng-model="textModel" uib-datepicker-popup="{{dateFormat}}" is-open="isOpen" close-text="Close" min-date="minDate" max-date="maxDate"/>' + '<span class="input-group-btn">' + '<button type="button" class="btn btn-default" ng-click="openCalendarAction()">' + '<i class="glyphicon glyphicon-calendar"></i>' + '</button>' + "</span>" + '</p>');
		
		$templateCache.put('ui/template/autoSuggest.html', 
				'<input type="text" id="{{id}}" ng-disabled="{{disable}}" placeholder="{{model.placeholder}}"'+
				' class="form-control" uib-typeahead="data as data.label for data in model.query($viewValue)"'+
				' ng-model="ngModel" typeahead-template-url="{{model.itemTemplateUrl}}"/>');
		
		$templateCache.put('ui/template/autoSuggestTemplate.html',
				'<a>'+
	      '<span id="{{$index}}" ng-bind-html="match.label | uibTypeaheadHighlight:query"></span></a>');

	} ]) .factory('UIModelFactory', ['$q', '$timeout', function ($q, $timeout) {
		
		var createTableModel = function(config){
			config.tableState = {
		      sort: {},
		      search: {},
		      pagination: {
		        start: 0,
		        totalItemCount: 0
		      }
		    };
			return config;
		}
		
		var createAutoSuggestModel = function(config){
			if(angular.isUndefined(config)){
				config = {
						placeholder: '',
						query: function(value){},
						itemTemplateUrl: 'uib/template/typeahead/typeahead-match.html'
				}
			}
			return config;
		}
		
		return {
			createTableModel: createTableModel,
			createAutoSuggestModel: createAutoSuggestModel
		}
	
}]);