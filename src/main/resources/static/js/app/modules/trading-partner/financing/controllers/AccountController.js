'use strict';
var ac = angular.module('gecscf.tradingPartner.financing');
ac.controller('AccountController', [ '$scope', '$stateParams', 'UIFactory', 'AccountService',
		function($scope, $stateParams, UIFactory, AccountService) {
	
	var vm = this;
	var dialogData = $scope.ngDialogData;
	console.log(dialogData);
	vm.save = function(data, callback){
		var preCloseCallback = function(account){
			callback(account);
		}
		UIFactory.showConfirmDialog({
			data : {
				headerMessage : 'Confirm save?'
			},
			confirm : function() {
				return AccountService.save({
					organizeId: dialogData.organizeId,
					accountNo: data.accountNo
				});
			},
			onFail : function(response) {
			     if(response.status != 400){
                     var msg = {
                    		 409 : 'Account No. is existed.'
                     };
	    		 	UIFactory.showFailDialog({
                         data : {
                             headerMessage :  'Add new account fail.',
                             bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
                         },
                         preCloseCallback : preCloseCallback
                     });
			     }
			},
			onSuccess : function(response) {
				UIFactory.showSuccessDialog({
					data : {
						headerMessage : 'Add new account success.',
						bodyMessage : ''
					},
					preCloseCallback : function(){
						preCloseCallback(response.data);
					}
				});
			}
		    });
	}

} ]);