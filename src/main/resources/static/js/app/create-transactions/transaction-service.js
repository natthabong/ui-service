angular.module('scfApp').service('TransactionService', [function() {
    var vm = this;
    vm.calculateTransactionAmount = function(totalAmount, preDradowPercentag) {
		var sumAmount = (totalAmount * (preDradowPercentag / 100)).toFixed(2);
		return sumAmount;
    };
}]);