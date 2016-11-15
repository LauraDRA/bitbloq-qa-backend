'use strict';
var chakram = require('chakram'),
    expect = chakram.expect,
    argv = require('yargs').argv;

var Request = function() {

    this.config = require('../../../config/config.json');

    this.postBackend =function(path,status,params,headers) {
      return chakram.post(this.config.env[argv.env].backend+path,params,headers).then(function(response) {
         expect(response).to.have.status(status);
         return response;
      });
    };

    this.getBackend =function(path,status,headers) {
      return chakram.get(this.config.env[argv.env].backend+path,headers).then(function(response) {
        expect(response).to.have.status(status);
        return response;
      });
    };

    this.headBackend =function(path,status,params,headers) {
      return chakram.head(this.config.env[argv.env].backend+path,params,headers).then(function(response) {
        expect(response).to.have.status(status);
        return response;
      });
    };

    this.putBackend = function(path,status,params,headers) {
      return chakram.put(this.config.env[argv.env].backend+path,params,headers).then(function(response) {
        expect(response).to.have.status(status);
        return response;
      });
    };

    this.postCompiler =function(path,status,params,headers) {
      return chakram.post(this.config.env[argv.env].compiler+path,params,headers).then(function(response) {
        expect(response).to.have.status(status);
         return response;
      });
    };


};
module.exports = Request;
