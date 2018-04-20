angular.module('gecscf.transaction').service('TransactionService', ['$http', '$q', 'blockUI', '$window', transactionService]);

function transactionService($http, $q, blockUI, $window) {

    //payment
    function getSuppliers(accountingTransactionType) {
        var deferred = $q.defer();

        $http({
                url: 'api/v1/create-transaction/suppliers',
                method: 'GET',
                params: {
                    accountingTransactionType: accountingTransactionType
                }
            })
            .then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    //loan
    function getSupplier(sponsorId) {
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: 'api/v1/create-transaction/supplier-code',
            params: {
                sponsorId: sponsorId
            }
        }).then(function (response) {
            deferred.resolve(response);
        }).catch(function (response) {
            deferred.reject(response);
        });
        return deferred;
    }

    function getBuyerCodes(ownerId) {
        var deferred = $q.defer();

        $http({
                url: 'api/v1/organize-customers/' + ownerId + '/customer-code-groups/me/customer-codes',
                method: 'GET'
            })
            .then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    function getAccounts(organizeId, supplierId) {
        var sort = ["-defaultLoanNo", "accountNo"];
        var deferred = $q.defer();
        $http({
                url: 'api/v1/organize-customers/' + organizeId + '/trading-partners/' + supplierId + '/accounts',
                method: 'GET',
                params: {
                    sort: sort
                }
            })
            .then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    function getAccountsByTenor(organizeId, supplierId, paymentDate, loanRequestMode) {
        var sort = ["-defaultLoanNo", "accountNo"];
        var deferred = $q.defer();
        $http({
                url: 'api/v1/organize-customers/' + organizeId + '/trading-partners/' + supplierId + '/accounts-by-tenor',
                method: 'GET',
                params: {
                    paymentDate: paymentDate,
                    loanRequestMode: loanRequestMode,
                    sort: sort
                }
            })
            .then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    function getDocuments(criteria) {
        var deferred = $q.defer();
        $http({
                url: 'api/v1/documents',
                method: 'GET',
                params: criteria
            }).then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    function getPaymentDate(transactionModel, type, accType, loanRequestMode, prodType, limitExpiryDate) {
        var deferred = $q.defer();
        $http({
                url: 'api/v1/create-transaction/payment-dates/calculate',
                method: 'POST',
                data: {
                    sponsorId: transactionModel.sponsorId,
                    supplierId: transactionModel.supplierId,
                    transactionMethod: transactionModel.transactionMethod,
                    documents: transactionModel.documents
                },
                params: {
                    loanRequestMode: loanRequestMode,
                    createTransactionType: type,
                    accountType: accType,
                    productType: prodType,
                    limitExpiryDate: limitExpiryDate
                }
            })
            .then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    function submitTransaction(transactionModel) {
        blockUI.start();
        var deferred = $q.defer();
        $http({
                url: 'api/v1/create-transaction/payment/submit',
                method: 'POST',
                data: transactionModel
            })
            .then(function (response) {
            	blockUI.stop();
                deferred.resolve(response);
            })
            .catch(function (response) {
            	blockUI.stop();
                deferred.reject(response);
            });
        return deferred;
    }

    function getSponsorPaymentDate(sponsorId, supplierCode, loanRequestMode) {
        var deferred = $q.defer();

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
                deferred.resolve(response);
            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    function getTransactionDate(sponsorId, sponsorPaymentDate, loanRequestMode, tenor, limitExpiryDate) {
        var deferred = $q.defer();

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
                params: {
                    limitExpiryDate: limitExpiryDate
                },
                transformRequest: function (data) {
                    if (data === undefined) {
                        return data;
                    }
                    return $.param(data);
                }
            })
            .then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    function getTradingInfo(sponsorId, supplierId, accountId) {
        var deferred = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: 'api/v1/create-transaction/trading-info/get',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                sponsorId: sponsorId,
                supplierId: supplierId,
                accountId: accountId
            },
            transformRequest: function (data) {
                if (data === undefined) {
                    return data;
                }
                return $.param(data);
            }
        }).then(function (response) {
            blockUI.stop();
            deferred.resolve(response);
        }).catch(function (response) {
            blockUI.stop();
            deferred.reject(response);
        });
        return deferred;
    }

    function verifyTransaction(transaction) {
        var deferred = $q.defer();
        $http.post('api/v1/create-transaction/transaction/verify', transaction)
            .then(function (response) {
                deferred.resolve(response);

            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    function getSponsor() {
        var deferred = $q.defer();

        $http.get('api/v1/create-transaction/sponsor')
            .then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    function verifyTradingPartner() {
        var deferred = $q.defer();
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
                deferred.resolve(response);
            })
            .catch(function (response) {
                deferred.reject(response);
            });
        return deferred;
    }

    function calculateTotalDocumentAmountWithPrePercentTage(totalAmount, preDradowPercentag) {
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
        var deferred = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: '/api/transaction/retry',
            data: transactionApproveModel
        }).then(function (response) {
            blockUI.stop();
            deferred.resolve(response);
        }).catch(function (response) {
            blockUI.stop();
            deferred.reject(response);
        });
        return deferred;
    }

    function reject(transactionModel) {
        var deferred = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: '/api/v1/reject-transaction/reject',
            data: transactionModel
        }).then(function (response) {
            blockUI.stop();
            deferred.resolve(response);
        }).catch(function (response) {
            blockUI.stop();
            if (response.status == 403) {
                $window.location.href = "/error/403";
            } else {
                deferred.reject(response);
            }
        });
        return deferred;
    }
    
    function resend(transactionModel) {
        var deferred = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: '/api/transaction/resend',
            data: transactionModel
        }).then(function (response) {
            blockUI.stop();
            deferred.resolve(response);
        }).catch(function (response) {
            blockUI.stop();
            deferred.reject(response);
        });
        return deferred;
    }

    function getTransactionDialogErrorUrl(errorCode, action) {
        var errorMessageCode = {
            incomplete: 'INCOMPLETE',
            transactionHour: 'E1012',
            concurency: 'E1003' ,
            tradeFinanceSuspend : 'E1017',
            accountSuspend : 'E1018' ,
            tradePartnerSuspend : 'E1019',
        }
        var version = (new Date()).getTime();
        var templateUrl = '/js/app/approve-transactions/fail-dialog.html?v=' + version;
        if (action === 'approve') {
            if (angular.isDefined(errorCode)) {
                if (errorCode == errorMessageCode.incomplete || errorCode == errorMessageCode.tradeFinanceSuspend 
                		|| errorCode == errorMessageCode.accountSuspend || errorCode == errorMessageCode.tradePartnerSuspend) {
                    templateUrl = '/js/app/approve-transactions/incomplete-dialog.html?v=' + version;
                } else if (errorCode == errorMessageCode.concurency) {

                    templateUrl = '/js/app/approve-transactions/approve-concurency-dialog.html?v=' + version;
                }
            }
        } else {
            templateUrl = '/js/app/approve-transactions/retry-fail-dialog.html?v=' + version;
            if (angular.isDefined(errorCode)) {
                if (errorCode == errorMessageCode.incomplete) {
                    templateUrl = '/js/app/approve-transactions/incomplete-dialog.html?v=' + version;
                } else if (errorCode == errorMessageCode.concurency) {

                    templateUrl = '/js/app/approve-transactions/retry-concurency-dialog.html?v=' + version;
                }
            }
        }
        return templateUrl;
    }

    function getAvailableMaturityDates(paymentDate, tenor) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: 'api/v1/create-transaction/maturity-dates/get',
            params: {
                paymentDate: paymentDate,
                tenor: tenor
            }
        }).then(function (response) {
            deferred.resolve(response);
        }).catch(function (response) {
            deferred.reject(response);
        });
        return deferred;

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
        var deferred = $q.defer();
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
            deferred.resolve(response);
        }).catch(function (response) {
            deferred.reject(response);
        });
        return deferred;
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
                } else if (transactionModel.transactionMethod == 'OD') {
                    a.download = "EvidenceOfReceiptBFPOverdraft_" + transactionModel.transactionNo + '.pdf';
                } else {
                    a.download = "EvidenceOfReceiptBFPDrawdown_" + transactionModel.transactionNo + '.pdf';
                }
            } else if (transactionModel.transactionType == 'DRAWDOWN') {
                if (transactionModel.transactionMethod == 'OD') {
                    a.download = "EvidenceOfReceiptSFPOverdraft_" + transactionModel.transactionNo + '.pdf';
                } else {
                    a.download = "EvidenceOfReceiptSFPDrawdown_" + transactionModel.transactionNo + '.pdf';
                }

            }

            document.body.appendChild(a);
            a.click();
        }).error(function (response) {

        });
    }

    function summaryStatusGroup(listTransactionModel) {
        var deferred = $q.defer();
        $http({
            url: 'api/v1/list-transaction/summary-status-group',
            method: 'POST',
            data: listTransactionModel
        }).then(function (response) {
            deferred.resolve(response);
        }).catch(function (response) {
            deferred.reject(response);
        });
        return deferred;
    }

    function searchMatchingField(params, data) {
        var deferred = $q.defer();
        $http({
            url: 'api/v1/documents/matching-by-fields',
            method: 'POST',
            params: params,
            data: data
        }).then(function (response) {
            deferred.resolve(response);
        }).catch(function (response) {
            deferred.reject(response);
        });
        return deferred;
    }

    function isAfterToday(data, serverTime) {

        var from_date = data.transactionDate;
        var YYYY = from_date.substring(0, 4);
        var MM = from_date.substring(5, 7);
        var DD = from_date.substring(8, 10);
        var txnDate = new Date();
        txnDate.setHours(0);
        txnDate.setMilliseconds(0);
        txnDate.setMinutes(0);
        txnDate.setSeconds(0);
        txnDate.setFullYear(YYYY, (MM - 1), DD);

        var now = serverTime;
        var Year = now.substring(0, 4);
        var Month = now.substring(5, 7);
        var Day = now.substring(8, 10);
        var todayDate = new Date();
        todayDate.setHours(0);
        todayDate.setMilliseconds(0);
        todayDate.setMinutes(0);
        todayDate.setSeconds(0);
        todayDate.setFullYear(Year, (Month - 1), Day);

        if (txnDate.getTime() > todayDate.getTime()) {
            return true;
        } else {
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
    this.getAccountsByTenor = getAccountsByTenor;
    this.getBuyerCodes = getBuyerCodes;
    this.getSuppliers = getSuppliers;
    this.calculateTotalDocumentAmountWithPrePercentTage = calculateTotalDocumentAmountWithPrePercentTage;
    this.submitTransaction = submitTransaction;
    this.retry = retry;
    this.reject = reject;
    this.resend = resend;
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