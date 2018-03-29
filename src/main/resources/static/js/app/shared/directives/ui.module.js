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
						'<input type="text" id="{{id}}" ng-disabled="disable" placeholder="{{model.placeholder}}"'
						+ ' class="form-control" uib-typeahead="data as data.label for data in model.query($viewValue)"'
						+ ' autocomplete="off" ng-model="ngModel" typeahead-template-url="{{model.itemTemplateUrl}}" ng-required="ngRequired" name="{{name}}"/>');
				$templateCache
        .put(
          'ui/template/organizationLogo.html',
            '<div style="display: inline-block"><img  ng-repeat="f in fundings" style="height: 32px; width: 32px;float: left;margin-left: 2px;" data-ng-src="data:image/png;base64,{{decodeBase64(f.fundingLogo)}}" title="{{f.fundingName}}"></img>'
          + '</div>');

				$templateCache
					.put(
						'ui/template/autoSuggestTemplate.html',
						[
							'<a>',
							'<span id="{{match.model.identity}}" ',
							'ng-bind-html="match.label | uibTypeaheadHighlight:query"></span>',
							'</a>' ].join(''));
				$templateCache
				.put(
					'ui/template/checkboxButton.html',
                                	['<div class="media" style="border: 1px solid #ddd;width:130px;min-height: 90px;">'
                                	,'<div class="checkbox pull-left">'
                                	,'<label> <input id="{{name}}-checkbox" type="checkbox" ng-model="ngModel" ng-disabled="disable"/>'
                                	,'</label></div>'
                                	,'<div class="media-body" style="word-wrap: break-word;">'
                                	,'<label for="{{name}}-checkbox" id="{{name}}-label" >{{label | translate}}</label></div><div class="clearfix"></div></div>'].join(''));

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
	} ]).service('PageNavigation', [
	    '$filter',
	    '$http',
	    '$log',
	    '$q',
	    '$state',
	    '$stateParams',
	    function($filter, $http, $log, $q, $state, $stateParams) {
	        var vm = this;
	        var log = $log;

	        var homePage = '/';

	        var previousPages = new Array();
	        var steps = new Array();

	        vm.gotoPage = function(page, params, keepStateObject) {
	            var currentState = $state.current.name == '' ? '/' : $state.current.name;
	            previousPages.push({
	                page: currentState,
	                stateObject: keepStateObject
	            });
	            if (params === undefined) {
	                params = {};
	            }
	            params.backAction = false;
	            $state.go(page, params);
	        }

	        vm.gotoPreviousPage = function(reset) {
	            var previousPage = previousPages.pop();
	            if (previousPage != null) {
	                if (previousPage.stateObject === undefined) {
	                    previousPage.stateObject = {};
	                }
	                previousPage.stateObject.backAction = true;
	                $state.go(previousPage.page, reset ? {} : previousPage.stateObject, {
	                    reload: reset
	                });
	            } else {
	                $state.go(homePage);
	            }
	        }

	        vm.nextStep = function(nextPage, params, keepStateObject) {
	            steps.push({
	                page: $state.current.name,
	                stateObject: keepStateObject
	            });

	            params.backAction = false;

	            $state.go(nextPage, params);
	        }

	        vm.backStep = function(reset) {
	            var previousStep = steps.pop();
	            if (previousStep != null) {
	                previousStep.stateObject.backAction = true;
	                $state.go(previousStep.page, reset ? {} : previousStep.stateObject, {
	                    reload: reset
	                });
	            }
	        }
	        
	        vm.getParameters = function(){
	        	return  $stateParams;
	        }

	    }
	])
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
							query : function(value) {},
							itemTemplateUrl : 'uib/template/typeahead/typeahead-match.html'
						}
					}
					return config;
				}

				var showConfirmDialog = function(config) {
					return ngDialog
						.open({
							template : BASE_TEMPLATE_URL + 'confirm-dialog.html',
							data : config.data,
							preCloseCallback : function(confirm) {
								if (confirm) {
									var deffered = config
										.confirm()
									return deffered.promise.then(function(response) {
										config.onSuccess(response);deffered.resolve(response)
									}).catch(function(response) {
										config.onFail(response);deffered.reject(response)
									});
								} else {
								    	if(config.onCancel != undefined){
								    	    config.onCancel();
								    	}
									return true;
								}
							}
						});
				}

				var showSuccessDialog = function(config) {
					return ngDialog
						.open({
							template : BASE_TEMPLATE_URL + 'success-dialog.html',
							preCloseCallback : config.preCloseCallback,
							data : {
								data : config.data,
								buttons : config.buttons
							}
						});
				}

				var showFailDialog = function(config) {				
					return ngDialog
						.open({
							template : BASE_TEMPLATE_URL + 'fail-dialog.html',
							preCloseCallback : config.preCloseCallback,
							data : {
								data : config.data,
								buttons : config.buttons
							}
						});
				}
				
				var showIncompleteDialog = function(config) {
					return ngDialog
						.open({
							template : BASE_TEMPLATE_URL + 'incomplete-dialog.html',
							preCloseCallback : config.preCloseCallback,
							data : {
								data : config.data,
								buttons : config.buttons
							}
						});
				}
				
				var showHourDialog = function(config) {	
					console.log(config);
						return ngDialog
							.open({
								template : BASE_TEMPLATE_URL + 'hour-dialog.html',
								preCloseCallback : config.preCloseCallback,
								data : {
									data : config.data,
									buttons : config.buttons
								}
							});
					}
				
				var createCriteria = function(criteria){
					if(angular.isDefined(criteria) && criteria != null){
						if(criteria.length > 0){
							return criteria;
						}						
					}
					
					return criteria
				}
				
				var showDialog = function(config) {				
					return ngDialog
						.open({
							template : config.templateUrl,
							preCloseCallback : config.preCloseCallback,
							data : config.data,
							controller:  config.controller,
							controllerAs: 'ctrl',
		                    cache: false
						});
				}
				
				return {
					createTableModel : createTableModel,
					createAutoSuggestModel : createAutoSuggestModel,
					showConfirmDialog : showConfirmDialog,
					showSuccessDialog : showSuccessDialog,
					showFailDialog : showFailDialog,
					showIncompleteDialog : showIncompleteDialog,
					createCriteria: createCriteria,
					showHourDialog: showHourDialog,
					showDialog: showDialog,
					constants: {
						NOLOGO: 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAS1BMVEX///8CM1LS2+Dd5OhWd4w+Y3u8ydG1w8zw8/U1XHVbe494kqMgS2bh5+uXq7gWQ2AuVnCdsLxPcYeFnaxDaH9qh5lxjZ4OPVomUGppW+TYAAAAu0lEQVQ4jbWT2w6DIBBEGa6uoCJi2///0i7GpthoTBOdB7I7OQ+zsAhxhSQq+V1gIKInItHrAGj5NGiEcLcB0Xsf8PBeHwCnU2RrbYSzdrotZFJKEaRSI2ZVaS/kRvIDBK31gKS1YddonTCwE75AlQFwQjQw7LRXAqcZTqeo7gEYlZIgdtKVIavXBCZrHSI7+Y+QQOad8vPqz6XJW6AvRbcCXWn6CwGKXAb+W0tRFEsTlqIAhzMU7Szgj97E2wmkdMmO8AAAAABJRU5ErkJggg=='
					}
				}

			} ])
	
	.filter('isDisplayTransactionErrorMessage', function() {
	    return function(data) {        	
	       if(data!=undefined && data.statusCode != undefined){
	    		    if("REJECTED_BY_BANK"==data.statusCode){
	    		    	return true;
	    		    }else if("REJECT_INCOMPLETE"==data.statusCode){
	    		    	return true;
	    		    }else if("FAIL_TO_DRAWDOWN"==data.statusCode){
	    		    	return true;
	    		    }else if("EXPIRED"==data.statusCode){
	    		    	return true;
	    		    }else if("INCOMPLETE"==data.statusCode){
	    		    	return true;
	    		    }else if("REJECT_BY_APPROVER"==data.statusCode){
	    		    	return true;
	    		    }else if("REJECT_BY_CHECKER"==data.statusCode){
	    		    	return true;
	    		    }else{
	    		    	 return false;
	    		    }
	       }else{
	    	   return false;
	       } 	      
	    };
	})	
	.filter('transactionErrorMessage', function() {
	    return function(data) {    
			if(data == undefined){
				return "";
			}else{
				if(data.statusCode == 'DRAWDOWN_SUCCESS'||data.statusCode == 'WAIT_FOR_DRAWDOWN_RESULT'||data.statusCode == 'PAYMENT_SUCCESS'||data.statusCode == 'WAIT_FOR_PAYMENT_RESULT'){
					return "";
				}
				if(data.statusCode == 'REJECTED_BY_BANK' || data.statusCode == 'REJECT_BY_CHECKER' || data.statusCode == 'REJECT_BY_APPROVER' || data.statusCode == 'EXPIRED'){
					return data.rejectReason;
				}else{
					if(data.returnCode != undefined && data.returnCode != null && data.returnCode != ''){
						return "["+data.returnCode+"] "+data.returnMessage;
					}else{
						return data.returnMessage ;
					}
				}
			}
	    };
	})
	.filter('transactionErrorMessagePopup', function() {
	    return function(data) {    
			if(data == undefined){
				return "";
			}else{
				if(data.statusCode == 'REJECTED_BY_BANK' || data.statusCode == 'REJECT_BY_CHECKER' || data.statusCode == 'REJECT_BY_APPROVER'){
					return data.rejectReason;
				}else{
					
					if(data.returnCode != undefined && data.returnCode != null && data.returnCode != ''){
						return "["+data.returnCode+"] "+data.returnMessage ;
					}else{
						return data.returnMessage ;
					}
				}
			}
	    };
	}).filter('accountNo', function() {
	    return function(data) {    
			if(data == undefined){
				return "";
			}else{
				var p1 = data.substring(0,3);
				var p2 = data.substring(3,4);
				var p3 = data.substring(4, 9);
				var p4 = data.substring(9,10);
				return [p1, p2, p3, p4].join('-');
			}
	    };
	})