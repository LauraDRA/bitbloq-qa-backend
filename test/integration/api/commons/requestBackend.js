'use strict';
var chakram = require('chakram'),
    expect = chakram.expect,
    argv = require('yargs').argv,
    Request = require('./request.js'),
    request = new Request();

var RequestBackend = function() {

    this.config = require('../../../config/config.json');

    this.post =function(path,status,params,headers) {
      return request.post(this.config.env[argv.env].backend+path,params,headers).then(function(response) {
         expect(response).to.have.status(status);
         return response;
      });
    };

    this.get =function(path,status,headers) {
      return request.get(this.config.env[argv.env].backend+path,headers).then(function(response) {
        expect(response).to.have.status(status);
        return response;
      });
    };

    this.head =function(path,status,params,headers) {
      return request.head(this.config.env[argv.env].backend+path,params,headers).then(function(response) {
        expect(response).to.have.status(status);
        return response;
      });
    };

    this.put = function(path,status,params,headers) {
      return request.put(this.config.env[argv.env].backend+path,params,headers).then(function(response) {
        expect(response).to.have.status(status);
        return response;
      });
    };

};
module.exports = RequestBackend;
