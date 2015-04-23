# gulp-swagger v0.0.1
--------------------------
[![Build Status](https://travis-ci.org/gersongoulart/gulp-swagger.png)](https://travis-ci.org/gersongoulart/gulp-swagger)

<!--
[![Build Status](https://img.shields.io/travis/gersongoulart/gulp-swagger.svg)](https://travis-ci.org/gersongoulart/gulp-swagger)
[![Dependencies](https://img.shields.io/david/bigstickcarpet/swagger-parser.svg)](https://david-dm.org/bigstickcarpet/swagger-parser)
[![Code Climate Score](https://img.shields.io/codeclimate/github/gersongoulart/gulp-swagger.svg)](https://codeclimate.com/github/gersongoulart/gulp-swagger)
[![Codacy Score](http://img.shields.io/codacy/6d686f916836433b9c013379fbe1052c.svg)](https://www.codacy.com/public/jamesmessinger/swagger-parser)
[![Coverage Status](https://img.shields.io/coveralls/gersongoulart/gulp-swagger.svg)](https://coveralls.io/r/gersongoulart/gulp-swagger)

[![Downloads](https://img.shields.io/npm/dm/swagger-parser.svg)](https://www.npmjs.com/package/swagger-parser)
[![npm](http://img.shields.io/npm/v/swagger-parser.svg)](https://www.npmjs.com/package/swagger-parser)
[![Bower](http://img.shields.io/bower/v/swagger-parser.svg)](#bower)
[![License](https://img.shields.io/npm/l/swagger-parser.svg)](LICENSE)
-->

| | |
| ----------- | ------------ |
| Package     | gulp-swagger |
| Description | [Gulp][gulp] plugin that parses [Swagger][swagger] specs in JSON or YAML format, validates against the official [Swagger 2.0 schema][swagger2spec], dereferences all $ref pointers, including pointers to external files and generates client-side API code. |
| Node Version | >= 0.8 |

Install
--------------------------

```js
npm install gulp-swagger
```

Usage
--------------------------

Output fully parsed schema:

```js
var gulp = require('gulp');
var swagger = require('gulp-swagger');

gulp.task('schema', function() {
    gulp.src('./src/api/index.yaml')
        .pipe(swagger('schema.json'))
        .pipe(gulp.dest('./build'));
});

gulp.task('default', ['schema']);
```

Generate client-side API based on schema:

```js
var gulp = require('gulp');
var swagger = require('gulp-swagger');

gulp.task('api', function() {
    gulp.src('./src/api/index.yaml')
        .pipe(swagger({
            filename: 'api.js',
            codegen: {
                template: {
                    class: './src/templates/api-class.mustache',
                    method: './src/templates/api-method.mustache',
                    request: './src/templates/api-request.mustache'
                }
            }
        }))
        .pipe(gulp.dest('./api'));
});

gulp.task('default', ['api']);

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch('./src/api/*.yaml', ['api']);
});
```

See Also
--------------------------

- [Gulp][gulp]
- [Swagger][swagger]
- [Swagger-Parser][swagger-parser]
- [Swagger to JS Codegen][swagger-js-codegen]

Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes. [File an issue](https://github.com/gersongoulart/gulp-swagger/issues) on GitHub and [submit a pull request](https://github.com/gersongoulart/gulp-swagger/pulls).

License
--------------------------
Gulp-Swagger is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.

[gulp]: http://github.com/gulpjs/gulp
[swagger]: http://swagger.io
[swagger2spec]: https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
[swagger-parser]: https://github.com/gersongoulart/gulp-swagger
[swagger-js-codegen]: https://github.com/wcandillon/swagger-js-codegen
