'use strict';

module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);

    // configuration paths for resources
    var conf = {
        bowr: 'bower_components',
        node: 'node_modules',
        css: 'findr/static/styles',
        js: 'findr/static/scripts'
    };

    grunt.initConfig({
        // project settings
        p: conf,

        // copies third-party resources to appr. directory
        copy: {
            dist: {
                files: [{
                    expand: true, cwd: '<%= p.bowr %>/angular/', src: 'angular.js', dest: '<%= p.js %>/libs/'}, {
                    expand: true, cwd: '<%= p.bowr %>/angular-route/', src: 'angular-route.min.js', dest: '<%= p.js %>/libs/'}, {
                    expand: true, cwd: '<%= p.bowr %>/angular-mocks/', src: 'angular-mocks.js', dest: '<%= p.js %>/libs/'}, {
                    expand: true, cwd: '<%= p.bowr %>/jquery/dist/', src: 'jquery.min.js', dest: '<%= p.js %>/libs/'}
                ]
            }
        }
    });

    grunt.registerTask('default', ['copy']);
};