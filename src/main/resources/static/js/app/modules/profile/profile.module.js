'use strict';

angular.module('gecscf.profile', [ 'blockUI', 'ngDialog', 'gecscf.ui' ]).config(
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