angular.module('scfApp').controller('OrganizeListController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', 
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http ){

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
    
    var organizeAutoSuggestServiceUrl = 'api/v1/organizes';
    var searchOrganizeTypeHead = function(value){
    	return $http.get(organizeAutoSuggestServiceUrl, {
			params : {
				q : value,
				isFounder: false,
				offset : 0,
				limit : 5
				}
			}).then(function(response) {
				return response.data.map(function(item) {
					item.identity = [ 'organize-', item.organizeId, '-option' ].join('');
					item.label = [ item.organizeId, ': ', item.organizeName ].join('');
					return item;
				});
			});
	}
	
	vm.organizeAutoSuggestModel = UIFactory.createAutoSuggestModel({
		placeholder: 'Enter Organize name or code',
		itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
		query: searchOrganizeTypeHead
	});
	
	vm.organizeCriteria = {
			organizeId: undefined
	}
	
	vm.pagingController = PagingController.create('/api/v1/organize-customers/', vm.organizeCriteria, 'GET');
	
	vm.searchOrganize = function(pageModel){
        var organizeId = undefined;
        if(angular.isObject(vm.organize)){
        	vm.organizeCriteria.organizeId = vm.organize.organizeId;
        }        
		
        vm.pagingController.search(pageModel);
        
	}
    
    vm.dataTable = {
    		identityField: 'organizeId',
            columns: [{
            	fieldName: 'organizeId',
                labelEN: 'Organize Code',
                labelTH: 'Organize Code',
                id: 'organize-{value}-organize-code-label',
                sortable: false,
                cssTemplate: 'text-center',
            },{
            	fieldName: 'organizeName',
            	labelEN: 'Organize Name',
            	labelTH: 'Organize Name',
                id: 'organize-{value}-organize-name-label',
                sortable: false,
                cssTemplate: 'text-left'
            }, {
            	labelEN: 'Sponsor',
            	labelTH: 'Sponsor',
                id: 'organize-{value}-sponsor-flag-label',
                cssTemplate: 'text-center',
				cellTemplate: '<img	style="height: 16px; width: 16px;" ng-show="data.sponsor" data-ng-src="img/checkmark.png"/>'
            }, {
            	labelEN: 'Status',
            	labelTH: 'Status',
                id: 'organize-{value}-active-label',
                sortable: false,
                cssTemplate: 'text-center',
                cellTemplate: '<span id="{{data.organizeId}}">{{data.active ? "Active" : "Inactive"}}</span>'	
            },{
				cssTemplate: 'text-center',
				sortable: false,
				cellTemplate: '<scf-button ng-disabled="true" class="btn-default gec-btn-action" id="organize-{{data.organizeId}}-profile-button" ng-click="ctrl.editOrganizeProfile(data)" title="Edit Profile"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button><scf-button class="btn-default gec-btn-action" ng-disabled="data.sponsor==false" id="organize-{{data.organizeId}}-sponsor-config-button" ng-click="ctrl.sponsorConfig(data)" title="Edit Profile"> <i class="fa fa-cog" aria-hidden="true" ng-show="data.completed"></i> <img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/> </scf-button>'
			}]
    }
    
	vm.initLoad = function() {
        vm.pageModel.currentPage = 0;
        vm.pageModel.pageSizeSelectModel = '20';
        
        vm.searchOrganize();
	}

	vm.initLoad();
	
}]);