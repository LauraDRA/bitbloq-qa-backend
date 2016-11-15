'use strict';
var chakram = require('chakram'),
//    expect = chakram.expect;

    Request = require('../../commons/request.js'),
    request = new Request();


describe('Project test', function() {

//GET /  get project published

    it.skip('Get project published - all params', function() {
        return request.get('/project?count=*',200).then(function() {
            return chakram.wait();
        });
    });

    it.skip('Get project published - without params', function() {
        return request.get('/project',400).then(function() {
            return chakram.wait();
        });
    });

    it.skip('Get project published - one params', function() {
        return request.get('/project',400).then(function() {
            return chakram.wait();
        });
    });
});
