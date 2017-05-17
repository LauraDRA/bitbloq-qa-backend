'use strict';
var argv = require('yargs').argv,
    Request = require('./request.js'),
    request = new Request();

var RequestUser = function() {

    this.config = require('../../../config/config.json');

    this.getPublishProject = function(params) {
        return request.get(this.config.env[argv.env].backend+'/project'+params).then(function(response) {
            return response;
        });
    };

    this.getProjectUser = function(params,token) {
        return request.get(this.config.env[argv.env].backend+'/project/me'+params,{headers:{'Authorization':'Bearer '+token}}).then(function(response) {
            return response;
        });
    };

    this.createProject = function(project,token) {
        return request.post(this.config.env[argv.env].backend+'/project',project,{headers:{'Authorization':'Bearer '+token}}).then(function(response) {
            return response;
        });
    };

    this.getProjectSharedUser = function(params,token) {
        return request.get(this.config.env[argv.env].backend+'/project/shared'+params,{headers:{'Authorization':'Bearer '+token}}).then(function(response) {
            return response;
        });
    };

    this.getProjectById = function(id,token) {
        return request.get(this.config.env[argv.env].backend+'/project/'+id,{headers:{'Authorization':'Bearer '+token}}).then(function(response) {
            return response;
        });
    };

};
module.exports = RequestUser;
