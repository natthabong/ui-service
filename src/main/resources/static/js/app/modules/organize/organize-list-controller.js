angular.module('scfApp').controller('OrganizeListController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', 
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http ){

	var vm = this;
	var log = $log;
	    
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
    	value = UIFactory.createCriteria(value);
    	return $http.get(organizeAutoSuggestServiceUrl, {
			params : {
				q : value,
				founder: false,
				supporter: false,
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
		placeholder: 'Enter organize name or code',
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
        }else{
        	vm.organizeCriteria.organizeId = undefined;
        }
		
        vm.pagingController.search(pageModel);
        
	}
    
    vm.dataTable = {
    		identityField: 'organizeId',
            columns: [{
            	fieldName: 'organizeId',
                labelEN: 'Organize Code',
                labelTH: 'Organize Code',
                id: '{value}-organize-code',
                sortable: false,
                cssTemplate: 'text-center',
            },{
            	fieldName: 'organizeName',
            	labelEN: 'Organize Name',
            	labelTH: 'Organize Name',
                id: '{value}-organize-name',
                sortable: false,
                cssTemplate: 'text-left'
            }, {
            	fieldName: 'sponsor',
            	labelEN: 'Sponsor',
            	labelTH: 'Sponsor',
                id: '{value}-sponsor-flag',
                cssTemplate: 'text-center',
				cellTemplate: '<img	style="height: 16px; width: 16px;" ng-show="data.sponsor" data-ng-src="img/checkmark.png"/>'
            }, {
            	fieldName: 'status',
            	labelEN: 'Status',
            	labelTH: 'Status',
                id: '{value}-active',
                sortable: false,
                cssTemplate: 'text-center',
                cellTemplate: '<span id="{{data.organizeId}}-status-label">{{data.active ? "Active" : "Suspend"}}</span>'	
            },{
				cssTemplate: 'text-center',
				sortable: false,
				cellTemplate: '<scf-button ng-disabled="true" class="btn-default gec-btn-action" id="{{data.organizeId}}-profile-button" ng-click="ctrl.editOrganizeProfile(data)" title="Edit Profile"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button><scf-button class="btn-default gec-btn-action" ng-disabled="data.sponsor==false" id="{{data.organizeId}}-config-button" ng-click="ctrl.sponsorConfig(data)" title="Config Sponsor"> <i class="fa fa-cog" aria-hidden="true" ng-show="data.completed"></i> <img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/> </scf-button>'
			}]
    }
    
	vm.initLoad = function() {
       
        vm.searchOrganize();
	}

	vm.initLoad();
	
}]);