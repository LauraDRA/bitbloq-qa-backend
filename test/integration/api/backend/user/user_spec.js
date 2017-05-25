'use strict';
var chakram = require('chakram'),
    expect = chakram.expect;

var User = require('./user.js'),
    user = new User(),
    RequestUser = require('../../commons/requestUser.js'),
    request = new RequestUser(),
    ObjectID = require('mongodb').ObjectID,
    config = require('../../../../config/config.json');

describe('User test', function() {

    var id;

//HEAD /:username Check that the username exists in BBDD
    it('bbb:565:The username exists',function(){
        var userRandom = user.generateRandomUser();
        return request.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            return request.checkUsername(userRandom.username).then(function(response2) {
                expect(response2).to.have.status(200);
                expect(response2).to.have.header('exists','true');
                return chakram.wait();
            });
        });
    });

    it('bbb:566:The username doesnt exist',function(){
        return request.checkUsername('userfakedoesntexist').then(function(response) {
            expect(response).to.have.status(204);
            expect(response).to.have.header('exists','false');
            return chakram.wait();
        });

    });

    it('bbb:567:The username has rare characters', function() {
        return request.checkUsername('pruebeci)()&64564¿*').then(function(response) {
            expect(response).to.have.header('exists','false');
            expect(response).to.have.status(204);
            return chakram.wait();
        });
    });

    it('bbb:568:The username is long', function() {
        return request.checkUsername(
        'pruebeci)()&64564¿*aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'+
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'+
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').then(function(response) {
            expect(response).to.have.header('exists','false');
            expect(response).to.have.status(204);
            return chakram.wait();
        });

    });


//HEAD /ban
    it('bbb:569:Ban an user', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            var userRandom = user.generateRandomUser();
            return request.createUser(userRandom).then(function(response2) {
                expect(response2).to.have.status(200);
                return request.getUserInfo(response2.body.token).then(function(response3) {
                    expect(response3).to.have.status(200);
                    return request.banUser(response3.body._id,response.body.token).then(function(response4){
                        expect(response4).to.have.status(200);
                        return request.getUserBanned().then(function(response5) {
                            expect(response4).to.have.status(200);
                            expect(response5.body[response5.body.length-1]._id).to.equal(response3.body._id);
                            id = response3.body._id;
                            return chakram.wait();
                        });
                    });
                });
            });
        });
    });

    it('bbb:570:Ban an user - A banned user', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            return request.banUser(id,response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                return request.getUserBanned().then(function(response3) {
                    expect(response3).to.have.status(200);
                    expect(response3.body[response3.body.length-1]._id).to.equal(id);
                    return chakram.wait();
                });
            });
        });
    });

    it('bbb:571:Ban an user - The user doesnt exist', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            var idRandom = new ObjectID();
            return request.banUser(idRandom,response.body.token).then(function(response2) {
                expect(response2).to.have.status(404);
                return request.getUserBanned().then(function(response4) {
                    expect(response4).to.have.status(200);
                    expect(response4.body[response4.body.length-1]._id).not.to.equal(idRandom);
                    return chakram.wait();
                });
            });
        });
    });

    it('bbb:572:Ban an user - Invalid token', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        var idRandom = new ObjectID();
        return request.banUser(idRandom,token).then(function(response) {
            expect(response).to.have.status(401);
            return chakram.wait();
        });
    });

//HEAD /unban
    it('bbb:573:Unban an user', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            return request.unbanUser(id,response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                return request.getUserBanned().then(function(response3) {
                    expect(response3).to.have.status(200);
                    if (response3.body.length>=1) {
                      expect(response3.body[response3.body.length-1]._id).not.to.equal(id);
                    } else {
                      expect(response3).to.have.json([]);
                    }
                    return chakram.wait();
                });
            });
        });
    });

    it('bbb:574:Unban an user - unbanned user', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            return request.unbanUser(id,response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                return request.getUserBanned().then(function(response3) {
                    expect(response3).to.have.status(200);
                    if (response3.body.length>=1) {
                      expect(response3.body[response3.body.length-1]._id).not.to.equal(id);
                    } else {
                      expect(response3).to.have.json([]);
                    }
                    return chakram.wait();
                });
            });
        });
    });

    it('bbb:575:Unban an user - The user doesnt exist', function() {
        return request.login(config.adminLogin).then(function(response) {
            var idRandom = new ObjectID();
            expect(response).to.have.status(200);
            return request.unbanUser(idRandom,response.body.token).then(function(response2) {
                expect(response2).to.have.status(404);
                return request.getUserBanned().then(function(response3) {
                    expect(response3).to.have.status(200);
                    if (response3.body.length>=1) {
                      expect(response3.body[response3.body.length-1]._id).not.to.equal(idRandom);
                    } else {
                      expect(response3).to.have.json([]);
                    }
                    return chakram.wait();
                });
            });
        });
    });

    it('bbb:576:Unban an user - Invalid token', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        var idRandom = new ObjectID();
        return request.unbanUser(idRandom,token).then(function(response) {
            expect(response).to.have.status(401);
            return chakram.wait();
        });
    });

