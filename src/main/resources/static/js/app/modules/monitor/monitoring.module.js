'use strict';
angular
		.module('gecscf.monitoring', [ 'ui.router', 'gecscf.ui' ])
		.config(
				[
						'$stateProvider',
						function($stateProvider) {

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
														.loadScript([
																'js/app/modules/monitor/controllers/bank-system-integration-monitor-controller.js',
																'js/app/modules/monitor/controllers/web-service-monitor-controller.js',
																'js/app/modules/monitor/controllers/ftp-monitor-controller.js',
																'js/app/modules/monitor/controllers/batch-job-monitor-controller.js',
																'js/app/modules/monitor/services/batch-job-monitor-service.js',
																'js/app/modules/monitor/services/system-integration-monitor-service.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											})
									.state(
											'/monitoring/customer-system-integration',
											{
												url : '/monitoring/customer-system-integration',
												controller : 'CustomerSystemIntegrationMonitorController',
												controllerAs : 'ctrl',
												templateUrl : '/system-integration-monitor/sponsor',
												params : {
													params : []
												},
												resolve : WebHelper
														.loadScript([
																'js/app/modules/monitor/controllers/customer-system-integration-monitor-controller.js',
																'js/app/modules/monitor/controllers/web-service-monitor-controller.js',
																'js/app/modules/monitor/controllers/ftp-monitor-controller.js',
																'js/app/modules/monitor/controllers/batch-job-monitor-controller.js',
																'js/app/modules/monitor/services/batch-job-monitor-service.js',
																'js/app/modules/monitor/services/system-integration-monitor-service.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
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
														.loadScript([
																'js/app/modules/monitor/controllers/my-system-integration-monitor-controller.js',
																'js/app/modules/monitor/controllers/web-service-monitor-controller.js',
																'js/app/modules/monitor/controllers/ftp-monitor-controller.js',
																'js/app/modules/monitor/controllers/batch-job-monitor-controller.js',
																'js/app/modules/monitor/services/batch-job-monitor-service.js',
																'js/app/modules/monitor/services/system-integration-monitor-service.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
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
																'js/app/modules/monitor/controllers/transaction-tracking-controller.js',
																'js/app/modules/monitor/services/transaction-tracking-service.js',
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
																'js/app/modules/monitor/controllers/view-transaction-tracking-message-controller.js',
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
													params : []
												},
												resolve : WebHelper
														.loadScript([
																'js/app/modules/monitor/controllers/batch-job-tracking-controller.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											})
									.state(
											'/view-batch-job-tracking-message',
											{
												url : '/view-batch-job-tracking-message',
												controller : 'ViewBatchJobTrackingMessageController',
												controllerAs : 'ctrl',
												templateUrl : '/view-batch-job-tracking-message',
												params : {
													params : []
												},
												resolve : WebHelper
														.loadScript([
																'js/app/modules/monitor/controllers/view-batch-job-tracking-message-controller.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											});

						} ]);