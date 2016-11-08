angular.module('scfApp').controller('DocumentListController',['Service', '$stateParams', '$log', function(Service, $stateParams, $log){
	var vm = this;
	var log = $log;
	
	vm.sponsorTxtDisable = false;
	vm.supplierTxtDisable = false;
	
	vm.dateFormat = "dd/MM/yyyy";
	vm.openDateFrom = false;
	vm.openDateTo = false;
	
	
	vm.sponsorModel = {
		sponsorName: ''
	};
	
	var loadSponsorURL = '';
	
	vm.loadSponsorDisplayName = function(){
		var organizeDisplayName = '';
		var sponsorCodesDeffered = Service.requestURL('/api/me',null, 'GET');
		sponsorCodesDeffered.promise.then(function(response){
			vm.sponsorModel.sponsorName = response.organizeName;
		}).catch(function(response){
			log.error('Sponsor error');
		});
	}
	
	vm.loadSupplierDisplayName = function(){
		var organizeDisplayName = '';
		var sponsorCodesDeffered = Service.requestURL('/api/me',null, 'GET');
		sponsorCodesDeffered.promise.then(function(response){
			vm.sponsorModel.supplierName = response.organizeName;
		}).catch(function(response){
			log.error('Supplier error');
		});
	}
	
	vm.initLoad = function(){
		var party = $stateParams.party;

		if(party == 'sponsor'){
			vm.sponsorTxtDisable = true;
			vm.loadSponsorDisplayName();
		}else if(party == 'supplier'){			
			vm.supplierTxtDisable = true;
			vm.loadSupplierDisplayName();
			
		}
		
	}
	
	vm.initLoad();
	
	vm.searchDocument = function(){
		
	}
	
	vm.openCalendarDateFrom = function(){
		vm.openDateFrom = true;
	}
	
	vm.openCalendarDateTo = function(){
		vm.openDateTo = true;
	}
	
}]);