var createapp = angular.module('scfApp');
createapp.controller('CreateTransactionController', ['CreateTransactionService', '$state', '$scope', 'TransactionService',
    function(CreateTransactionService, $state, $scope, TransactionService) {
        var vm = this;
        //Initail Data 
        $scope.validateDataFailPopup = false;
        vm.showInfomation = false;
        vm.errorMsgPopup = "Insufficient Fund"
        vm.showErrorMsg = false;
        vm.errorMsgGroups = 'transaction-error-msg-payment-date';
		vm.documentSelects = [];
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
		vm.submitTransactionAmount = 0.00;
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
            if (validateSponsorPaymentDate(sponsorPaymentDate)) {
                if (pagingModel === undefined) {
                    vm.loadDocument();
                    vm.loadTransactionDate(sponsorCode, sponsorPaymentDate);
                } else {
                    console.log(pagingModel);
                    vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
                    vm.pageModel.currentPage = pagingModel.page;
                    vm.loadDocument();
                }
                vm.showInfomation = true;
                vm.showErrorMsg = false;
            } else {
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
                    supplierDates.forEach(function(data) {
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

        //next to page verify and submit
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

        vm.loadDocument = function() {
            var sponsorCode = vm.createTransactionModel.sponsorCode;
            var supplierCode = vm.createTransactionModel.supplierCode;
            var sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;
            var page = vm.pageModel.currentPage;
            var pageSize = vm.pageModel.pageSizeSelectModel;
            //Call Service
            var deffered = CreateTransactionService.getDocument(sponsorCode, supplierCode, sponsorPaymentDate, page, pageSize);
            deffered.promise
                .then(function(response) {
                    //response success
                    vm.pageModel.totalRecord = response.data.totalElements;
                    vm.pageModel.currentPage = response.data.number;
					console.log(response);
                    //Generate Document for display
					 vm.tableRowCollection = convertDocumentJSON(response.data.content);
                })
                .catch(function(response) {
                    console.log(response);
                });
        }
		
		function convertDocumentJSON(content){
			var documentJsons = [];
			content.forEach(function(document){
				documentJsons.push({
					documentAmount: document.documentAmount,
					documentId: document.documentId,
					documentNo: document.documentNo,
					documentStatus: document.documentStatus,
					documentType: document.documentType,
					sponsorId: document.sponsorId,
					sponsorName: document.sponsorName,
					sponsorPaymentDate: new Date(document.sponsorPaymentDate),
					supplierCode: document.supplierCode,
					supplierId: document.supplierId,
					supplierName: document.supplierName,
					dueDate: new Date(document.sponsorPaymentDate)
				});
			});
			return documentJsons;
		}

        vm.dataTable = {
            columns: [{
                label: '<input type="checkbox" name="checkData" ng-click="createTransactionCtrl.checkAll(data)"/>',
                showCheckBox: true,
                cssTemplate: 'text-center',
                cellTemplate: '<input type="checkbox" checklist-model="createTransactionCtrl.documentSelects" checklist-value="data" id="document-{{data.documentId}}" ng-click="createTransactionCtrl.selectDocument(data)"/>'
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
                field: 'sponsorPaymentDate',
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

        vm.tableRowCollection = [];

        function validateSponsorPaymentDate(paymentDate) {
            return paymentDate === 'PleaseSelect' ? false : true;
        }
		
		vm.selectDocument = function(document){
			var sumAmount = 0;
			vm.documentSelects.forEach(function(document){
				sumAmount += document.documentAmount;
			});
			vm.submitTransactionAmount = TransactionService.calculateTransactionAmount(sumAmount, 80.00);
		};
		vm.selectDocument();
    }
]);