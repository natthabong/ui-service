var createapp = angular.module('scfApp');
createapp.controller('CreateTransactionController', ['CreateTransactionService', '$state', '$scope', '$window',
    function(CreateTransactionService, $state, $scope, $window) {
        var vm = this;
        //Initail Data 
        $scope.validateDataFailPopup = false;
		vm.showInfomation = false;
        vm.errorMsgPopup = "Insufficient Fund"
		vm.showErrorMsg = false;
		vm.errorMsgGroups= 'transaction-error-msg-payment-date';
            // Data Sponsor
        vm.sponsorCodes = [{
            label: 'TESCO CO,LTD.',
            value: '00017551'
        }];
        vm.supplierCodes = [{
            label: 'JINTANA INTERTRADE CO,LTD.',
            value: '32001'
        }];
        vm.sponsorPaymentDates = [{
            label: 'Please Select',
            value: 'PleaseSelect'
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
			//validate SponsorPayment Date is Select
			if(validateSponsorPaymentDate(sponsorPaymentDate)){
				if (pagingModel === undefined) {
                vm.loadTransactionDate(sponsorCode, sponsorPaymentDate);
				}
				vm.showInfomation = true;
			}else{
				vm.showErrorMsg = true;
			}
            
        };

        // Load Sponsor paymentDate
        vm.loadSupplierDate = function() {
            var sponsorCode = vm.createTransactionModel.sponsorCode;
            var supplierCode = vm.createTransactionModel.supplierCode;

            var deffered = CreateTransactionService.getSponsorPaymentDate(sponsorCode, supplierCode);
            deffered.promise.then(function(response) {
				var supplierDates = response.data;
				supplierDates.forEach(function(data){
					vm.sponsorPaymentDates.push({
						label: data,
						value: data
					})
				});
                })
                .catch(function(response) {
                    console.log(response);
                });
        }
        vm.loadSupplierDate();

        vm.nextStep = function() {
            $state.go('/create-transaction/validate-submit');
            //            $scope.validateDataFailPopup = true;
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
                cssTemplate: 'text-center',
				filterType: 'date',
                filterFormat: 'dd/MM/yyyy'
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

        vm.tableRowCollection = [{
            dueDate: new Date('2016-06-30'),
            documentDate: new Date('2016-05-10'),
            documentNo: '151712',
            documentType: 'RV',
            supplierCode: '30002',
            documentAmount: '10000'
        }, {
            dueDate: new Date('2016-06-30'),
            documentDate: new Date('2016-05-10'),
            documentNo: '151713',
            documentType: 'RV',
            supplierCode: '30002',
            documentAmount: '10000'
        }, {
            dueDate: new Date('2016-06-30'),
            documentDate: new Date('2016-05-10'),
            documentNo: '151714',
            documentType: 'RV',
            supplierCode: '30002',
            documentAmount: '10000'
        }, {
            dueDate: new Date('2016-06-30'),
            documentDate: new Date('2016-05-10'),
            documentNo: '151715',
            documentType: 'RV',
            supplierCode: '30002',
            documentAmount: '10000'
        }];
		function validateSponsorPaymentDate(paymentDate){
			return paymentDate === 'PleaseSelect'? false: true;
		}
    }
]);