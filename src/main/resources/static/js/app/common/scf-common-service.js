angular.module('scfApp').service('SCFCommonService', [function() {
	var vm = this;
	vm.splitePage = function(pageSize, currentPage, totalRecord) {
		var recordDisplay = '' + (currentPage * pageSize + 1) + ' - ';
		var endRecord = ((currentPage + 1) * pageSize);
		if(totalRecord < endRecord){
			endRecord = totalRecord;
		}

		recordDisplay += '' + endRecord + ' of '+ totalRecord;
		
		return recordDisplay;
    };
	
}]);