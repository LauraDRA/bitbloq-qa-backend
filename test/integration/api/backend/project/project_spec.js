'use strict';
var chakram = require('chakram'),
    expect = chakram.expect,
    RequestProject = require('../../commons/requestProject.js'),
    requestProject = new RequestProject(),
    RequestUser = require('../../commons/requestUser.js'),
    requestUser = new RequestUser(),
    User = require('../user/user.js'),
    user = new User(),
    Project = require('./project.js'),
    project = new Project(),
    ObjectID = require('mongodb').ObjectID,
    config = require('../../../../config/config.json');

describe('Project test', function() {

//GET /  get project published

    it('bbb-552:Get project published - all params', function() {
        return requestProject.getPublishProject('?count=*&page=0&query=%7B%22hardwareTags%22:%7B%22$all%22:%5B%22us%22%5D%7D%7D').then(function(response) {
            expect(response).to.have.status(200);
            expect(response).not.have.to.json([]);
            return chakram.wait();
        });
    });

    it.skip('bbb-553:Get project published - without params', function() {
        return requestProject.getPublishProject('').then(function(response) {
            expect(response).to.have.status(400);
            return chakram.wait();
        });
    });

    it.skip('bbb-554:Get project published - invalid params', function() {
        return requestProject.getPublishProject('?p=0').then(function(response) {
            expect(response).to.have.status(400);
            return requestProject.getPublishProject('?cont=*').then(function(response2) {
                expect(response2).to.have.status(400);
                return requestProject.get('?qery=%7B%22hardwareTags%22:%7B%22$all%22:%5B%22us%22%5D%7D%7D').then(function(response3) {
                    expect(response3).to.have.status(400);
                    return chakram.wait();
                });
            });
        });
    });

    it('bbb-555:Get project published - one params', function() {
        return requestProject.getPublishProject('?page=1').then(function(response1) {
            expect(response1).to.have.status(200);
            expect(response1).not.have.to.json([]);
            return requestProject.getPublishProject('?count=*').then(function(response2) {
                expect(response2).to.have.status(200);
                expect(response2).have.to.json('count', function(number) {
                    expect(number).to.be.at.least(0);
                });
                return requestProject.getPublishProject('?query=%7B%22hardwareTags%22:%7B%22$all%22:%5B%22us%22%5D%7D%7D',200).then(function(response3) {
                    expect(response3).to.have.status(200);
                    expect(response3).not.have.to.json([]);
                    return chakram.wait();
                });
            });
        });
    });

//GET /project/me

    it('bbb-556:Get projects of a user', function() {
        var userRandom = user.generateRandomUser();
        return requestUser.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            var project1 = project.generateProjectRandom();
            var project2 = project.generateProjectRandom();
            return requestProject.createProject(project1,response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                return requestProject.createProject(project2,response.body.token).then(function(response3) {
                    expect(response3).to.have.status(200);
                    return requestProject.getProjectUser('?page=0&pageSize=1',response.body.token).then(function(response4) {
                        expect(response4).to.have.status(200);
                        expect(response4).have.to.json(function(json) {
                            expect(json.length).to.be.equal(1);
                        });
                        return requestProject.getProjectUser('?pageSize=5',response.body.token).then(function(response5) {
                            expect(response5).to.have.status(200);
                            expect(response5).have.to.json(function(json) {
                                expect(json.length).to.be.equal(2);
                            });
                            return chakram.wait();
                        });
                    });
                });
            });
        });
    });

    it.skip('bbb-557:Get projects of a user - without mandatory params', function() {
        var userRandom = user.generateRandomUser();
        return requestUser.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            return requestProject.getProjectUser('?page=0',response.body.token).then(function(response2) {
                expect(response2).to.have.status(400);
                return requestProject.getProjectUser('',response.body.token).then(function(response3) {
                    expect(response3).to.have.status(400);
                    return chakram.wait();
                });
            });
        });
    });

    it('bbb-558:Get projects of a user - token is incorrect', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        return requestProject.getProjectUser('',token).then(function(response1) {
            expect(response1).to.have.status(401);
            return requestProject.getProjectUser('?page=0',token).then(function(response2) {
                expect(response2).to.have.status(401);
                return requestProject.getProjectUser('?pageSize=1',token).then(function(response3) {
                    expect(response3).to.have.status(401);
                    return requestProject.getProjectUser('?page=0&pageSize=1',token).then(function(response4) {
                          expect(response4).to.have.status(401);
                        return chakram.wait();
                    });
                });
            });
        });
    });

//GET /project/shared

    it('bbb-559:Get shared projects of a user', function() {
        return requestUser.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            return requestProject.getProjectSharedUser('?pageSize=1',response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                expect(response2).have.to.json(function(json) {
                    expect(json.length).to.be.equal(1);
                });
                return requestProject.getProjectSharedUser('?page=0&pageSize=3',response.body.token).then(function(response3) {
                    expect(response3).to.have.status(200);
                    expect(response3).have.to.json(function(json) {
                        expect(json.length).to.be.equal(3);
                    });
                });
            });
        });
    });

    it('bbb-560:Get shared projects of a user - token is incorrect', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        return requestProject.getProjectSharedUser('',token).then(function(response) {
            expect(response).to.have.status(401);
            return requestProject.getProjectSharedUser('?page=0',token).then(function(response2) {
                expect(response2).to.have.status(401);
                return requestProject.getProjectSharedUser('?pageSize=1',token).then(function(response3) {
                    expect(response3).to.have.status(401);
                    return requestProject.getProjectSharedUser('?page=0&pageSize=1',token).then(function(response4) {
                        expect(response4).to.have.status(401);
                        return chakram.wait();
                    });
                });
            });
        });
    });

    it.skip('bbb-561:Get shared projects of a user - without mandatory params', function() {
        return requestUser.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            return requestProject.getProjectSharedUser('?page=0',response.body.token).then(function(response2) {
                expect(response2).to.have.status(400);
                return requestProject.getProjectSharedUser('',response.body.token).then(function(response3) {
                    expect(response3).to.have.status(400);
                    return chakram.wait();
                });
            });
        });
    });

//GET /project/:id

    it('bbb-562:Get a project', function() {
        var userRandom = user.generateRandomUser();
        return requestUser.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            var project1 = project.generateProjectRandom();
            return requestProject.createProject(project1,response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                return requestProject.getProjectById(response2.body,response.body.token).then(function(response3) {
                    expect(response3).to.have.status(200);
                    expect(response3).not.have.to.json({});
                    chakram.wait();
                });
            });
        });
    });

    it('bbb-563:Get a project - the project no exist', function() {
        var idRandom = new ObjectID();
        var userRandom = user.generateRandomUser();
        return requestUser.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            return requestProject.getProjectById(idRandom,response.body.token).then(function(response2) {
                expect(response2).to.have.status(404);
                chakram.wait();
            });
        });
    });

    it('bbb-564:Get a project - invalid token', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        var userRandom = user.generateRandomUser();
        return requestUser.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            var project1 = project.generateProjectRandom();
            return requestProject.createProject(project1,response.body.token).then(function(response2) {
                expect(response).to.have.status(200);
                return requestProject.getProjectById(response2.body,token).then(function(response3) {
                    expect(response3).to.have.status(401);
                    chakram.wait();
                });
            });
        });
    });
});
