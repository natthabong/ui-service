var createapp = angular.module('gecscf.transaction');
createapp.controller('CreateLoanController', ['TransactionService', '$state',
    '$scope', 'SCFCommonService', '$stateParams', '$log','PageNavigation','$q','PagingController','$rootScope', 'blockUI',
    function(TransactionService, $state, $scope, SCFCommonService,$stateParams, $log, PageNavigation, $q, PagingController
    ,$rootScope,blockUI){
        
        var vm = this;
        var log = $log;

        $scope.validateDataFailPopup = false;
        
        vm.errorMsgPopup = 'Insufficient Fund'
        vm.showErrorMsg = false;
        vm.errorMsgGroups = '';
		vm.showBackButton = false;
        
        // SponsorCode dropdown
        vm.sponsorCodes = [];

        var ownerId = $rootScope.userInfo.organizeId;

        vm.loanRequestMode = null;
        var supplierCodeSelectionMode = 'SINGLE_PER_TRANSACTION';
        var hasSponsorPaymentDate = false;
        var dashboardParams = $stateParams.dashboardParams;
        var backAction = $stateParams.backAction || false;

        function _setDefualtValue(clearAll) {
            if(clearAll){
                vm.supplierCodes = [];
                vm.sponsorPaymentDates = [];
                vm.transactionDates = [];
                vm.submitTransactionAmount = 0.00;
            }
            vm.showInfomation = false;
            vm.documentSelects = [];
            vm.checkAllModel = false;
            vm.selectAllModel = false;
        };
        _setDefualtValue(true);

        vm.createTransactionModel = {
            sponsorCode: '',
            supplierCode: '',
            sponsorPaymentDate: '',
            transactionDate: '',
            supplierCodeSelected: '',
            sponsorIdSelected: '',
            order: '',
            orderBy: ''
        };

        vm.tradingpartnerInfoModel = {};

        vm.dataTable = {
            options: {
                displaySelect: {
                    label: '<input type="checkbox" id="select-all-checkbox" ng-model="ctrl.checkAllModel" ng-click="ctrl.checkAllDocument()"/>',
                    cssTemplate: 'text-center',
                    cellTemplate: '<input type="checkbox" checklist-model="ctrl.documentSelects" checklist-value="data" ng-click="ctrl.selectDocument(data)"/>',
                    displayPosition: 'first',
					idValueField: '$rowNo',
					id: 'document-{value}-checkbox'
                }
            },
            columns: []
        };
        var _criteria = $stateParams.criteria || {
            accountingTransactionType: 'PAYABLE',
            sponsorId: vm.createTransactionModel.sponsorCode,
            supplierId : ownerId,
            customerCode: vm.createTransactionModel.supplierCode,
            documentStatus: ['NEW'],
            sponsorPaymentDate : vm.createTransactionModel.sponsorPaymentDate,
            showOverdue: true
        }

        function calculateTransactionAmount(documentSelects, prepercentagDrawdown) {
            var sumAmount = 0;
            documentSelects.forEach(function(document) {
                sumAmount += document.outstandingAmount;
            });
            vm.totalDocumentAmount = sumAmount;
            vm.submitTransactionAmount = TransactionService.calculateTransactionAmount(sumAmount, prepercentagDrawdown);
        }

        vm.loadDocument = function(pagingModel) {
            _criteria.buyerId = vm.createTransactionModel.sponsorCode;
            _criteria.customerCode = vm.createTransactionModel.supplierCode;
            _criteria.sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;

            var deffered = vm.pagingController.search(pagingModel || ( $stateParams.backAction? {
	    		offset : _criteria.offset,
				limit : _criteria.limit
	    	}: undefined));

            deffered.promise.then(function(response){
                if(backAction){
                    vm.documentSelects = $stateParams.documentSelects;
                    // clear param
                    $stateParams.documentSelects = [];
                    $stateParams.backAction = false;
                    backAction = false;
                    calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                }else if(!backAction && dashboardParams != null){
                    vm.selectAllDocument();
                    //clear dashboard param after search
                    $stateParams.dashboardParams = null;
                    dashboardParams = null;
                }
                vm.watchCheckAll();
                blockUI.stop();
            }).catch(function(response){
                blockUI.stop();
            });
            vm.showInfomation = true;
        }

        function _loadTransactionDate(sponsorCode, sponsorPaymentDate) {
        	var tenor = vm.tradingpartnerInfoModel.tenor;
        	var loanRequestMode = vm.loanRequestMode;
            var deffered = TransactionService.getTransactionDate(sponsorCode, sponsorPaymentDate, loanRequestMode, tenor);
            deffered.promise.then(function(response) {
                // clear list transaction date
                vm.transactionDates = [];
                var transactionResponse = response.data;

                if (transactionResponse.length > 0) {
                    transactionResponse.forEach(function(data) {
                        vm.transactionDates.push({
                            label: data,
                            value: data
                        });
                    });

                    // Check action come from page validate and sumbit
                    if (backAction === false) {
                        // set select default value
                        vm.createTransactionModel.transactionDate = vm.transactionDates[0].value;
                    }
                }
                vm.loadDocument();
            }).catch(function(response) {
                log.error(response);
            });
            return deffered;
        };

        function _loadTradingPartnerInfo(sponsorCode,sponsorPaymentDate){
        	var differed = null;
            var tradingInfo = TransactionService.getTradingInfo(sponsorCode, ownerId);
            tradingInfo.promise.then(function(response) {
                vm.tradingpartnerInfoModel = response.data;
                differed = _loadTransactionDate(sponsorCode,sponsorPaymentDate);
            }).catch(function(response){
                log.error("Load trading partner fail !");
            });
            return differed;
        }

        function validateSponsorPaymentDate(paymentDate) {
            return paymentDate === '' ? false : true;
        }

        vm.searchDocument = function(pagingModel) {
            blockUI.start();
            var searchDocumentDeferred = $q.defer();
            var sponsorCode = vm.createTransactionModel.sponsorCode;
            var sponsorPaymentDate = vm.createTransactionModel.sponsorPaymentDate;
            _setDefualtValue(false);
            
            // validate SponsorPayment Date is Select
            if(hasSponsorPaymentDate){
            	if (validateSponsorPaymentDate(sponsorPaymentDate)) {
                    _loadTradingPartnerInfo(sponsorCode,sponsorPaymentDate);
                    // set supplierCode after search
                    vm.createTransactionModel.supplierCodeSelected = vm.createTransactionModel.supplierCode;
                    vm.createTransactionModel.sponsorIdSelected = vm.createTransactionModel.sponsorCode;
                } else {
                    vm.requireSponsorPaymentDate = true;
                    blockUI.stop();
                }
                return searchDocumentDeferred;
            }else{
            	vm.errorMsgGroups = 'Could not be create transaction because the document not found.';
                vm.showErrorMsg = true;
                blockUI.stop();
            }
        };

        function _loadSponsorPaymentDate() {
            var sponsorId = vm.createTransactionModel.sponsorCode;
            var supplierCode = vm.createTransactionModel.supplierCode;
            var loanRequestMode = vm.loanRequestMode;
            
            vm.requireSponsorPaymentDate = false;
            vm.showErrorMsg = false;
            vm.showInfomation = false;
            
            hasSponsorPaymentDate = false;
            
            vm.sponsorPaymentDates = [{
                label: 'Please select',
                value: ''
            }];

            var deffered = TransactionService.getSponsorPaymentDate(sponsorId, supplierCode, loanRequestMode);
            deffered.promise.then(function(response) {
                var supplierDates = response.data;

                supplierDates.forEach(function(data) {
                    hasSponsorPaymentDate = true;
                    vm.sponsorPaymentDates.push({
                        label: data,
                        value: data
                    })
                });
                if (backAction === false && dashboardParams == null) {
                    vm.createTransactionModel.sponsorPaymentDate = vm.sponsorPaymentDates[0].value;
                }
                else if(dashboardParams != null){
                    vm.createTransactionModel.sponsorPaymentDate = SCFCommonService.convertDate(dashboardParams.paymentDate);
                    dashboardInitLoad();
                }
                else{
                    hasSponsorPaymentDate = true;
                    vm.searchDocument(undefined);
                }
            })
            .catch(function(response) {
                log.error(response);
            });
        }

        function _loadSupplierCode() {
            var sponsorId = vm.createTransactionModel.sponsorCode;
            var supplierDeffered = TransactionService.getSupplier(sponsorId);
            supplierDeffered.promise.then(function(response) {
                vm.supplierCodes = [];
                if(supplierCodeSelectionMode=='MULTIPLE_PER_TRANSACTION'){
                	var supplierCode = {
                        label: 'All',
                        value: ''
                    }
                    vm.supplierCodes.push(supplierCode);
                }
                var supplilerCodeList = response.data;
                if (supplilerCodeList.length > 0) {
                    supplilerCodeList.forEach(function(obj) {
                        var supplierCode = {
                            label: obj,
                            value: obj
                        }
                        vm.supplierCodes.push(supplierCode);
                    });

					if(dashboardParams != null){
						vm.createTransactionModel.supplierCode = dashboardParams.customerCode;       	
                    }
					else if (backAction === false && dashboardParams == null) {
                        vm.createTransactionModel.supplierCode = vm.supplierCodes[0].value;
                    }
                    _loadSponsorPaymentDate();
                }
            }).catch(function(response) {
                vm.errorMsgPopup = response.data.errorCode;
                vm.showErrorMsgPopup = true;
            });
        };

        function _loadDocumentDisplayConfig(sponsorId) {
            var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId,'PAYABLE','TRANSACTION_DOCUMENT');
            displayConfig.promise.then(function(response) {
                vm.dataTable.columns = response.items;
                vm.pagingController = PagingController.create('api/v1/documents', _criteria, 'GET');
                vm.loanRequestMode = response.loanRequestMode;
                vm.documentSelection = response.documentSelection;
                supplierCodeSelectionMode = response.supplierCodeSelectionMode;
                if(vm.loanRequestMode != null){
                    _loadSupplierCode();
                }
                else{
                    log.error("Load document dispay fail!");
                }
            });
        }
		
        function _loadSponsor() {
            var sponsorDeffered = TransactionService.getSponsor();
            sponsorDeffered.promise.then(function(response) {
                vm.sponsorCodes = [];
                var sponsorCodeList = response.data;
                if (sponsorCodeList !== undefined) {
                    sponsorCodeList.forEach(function(obj) {
                        var selectObj = {
                            label: obj.sponsorName,
                            value: obj.sponsorId
                        }
                        vm.sponsorCodes.push(selectObj);
                    });
					if(dashboardParams!=null){
                     	vm.createTransactionModel.sponsorCode = dashboardParams.buyerId;
                    }

					// Check action come from page validate
					// and sumbit
					else if (backAction == false && dashboardParams==null) {
                        vm.createTransactionModel.sponsorCode = vm.sponsorCodes[0].value;
                    }

                    // Load documentConfig from DB
                    _loadDocumentDisplayConfig(vm.createTransactionModel.sponsorCode);
                }
               
            }).catch(function(response) {
                log.error(response);
            });
        };
		
        var initLoad = function() {
            if(backAction) {
                var tradingPartnerInfo = $stateParams.tradingpartnerInfoModel;
				vm.showBackButton = $stateParams.showBackButton;
                if (tradingPartnerInfo !== null) {
                    var transactionModel = $stateParams.transactionModel;
                    vm.tradingpartnerInfoModel = tradingPartnerInfo;
                    vm.createTransactionModel = {
                        sponsorCode: tradingPartnerInfo.sponsorId,
                        supplierCode: tradingPartnerInfo.supplierCodeSelected,
                        sponsorPaymentDate: SCFCommonService.convertDate(transactionModel.sponsorPaymentDate),
                        transactionDate: SCFCommonService.convertDate(transactionModel.transactionDate)
                    };
                    hasSponsorPaymentDate = true;
                }else{
                    $timeout(function(){
                        PageNavigation.gotoPage('/');
                    }, 10);
                }
            }
            _loadSponsor();
        }();

        vm.watchCheckAll = function() {
            vm.checkAllModel = false;
            var comparator = angular.equals;
            var countRecordData = 0;
            vm.pagingController.tableRowCollection.forEach(function(document) {
                for (var index = vm.documentSelects.length; index--;) {
                    if (comparator(document, vm.documentSelects[index])) {
                        countRecordData++;
                        break;
                    }
                }
            });
            if (countRecordData === vm.pagingController.tableRowCollection.length && countRecordData > 0) {
                vm.checkAllModel = true;
            }
            vm.watchSelectAll();
        }

        vm.watchSelectAll = function() {
            vm.selectAllModel = false;
            var pageSize = vm.pagingController.splitePageTxt.split("of ")[1];
            if (vm.documentSelects.length > 0 && vm.documentSelects.length == pageSize) {
                vm.selectAllModel = true;
            }
        }

        var searchByMatchingRef = function(matchingRef){
			var deferred = $q.defer();
			var documents = [];
            var totalRecord = vm.pagingController.splitePageTxt.split(" of")[1];

            var searchCriteria = {
                accountingTransactionType: _criteria.accountingTransactionType,
                buyerId: _criteria.buyerId,
                supplierId : _criteria.supplierId,
                customerCode: _criteria.customerCode,
                documentStatus: _criteria.documentStatus,
                showOverdue: _criteria.showOverdue,
                offset: _criteria.offset
            }

            searchCriteria.limit = totalRecord;
            searchCriteria.matchingRef = matchingRef;

			var diferredDocumentAll = TransactionService.getDocuments(searchCriteria);
			diferredDocumentAll.promise.then(function(response){
				documents = response.data;
				deferred.resolve(documents);
			}).catch(function(response){
				log.error('matchingRef error !')
				deferred.reject(response);
			});
			
			return deferred;
		}

        var selectFormMatchingRef = function(data){
            var checkOrUncheck = (vm.documentSelects.map(function(o) {
                        return o.documentId;
                    }).indexOf(data.documentId) > -1);
        	// var checkOrUncheck = (vm.documentSelects.indexOf(data) > -1);
        	var macthingRefSelected = data.matchingRef;

        	if(checkOrUncheck){
        		var removeDupDataFormSearch = vm.documentSelects.indexOf(data);
        		vm.documentSelects.splice(removeDupDataFormSearch, 1);
        		var result = searchByMatchingRef(macthingRefSelected);
        		result.promise.then(function(response){
        			vm.documentSelects = vm.documentSelects.concat(response);
        			calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
        		}).catch(function(response){
 		
        		});
        	}else{
        		for (var index = vm.documentSelects.length-1; index > -1;index--) {
        			if(macthingRefSelected === vm.documentSelects[index].matchingRef){
        				vm.documentSelects.splice(index, 1);
        			}
        		}
        		calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
        	}
        }

        vm.selectDocument = function(data) {
            vm.checkAllModel = false;
            vm.selectAllModel = false;
            if(data.matchingRef != null && vm.documentSelection === 'GROUP_BY_MATCHING_REF_NO'){
            	selectFormMatchingRef(data);
            }else{
            	calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
            }
            vm.watchCheckAll();
        }

        // Select All in page
        vm.checkAllDocument = function() {
            var tempMatchingRefNotQueryAgain = [];
            if (vm.checkAllModel) {
                vm.pagingController.tableRowCollection.forEach(function(document) {

                	var foundDataSelect = (vm.documentSelects.map(function(o) {
                        return o.documentId;
                    }).indexOf(document.documentId) > -1);

                    if (!foundDataSelect){
                    	if(document.matchingRef != null && vm.documentSelection === 'GROUP_BY_MATCHING_REF_NO'){                   		
                    		var foundMatchingRefInTemp = tempMatchingRefNotQueryAgain.indexOf(document.matchingRef)
                    		if(foundMatchingRefInTemp === -1){
                    			
                        		for (var index = vm.documentSelects.length-1; index > -1;index--) {
                        			if(document.matchingRef === vm.documentSelects[index].matchingRef){
                        				vm.documentSelects.splice(index, 1);
                        			}
                        		}
                        		
                    			tempMatchingRefNotQueryAgain.push(document.matchingRef);
                        		var result = searchByMatchingRef(document.matchingRef);
                        		result.promise.then(function(response){
                        			vm.documentSelects = vm.documentSelects.concat(response);                      			
                        			calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                        		}).catch(function(response){
                 		
                        		});
                    		}
                            
                        }else{
                    		vm.documentSelects.push(document);
                    		calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
                    	}
                    }
                });
            } else {
            	vm.selectAllModel = false;
            	vm.pagingController.tableRowCollection.forEach(function(document) {
                    var foundMatchingRefInTemp = tempMatchingRefNotQueryAgain.indexOf(document.matchingRef);
        			if(document.matchingRef != null && foundMatchingRefInTemp === -1 && vm.documentSelection === 'GROUP_BY_MATCHING_REF_NO'){
        				tempMatchingRefNotQueryAgain.push(document.matchingRef);
        				for (var index = vm.documentSelects.length-1; index > -1;index--) {
                			if(document.matchingRef === vm.documentSelects[index].matchingRef){
                				vm.documentSelects.splice(index, 1);
                			}
                		}
                    }else{
        				for (var index = vm.documentSelects.length-1; index > -1;index--) {
                			if(document.documentId === vm.documentSelects[index].documentId){
                				vm.documentSelects.splice(index, 1);
                			}
                		}
        			}

            	});
        		calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
            }
            vm.watchCheckAll();
        }

        vm.selectAllDocument = function() {
        	if(!vm.selectAllModel){
                var totalRecord = vm.pagingController.splitePageTxt.split(" of")[1];
                var searchCriteria = _criteria;
                searchCriteria.limit = totalRecord;

    			var diferredDocumentAll = TransactionService.getDocuments(searchCriteria);
    			diferredDocumentAll.promise.then(function(response){
    				vm.documentSelects = response.data;
    				calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
    				vm.selectAllModel = true;
    				vm.checkAllModel = true;
    			}).catch(function(response){
    				log.error('select all document error')
    			});
        	}else{
        		_setDefualtValue(false);
                vm.showInfomation = true;
        		calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
        	}
        };
        
        // next to page verify and submit
        vm.nextStep = function() {
            if (vm.documentSelects.length === 0) {
                vm.errorMsgGroups = 'Please select document.';
                vm.showErrorMsg = true;
            } else {
                var transactionModel = angular.extend(vm.createTransactionModel, {
                    documents: vm.documentSelects,
                    transactionAmount: vm.submitTransactionAmount,
                    sponsorId: vm.createTransactionModel.sponsorIdSelected,
                    payerAccountId: vm.tradingpartnerInfoModel.accountId
                });
                var sponsorNameSelect = '';
                vm.sponsorCodes.forEach(function(sponsorObj) {
                    if (vm.createTransactionModel.sponsorIdSelected === sponsorObj.value) {
                        sponsorNameSelect = sponsorObj.label;
                    }
                });

                transactionModel.sponsorPaymentDate = SCFCommonService.convertStringTodate(transactionModel.sponsorPaymentDate);
                transactionModel.transactionDate = SCFCommonService.convertStringTodate(transactionModel.transactionDate);

                var deffered = TransactionService.verifyTransaction(transactionModel);
                deffered.promise.then(function(response) {
                    var tradingpartnerInfoExtend = angular.extend(vm.tradingpartnerInfoModel, {
                        sponsorName: sponsorNameSelect,
                        supplierCodeSelected: vm.createTransactionModel.supplierCodeSelected,
						
                    });
                    var transaction = response.data;
                    SCFCommonService.parentStatePage().saveCurrentState('/create-transaction');
                    PageNavigation.nextStep('/create-transaction/validate-submit', {
                        transactionModel: transaction,
                        totalDocumentAmount: vm.totalDocumentAmount,
                        tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                        documentSelects: vm.documentSelects						
                    },{
                        transactionModel: transaction,
                        totalDocumentAmount: vm.totalDocumentAmount,
                        tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                        documentSelects: vm.documentSelects,
						showBackButton: vm.showBackButton,
                        criteria : _criteria
                    });
                }).catch(function(response) {
                    vm.errorMsgPopup = response.data.errorCode;
                    $scope.validateDataFailPopup = true;
                    vm.createTransactionModel.sponsorPaymentDate = SCFCommonService.convertDate(vm.createTransactionModel.sponsorPaymentDate);
                    vm.createTransactionModel.transactionDate = SCFCommonService.convertDate(vm.createTransactionModel.transactionDate);
                });
            }
        };
		
		var dashboardInitLoad = function(){
			vm.showBackButton = true;
			vm.searchDocument(undefined);
		}
        

        $scope.sortData = function(order, orderBy) {
            vm.createTransactionModel.order = order;
            vm.createTransactionModel.orderBy = orderBy;
            vm.loadDocument();
        };

        vm.sponsorChange = function() {
            _setDefualtValue(true);
            _loadDocumentDisplayConfig(vm.createTransactionModel.sponsorCode);
        }
		
		vm.supplierCodeChange = function(){
            _setDefualtValue(false);
			_loadSponsorPaymentDate();
		}
		
		vm.paymentDateChange = function(){
            _setDefualtValue(false);
            vm.requireSponsorPaymentDate = false;
		}
		
		vm.backStep = function(){
			PageNavigation.gotoPreviousPage(true);
		}
    }
]);