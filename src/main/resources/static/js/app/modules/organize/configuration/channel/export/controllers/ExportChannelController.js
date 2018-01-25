var exportChannelModule = angular
        .module('gecscf.organize.configuration.channel.export');
exportChannelModule.constant('ChannelDropdown',[
	{label:'Web', value: 'WEB'},
	{label:'FTP', value: 'FTP'}
	]);
exportChannelModule.constant('ExportDataTypeDropdown',[
	{label:'All Product type', value: 'ALL'},
	{label:'Specified product type', value: 'SPECIFIED'}
	]);
exportChannelModule.controller('ExportChannelController', [
			'$log','$scope','$state','$stateParams','Service','ChannelDropdown','ExportDataTypeDropdown','FileLayoutService',
			'PageNavigation',
	function($log , $scope , $state , $stateParams , Service , ChannelDropdown , ExportDataTypeDropdown , FileLayoutService ,
			PageNavigation) {

      var vm = this;
      var channelId = $stateParams.channelId;
      var organizeId = $stateParams.organizeId;
      var BASE_URI = 'api/v1/organize-customers/' + organizeId;
      vm.channelModel = {};
      vm.productTypes = {};
      vm.haveProductType = false;
      vm.fileLayouts = [];
      vm.channelDropdown = ChannelDropdown;
      vm.exportDataTypeDropdown = ExportDataTypeDropdown;
      $scope.errors = {};
      vm.manageAll=false;
      vm.openActiveDate = false;
      vm.openCalendarActiveDate = function() {
      	vm.openActiveDate = true;
      };
      vm.openExpireDate = false;
      vm.openCalendarExpireDate = function() {
      	vm.openExpireDate = true;
      };
      vm.isUseExpireDate = false;
      vm.isAllProductType = false;
      
      vm.backToSponsorConfigPage = function(){
 		 PageNavigation.gotoPage('/sponsor-configuration',  {
 	        	organizeId:  organizeId
 	     });
      }
      
      var sendRequest = function(uri, succcesFunc, failedFunc) {
          var serviceDiferred = Service.doGet(BASE_URI + uri);

          var failedFunc = failedFunc | function(response) {
              log.error('Load data error');
          };
          serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
      }
      
      vm.searchChannel = function(){
  			sendRequest('/export-channels/' + channelId, function(response) {
	            vm.channelModel = response.data;
	              
	            if(response.data.activeDate != null){
	              	vm.channelModel.activeDate =  new Date(response.data.activeDate);
	  			}else {
	  				vm.channelModel.activeDate = null;
	  			}
	              
	            if(response.data.expiryDate != null){
	              	vm.channelModel.expiryDate =  new Date(response.data.expiryDate);
	  				vm.isUseExpireDate = true;
	  			}else{
	  				vm.channelModel.expiryDate = null;
	  			}
	            
	            if(vm.channelModel.exportDataType == 'ALL'){
	            	vm.isAllProductType = true;
	  			}
  			});
      }
      
      vm.searchFileLayout = function(){
    	  var deffered = FileLayoutService.getFileLayouts(organizeId, 'EXPORT_DOCUMENT', 'EXPORT');
    	  deffered.promise.then(function(response){
    		  vm.fileLayouts = [];
    		  var _fileLayouts = response.data;
          	  if (angular.isDefined(_fileLayouts)) {
          		 _fileLayouts.forEach(function (fileLayout) {
                      var selectObj = {
                          label: fileLayout.displayName,
                          value: fileLayout.layoutConfigId
                      }
                      vm.fileLayouts.push(selectObj);
                   });
          	  }
    	  });
     };
     
     vm.searchProductTypes = function(){
    	 sendRequest('/product-types', function(response) {
    		 vm.productTypes = response.data;
	         if(response.data != null){
	           	vm.haveProductType =  true;
	         }
    	 });
     }

     var setupPrepareData = function(){
 		if(!vm.isUseExpireDate){
 			vm.channelModel.expiryDate = null;
 		}
 	 }     

     var validSave = function(){
 		$scope.errors = {};
 		var isValid = true;
 		var channel = vm.channelModel;

 		if(vm.channelModel.displayName == null || vm.channelModel.displayName ==""){
 			isValid = false;
 			$scope.errors.displayName = {
 					message : 'Display name is required.'
 			}			
 		} 		
 		
 		if(vm.channelModel.layoutConfigId == null || vm.channelModel.layoutConfigId ==""){
 			isValid = false;
 			$scope.errors.layout = {
 					message : 'File layout is required.'
 			}			
 		}

 		if (!angular.isDefined(channel.activeDate)) {
 			isValid = false;
 		    $scope.errors.activeDate = {
 	    		message : 'Wrong date format data.'
 		    }
 		}else if(channel.activeDate == null|| channel.activeDate ==''){
 			isValid = false;
 		    $scope.errors.activeDate = {
 	    		message : 'Active date is required.'
 		    }
 		}
 		
 		if (vm.isUseExpireDate) {
 		    if (!angular.isDefined(channel.expiryDate)) {
 		    	isValid = false;
 				$scope.errors.expiryDate = {
 				    message : 'Wrong date format data.'
 				}
 		    }else if(channel.expiryDate == null|| channel.expiryDate ==''){				    	
 		    	isValid = false;
 			    $scope.errors.expiryDate = {
 		    		message : 'Expire date is required.'
 			    }
 		    }else if (angular.isDefined(channel.activeDate)
 				    && channel.expiryDate < channel.activeDate) {
 		    	isValid = false;
 				$scope.errors.activeDate = {
 				    message : 'Active date must be less than or equal to expire date.'
 				}
 			}
 		}
 		return isValid;
 	 }     
     
     vm.saveChannel = function(){
    	setupPrepareData();
    	if(validSave()){
	    	var preCloseCallback = function(confirm) {
	    		vm.backToSponsorConfigPage();
	        }
	    	
	    	UIFactory.showConfirmDialog({
	    		data : {
	    		    headerMessage : 'Confirm save?'
	    		},
		    	confirm : $scope.confirmSave,
		    	onSuccess : function(response) {
		    		blockUI.stop();
		    		UIFactory.showSuccessDialog({
		    			data : {
		    				headerMessage : 'Edit channel complete.',
		    				bodyMessage : ''
		    			},
		    			preCloseCallback : preCloseCallback
		    		});
		    	},
		    	onFail : function(response) {
		    		var msg = {
							405 : 'Channel has been modified.'
					};
			    	blockUI.stop();
			    	UIFactory.showFailDialog({
						data : {
								headerMessage : 'Edit channel fail.',
								bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback : null
		    		});
		    	}
	    	});
    	}
     }    	 
      
	 vm.initLoad = function() {
	   	vm.searchChannel();
	 	vm.searchFileLayout();
	 	vm.searchProductTypes();
	 }();
	 
}]);