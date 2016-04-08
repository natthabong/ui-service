(function() {
    var app2 = angular.module('scfCreateLoan', ['ui.bootstrap', 'scf-component']);
    app2.controller('CreateLoanRequestCtrl', [function() {
        var self = this;

        self.isOpenLoanReq = false;
        self.dateFormat = "dd/MM/yyyy";

        self.loanReqDate = new Date();
        self.openCalLoanDate = function() {		
            self.isOpenLoanReq = true;
        };
    }]);
})();