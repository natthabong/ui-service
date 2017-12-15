'use strict';

angular.module('gecscf.transaction', [ 'ui.router', 'gecscf.ui' ]).config(
		[ '$stateProvider', function($stateProvider) {
			
		} ]).filter('accountNoDisplay', function() {
		    return function(accountNo) {
		    	var pattern = new RegExp("^\\d{10}$");
		    	var accountNoDisplay = accountNo;
		    	if(accountNo.match(pattern)){
		    		var word1 = accountNo.substring(0,3);
		    		var word2 = accountNo.substring(3,4);
		    		var word3 = accountNo.substring(4, 9);
		    		var word4 = accountNo.substring(9,10);
		    		accountNoDisplay = word1+'-'+word2+'-'+word3+'-'+word4;    		
		    	}
				// else{
		    	// 	accountNoDisplay = accountNo.charAt(0).toUpperCase() + accountNo.slice(1).toLowerCase();
		    	// }
				return accountNoDisplay;
		    };
		});