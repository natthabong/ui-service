var gecscf = angular.module('gecscfApp', ['scf-component', 'ui.bootstrap']);
gecscf.controller('pagingController', [function(){
    var vm = this;
    vm.pagingList = [{label: '10', value: 10}, {label: '20', value: 20}, {label: '50', value: 50}];
    vm.pagingDropDown = '10';
    vm.currentPage = 0;
    vm.searchPage = function(pageModel){
        vm.currentPage = pageModel.page;
        console.log( pageModel);
    };
}]);