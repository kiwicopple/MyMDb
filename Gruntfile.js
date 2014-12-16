// The MIT License (MIT)

// Copyright (c) 2014 Paul Copplestone

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE. 

module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {   
			js: {
				src: [
					// ensure that all files are in the correct order
					'src/js/vendor/jquery-1.11.1.min.js',  
					'src/js/vendor/bootstrap.min.js',  
					'src/js/vendor/handlebars-v2.0.0.js',    
					'src/js/vendor/jquery.hideseek.min.js',  
					'src/js/vendor/moment.js',  
					'src/js/guessTheShow.js',  
					'src/js/movieManager.js',  
					'src/js/main.js',  
				],
				dest: 'src/js/production.js',
			},
		},
		
		cssmin: {
			combine: {
				files: {
					'src/css/production.min.css': [
						// ensure that all files are in the correct order
						'src/css/bootstrap.min.css',  
						'src/css/bootstrap-theme.min.css',  
						'src/css/main.css', 
					]
				}
			}
		},
		
		uglify: {
			build: {
				src: 'src/js/production.js',
				dest: 'src/js/production.min.js'
			}
		},
		
		copy: {
			prod: {
				files: [
					{ src:"src/index.html", dest:"dist/index.html" },
					{ src:"src/404.html", dest:"dist/404.html" },
					{ src:"src/favicon.ico", dest:"dist/favicon.ico" },
					{ src:"src/js/production.min.js", dest:"dist/js/production.min.js" },
					{ src:"src/js/vendor/modernizr-2.6.2-respond-1.1.0.min.js", dest:"dist/js/vendor/modernizr-2.6.2-respond-1.1.0.min.js" },
					{ src:"src/css/production.min.css", dest:"dist/css/production.min.css" },
					{
						cwd: 'src/fonts',  		// set working folder / root to copy
						src: '**/*',           	// copy all files and subfolders
						dest: 'dist/fonts',    	// destination folder
						expand: true           	// required when using cwd
					},
				]
			},
		},
				
		processhtml: {
			build: {
				files: {
					'dist/index.html' : ['dist/index.html'],
				}
			}
		},
		
		watch: {
			scripts: {
				files: ['src/js/*.js', 'src/css/main.css'],
				tasks: ['concat', 'cssmin', 'uglify'],
				options: {
					spawn: false,
				},
			} 
		},

    });

    // 3. Where we tell Grunt we plan to use the plug-ins.
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-copy');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', []);
    grunt.registerTask('prod', ['concat', 'cssmin', 'uglify', 'copy', 'processhtml']);

};