'use strict';

angular.module('gecscf.user', [ 'blockUI', 'ngDialog' ]).config(
	[ 'ngDialogProvider', function(ngDialogProvider) {
	    ngDialogProvider.setDefaults({
		className : 'ngdialog-theme-default',
		plain : false,
		showClose : false,
		closeByDocument : false,
		closeByEscape : false,
		appendTo : false,
		disableAnimation : true
	    });
	} ]);