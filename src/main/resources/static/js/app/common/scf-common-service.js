angular.module('scfApp').service('SCFCommonService', [function() {
    var vm = this;
    vm.splitePage = function(pageSize, currentPage, totalRecord) {
		
        var recordDisplay = '0 - ' 
		if(totalRecord > 0){
			recordDisplay = (currentPage * pageSize + 1) + ' - ';
		}
        var endRecord = ((currentPage + 1) * pageSize);
        if (totalRecord < endRecord) {
            endRecord = totalRecord;
        }

        recordDisplay += '' + endRecord + ' of ' + totalRecord;

        return recordDisplay;
    };
    
    var fromState = '';
    vm.parentStatePage = function(){
      
        return{
            saveCurrentState: saveCurrentState,
            getParentState: getParentState,
            clearParentState: clearParentState
        }
        function saveCurrentState(currentState){
            fromState = currentState;
        }
        
        function getParentState(){
            return fromState;
        }
        
        function clearParentState(){
            fromState = '';
        }
    };
	
	vm.clientPagination = function (listDatas, pagesize, currentPage) {
        var dataResult = {
            content: [],
            totalPages: 0,
            size: 0,
            number: 0,
            totalElements: 0
        };

        if (angular.isArray(listDatas)) {
            var indexStart = currentPage * pagesize;
            var indexLast = (currentPage * pagesize) + pagesize;
            var totalPage = Math.ceil(listDatas.length / pagesize);
            var dataSplites = [];
            for (; indexStart < indexLast && indexStart < listDatas.length; indexStart++) {
                dataSplites.push(listDatas[indexStart]);
            }
            dataResult.content = dataSplites;
            dataResult.totalPages = totalPage;
            dataResult.size = pagesize;
            dataResult.number = currentPage;
            dataResult.totalElements = listDatas.length
        }

        return dataResult;
    };
	
	vm.convertDate = function(dateTime){
		var result = '';
		if(dateTime != undefined && dateTime != ''){
							
			if(!angular.isDate(dateTime)){
				dateTime = new Date(dateTime);
			}
			var date = dateTime.getDate();		
			var month = (dateTime.getMonth() + 1);
			
			if(month < 10){
				month = '0'+month.toString();
			}
			var year = dateTime.getFullYear();
			result =  date +'/' + month + '/' + year;
		}
		return result;
	}
}]);