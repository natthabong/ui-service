'use strict';

angular.module('gecscf.ui', []).run([ "$templateCache", function($templateCache) {
		$templateCache.put('ui/template/calendar.html',
			'<p class="input-group">' + '<input type="text" placeholder="DD/MM/YYYY" show-weeks="false" class="form-control" ng-model="textModel" uib-datepicker-popup="{{dateFormat}}" is-open="isOpen" close-text="Close" min-date="minDate" max-date="maxDate"/>' + '<span class="input-group-btn">' + '<button type="button" class="btn btn-default" ng-click="openCalendarAction()">' + '<i class="glyphicon glyphicon-calendar"></i>' + '</button>' + "</span>" + '</p>');
		
		$templateCache.put('ui/template/autosuggest.html', 
				'<input type="text" placeholder="model.placeholer" ng-model="model.suggestModel" uib-typeahead="data for datas in model.searchTypeHead($viewValue)"/>');


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
		
		return {
			createTableModel: createTableModel
		}
	
}]);