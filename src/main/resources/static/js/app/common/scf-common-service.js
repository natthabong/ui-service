var app = angular.module('scfApp')
app.service('SCFCommonService', [
    '$filter',
    '$http',
    '$log',
    '$q',
    function ($filter, $http, $log, $q) {
        var vm = this;
        var log = $log;
        vm.splitePage = function (pageSize, currentPage, totalRecord) {

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
        vm.parentStatePage = function () {

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

        vm.convertDate = function (dateTime) {
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

        vm.convertStringTodate = function (date) {
            result = '';
            if (date != undefined && date != '') {
                var dateSplite = date.toString().split('/');
                result = new Date(dateSplite[2] + '-' + dateSplite[1] + '-' + dateSplite[0]);
            }
            return result
        }

        vm.getDocumentDisplayConfig = function (sponsorId) {
            var differed = $q.defer();
            var displayConfig = [];
            $http({
                method: 'POST',
                url: '/api/document-display-config',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    sponsorId: sponsorId
                }
            }).success(function (response) {
                if (response.length === 0) {
                    displayConfig = defaultColumDisplay;
                } else {
                    displayConfig = response;
                }
                differed.resolve(displayConfig);
            }).error(function (response) {
                log.error('Load Display config error');
                differed.reject(defaultColumDisplay);
            });
            return differed;
        };

        vm.shortenLargeNumber = function (amount) {
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
                    	result = checkLargeNumber(amount, amountBase,index);
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
            
            function convertToShortenNumber(amountDivision, decimalPlace, shourtenNumberIndex){
                return toFixed(amountDivision, decimalPlace) + shortenNumber[shourtenNumberIndex];
            }
            
            function toFixed(amount, decimalPlace){
            	amount *= Math.pow(10, decimalPlace);
            	amount = (Math.round(amount, decimalPlace) + (((amount - Math.round(amount, decimalPlace))>=0.5)?1:0)) / Math.pow(10, decimalPlace);
                return amount.toFixed(decimalPlace);
            }
            
            return result;
        };
    }
]);

app.service('PageNavigation', [
    '$filter',
    '$http',
    '$log',
    '$q',
    '$state',
    function ($filter, $http, $log, $q, $state) {
        var vm = this;
        var log = $log;

        var homePage = '/';

        var previousPages = new Array();
        var steps = new Array();

        vm.gotoPage = function (page, params, keepStateObject) {
            var currentState = $state.current.name == '' ? '/' : $state.current.name;
            previousPages.push({
                page: currentState,
                stateObject: keepStateObject
            });
            if (params === undefined) {
                params = {};
            }
            params.backAction = false;
            $state.go(page, params);
        }

        vm.gotoPreviousPage = function (reset) {
            var previousPage = previousPages.pop();
            if (previousPage != null) {
                if (previousPage.stateObject === undefined) {
                    previousPage.stateObject = {};
                }
                previousPage.stateObject.backAction = true;
                $state.go(previousPage.page, reset ? {} : previousPage.stateObject, {
                    reload: reset
                });
            } else {
                $state.go(homePage);
            }
        }

        vm.nextStep = function (nextPage, params, keepStateObject) {
            steps.push({
                page: $state.current.name,
                stateObject: keepStateObject
            });

            params.backAction = false;

            $state.go(nextPage, params);
        }

        vm.backStep = function (reset) {
            var previousStep = steps.pop();
            if (previousStep != null) {
                previousStep.stateObject.backAction = true;
                $state.go(previousStep.page, reset ? {} : previousStep.stateObject, {
                    reload: reset
                });
            }
        }

    }
]);

var defaultColumDisplay = [{
    field: 'sponsorPaymentDate',
    label: 'วันครบกำหนดชำระ',
    sortData: true,
    cssTemplate: 'text-center',
    filterType: 'date',
    filterFormat: 'dd/MM/yyyy'
}, {
    field: 'documentDate',
    label: 'วันที่เอกสาร',
    sortData: true,
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
    sortData: true,
    cssTemplate: 'text-center',
}, {
    field: 'supplierCode',
    label: 'รหัสลูกค้า',
    sortData: true,
    cssTemplate: 'text-center'
}, {
    field: 'outstandingAmount',
    label: 'จำนวนเงินตามเอกสาร',
    sortData: true,
    cssTemplate: 'text-right',
    filterType: 'number',
    filterFormat: '2'
}];