var gulp = require('gulp');
var del = require('del');
var args = require('yargs').argv;
var assemblyInfo = require('gulp-dotnet-assembly-info');
var msbuild = require('gulp-msbuild');
var nunit = require('gulp-nunit-runner');
var exec = require('gulp-exec');
var gulpSequence = require('gulp-sequence');


var params = {
	buildVersion: args.buildVersion || '1.0.0.0',
	nunitRunner: args.nunitRunner || __dirname + '\\packages\\NUnit.Console.3.0.1\\tools\\nunit3-console.exe',
	nugetPath: args.nugetPath || 'nuget'
}


gulp.task('assemblyInfo', function() {
	return gulp
        .src('**/AssemblyInfo.cs')
        .pipe(assemblyInfo({
        	version: params.buildVersion,
        	fileVersion: params.buildVersion,
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('clean', function () {
	return gulp
        .src('**/*.sln')
        .pipe(msbuild({
        	toolsVersion: 14.0,
        	targets: ['Clean'],
        	errorOnFail: true,
        	stdout: true
        }));
});


gulp.task('build', function () {
	return gulp
        .src('**/*.sln')
        .pipe(msbuild({
        	toolsVersion: 14.0,
        	targets: ['Build'],
        	errorOnFail: true,
        	stdout: true
        }));
});

gulp.task('test', function () {
	return gulp
        .src(['**/bin/**/*Tests.dll'], { read: false })
        .pipe(nunit({
        	teamcity: true,
        	executable: params.nunitRunner
        }));
});

gulp.task('nugetRestore',function() {
	var options = {
		continueOnError: false, // default = false, true means don't emit error event 
		pipeStdout: false, // default = false, true means stdout is written to file.contents 
		nugetPath: params.nugetPath
	};
	var reportOptions = {
		err: true, // default = true, false means don't write err 
		stderr: true, // default = true, false means don't write stderr 
		stdout: true // default = true, false means don't write stdout 
	}

	return gulp.src('**/*.sln')
	  .pipe(exec('<%= options.nugetPath %> restore <%= file.path %>', options))
	  .pipe(exec.reporter(reportOptions));
 
});

gulp.task('default', function () {
	console.log(params.buildVersion);
});

gulp.task('ci', gulpSequence('clean', 'nugetRestore', 'build', 'test') );