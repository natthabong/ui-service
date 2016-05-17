var createapp = angular.module('scfApp');
createapp.controller('CreateTransactionController', ['CreateTransactionService', '$state', '$scope', '$window',
    function(CreateTransactionService, $state, $scope, $window) {
        var vm = this;
        //Initail Data 
        $scope.validateDataFailPopup = false;
        vm.errorMsg = "Insufficient Fund"
            // Data Sponsor
        vm.sponsorCodes = [{
            label: 'TESCO CO,LTD.',
            value: '0017551'
        }];
        vm.supplierCodes = [{
            label: 'JINTANA INTERTRADE CO,LTD.',
            value: '32001'
        }];
        vm.sponsorPaymentDates = [{
            label: 'Please Select',
            value: 'Please Select'
        }, {
            label: '27/05/2016',
            value: '27/05/2016'
        }, {
            label: '25/05/2016',
            value: '25/05/2016'
        }];
        vm.transactionDates = [];
        // End Data Sponsor
        //Model for transaction
        vm.createTransactionModel = {
            sponsorCode: vm.sponsorCodes[0].value,
            supplierCode: vm.supplierCodes[0].value,
            sponsorPaymentDate: vm.sponsorPaymentDates[0].value,
            transactionDate: ''
        };

        // Init data paging
        vm.pageSizeList = [{
            label: '10',
            value: '10'
        }];
        vm.pageSizeSelectModel = '10';
        vm.pageModel = {
            pageSizeSelectModel: '10',
            totalRecord: '10',
            currentPage: 0
        };

        //Search Document
        vm.searchDocument = function(pagingModel) {
            var sponsorCode = vm.createTransactionModel.sponsorCode;
            var sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;
            if (pagingModel === undefined) {
                vm.loadTransactionDate(sponsorCode, sponsorPaymentDate);
            }
        };

        // Load Sponsor paymentDate
        vm.loadSupplierDate = function() {
            var sponsorCode = vm.createTransactionModel.sponsorCode;
            var supplierCode = vm.createTransactionModel.supplierCode;

            var deffered = CreateTransactionService.getSponsorPaymentDate(sponsorCode, supplierCode);
            deffered.promise.then(function(response) {
                    console.log(response);
                })
                .catch(function(response) {
                    console.log(response);
                });
        }
        vm.loadSupplierDate();

        vm.nextStep = function() {
            console.log($state.parrentState);
            //		$state.go('/create-transaction/validate-submit');
            //		$window.scrollTo(0, 0);
            $scope.validateDataFailPopup = true;
        };

        //Load Transaction Date
        vm.loadTransactionDate = function(sponsorCode, sponsorPaymentDate) {
            var deffered = CreateTransactionService.getTransactionDate(sponsorCode, sponsorPaymentDate);
            deffered.promise.then(function(response) {
                //clear list transaction date
                vm.transactionDates = [];
                var transactionResponse = response.data;
                transactionResponse.forEach(function(data) {
                    vm.transactionDates.push({
                        label: data,
                        value: data
                    });
                });
                //set select default value
                vm.createTransactionModel.transactionDate = vm.transactionDates[0].value;
            }).catch(function(response) {
                console.log(response);
            });
        };

        vm.dataTable = {
            columns: [{
                label: '<input type="checkbox" name="checkData" ng-click="createTransactionCtrl.checkAll(data)"/>',
                showCheckBox: true,
                cssTemplate: 'text-center',
                cellTemplate: '<input type="checkbox" name="checkData" ng-click="createTransactionCtrl.checkBoxData(data)"/>'
            }, {
                label: 'No.',
                cssTemplate: 'text-center',
                showRowNo: true
            }, {
                field: 'dueDate',
                label: 'วันครบกำหนดชำระ',
                sortData: false,
                cssTemplate: 'text-center'
            }, {
                field: 'documentDate',
                label: 'วันที่เอกสาร',
                sortData: false,
                cssTemplate: 'text-center',
				filterType: 'date',
                filterFormat: 'dd/MM/yyyy'
            }, {
                field: 'documentNo',
                label: 'เลขที่เอกสาร',
                sortData: true,
                cssTemplate: 'text-center',
                filterType: 'date',
                filterFormat: 'dd/MM/yyyy'
            }, {
                field: 'documentType',
                label: 'ประเภทเอกสาร',
                sortData: false,
                cssTemplate: 'text-center',
            }, {
                field: 'supplierCode',
                label: 'รหัสลูกค้า',
                sortData: false,
                cssTemplate: 'text-center'
            }, {
                field: 'documentAmount',
                label: 'จำนวนเงินตามเอกสาร',
                sortData: false,
                cssTemplate: 'text-right',
				filterType: 'number',
				filterFormat: '2'
            }]
        };
		
		vm.tableRowCollection = {
			
		};
    }
]);