// GET /

    it('bbb:577:Get list of users', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            return request.getListOfUser(response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                expect(response2.body).not.to.have.json([]);
                return chakram.wait();
            });
        });
    });

    it('bbb:578:Get list of users - invalid token', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            return request.getListOfUser(token).then(function(response2) {
                expect(response2).to.have.status(401);
                return chakram.wait();
            });
        });
    });

//GET /email/:email Return id of user
    it('bbb:579:Get id at email - the user exists', function() {
        var userRandom = user.generateRandomUser();
        return request.createUser(userRandom).then(function(res) {
          expect(res).to.have.status(200);
          return request.getUserInfo(res.body.token).then(function(res2) {
              expect(res2).to.have.status(200);
              return request.getUserByEmail(encodeURIComponent(userRandom.email)).then(function(res3) {
                  expect(res3).to.have.status(200);
                  expect(res3.body.user).to.equal(res2.body._id);
                  return chakram.wait();
              });
          });
        });
    });

    it('bbb:580:Get id at email - the user doesnt exist', function() {
        return request.getUserByEmail(encodeURIComponent('emailfakefake@emailake.es')).then(function(response) {
            expect(response).to.have.status(400);
            expect(response).to.have.json('error','This email is not registered');
            return chakram.wait();
        });
    });

    it('bbb:581:Get id at email - the email is incorrect', function() {
        return request.getUserByEmail(encodeURIComponent('emailfakefakeemailake.es')).then(function(response) {
            expect(response).to.have.status(400);
            expect(response).to.have.json('error','This email is not registered');
            return chakram.wait();
        });
    });

//GET /banned

    it('bbb:582:Get banned users', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            var userRandom = user.generateRandomUser();
            return request.createUser(userRandom).then(function(response2) {
                expect(response2).to.have.status(200);
                return request.getUserInfo(response2.body.token).then(function(response3) {
                    expect(response3).to.have.status(200);
                    return request.banUser(response3.body._id,response.body.token).then(function(response4){
                        expect(response4).to.have.status(200);
                        return request.getUserBanned().then(function(response5) {
                            expect(response5).to.have.status(200);
                            expect(response5).not.to.have.json([]);
                            return chakram.wait();
                        });
                    });
                });
            });
        });
    });

//GET /me Get info for user

    it('bbb:583:Get user information - new User', function() {
        var userRandom = user.generateRandomUser();
        return request.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            return request.getUserInfo(response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                expect(response2.body.email).to.equal(userRandom.email);
                return chakram.wait();
            });
        });
    });

    it('bbb:584:Get user information - old user', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            return request.getUserInfo(response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                expect(response2.body.email).to.equal(config.adminLogin.email);
                return chakram.wait();
            });
        });
    });

    it('bbb:585:Get user information - invalid token', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        return request.getUserInfo(token).then(function(response) {
            expect(response).to.have.status(401);
            return chakram.wait();
        });
    });

//Get /:id Get user profile

    it('bbb:586:Get user profile - new user', function() {
        var userRandom = user.generateRandomUser();
        return request.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            return request.getUserInfo(response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                return request.getUserProfile(response2.body._id).then(function(response3) {
                    expect(response3).to.have.status(200);
                    expect(response3.body.username).to.equal(userRandom.username);
                    expect(response3.body.role).to.equal('user');
                    return chakram.wait();
                });
            });
        });
    });

    it('bbb:587:Get user profile - old user', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            return request.getUserInfo(response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                return request.getUserProfile(response2.body._id).then(function(response3) {
                    expect(response3).to.have.status(200);
                    expect(response3.body.username).to.equal(response2.body.username);
                    expect(response3.body.role).to.equal('admin');
                    return chakram.wait();
                });
            });
        });
    });

    it('bbb:588:Get user profile - The user doesnt exist', function() {
        var idRandom = new ObjectID();
        return request.getUserProfile(idRandom).then(function(response) {
            expect(response).to.have.status(404);
            return chakram.wait();
        });
    });

