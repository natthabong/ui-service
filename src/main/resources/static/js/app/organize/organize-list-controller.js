angular.module('scfApp').controller('OrganizeListController',['$scope','Service', '$stateParams', '$log', 'SCFCommonService','PagingController', function($scope,Service, $stateParams, $log, SCFCommonService,PagingController ){

	var vm = this;
	var log = $log;
	
	vm.organizeName = '';
	vm.splitePageTxt = '';
	vm.currentPage = 0;
    vm.pageModel = {
            pageSizeSelectModel: '20',
            totalRecord: 0,
			totalPage: 0,
    		clearSortOrder: false
    };
    
	vm.newOrganizeProfile = function(){
		PageNavigation.gotoPage('/api/v1/organize-customers/');
	}
    
	vm.editOrganizeProfile = function(data){
		PageNavigation.gotoPage('/api/v1/organize-customers/'+data.organizeId,{
			
		});
	}
	
	vm.sponsorConfig = function(data){
		PageNavigation.gotoPage('/sponsor-configuration'+data.organizeId, {
			organizeModel: data
		});
	}
	
    vm.data = [{
    	"organizeId" : "00022356",
    	"organizeName":"BIG C SUPERCENTER PUBLIC CO.,LTD",
    	"sponsor":1,
    	"active":"Active"
    },{
    	"organizeId" : "00025408",
    	"organizeName":"EK-CHAI DISTRIBUITION SYSTEM CO.,LTD",
    	"sponsor":1,
    	"active":"Active"
    },{
    	"organizeId" : "00047384",
    	"organizeName":"MASS SUPPLY SERVICE CO.,LTD,",
    	"sponsor":0,
    	"active":"Active"
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
				cellTemplate: '<img	style="height: 16px; width: 16px;" data-ng-src="img/checkmark.png"/>'
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
				cellTemplate: '<scf-button class="btn-default gec-btn-action" id="organize-{{data.organizeId}}-profile-button" ng-click="ctrl.editOrganizeProfile(data)" title="Edit Profile"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button> <scf-button class="btn-default gec-btn-action" id="organize-{{data.organizeId}}-sponsor-config-button" ng-click="ctrl.sponsorConfig(data)" title="Edit Profile"><i class="fa fa-cog" aria-hidden="true"></i></scf-button><scf-button class="btn-default gec-btn-action" id="organize-{{data.organizeId}}-sponsor-config-button" ng-click="ctrl.sponsorConfig(data)" title="Edit Profile"><img data-ng-src="img/gear_warning.png" style="height: 16px; width: 16px;"/></scf-button>'
			}]
    }
    
}]);