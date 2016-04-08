module.exports = function(grunt) {
	
    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! GECSCF <%= grunt.template.today("yyyy-mm-dd")%> */\n',
				exceptionsFiles: [ 'myExceptionsFile.json' ]
            },
            core: {
            	files: [{
					'src/main/resources/static/js/app/loans/create-loan.min.js': 'src/main/resources/static/js/app/loans/create-loan.js',
					'src/main/resources/static/js/app/authen/auth.min.js': 'src/main/resources/static/js/app/authen/auth.js',
					'src/main/resources/static/js/app/authen/authentication.min.js': 'src/main/resources/static/js/app/authen/authentication.js',
					'src/main/resources/static/js/app/gecscf.min.js': 'src/main/resources/static/js/app/gecscf.js',
					'src/main/resources/static/js/app/navigation.min.js':'src/main/resources/static/js/app/navigation.js',
					'src/main/resources/static/js/app/scf-app.min.js': 'src/main/resources/static/js/app/scf-app.js'
				}]
            }
        },
    });
	
	//Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');	
	//Default task(s)
	grunt.registerTask('default', ['uglify']);
};