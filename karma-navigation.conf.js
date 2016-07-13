module.exports = function(config){
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'target/generated-resources/static/js/angular-bootstrap.js',
			'target/generated-resources/static/js/angular-mock.js',
			'src/main/resources/static/js/app/common/scf-common-service.js',
			
            'src/main/resources/static/js/test/common/scf-common-service-page-navigation-test.js'
			
		]
	});
};