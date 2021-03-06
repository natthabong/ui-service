'use strict';

angular.module('scfApp').factory('VerifyTransactionService', ['$http', '$q', 'Service', VerifyTransactionService]);

function VerifyTransactionService($http, $q, Service) {
    return {
        prepare: prepare,
        approve: approve,
        reject: reject,
        getTradeFinanceInfo: getTradeFinanceInfo,
        getDocuments: getDocuments
    }


    function prepare(transaction) {
        var deffered = $q.defer();
        var serviceUrl = 'api/v1/transactions/' + transaction.transactionId;
        $http({
            url: serviceUrl,
            method: 'GET',
            headers: {
                'If-Match': transaction.version
            },
            params: {
                mode: 'verify'
            }
        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });
        return deffered;
    }

    function approve(transaction) {
        var deffered = $q.defer();
        $http({
            url: 'api/verify-transaction/approve',
            method: 'POST',
            data: transaction
        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });
        return deffered;
    }

    function reject(transaction) {
        var deffered = $q.defer();
        $http({
            url: 'api/verify-transaction/reject',
            method: 'POST',
            data: transaction
        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });
        return deffered;
    }

    function getDocuments(txnDocCriteria) {
        var deffered = $q.defer();
        $http({
            url: 'api/transaction-documents/get',
            method: 'POST',
            data: txnDocCriteria
        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });
        return deffered;
    }

    function getTradeFinanceInfo(sponsorId, supplierId, accountId) {
        var url = '/api/v1/organize-customers/' + sponsorId + '/trading-partners/' + supplierId + '/trade-finance/' + accountId;
        return Service.doGet(url);
    }
}