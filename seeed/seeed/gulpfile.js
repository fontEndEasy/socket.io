var gulp = require('gulp');
var concat = require('gulp-concat');                            //- 多个文件合并为一个；
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');

gulp.task('concat', function() {
    gulp.src('css/**/*.css')
        .pipe(concat('wap.min.css'))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest('build/dest/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/dest/rev'));
});
