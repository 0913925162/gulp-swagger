var fs = require('fs');
var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var swaggerParser = require('swagger-parser');
var swaggerTools = require('swagger-tools').specs.v2; // Validate using the latest Swagger 2.x specification
var PLUGIN_NAME = 'gulp-swagger';

module.exports = function gulpSwagger (filename, options) {
	// Allow for passing the `filename` as part of the options.
	if (typeof filename === 'object') {
		options = filename;
		filename = options.filename;
	}

	// File name is mandatory (otherwise gulp won't be able to write the file properly)
	if (!filename) {
		throw new gutil.PluginError(PLUGIN_NAME, 'A file name is required');
	}

	return through.obj(function throughObj (file, encoding, callback) {
		var _this = this;

		if ( file.isStream() ) {
			throw new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported');
		}

		// Load swagger main file resolving *only* external $refs and validate schema (1st pass).
		// We keep internal $refs intact for more accurate results in 2nd validation pass bellow.
		swaggerParser.dereference(file.history[0], {
			$refs: { internal: false }
		}, function parseSchema (error, swaggerObject) {
			if ( error ) {
				callback(new gutil.PluginError(PLUGIN_NAME, error));
				return;
			}

			// Re-Validate resulting schema using different project (2nd pass), the
			// reason being that this validator gives different (and more accurate) resutls.
			swaggerTools.validate(swaggerObject, function validateSchema (err, result) {
				if (err) {
					callback(new gutil.PluginError(PLUGIN_NAME, err));
					return;
				}

				if ( typeof result !== 'undefined' ) {
					if ( result.errors.length > 0 ) {
						gutil.log(
							gutil.colors.red([
								'',
								'',
								'Swagger Schema Errors (' + result.errors.length + ')',
								'--------------------------',
								result.errors.map(function (err) {
									return '#/' + err.path.join('/') + ': ' + err.message +
										'\n' +
										JSON.stringify(err) +
										'\n';
								}).join('\n'),
								''
							].join('\n')),
							''
						);
					}

					if ( result.warnings.length > 0 ) {
						gutil.log(
							gutil.colors.yellow([
								'',
								'',
								'Swagger Schema Warnings (' + result.warnings.length + ')',
								'------------------------',
								result.warnings.map(function (warn) {
									return '#/' + warn.path.join('/') + ': ' + warn.message +
										'\n' +
										JSON.stringify(warn) +
										'\n';
								}).join('\n'),
								''
							].join('\n')),
							''
						);
					}

					if ( result.errors.length > 0 ) {
						callback(new gutil.PluginError(PLUGIN_NAME, 'The Swagger schema is invalid'));
						return;
					}
				}

				var fileBuffer = JSON.stringify(swaggerObject);


				// Return processed file to gulp
				_this.push(new gutil.File({
					cwd: file.cwd,
					base: file.base,
					path: path.join(file.base, filename),
					contents: new Buffer(fileBuffer)
				}));

				callback();
			}); // swaggerTools.validate
		}); // swaggerParser.dereference (external $refs)
	}); // return through.obj
};
