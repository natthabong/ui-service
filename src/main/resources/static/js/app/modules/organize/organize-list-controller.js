angular.module('scfApp').controller('OrganizeListController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', 
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http ){

	var vm = this;
	var log = $log;
	
	var _criteria = {};
    vm.criteria = $stateParams.criteria || {
    	organizeId: undefined
	}
    vm.organize =  $stateParams.organize || undefined;
    
	vm.newOrganizeProfile = function(){
		PageNavigation.gotoPage('/');
	}
    
	vm.editOrganizeProfile = function(data){
		PageNavigation.gotoPage('/'+data.memberId,{
			
		});
	}

	
	vm.sponsorConfig = function(data){
		var params = {organizeId: data.memberId};
		PageNavigation.nextStep('/sponsor-configuration', params, {criteria: _criteria, organize: vm.organize});
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
					item.identity = [ 'organize-', item.memberId, '-option' ].join('');
					item.label = [ item.memberCode, ': ', item.memberName ].join('');
					return item;
				});
			});
	}
	
	vm.organizeAutoSuggestModel = UIFactory.createAutoSuggestModel({
		placeholder: 'Enter organization name or code',
		itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
		query: searchOrganizeTypeHead
	});
	
	vm.organizeCriteria = {
			organizeId: undefined
	}
	
	vm.pagingController = PagingController.create('/api/v1/organize-customers/', _criteria, 'GET');
	vm.loadData = function(pageModel){
		vm.pagingController.search(pageModel || ( $stateParams.backAction? {
    		offset : _criteria.offset,
			limit : _criteria.limit,
			organizeId : _criteria.organizeId
    	}: undefined));
        
        if($stateParams.backAction){
    		$stateParams.backAction = false;
    	}
	}
	vm.searchOrganize = function(pageModel){
        var organizeId = undefined;
        if(angular.isObject(vm.organize)){
        	vm.criteria.organizeId = vm.organize.memberId;
        }else{
        	vm.criteria.organizeId = undefined;
        }
        _storeCriteria();
        vm.loadData(pageModel);
	}
    
    vm.dataTable = {
    		identityField: 'memberId',
            columns: [{
            	fieldName: 'memberCode',
                labelEN: 'Organization Code',
                labelTH: 'Organization Code',
                id: '{value}-organize-code',
                sortable: false,
                cssTemplate: 'text-center',
            },{
            	fieldName: 'memberName',
            	labelEN: 'Organization Name',
            	labelTH: 'Organization Name',
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
                cellTemplate: '<span id="{{data.memberId}}-status-label">{{data.suspend ? "Suspend" :  "Active"}}</span>'	
            },{
				cssTemplate: 'text-center',
				sortable: false,
				cellTemplate: '<scf-button ng-disabled="true" class="btn-default gec-btn-action" id="{{data.memberId}}-profile-button" ng-click="ctrl.editOrganizeProfile(data)" title="Edit Profile"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button><scf-button class="btn-default gec-btn-action" id="{{data.organizeId}}-config-button" ng-click="ctrl.sponsorConfig(data)" title="Config Sponsor"> <i class="fa fa-cog" aria-hidden="true"></i></scf-button>'
			}]
    }
    
    function _storeCriteria() {
		angular.copy(vm.criteria, _criteria);
	}
    
	vm.initLoad = function() {
		var backAction = $stateParams.backAction;
		
		if(backAction && Object.keys($stateParams.criteria).length != 0){
			vm.organizeCriteria = $stateParams.criteria;
		}
        vm.searchOrganize();
	}

	vm.initLoad();
	
}]);