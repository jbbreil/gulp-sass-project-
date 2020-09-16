const { src, dest, watch, series, parallel } = require('gulp');// Access gulp via the methods 
const sass = require('gulp-sass'); 
sass.compiler = require('node-sass'); // Compile the files
var concat = require('gulp-concat'); // It is mainly used to concatenate files
var cleanCSS = require('gulp-clean-css'); // Process CSS files to minimize size.
var uglify = require('gulp-uglify-es').default; // Minimizes the size of Javascript´ files.
const htmlmin = require('gulp-htmlmin'); // Minimizes the size of html´ files.

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// Create Files´paths object
const files = {
    htmlPath: 'src/**/*.html', // matchar alla filer som slutar med .html i rotmappen och eventuella underkataloger.
    cssPath: 'src/**/*.css',
    jsPath: 'src/**/*.js',
    sassPath: 'src/**/*.scss',
}

// Copy HTML´S files 
function htmlFiles () {
    return src(files.htmlPath) // Tells the Gulp task what files to use for the task
    .pipe(htmlmin({ collapseWhitespace: true, removeComments:true })) // Minimize files´size by removing whitespace and commets
    .pipe(dest('pub')) // Tells Gulp where to output the files once the task is completed
    .pipe(browserSync.stream()); // Synchronize files´changes to all browser
    }

// Concat and compress JAVASCRIPT´S files
function jsFiles () {
    return src(files.jsPath) // Tells the Gulp task what files to use for the task
    .pipe(concat('main.js')) // Concat all js-files into the main.js
    .pipe(uglify()) // Minimizes the size of Javascript´ files by removing whitespace and commets
    .pipe(dest('pub/JS-resultatfil')) // Save those files into pub-directory
    .pipe(browserSync.stream()); // Synchronize files´changes to all browser
    }

// Concat and compress CSS´ files
function cssFiles () {
    return src(files.cssPath) // Tells the Gulp task what files to use for the task
    .pipe(concat('style.css')) // Concat all js-files into the main.js
    .pipe(cleanCSS()) // Minimizes the size of CSS' files by removing whitespace and commets
    .pipe(dest('pub/CSS-resultatfil')) // Save those files into pub-subdirectory
    .pipe(browserSync.stream()); // Synchronize files´changes to all browser
    }

// Concat and compress SASS´ files
function sassFiles () {
    return src(files.sassPath) // Tells the Gulp task what files to use for the task
    .pipe(concat('style.scss')) // Concat all js-files into the main.js
    .pipe(dest('pub/SASS-resultatfil')) // Save those files into pub-directory
    .pipe(browserSync.stream()); // Synchronize files´changes to all browser
    }

// Watch Task browser reload
function watchTask () {
    browserSync.init({
        server: {
            baseDir: "pub/"
        }
    });
    // Look after files´changes 
    watch([files.htmlPath, files.jsPath, files.cssPath, files.sassPath], parallel(htmlFiles, jsFiles, cssFiles, sassFiles)).on("change", reload); 
    }


// Export private tasks
exports.default = series(
    parallel(htmlFiles, jsFiles, cssFiles, sassFiles), // Runs all tasks simultaneously
    watchTask // Look after changes in the tasks´s files
);



