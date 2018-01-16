'use strict';

angular.module('gecscf.downloadPaymentResult', [ 'ui.router', 'gecscf.ui' ]).config(
		[ '$stateProvider', function($stateProvider) {
		  
		  var resources = ['js/app/modules/download-payment-result/services/DownloadPaymentResultService.js','js/app/modules/download-payment-result/controllers/DownloadPaymentResultController.js'];
		  
		  $stateProvider.state('/partner-organize/download-payment-advices',{
        url: '/partner-organize/download-payment-advices',
        controller: 'DownloadPaymentResultController',
        controllerAs: 'ctrl',
        templateUrl: '/download-payment-result/supplier',
        params: {transaction: null},
        resolve: WebHelper.loadScript(resources)
      })
		} ]);