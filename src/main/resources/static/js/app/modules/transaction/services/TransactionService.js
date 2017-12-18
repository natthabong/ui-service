angular.module('gecscf.transaction').service('TransactionService', ['$http', '$q', 'blockUI', '$window', transactionService]);

function transactionService($http, $q, blockUI, $window) {

    //payment
    function getSuppliers(accountingTransactionType) {
        var deffered = $q.defer();

        $http({
            url: 'api/v1/create-transaction/suppliers',
            method: 'GET',
            params: {
                accountingTransactionType: accountingTransactionType
            }
        })
            .then(function (response) {
                deffered.resolve(response);
            })
            .catch(function (response) {
                deffered.reject('Cannot load supplierCode');
            });
        return deffered;
    }

    //loan
    function getSupplier(sponsorId) {
        var deffered = $q.defer();

        $http({
            method: 'GET',
            url: 'api/v1/create-transaction/supplier-code',
            params: {
                sponsorId: sponsorId
            }
        }).then(function (response) {
            deffered.resolve(response);
        }).catch(function (response) {
            deffered.reject(response);
        });
        return deffered;
    }

    function getBuyerCodes(ownerId) {
        var deffered = $q.defer();

        $http({
            url: 'api/v1/organize-customers/' + ownerId + '/customer-code-groups/me/customer-codes',
            method: 'GET'
        })
            .then(function (response) {
                deffered.resolve(response);
            })
            .catch(function (response) {
                deffered.reject('Cannot load customer code');
            });
        return deffered;
    }

    function getAccounts(organizeId, supplierId) {
        var sort = ["-accountType","-defaultLoanNo","accountNo"];
        var deffered = $q.defer();
        $http({
            url: 'api/v1/organize-customers/' + organizeId + '/trading-partners/' + supplierId + '/accounts',
            method: 'GET',
            params: {
                sort : sort
            }
        })
            .then(function (response) {
                deffered.resolve(response);
            })
            .catch(function (response) {
                deffered.reject('Cannot load account');
            });
        return deffered;
    }

    function getDocuments(criteria) {
        var deffered = $q.defer();
        $http({
            url: 'api/v1/documents',
            method: 'GET',
            params: criteria
        }).then(function (response) {
            deffered.resolve(response);
        })
            .catch(function (response) {
                deffered.reject(response);
            });
        return deffered;
    }

    function getPaymentDate(transactionModel, type, accType) {
        var deffered = $q.defer();
        $http({
            url: 'api/v1/create-transaction/payment-dates/calculate',
            method: 'POST',
            data: {
                sponsorId: transactionModel.sponsorId,
                supplierId: transactionModel.supplierId,
                documents: transactionModel.documents,
                transactionMethod: transactionModel.transactionMethod
            },
            params: {
                loanRequestMode: "CURRENT_AND_FUTURE",
                createTransactionType: type,
                accountType: accType
            }
        })
            .then(function (response) {
                deffered.resolve(response);
            })
            .catch(function (response) {
                deffered.reject('Cannot load payment date');
            });
        return deffered;
    }

    function submitTransaction(transactionModel) {
        var deffered = $q.defer();
        $http({
            url: 'api/v1/create-transaction/payment/submit',
            method: 'POST',
            data: transactionModel
        })
            .then(function (response) {
                deffered.resolve(response);
            })
            .catch(function (response) {
                deffered.reject(response);
            });
        return deffered;
    }

    function getSponsorPaymentDate(sponsorId, supplierCode, loanRequestMode) {
        var deffered = $q.defer();

        $http({
            url: 'api/v1/create-transaction/sponsor-payment-dates/get',
            method: 'GET',
            params: {
                sponsorId: sponsorId,
                supplierCode: supplierCode,
                loanRequestMode: loanRequestMode
            },
            transformRequest: function (data) {
                if (data === undefined) {
                    return data;
                }
                return $.param(data);
            }
        })
            .then(function (response) {
                deffered.resolve(response);
            })
            .catch(function (response) {
                deffered.reject('Cannot load supplierCode');
            });
        return deffered;
    }

    function getTransactionDate(sponsorId, sponsorPaymentDate, loanRequestMode, tenor) {
        var deffered = $q.defer();

        $http({
            url: 'api/v1/create-transaction/transaction-dates/get',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                sponsorId: sponsorId,
                sponsorPaymentDate: sponsorPaymentDate,
                loanRequestMode: loanRequestMode,
                tenor: tenor
            },
            transformRequest: function (data) {
                if (data === undefined) {
                    return data;
                }
                return $.param(data);
            }
        })
            .then(function (response) {
                deffered.resolve(response);
            })
            .catch(function (response) {
                deffered.reject(response);
            });
        return deffered;
    }

    function getTradingInfo(sponsorId, supplierId) {
        var deffered = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: 'api/v1/create-transaction/trading-info/get',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                sponsorId: sponsorId,
                supplierId: supplierId
            },
            transformRequest: function (data) {
                if (data === undefined) {
                    return data;
                }
                return $.param(data);
            }
        }).then(function (response) {
            blockUI.stop();
            deffered.resolve(response);
        }).catch(function (response) {
            blockUI.stop();
            deffered.reject(response);
        });
        return deffered;
    }

    function verifyTransaction(transaction) {
        var deffered = $q.defer();
        $http.post('api/v1/create-transaction/transaction/verify', transaction)
            .then(function (response) {
                deffered.resolve(response);

            })
            .catch(function (response) {
                deffered.reject(response);
            });
        return deffered;
    }

    function getSponsor() {
        var deffered = $q.defer();

        $http.get('api/v1/create-transaction/sponsor')
            .then(function (response) {
                deffered.resolve(response);
            })
            .catch(function (response) {
                deffered.reject(response);
            });
        return deffered;
    }

    function verifyTradingPartner() {
        var deffered = $q.defer();
        $http({
            url: 'api/v1/create-transaction/trading-partner/verify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {

            },
            transformRequest: function (data) {
                if (data === undefined) {
                    return data;
                }
                return $.param(data);
            }
        })
            .then(function (response) {
                deffered.resolve(response);
            })
            .catch(function (response) {
                deffered.reject(response);
            });
        return deffered;
    }

    function calculateTotalDocumentAmountWithPrePercentTag(totalAmount, preDradowPercentag) {
        var sumAmount = (totalAmount * (preDradowPercentag / 100)).toFixed(2);
        return sumAmount;
    }

    function summaryAllDocumentAmount(documentSelects) {
        var sumAmount = 0;
        documentSelects.forEach(function (document) {
            sumAmount += Number(document.calculatedPaymentAmount);
        });
        return sumAmount;
    }

    function findIndexFromDoucmentListByDocument(ducument, documentList) {
        return documentList.map(function (o) {
            return o.documentId;
        }).indexOf(ducument.documentId);
    }

    function checkSelectAllDocumentInPage(documentSelects, allDocumentInPage) {
        var selectAllDocumentInPage = false;
        var countRecordData = 0;
        if (documentSelects.length > 0) {
            allDocumentInPage.forEach(function (document) {
                for (var index = documentSelects.length; index--;) {
                    if (angular.equals(document, documentSelects[index])) {
                        countRecordData++;
                        break;
                    }
                }
            });
        }

        if (countRecordData === allDocumentInPage.length && countRecordData > 0) {
            selectAllDocumentInPage = true;
        }
        return selectAllDocumentInPage;
    }

    function checkSelectAllDocument(documentSelects, pageSize) {
        var selectAllDocument = false;
        if (documentSelects.length > 0 && documentSelects.length == pageSize) {
            selectAllDocument = true;
        }
        return selectAllDocument;
    }

    function retry(transactionApproveModel) {
        var deffered = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: '/api/transaction/retry',
            data: transactionApproveModel
        }).then(function (response) {
            blockUI.stop();
            deffered.resolve(response);
        }).catch(function (response) {
            blockUI.stop();
            deffered.reject(response);
        });
        return deffered;
    }

    function reject(transactionModel) {
        var deffered = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: '/api/v1/reject-transaction/reject',
            data: transactionModel
        }).then(function (response) {
            blockUI.stop();
            deffered.resolve(response);
        }).catch(function (response) {
            blockUI.stop();
            if (response.status == 403) {
                $window.location.href = "/error/403";
            } else {
                deffered.reject(response);
            }
        });
        return deffered;
    }

    function getTransactionDialogErrorUrl(errorCode, action) {
        var errorMessageCode = {
            incomplete: 'INCOMPLETE',
            transactionHour: 'E1012',
            concurency: 'E1003'
        }
        var version = (new Date()).getTime();
        var templateUrl = '/js/app/approve-transactions/fail-dialog.html?v=' + version;
        if (action === 'approve') {
            if (angular.isDefined(errorCode)) {
                if (errorCode == errorMessageCode.incomplete) {
                    templateUrl = '/js/app/approve-transactions/incomplete-dialog.html?v=' + version;
                }
                else if (errorCode == errorMessageCode.concurency) {

                    templateUrl = '/js/app/approve-transactions/approve-concurency-dialog.html?v=' + version;
                }
            }
        } else {
            templateUrl = '/js/app/approve-transactions/retry-fail-dialog.html?v=' + version;
            if (angular.isDefined(errorCode)) {
                if (errorCode == errorMessageCode.incomplete) {
                    templateUrl = '/js/app/approve-transactions/incomplete-dialog.html?v=' + version;
                }
                else if (errorCode == errorMessageCode.concurency) {

                    templateUrl = '/js/app/approve-transactions/retry-concurency-dialog.html?v=' + version;
                }
            }
        }
        return templateUrl;
    }

    function getAvailableMaturityDates(paymentDate, tenor) {
        var deffered = $q.defer();

        $http({
            method: 'POST',
            url: 'api/v1/create-transaction/maturity-dates/get',
            params: {
                paymentDate: paymentDate,
                tenor: tenor
            }
        }).then(function (response) {
            deffered.resolve(response);
        }).catch(function (response) {
            deffered.reject(response);
        });
        return deffered;

    }

    function generateCreditAdviceForm(transactionModel) {
        $http({
            method: 'POST',
            url: '/api/approve-transaction/evidence-form',
            data: transactionModel,
            responseType: 'arraybuffer'
        }).success(function (response) {
            var file = new Blob([response], {
                type: 'application/pdf'
            });
            var fileURL = URL.createObjectURL(file);
            var a = document.createElement('a');
            a.href = fileURL;
            a.target = '_blank';
            if (transactionModel.transactionType == 'PAYMENT') {
                if (transactionModel.transactionMethod == 'DEBIT') {
                    a.download = "EvidenceOfReceiptBFPDirectDebit_" + transactionModel.transactionNo + '.pdf';
                } else {
                    a.download = "EvidenceOfReceiptBFPDrawdown_" + transactionModel.transactionNo + '.pdf';
                }
            } else {
                a.download = transactionModel.transactionNo + '.pdf';
            }

            document.body.appendChild(a);
            a.click();
        }).error(function (response) {

        });
    }

    function getTransaction(transaction) {
        var deffered = $q.defer();
        $http({
            method: 'GET',
            url: 'api/v1/transactions/' + transaction.transactionId,
            headers: {
                'If-Match': transaction.version
            },
            params: {
                mode: 'view'
            }
        }).then(function (response) {
            deffered.resolve(response);
        }).catch(function (response) {
            deffered.reject(response);
        });
        return deffered;
    }

    function generateEvidenceForm(transactionModel) {
        $http({
            method: 'POST',
            url: '/api/approve-transaction/evidence-form',
            data: transactionModel,
            responseType: 'arraybuffer'
        }).success(function (response) {
            var file = new Blob([response], {
                type: 'application/pdf'
            });
            var fileURL = URL.createObjectURL(file);
            var a = document.createElement('a');
            a.href = fileURL;
            a.target = '_blank';
            if (transactionModel.transactionType == 'PAYMENT') {
                if (transactionModel.transactionMethod == 'DEBIT') {
                    a.download = "EvidenceOfReceiptBFPDirectDebit_" + transactionModel.transactionNo + '.pdf';
                } else if (transactionModel.transactionMethod == 'DEBIT_SPECIAL') {
                    a.download = "EvidenceOfReceiptBFPDirectDebitSP_" + transactionModel.transactionNo + '.pdf';
                } else {
                    a.download = "EvidenceOfReceiptBFPDrawdown_" + transactionModel.transactionNo + '.pdf';
                }
            } else {
                a.download = "EvidenceOfReceiptSFPDrawdown_" + transactionModel.transactionNo + '.pdf';
            }

            document.body.appendChild(a);
            a.click();
        }).error(function (response) {

        });
    }

    function summaryStatusGroup(listTransactionModel) {
        var deffered = $q.defer();
        $http({
            url: 'api/v1/list-transaction/summary-status-group',
            method: 'POST',
            data: listTransactionModel
        }).then(function (response) {
            deffered.resolve(response);
        }).catch(function (response) {
            deffered.reject(response);
        });
        return deffered;
    }

    function searchMatchingField(params, data) {
        var deffered = $q.defer();
        $http({
            url: 'api/v1/documents/matching-by-fields',
            method: 'POST',
            params: params,
            data: data
        }).then(function (response) {
            deffered.resolve(response);
        }).catch(function (response) {
            deffered.reject(response);
        });
        return deffered;
    }
    
    function isAfterToday(data , serverTime) {
        
        var from_date = data.transactionDate;
        var YYYY = from_date.substring(0, 4);
        var MM = from_date.substring(5, 7);
        var DD = from_date.substring(8,10);
        var txnDate = new Date();
        txnDate.setHours(0);
        txnDate.setMilliseconds(0);
        txnDate.setMinutes(0);
        txnDate.setSeconds(0);
        txnDate.setFullYear(YYYY,(MM-1), DD);

        var now = serverTime;
        var Year = now.substring(0, 4);
        var Month = now.substring(5, 7);
        var Day = now.substring(8,10);
        var todayDate = new Date();
        todayDate.setHours(0);
        todayDate.setMilliseconds(0);
        todayDate.setMinutes(0);
        todayDate.setSeconds(0);
        todayDate.setFullYear(Year,(Month-1), Day);    

        if (txnDate.getTime() > todayDate.getTime()) {
        	return true;
        }else{
        	return false;
        }   
    }
    
    function validateCredential(data) {
        var result = true;
        if (angular.isUndefined(data) || data === '') {
            result = false;
        }
        return result;
    }

    this.searchMatchingField = searchMatchingField;
    this.getSponsorPaymentDate = getSponsorPaymentDate;
    this.getTransactionDate = getTransactionDate;
    this.getTradingInfo = getTradingInfo;
    this.verifyTransaction = verifyTransaction;
    this.verifyTradingPartner = verifyTradingPartner;
    this.getSponsor = getSponsor;
    this.getSupplier = getSupplier;
    this.getPaymentDate = getPaymentDate;
    this.getDocuments = getDocuments;
    this.getAccounts = getAccounts;
    this.getBuyerCodes = getBuyerCodes;
    this.getSuppliers = getSuppliers;
    this.calculateTotalDocumentAmountWithPrePercentTag = calculateTotalDocumentAmountWithPrePercentTag;
    this.submitTransaction = submitTransaction;
    this.retry = retry;
    this.reject = reject;
    this.getAvailableMaturityDates = getAvailableMaturityDates;
    this.getTransactionDialogErrorUrl = getTransactionDialogErrorUrl;
    this.getTransaction = getTransaction;
    this.generateEvidenceForm = generateEvidenceForm;
    this.summaryStatusGroup = summaryStatusGroup;
    this.findIndexFromDoucmentListByDocument = findIndexFromDoucmentListByDocument;
    this.checkSelectAllDocumentInPage = checkSelectAllDocumentInPage;
    this.checkSelectAllDocument = checkSelectAllDocument;
    this.summaryAllDocumentAmount = summaryAllDocumentAmount;
    this.isAfterToday = isAfterToday;
    this.validateCredential = validateCredential;
        
}