//PUT /me Update user data

    it('bbb:589:Update user data - new user', function() {
        var userRandom = user.generateRandomUser();
        return request.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            userRandom.lastName = 'Changed';
            return request.updateUser(userRandom,response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                return request.getUserInfo(response.body.token).then(function(response3) {
                    expect(response3).to.have.status(200);
                    var userMod = response3.body;
                    expect(userMod.lastName).to.equal(userRandom.lastName);
                    return chakram.wait();
                });
            });
        });
    });

    it('bbb:590:Update user data - old user', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            return request.getUserInfo(response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                var user = response2.body;
                user.lastName = 'Changed'+Number(new Date()) + Math.floor((Math.random() * 100000) + 1);
                return request.updateUser(user,response.body.token).then(function(response3) {
                    expect(response3).to.have.status(200);
                    return request.getUserInfo(response.body.token).then(function(response4) {
                        expect(response4).to.have.status(200);
                        var userMod = response4.body;
                        expect(userMod.lastName).to.equal(user.lastName);
                        user.lastName = 'Test';
                        return request.getUserInfo(response.body.token).then(function(response5) {
                            expect(response5).to.have.status(200);
                            return chakram.wait();
                        });
                    });
                });
            });
        });
    });

    it('bbb:591:Update user data - invalid token', function() {
        var userRandom = user.generateRandomUser();
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        return request.updateUser(userRandom,token).then(function(response) {
            expect(response).to.have.status(401);
            return chakram.wait();
        });
    });

//PUT /me/password Update user data

    it('bbb:592:Update user password (Logged) - new user', function() {
        var userRandom = user.generateRandomUser();
        return request.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            var password = {
              newPassword:'aaaaaa'
            };
            return request.updatePassword(password,response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                return request.login({email:userRandom.email,password:password.newPassword}).then(function(response3) {
                    expect(response3).to.have.status(200);
                    return request.getUserInfo(response3.body.token).then(function(response4) {
                        expect(response4).to.have.status(200);
                        return chakram.wait();
                    });
                });
            });
        });
    });

    it('bbb:593:Update user password (Logged) - old user', function() {
        return request.login(config.adminLogin).then(function(response) {
            expect(response).to.have.status(200);
            var password = {
              newPassword:'aaaaaa'
            };
            return request.updatePassword(password,response.body.token).then(function(response2) {
                expect(response2).to.have.status(200);
                return request.login({email:config.adminLogin.email,password:password.newPassword}).then(function(response3) {
                    expect(response3).to.have.status(200);
                    return request.getUserInfo(response3.body.token).then(function(response4) {
                        expect(response4).to.have.status(200);
                        return request.updatePassword({newPassword:config.adminLogin.password},response3.body.token).then(function(response5) {
                            expect(response5).to.have.status(200);
                            return chakram.wait();
                        });
                    });
                });
            });
        });
    });

    it('bbb:594:Update user password (Logged) - invalid token', function() {
        var password = {
          newPassword:'aaaaaa'
        };
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        return request.updatePassword(password,token).then(function(response) {
            expect(response).to.have.status(401);
            return chakram.wait();
        });
    });

//POST /

    it('bbb:595:Create a user - valid info', function() {
        var userRandom = user.generateRandomUser();
        return request.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            return request.login({email:userRandom.email,password:userRandom.password}).then(function(response2) {
                expect(response2).to.have.status(200);
                return chakram.wait();
            });
        });
    });

    it('bbb:596:Create a user - the user exists', function() {
      var userRandom = user.generateRandomUser();
      return request.createUser(userRandom).then(function(response) {
          expect(response).to.have.status(200);
          return request.createUser(userRandom).then(function(response2) {
              expect(response2).to.have.status(409);
              expect(response2.body.errors.username.message).to.equal('The specified username is already in use.');
              expect(response2.body.errors.email.message).to.equal('The specified email address is already in use.');
              return chakram.wait();
          });
      });
    });

    it('bbb:597:Create a user - without info', function() {
        return request.createUser({}).then(function(response) {
            expect(response).to.have.status(400);
            return chakram.wait();
        });
    });

//POST /forgot

    it('bbb:598:Send a recovery password email - correct email', function() {
        var userRandom = user.generateRandomUser();
        return request.createUser(userRandom).then(function(response) {
            expect(response).to.have.status(200);
            return request.forgotPass({'email':userRandom.email}).then(function(response2) {
                expect(response2).to.have.status(200);
                return chakram.wait();
            });
        });
    });

    it('bbb:599:Send a recovery password email - the email doesnt exist', function() {
        return request.forgotPass({'email':'userRandomFake@fakefake.es'}).then(function(response) {
            expect(response).to.have.status(404);
            return chakram.wait();
        });
    });

    it('bbb:600:Send a recovery password email - json parameter is incorrect', function() {
        return request.forgotPass({'em':'userRandomFake@fakefake.es'}).then(function(response) {
            expect(response).to.have.status(404);
            return chakram.wait();
        });
    });

});
