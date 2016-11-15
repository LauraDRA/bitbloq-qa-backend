'use strict';
var chakram = require('chakram'),
    expect = chakram.expect,
    Request = require('../../commons/request.js'),
    request = new Request(),
    User = require('../user/user.js'),
    user = new User();


describe('Project test', function() {

//GET /  get project published

    it('Get project published - all params', function() {
        return request.getBackend('/project?count=*&page=0&query=%7B%22hardwareTags%22:%7B%22$all%22:%5B%22us%22%5D%7D%7D',200).then(function(response) {
            expect(response).not.have.to.json([]);
            return chakram.wait();
        });
    });

    it.skip('Get project published - without params', function() {
        return request.getBackend('/project',400).then(function() {
            return chakram.wait();
        });
    });

    it.skip('Get project published - invalid params', function() {
        return request.getBackend('/project?p=0',400).then(function() {
            return request.getBackend('/project?cont=*',400).then(function() {
                return request.getBackend('/project?qery=%7B%22hardwareTags%22:%7B%22$all%22:%5B%22us%22%5D%7D%7D',400).then(function() {
                    return chakram.wait();
                });
            });
        });
    });

    it('Get project published - one params', function() {
        return request.getBackend('/project?page=1',200).then(function(response1) {
            expect(response1).not.have.to.json([]);
            return request.getBackend('/project?count=1',200).then(function(response2) {
                expect(response2).not.have.to.json([]);
                return request.getBackend('/project?query=%7B%22hardwareTags%22:%7B%22$all%22:%5B%22us%22%5D%7D%7D',200).then(function(response3) {
                    expect(response3).not.have.to.json([]);
                    return chakram.wait();
                });
            });
        });
    });

//GET /project/me

    it('Get projects of a user', function() {
        var userRandom = user.generateRandomUser();
        return request.postBackend('/user',200,userRandom).then(function(response) {
            return request.getBackend('/project/me?page=0&pageSize=1',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                return request.getBackend('/project/me?pageSize=1',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                    return chakram.wait();
                });
            });
        });
    });

    it.skip('Get projects of a user - without mandatory params', function() {
        var userRandom = user.generateRandomUser();
        return request.postBackend('/user',200,userRandom).then(function(response) {
            return request.getBackend('/project/me?page=0',400,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                return request.getBackend('/project/me',400,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                    return chakram.wait();
                });
            });
        });
    });
});
