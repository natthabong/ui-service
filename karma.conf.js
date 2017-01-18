module.exports = function(config){
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		browsers : ['Chrome'],
		files: [
			
			'src/main/resources/static/js/test/libs/jquery-3.1.1.js',
			'src/main/resources/static/js/test/libs/angular.js',
			'src/main/resources/static/js/test/libs/angular-mocks.js',
			'src/main/resources/static/js/test/libs/angular-cookies.js',
			'src/main/resources/static/js/test/libs/angular-translate.js',
			'src/main/resources/static/js/test/libs/angular-translate-loader-partial.js',
			'src/main/resources/static/js/test/libs/angular-ui-router.js',
			'src/main/resources/static/js/test/libs/checklist-model.js',
			'src/main/resources/static/js/test/libs/ocLazyLoad.js',
			'src/main/resources/static/js/test/libs/Chart.js',
			'src/main/resources/static/js/test/libs/angular-chart.js',
			'src/main/resources/static/js/app/common/ui-bootstrap-tpls-1.1.0.js',
			
			'src/main/resources/static/js/app/authen/authentication.js',
			'src/main/resources/static/js/app/components/scfjs.js',
			'src/main/resources/static/js/plugins/*',
			'src/main/resources/static/js/plugins/analytic/*',
			'src/main/resources/static/js/app/scf-app.js',
			
			'src/main/resources/static/js/app/common/scf-common-service.js',

			'src/main/resources/static/js/test/common/scf-common-service-splitepage-test.js',
            'src/main/resources/static/js/test/common/scf-common-service-clientpaging-test.js',
            'src/main/resources/static/js/test/common/scf-common-service-page-navigation-test.js',
			'src/main/resources/static/js/test/common/scf-common-service-shorten-large-number-test.js',
            'src/main/resources/static/js/test/common/scf-common-service-formula-document-date-rule-type-filter-test.js',
            'src/main/resources/static/js/test/common/scf-common-service-formula-payment-date-formula-filter-test.js',
            'src/main/resources/static/js/test/common/scf-common-service-formula-payment-period-filter-test.js'
		]
	});
};