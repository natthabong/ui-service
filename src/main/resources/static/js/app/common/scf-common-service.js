var app = angular.module('scfApp')
app.service('SCFCommonService', [
    '$filter',
    '$http',
    '$log',
    '$q', 'Service',
    function($filter, $http, $log, $q, Service) {
        var vm = this;
        var log = $log;
        vm.splitePage = function(pageSize, currentPage, totalRecord) {
        	totalRecord = totalRecord || 0;
        	currentPage = currentPage || 0;
            var recordDisplay = '0 - '
            if (totalRecord > 0) {
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
        vm.parentStatePage = function() {

            return {
                saveCurrentState: saveCurrentState,
                getParentState: getParentState,
                clearParentState: clearParentState
            }

            function saveCurrentState(currentState) {
                fromState = currentState;
            }

            function getParentState() {
                return fromState;
            }

            function clearParentState() {
                fromState = '';
            }
        };

        vm.clientPagination = function(listDatas, pagesize, currentPage) {
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

        vm.convertDate = function(dateTime) {
            var result = '';
            if (dateTime != undefined && dateTime != '') {

                if (!angular.isDate(dateTime)) {
                    dateTime = new Date(dateTime);
                }

                result = $filter('date')
                    (dateTime, 'dd/MM/yyyy', 'UTC+0700');
            }
            return result;
        }

        vm.convertStringTodate = function(date) {
            result = '';
            if (date != undefined && date != '') {
                var dateSplite = date.toString().split('/');
                result = new Date(dateSplite[2] + '-' + dateSplite[1] + '-' + dateSplite[0]);
            }
            return result
		}

		vm.getDocumentDisplayConfig = function(sponsorId) {
			var differed = $q.defer();
			var displayConfig = [];
			var reqUrl = '/api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP/displays'

			var documentDisplayDiferred = Service.doGet(reqUrl);
			documentDisplayDiferred.promise.then(function(response) {
				
				if (angular.isUndefined(response.data)) {
					displayConfig = defaultColumDisplay;
				} else {
					if (response.data.length == 0) {
						displayConfig = defaultColumDisplay;
					} else {
						displayConfig = response.data[0];
					}
				}

				differed.resolve(displayConfig);
			}).catch(function(response) {
				log.error('Load Display config error');
				differed.resolve(defaultColumDisplay);
			});
			return differed;
		};

        vm.shortenLargeNumber = function(amount) {
            var shortenNumber = ['k', 'M', 'G', 'T'];
            var amountBase, result;
            amount = parseInt(amount);
            if (amount >= 0 && amount < 1000) {
                result = amount + '';
            } else {
                var index = shortenNumber.length - 1;
                for (; index >= 0; index--) {
                    amountBase = Math.pow(1000, index + 1);
                    if (amount >= amountBase) {
                        result = checkLargeNumber(amount, amountBase, index);
                        break;
                    }
                }
            }

            function checkLargeNumber(amount, amountBase, shortenNumberIndex) {
                var amountDivision = amount / amountBase;
                var amountFixed = toFixed(amountDivision, 1);
                var decimalArray = amountFixed.split('.');
                var largeNumberResult = '';

                if (decimalArray[0].length >= 3) {
                    largeNumberResult = convertToShortenNumber(amountDivision, 0, shortenNumberIndex);
                } else {
                    if (decimalArray[1] == 0) {
                        largeNumberResult = convertToShortenNumber(amountDivision, 0, shortenNumberIndex);
                    } else {
                        largeNumberResult = convertToShortenNumber(amountDivision, 1, shortenNumberIndex);
                    }
                }
                return largeNumberResult;
            }

            function convertToShortenNumber(amountDivision, decimalPlace, shourtenNumberIndex) {
                return toFixed(amountDivision, decimalPlace) + shortenNumber[shourtenNumberIndex];
            }

            function toFixed(amount, decimalPlace) {
                amount *= Math.pow(10, decimalPlace);
                amount = (Math.round(amount, decimalPlace) + (((amount - Math.round(amount, decimalPlace)) >= 0.5) ? 1 : 0)) / Math.pow(10, decimalPlace);
                return amount.toFixed(decimalPlace);
            }

            return result;
        };

        vm.replacementStringFormat = function(msgFormat, replacements) {
            return msgFormat.replace(/\{(\d+)\}/g, function() {
                return replacements[arguments[1]]
            });
        };

        vm.camelize = function(input) {
			if(angular.isUndefined(input) || input == null){
				return '-';
			}
			
            var stringMsg = [];
            var index = 0;
            stringMsg[index] = input.slice(0, 1);
            while (++index < input.length) {
                stringMsg[index] = input[index].charAt(0).toLowerCase() + input[index].slice(1);
            }
            return stringMsg.join('');
        }
    }
]);

app.service('PagingController', ['$http', '$log', '$q', 'Service', 'SCFCommonService', function($http, $log, $q, Service, SCFCommonService) {
    var log = $log;

    var defaultPage = 0,
        defaultPageSize = '20',
        defaultPageSizeList = [ {
		label : '10',
		value : '10'
	}, {
		label : '20',
		value : '20'
	}, {
		label : '50',
		value : '50'
	} ];

    this.create = function(source, criteriaData, methodRequest) {
	
	var ctrl = {
	   clientMode: false,
	   tableRowCollection: {},
	   plitePageTxt: '',
	   pagingModel: {
	       pageSizeSelectModel: defaultPageSize,
	       totalRecord: 0,
	       totalPage: 0,
	       currentPage: defaultPage,
	       clearSortOrder: false
	   },
	   pageSizeList: defaultPageSizeList,
	   updateSource: function(source){
		this.dataSource = source;
		return this;
	   },
	   search: function(pagingData, callback){
		var self = this;
		if (pagingData === undefined) {
		    self.pagingModel.pageSizeSelectModel = defaultPageSize;
		    self.pagingModel.currentPage = defaultPage;
	        } else {
	            self.pagingModel.pageSizeSelectModel = pagingData.pageSize;
	            self.pagingModel.currentPage = pagingData.page;
	        }
		
		if(this.clientMode){
		    
		    if (angular.isArray(self.dataSource)) {
			var pagesize = self.pagingModel.pageSizeSelectModel;
			var currentPage = self.pagingModel.currentPage;
			
	                var indexStart = currentPage * pagesize;
	                var indexLast = (currentPage * pagesize) + pagesize;
	                var totalPage = Math.ceil(self.dataSource.length / pagesize);
	                var dataSplites = [];
	                for (; indexStart < indexLast && indexStart < self.dataSource.length; indexStart++) {
	                    dataSplites.push(self.dataSource[indexStart]);
	                }
	                self.pagingModel.totalRecord = self.dataSource.length;
	                self.pagingModel.totalPage = totalPage;
	                self.tableRowCollection = dataSplites;
	                self.splitePageTxt = SCFCommonService.splitePage(self.pagingModel.pageSizeSelectModel, self.pagingModel.currentPage, self.pagingModel.totalRecord);
	            }
		}
		else{
		    
		    var diferred = $q.defer();
		        
		        var criteriaData = self._prepareCriteria(self.pagingModel, self.postParams);
		        console.log(criteriaData);
		        var searchDeferred = '';
		        
		        if(self.methodRequestUrl == 'POST'){
		        	searchDeferred = Service.doPost(self.apiUrl, criteriaData, 'POST');
		        }else{
		        	searchDeferred = Service.doGet(self.apiUrl, criteriaData);
		        }

		        searchDeferred.promise.then(function(response) {
		            self.pagingModel.totalRecord = response.headers('X-Total-Count');
		            self.pagingModel.totalPage = response.headers('X-Total-Page');
		            self.tableRowCollection = response.data;
		            self.splitePageTxt = SCFCommonService.splitePage(self.pagingModel.pageSizeSelectModel, self.pagingModel.currentPage, self.pagingModel.totalRecord);
		            
		            if(callback!=null){
		        	callback(criteriaData);
		            }
		            
		            diferred.resolve(response);
		        }).catch(function(response) {
		            log.error('Search data error');
		            diferred.reject(response);
		        });
		        return diferred;
		}
	    },
	    reload: function(callback) {
		this.search({
		    pageSize: this.pagingModel.pageSizeSelectModel,
		    page: this.pagingModel.currentPage
		}, callback);
	    },
	    _prepareCriteria: function(pagingModel, postParams) {
	        var criteria = postParams;
	        criteria.limit = pagingModel.pageSizeSelectModel;
	        criteria.offset = pagingModel.currentPage * pagingModel.pageSizeSelectModel;
	        return criteria;
	    }
	};
	
	if(typeof source == "string"){
	    ctrl.apiUrl = source;
	    ctrl.postParams = criteriaData;
	    ctrl.methodRequestUrl = methodRequest || 'POST';
	}
	else{
	    ctrl.clientMode = true;
	    ctrl.dataSource = source;
	}
        return ctrl;
    }
    
}]);
app.filter('noSeperatorNumeric', ['$filter', function ($filter) {
    return function (rawData) {
    	var input =  parseFloat(rawData).toFixed(2);
    	var inputNumeric = isNaN(input)?0:input;
    	return inputNumeric;
    };
}]);
app.filter('negativeParenthesis', ['$filter', function ($filter) {
    return function (input, fractionSize) {
        if(!fractionSize){
          fractionSize=2;
        }
        if (input < 0) {
            return "("+$filter('number')(Math.abs(input), fractionSize)+")";
        } else {
            return $filter('number')(input, fractionSize);
        }
    };
}]);
app.filter('noSeperatorNegativeParenthesis', ['$filter', function ($filter) {
    return function (rawData) {
    	var input =  parseFloat(rawData).toFixed(2);

    	var inputNumeric = isNaN(input)?0:input;
    	if (input < 0) {
            return "("+Math.abs(inputNumeric)+")";
        } else {
            return inputNumeric;
        }
    };
}]);

app.filter('documentDateRuleType', [function() {
	var documentDateType = {'EVERY_DAY': 'EVERY_DAY', 'RANGE': 'RANGE'}
	var dateRange = function(creditterm){
		var result = '';
		if(creditterm.documentDateStartPeriod != null 
				&& creditterm.documentDateEndPeriod != null){
			result = addOrdinalNumberSuffix(creditterm.documentDateStartPeriod);
			result += ' - ';
			result += addOrdinalNumberSuffix(creditterm.documentDateEndPeriod);
		}
		return result;
	}
	
	return function(creditterm){		
		var displayMessage = '';		
		if(creditterm.documentDateType == documentDateType.EVERY_DAY){
			displayMessage = 'every day';
		}else if(creditterm.documentDateType == documentDateType.RANGE){
			displayMessage = dateRange(creditterm);
		}
		return displayMessage;
	}
}]);

app.filter('paymentDateFormula', [function() {
	var startMonthType = {'NEXT': 'NEXT', 'CURRENT': 'CURRENT'}
	var termTypeMsg = {'DAY': 'DAY', 'WEEK': 'WEEK'}
	
	var dateOfMonthMsg = function(formula){
		var displayMessage = '';
		if(formula.startDateOfMonth == 99){
			displayMessage = angular.lowercase(formula.startDayOfWeek);
			displayMessage += ' end of this month ';
		}else{
			displayMessage = addOrdinalNumberSuffix(formula.startDateOfMonth);
			displayMessage += ' ';
			displayMessage += 'of this month ';
		}
		return displayMessage;
	}
	
	return function(formula){
		var displayMessage = '';
		
		if(formula.startMonthType == startMonthType.CURRENT){
			displayMessage = dateOfMonthMsg(formula);
			
		}else if(formula.startMonthType == startMonthType.NEXT){
			if(formula.startDayOfWeek == null){
				displayMessage = addOrdinalNumberSuffix(formula.startDateOfMonth);
				displayMessage += ' of next month ';
			}else{
				displayMessage = 'next ';
				displayMessage += angular.lowercase(formula.startDayOfWeek);
				displayMessage += ' after ';
// displayMessage += addOrdinalNumberSuffix(formula.startDateOfMonth);
				displayMessage += dateOfMonthMsg(formula);
			}					
// displayMessage += ' ';
		}

		displayMessage += 'of Document date + ';
		if(formula.term != null){
			displayMessage += formula.term;
			if(formula.termType == termTypeMsg.DAY){
				displayMessage += ' days';
			}else{
				displayMessage += ' weeks';
			}			
		}
		return displayMessage;
	}
}]);

app.filter('period', [function() {
	var paymentPeriodType = {'DATE_OF_MONTH': 'DATE_OF_MONTH', 'DAY_OF_WEEK': 'DAY_OF_WEEK', 'EVERY_DAY': 'EVERY_DAY'}
	var occurrentWeekType = {'EVERY': 'EVERY', 'LAST': 'LAST'}
	
	var occurrentWeekMsg = function(period){
		var displayMessage = '';
		if(period.occurrenceWeek != occurrentWeekType.EVERY 
				&& period.occurrenceWeek != occurrentWeekType.LAST){
			displayMessage = 'every ';
		}
			displayMessage += angular.lowercase(period.occurrenceWeek);
			displayMessage += ' ';
		return displayMessage;
	}
	var paymentPeriodMsg = function(period){
		var displayMessage = '';		
		if(period.paymentPeriodType == paymentPeriodType.DATE_OF_MONTH){
			if(period.dateOfMonth == 99){
				return addOrdinalNumberSuffix(period.dateOfMonth);
			}
			displayMessage = 'The ';
			displayMessage += addOrdinalNumberSuffix(period.dateOfMonth);
			displayMessage += ' day of month';
		}else if(period.paymentPeriodType == paymentPeriodType.DAY_OF_WEEK){
			if(period.occurrenceWeek != null){
				displayMessage = occurrentWeekMsg(period);
			}			
			displayMessage += angular.lowercase(period.dayOfWeek);
			
			displayMessage += ' of month';
		}else if(period.paymentPeriodType == paymentPeriodType.EVERY_DAY){
			displayMessage = 'every day';
		}
		return displayMessage;
	}
	return function(period){
		var displayMessage = '';
		return paymentPeriodMsg(period);
	}
}]);

app.filter('paymentPeriod', ['$filter',function($filter){
	return function(creditTerm){
		var displayMessage = '';
		if(creditTerm.periodType == 'EVERY_PERIOD'){
			return 'Every period';
		}
		
		var periods = creditTerm.paymentPeriods;
		
		if(angular.isArray(periods)){
			var displayMessages = [];
			periods.forEach(function(period){
				var periodMsg = $filter('period')(period);
				displayMessages.push(periodMsg);
			});
			
			displayMessage = displayMessages.join(', ');
		}else{
			return $filter('period')(periods);
		}
		return displayMessage;
	}
}]);

var addOrdinalNumberSuffix = function(number){
	if(number == 99){
		return 'end of month';
	}
	if(number == 12){
		return number + 'th';
	}
	switch(number % 10){
	case 1:
		return number + 'st';
	case 2:
		return number + 'nd';
	case 3:
		return number + 'rd';
	default:		
		return number + 'th';
	}
}

var defaultColumDisplay = {
	supplierCodeGroupSelection: 'SINGLE_PER_TRANSACTION',
	loanRequestMode: 'CURRENT_AND_FUTURE',
	documentSelection :'ANY_DOCUMENT',
	items: [{
            field: 'sponsorPaymentDate',
            labelEN: 'วันครบกำหนดชำระ',
            labelTH: 'วันครบกำหนดชำระ',
            sortData: true,
            cssTemplate: 'text-center',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy'
        }, {
            field: 'documentDate',
            labelEN: 'วันที่เอกสาร',
            labelTH: 'วันที่เอกสาร',
            sortData: true,
            cssTemplate: 'text-center',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy'
        }, {
            field: 'documentNo',
            labelEN: 'เลขที่เอกสาร',
            labelTH: 'เลขที่เอกสาร',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
            field: 'documentType',
            labelEN: 'ประเภทเอกสาร',
            labelTH: 'ประเภทเอกสาร',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
            field: 'supplierCode',
            labelEN: 'รหัสลูกค้า',
            labelTH: 'รหัสลูกค้า',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
            field: 'outstandingAmount',
            labelEN: 'จำนวนเงินตามเอกสาร',
            labelTH: 'จำนวนเงินตามเอกสาร',
            sortData: true,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }]
};