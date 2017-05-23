'use strict';
var argv = require('yargs').argv,
    Request = require('./request.js'),
    request = new Request();

var RequestCompiler = function() {

    this.config = require('../../../config/config.json');

    this.compiler =function(params) {
      return request.post(this.config.env[argv.env].compiler+'/compile',params);
    };

};
module.exports = RequestCompiler;
