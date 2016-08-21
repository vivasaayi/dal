module.exports = function (grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        csslint: {
            strict: {
                options: {
                    import: 2
                },
                src: ['public/css/*.css']
            },
            lax: {
                options: {
                    import: false
                },
                src: ['path/to/**/*.css']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'public/**/*.js', 'app/**/*.js', '!node_modules/**', '!public/assets/**']
        },
        jasmine_node: {
            options: {
                specFolders: [],
                projectRoot: '', 
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'unitspec'
            },
            all: ['unitspec/']
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');
    
    // Default task(s).
    grunt.registerTask('default', ['csslint', 'jshint', 'jasmine_node']);

};