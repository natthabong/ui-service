'use strict';

var acctApp = angular.module('gecscf.account', [ 'ui.router', 'gecscf.ui' ]).config(
		[ '$stateProvider', function($stateProvider) {
			
		} ]);
acctApp.constant("AccountStatus", [
	{
		label : 'All',
		value : '',
		valueObject : null
	},
	{
		label : 'Active',
		value : false,
		valueObject : false
	},
	{
		label : 'Suspend',
		value : true,
		valueObject : true
	}
]);