'use strict';


module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
				options: {
						jshintrc: '.jshintrc',
						reporter: require('jshint-stylish')
				},
				all: {
						src: [
								'Gruntfile.js',
								'test/'
						]
				}
		},
		clean: {
				target: 'mochawesome-reports/*'
		},
		simplemocha: {
			all: { options: {
							fullTrace: true,
							timeout: 60000,
							reporter: 'mochawesome',
							reporterOptions: {
								reportName: 'mochawesome-all',
							}
						},
						src: ['test/**/*.js']},
			user: { options: {
							timeout: 60000,
							reporter: 'mochawesome',
							fullTrace: true,
							reporterOptions: {
								reportName: 'mochawesome-user',
							}
						},
						src: ['test/integration/api/backend/user/*.js']},
			project: { options: {
								timeout: 60000,
								reporter: 'mochawesome',
								fullTrace: true,
								reporterOptions: {
									reportName: 'mochawesome-project',
								}
							},
							src: ['test/integration/api/backend/project/*.js']},
			compile: { options: {
								timeout: 60000,
								reporter: 'mochawesome',
								fullTrace: true,
								reporterOptions: {
									reportName: 'mochawesome-compile',
								}
							},
							src: ['test/integration/api/compiler/compile/*.js']}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-simple-mocha');

	grunt.registerTask('test', 'Protractor e2e funcional test (Selenium) task.', function() {
		var env = grunt.option('env') || 'local',
		 		suite = grunt.option('suite') || 'all',
				tasks = ['jshint'];

		tasks.push('clean:target');
		if (env === 'local') {

			if (suite === 'all') {
				tasks.push('simplemocha:user');
				tasks.push('simplemocha:project');
			} else {
				if (suite === 'compile') {
					console.error('Compile can not execute in local environment');
				} else {
					tasks.push('simplemocha:'+suite);
				}
			}
		}
		if (env === 'qa') {
			tasks.push('simplemocha:'+suite);
		}
		if (env === 'next') {
			tasks.push('simplemocha:'+suite);
		}

		grunt.task.run(tasks);

	});
};
