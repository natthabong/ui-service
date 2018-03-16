'use strict';
angular
		.module('gecscf.documentUploadLog', [ 'ui.router', 'gecscf.ui' ])
		.config(
				[
						'$stateProvider',
						function($stateProvider) {

							$stateProvider
									.state(
											'/my-organize/document-upload-log',
											{
												url : '/my-organize/document-upload-log',
												controller : 'DocumentUploadLogController',
												controllerAs : 'ctrl',
												params : {
													viewMode : 'MY_ORGANIZE',
													criteria : null,
													backAction : false
												},
												templateUrl : '/document-upload-log',
												resolve : WebHelper
														.loadScript([
																'js/app/modules/document-upload-log/controllers/DocumentUploadLogController.js',
																'js/app/modules/document-upload-log/services/DocumentUploadLogService.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											})
									.state(
											'/customer-organize/upload-document-logs',
											{
												url : '/customer-organize/upload-document-logs',
												controller : 'DocumentUploadLogController',
												controllerAs : 'ctrl',
												params : {
													viewMode : 'FUNDING',
													criteria : null,
													organize : null,
													backAction : false
												},
												templateUrl : '/document-upload-log/funding',
												resolve : WebHelper
														.loadScript([
																'js/app/modules/document-upload-log/controllers/DocumentUploadLogController.js',
																'js/app/modules/document-upload-log/services/DocumentUploadLogService.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											})
									.state(
											'/customer-organize/upload-document-logs/all-funding',
											{
												url : '/customer-organize/upload-document-logs/all-funding',
												controller : 'DocumentUploadLogController',
												controllerAs : 'ctrl',
												params : {
													viewMode : 'ALLFUNDING',
													criteria : null,
													organize : null,
													backAction : false
												},
												templateUrl : '/document-upload-log/funding',
												resolve : WebHelper
														.loadScript([
																'js/app/modules/document-upload-log/controllers/DocumentUploadLogController.js',
																'js/app/modules/document-upload-log/services/DocumentUploadLogService.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											});

						} ]);