'use strict';
angular
		.module('gecscf.monitoring', [ 'ui.router', 'gecscf.ui' ])
		.config(
				[
						'$stateProvider',
						function($stateProvider) {
						  var requiredLibs = [
                'js/app/modules/monitor/controllers/BankSystemIntegrationMonitorController.js',
                'js/app/modules/monitor/controllers/CustomerSystemIntegrationMonitorController.js',
                'js/app/modules/monitor/controllers/MySystemIntegrationMonitorController.js',
                'js/app/modules/monitor/controllers/WebServiceMonitorController.js',
                'js/app/modules/monitor/controllers/FtpMonitorController.js',
                'js/app/modules/monitor/controllers/BatchJobMonitorController.js',
                'js/app/modules/monitor/services/BatchJobMonitorService.js',
                'js/app/modules/monitor/services/SystemIntegrationMonitorService.js',
                'js/app/common/scf-component.js',
                'js/app/common/scf-component.css' ]
						  
							$stateProvider
									.state(
											'/monitoring/bank-system-integration',
											{
												url : '/monitoring/bank-system-integration',
												controller : 'BankSystemIntegrationMonitorController',
												controllerAs : 'ctrl',
												templateUrl : '/system-integration-monitor/bank',
												params : {
													params : []
												},
												resolve : WebHelper
														.loadScript(requiredLibs)
											})
									.state(
											'/monitoring/customer-system-integration',
											{
												url : '/monitoring/customer-system-integration',
												controller : 'CustomerSystemIntegrationMonitorController',
												controllerAs : 'ctrl',
												templateUrl : '/system-integration-monitor/sponsor',
												params : {
													params : [],
													backAction : false,
													customerModel : null
												},
												resolve : WebHelper
														.loadScript(requiredLibs)
											})
									.state(
											'/monitoring/system-integration',
											{
												url : '/monitoring/system-integration',
												controller : 'MySystemIntegrationMonitorController',
												controllerAs : 'ctrl',
												templateUrl : '/system-integration-monitor/gec',
												params : {
													params : []
												},
												resolve : WebHelper
														.loadScript(requiredLibs)
											})
									.state(
											'/monitoring/transaction-tracking',
											{
												url : '/monitoring/transaction-tracking',
												controller : 'TransactionTrackingController',
												controllerAs : 'ctrl',
												templateUrl : '/transaction-tracking',
												params : {
													backAction : false,
													criteria : null
												},
												resolve : WebHelper
														.loadScript([
																'js/app/modules/monitor/controllers/TransactionTrackingController.js',
																'js/app/modules/monitor/services/TransactionTrackingService.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											})
									.state(
											'/view-transaction-tracking-message',
											{
												url : '/view-transaction-tracking-message',
												controller : 'ViewTransactionTrackingMessageController',
												controllerAs : 'ctrl',
												templateUrl : '/view-transaction-tracking-message',
												params : {
													params : []
												},
												resolve : WebHelper
														.loadScript([
																'js/app/modules/monitor/controllers/ViewTransactionTrackingMessageController.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											})
									.state(
											'/batch-job-tracking',
											{
												url : '/batch-job-tracking',
												controller : 'BatchJobTrackingController',
												controllerAs : 'ctrl',
												templateUrl : '/batch-job-tracking',
												params : {
													params : [],
													customerModel : null
												},
												resolve : WebHelper
														.loadScript([
																'js/app/modules/monitor/controllers/BatchJobTrackingController.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											});

						} ]);