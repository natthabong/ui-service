angular.module('scfApp').controller('ExportPaymentConfigController', [
	'$log',
	'$scope',
	'$state',
	'SCFCommonService',
	'$stateParams',
	'$timeout',
	'PageNavigation',
	'Service',
	'FileLayoutService',
	'UIFactory', 
	'ConfigurationUtils',
	function($log, $scope, $state, SCFCommonService, $stateParams, $timeout,
			PageNavigation, Service, FileLayoutService, UIFactory , ConfigurationUtils) {
        var vm = this;
        var log = $log;
        vm.viewAll = false;
        vm.manageAll = false;
        
        var parameters = PageNavigation.getParameters();
		var organizeId = parameters.organizeId;
        vm.pageModel = {
				pageSizeSelectModel : '20',
				totalRecord : 0,
				currentPage : 0,
				clearSortOrder : false,
				page: 0,
				pageSize: 20
		};

		vm.pageSizeList = [ {
			label : '10',
			value : '10'
		}, {
			label : '20',
			value : '20'
		}, {
			label : '50',
			value : '50'
		} ];
		vm.data = [];
        
        vm.unauthenConfig = function(){
            var disable = true;
            if(vm.viewAll || vm.manageAll){
                disable = false;
            }
            return disable;
        }

        vm.setupExportPayment = function(data) {
            var params = {
            	layoutConfigId : data.layoutConfigId,
                organizeId: organizeId
            };
            PageNavigation.gotoPage('/sponsor-configuration/export-payments/settings', params)
        };
        
        vm.newExportFileLayout = function(data, processType, integrateType){		
			ConfigurationUtils.showCreateExportLayoutDialog({
				data : { 
					showAll: true ,
					ownerId : organizeId
				}, preCloseCallback : function() {
					vm.init(processType, integrateType);
				}
			});
		}
        
        vm.deleteLayout = function(data) {
            UIFactory
            .showConfirmDialog({
              data : {
                headerMessage : 'Confirm delete?'
              },
              confirm : function() {
                return FileLayoutService
                    .deleteLayout(data, vm.processType, vm.integrateType);
              },
              onFail : function(response) {
                var status = response.status;
                  var msg = {
                    404 : "File layout has been deleted.",
                    409 : "File layout has been modified.",
                    405 : "File Layout has been used."
                  }
                  UIFactory
                      .showFailDialog({
                        data : {
                          headerMessage : 'Delete file layout fail.',
                          bodyMessage : msg[status] ? msg[status]
                              : response.errorMessage
                        },
                        preCloseCallback : function(){
                          callService(vm.processType, vm.integrateType);
                        }
                      });

              },
              onSuccess : function(response) {
                UIFactory
                    .showSuccessDialog({
                      data : {
                        headerMessage : 'Delete file layout success.',
                        bodyMessage : ''
                      },
                      preCloseCallback : function(){
                        callService(vm.processType, vm.integrateType);
                      }
                    });
              }
            });
      }
        
        function callService(processType, integrateType){
			var sponsorId = organizeId;
			
			var offset = 0;
			if(vm.pageModel.currentPage>0){
				offset = vm.pageModel.currentPage*vm.pageModel.pageSizeSelectModel;
			}
			
			var fileLayoutsUrl = '/api/v1/organize-customers/'+sponsorId+'/process-types/'+processType+ '/integrate-types/' + integrateType+'/layouts';
			var serviceDiferred = Service.doGet(fileLayoutsUrl, {
				offset: offset,
				limit: vm.pageModel.pageSizeSelectModel
			});									
			
			serviceDiferred.promise.then(function(response){
				vm.data = response.data;
				
				vm.pageModel.totalRecord = response.headers("X-Total-Count");
				vm.pageModel.totalPage = response.headers("X-Total-Page");	
				vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
			}).catch(function(response){
				log.error('Load File layouts data error');
			});
		}
        
        //init
		vm.init = function(processType, integrateType) {
            vm.pageModel.currentPage = 0;
            vm.pageModel.pageSizeSelectModel = '20';
            vm.processType = processType;
            vm.integrateType = integrateType;
        	callService(processType, integrateType);
		}
		
    }
]);