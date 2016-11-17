angular.module('scfApp').controller('OrganizeListController',['$scope','Service', '$stateParams', '$log', 'SCFCommonService','PagingController', function($scope,Service, $stateParams, $log, SCFCommonService,PagingController ){

	var vm = this;
	var log = $log;
	
	vm.organizeName = '';
	vm.splitePageTxt = '1-3 of 3';
	vm.currentPage = 0;
    vm.pageModel = {
            pageSizeSelectModel: '20',
            totalRecord: 0,
			totalPage: 1,
    		clearSortOrder: false
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
    
    vm.currentPage = 1;
    
    vm.searchOrganize = function(){
    	
    }
    
	vm.newOrganizeProfile = function(){
		PageNavigation.gotoPage('/api/v1/organize-customers/');
	}
    
	vm.editOrganizeProfile = function(data){
		PageNavigation.gotoPage('/api/v1/organize-customers/'+data.organizeId,{
			
		});
	}
	
	vm.sponsorConfig = function(data){
		PageNavigation.gotoPage('/api/v1/organize-customers/'+data.organizeId, {
			organize: data
		});
	}
	
    vm.data = [{
    	"organizeId" : "00022356",
    	"organizeName":"BIG C SUPERCENTER PUBLIC CO.,LTD",
    	"sponsor":1,
    	"active":"Active",
    	"isComplete":1,
    },{
    	"organizeId" : "00025408",
    	"organizeName":"EK-CHAI DISTRIBUITION SYSTEM CO.,LTD",
    	"sponsor":1,
    	"active":"Active",
    	"isComplete":0,
    },{
    	"organizeId" : "00047384",
    	"organizeName":"MASS SUPPLY SERVICE CO.,LTD,",
    	"sponsor":0,
    	"active":"Active",
    	"isComplete":0,	
    }]
    
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
				cellTemplate: '<img	style="height: 16px; width: 16px;" ng-hide="data.sponsor==false" data-ng-src="img/checkmark.png"/>'
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
				cellTemplate: '<scf-button class="btn-default gec-btn-action" id="organize-{{data.organizeId}}-profile-button" ng-click="ctrl.editOrganizeProfile(data)" title="Edit Profile"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button><scf-button class="btn-default gec-btn-action" ng-disabled="data.sponsor==false" id="organize-{{data.organizeId}}-sponsor-config-button" ng-click="ctrl.sponsorConfig(data)" title="Edit Profile"> <i class="fa fa-cog" aria-hidden="true" ng-hide="data.isComplete==true"></i> <img ng-hide="data.isComplete==false" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/> </scf-button>'
			}]
    }
    
}]);