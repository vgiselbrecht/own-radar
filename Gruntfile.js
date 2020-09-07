'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '!Gruntfile.js',
        'public_html/assets/js/**/*.js',
        '!public_html/assets/js/app.min.js',
        '!public_html/assets/js/leaflet.label.js'
      ]
    },
    sass: {
      dist: {
        options: {
          style: 'compressed',
          compass: false,
          sourcemap: true
        },
        files: {
          'public_html/assets/css/main.min.css': [
              'public_html/assets/sass/main.scss'
          ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'public_html/assets/js/app.min.js': [
            'public_html/assets/js/app.js'
          ]
        },
        options: {
          sourceMap: 'public_html/assets/js/app.min.js.map',
          sourceMappingURL: 'public_html/assets/js/app.min.js.map'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      sass: {
        files: [
          'public_html/assets/sass/**/*.scss'
        ],
        tasks: ['sass']
      },
      js: {
        files: [
          'public_html/assets/js/**/*.js',
          '!public_html/assets/js/app.min.js'
        ],
        tasks: ['jshint', 'uglify']
      },
      html: {
        files: [
          '**/*.html'
        ]
      }
    },
    clean: {
      dist: [
        'public_html/assets/css/main.min.css',
        'public_html/assets/js/app.min.js'
      ]
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Register tasks
  grunt.registerTask('default', [
    'clean',
    'sass',
    'uglify'
  ]);
  grunt.registerTask('dev', [
    'watch'
  ]);

};