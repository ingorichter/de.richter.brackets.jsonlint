/*jshint camelcase: false, globalstrict: true*/

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    "use strict";
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var extensionConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        extensionConfig: extensionConfig,
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= extensionConfig.dist %>/*',
                        '!<%= extensionConfig.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= extensionConfig.app %>/main.js',
                'test/spec/{,*/}*.js',
                'unittests.js'
            ]
        },
        compress: {
            dist: {
                options: {
                    archive: '<%= extensionConfig.dist %>/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['main.js', 'package.json', 'README.md', 'thirdparty/**'],
                    dest: ''
                }]
            }
        }
    });

    // load required tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('time-grunt');

    grunt.registerTask('test', [
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'compress'
    ]);

    grunt.registerTask('default', [
        'jshint',
//        'test',
        'build'
    ]);
};
