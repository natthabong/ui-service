angular.module('scfApp').service('SCFCommonService', [function() {
    var vm = this;
    vm.splitePage = function(pageSize, currentPage, totalRecord) {
        var recordDisplay = '' + (currentPage * pageSize + 1) + ' - ';
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
}]);