'use strict';
var chakram = require('chakram'),
    expect = chakram.expect,
    argv = require('yargs').argv,
    Request = require('./request.js'),
    request = new Request();

var RequestCompiler = function() {

    this.config = require('../../../config/config.json');

    this.post =function(path,status,params,headers) {
      return request.post(this.config.env[argv.env].compiler+path,params,headers).then(function(response) {
        expect(response).to.have.status(status);
        return response;
      });
    };

};
module.exports = RequestCompiler;
