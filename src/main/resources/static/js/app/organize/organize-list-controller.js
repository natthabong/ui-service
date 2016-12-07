angular.module('scfApp').controller('OrganizeListController',['$scope','Service', '$stateParams', '$log', 'SCFCommonService','PagingController','PageNavigation', '$state', function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state ){

	var vm = this;
	var log = $log;
	
	vm.organizeName = '';
	
	vm.splitePageTxt = '';

	vm.pageModel = {
		pageSizeSelectModel : '20',
		totalRecord : 0,
		currentPage : 0,
		clearSortOrder : false,
		pageSize: 20
	};
	
   
    vm.pageModel.pageSizeList = [ {
		label : '10',
		value : '10'
	}, {
		label : '20',
		value : '20'
	}, {
		label : '50',
		value : '50'
	} ];
    
	vm.newOrganizeProfile = function(){
		PageNavigation.gotoPage('/');
	}
    
	vm.editOrganizeProfile = function(data){
		PageNavigation.gotoPage('/'+data.organizeId,{
			
		});
	}
	
	vm.sponsorConfig = function(data){
		var params = {organizeModel: data};
		PageNavigation.gotoPage('/sponsor-configuration', params);
	}

    vm.data = []
    
	vm.searchOrganize = function(pageModel){
    	
        if (pageModel === undefined) {
            vm.pageModel.pageSizeSelectModel = '20';
            vm.pageModel.currentPage = 0;
        } else {
            vm.pageModel.pageSizeSelectModel = pageModel.pageSize;
            vm.pageModel.currentPage = pageModel.page;
        }
        
		var serviceUrl = '/api/v1/organize-customers/';
		var serviceDiferred = Service.doGet(serviceUrl, {
			page: vm.pageModel.currentPage,
			size: vm.pageModel.pageSizeSelectModel
		});		
		
		serviceDiferred.promise.then(function(response){
			vm.data = response.data;
			vm.pageModel.totalRecord = response.headers("X-Total-Count");
			vm.pageModel.totalPage = response.headers("X-Total-Page");
			vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
		}).catch(function(response){
			log.error('Load organize data error');
		});

	}    
    
    vm.dataTable = {
            columns: [{
                field: 'organizeId',
                label: 'Organize Code',
                idValueField: 'template',
                id: 'organize-{value}-organize-code-label',
                sortable: true,
                cssTemplate: 'text-center',
            },{
                field: 'organizeName',
                label: 'Organize Name',
                idValueField: 'template',
                id: 'organize-{value}-organize-name-label',
                sortable: true,
                cssTemplate: 'text-center'
            }, {
                label: 'Sponsor',
                idValueField: 'template',
                id: 'organize-{value}-sponsor-flag-label',
                cssTemplate: 'text-center',
				cellTemplate: '<img	style="height: 16px; width: 16px;" ng-show="data.sponsor" data-ng-src="img/checkmark.png"/>'
            }, {
                field: 'active',
                label: 'Active',
                id: 'organize-{value}-active-label',
                sortable: true,
                cssTemplate: 'text-center'
            },{
				field: 'Action',
				label: 'Action',
				cssTemplate: 'text-center',
				sortable: false,
				cellTemplate: '<scf-button class="btn-default gec-btn-action" id="organize-{{data.organizeId}}-profile-button" ng-click="ctrl.editOrganizeProfile(data)" title="Edit Profile"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button><scf-button class="btn-default gec-btn-action" ng-disabled="data.sponsor==false" id="organize-{{data.organizeId}}-sponsor-config-button" ng-click="ctrl.sponsorConfig(data)" title="Edit Profile"> <i class="fa fa-cog" aria-hidden="true" ng-show="data.completed"></i> <img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/> </scf-button>'
			}]
    }
    
	vm.initLoad = function() {
        vm.pageModel.currentPage = 0;
        vm.pageModel.pageSizeSelectModel = '20';
        
        vm.searchOrganize();
	}

	vm.initLoad();    
    
}]);