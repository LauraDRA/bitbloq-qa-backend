'use strict';
var chakram = require('chakram'),
    expect = chakram.expect;

var User = require('./user.js'),
    user = new User(),
    Request = require('../../commons/request.js'),
    request = new Request(),
    ObjectID = require('mongodb').ObjectID,
    config = require('../../../../config/config.json');

describe('User test', function() {

    var id;

//HEAD /:username Check that the username exists in BBDD
    it('The username exists',function(){
        var userRandom = user.generateRandomUser();
        return request.postBackend('/user',200,userRandom).then(function() {
            return request.headBackend('/user/'+userRandom.username,200).then(function(response) {
                expect(response).to.have.header('exists','true');
                return chakram.wait();
            });
        });
    });

    it('The username doesnt exist',function(){
        return request.headBackend('/user/userfakedoesntexist',204).then(function(response) {
            expect(response).to.have.header('exists','false');
            return chakram.wait();
        });

    });

    it('The username has rare characters', function() {
        return request.headBackend('/user/pruebeci)()&64564¿*',204).then(function(response) {
            expect(response).to.have.header('exists','false');
            return chakram.wait();
        });

    });

    it('The username is long', function() {
        return request.headBackend(
        '/user/pruebeci)()&64564¿*aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'+
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'+
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',204).then(function(response) {
            expect(response).to.have.header('exists','false');
            return chakram.wait();
        });

    });


//HEAD /ban
    it('Ban an user', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            var userRandom = user.generateRandomUser();
            return request.postBackend('/user',200,userRandom).then(function(response2) {
                return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response2.body.token}}).then(function(response3) {
                    return request.headBackend('/user/'+response3.body._id+'/ban',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function(){
                        return request.getBackend('/user/banned',200).then(function(response4) {
                            expect(response4.body[response4.body.length-1]._id).to.equal(response3.body._id);
                            id = response3.body._id;
                        });
                    });
                });
            });
        });
    });

    it('Ban an user - A banned user', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            return request.headBackend('/user/'+id+'/ban',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                return request.getBackend('/user/banned',200).then(function(response4) {
                    expect(response4.body[response4.body.length-1]._id).to.equal(id);
                    return chakram.wait();
                });
            });
        });
    });

    it('Ban an user - The user doesnt exist', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            var idRandom = new ObjectID();
            return request.headBackend('/user/'+idRandom+'/ban',404,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                return request.getBackend('/user/banned',200).then(function(response4) {
                    expect(response4.body[response4.body.length-1]._id).not.to.equal(idRandom);
                    return chakram.wait();
                });
            });
        });
    });

    it('Ban an user - Invalid token', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        var idRandom = new ObjectID();
        return request.headBackend('/user/'+idRandom+'/ban',401,{headers:{'Authorization':'Bearer '+token}}).then(function() {
            return chakram.wait();
        });
    });

//HEAD /unban
    it('Unban an user', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            return request.headBackend('/user/'+id+'/unban',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                return request.getBackend('/user/banned',200).then(function(response4) {
                    if (response4.body.length>=1) {
                      expect(response4.body[response4.body.length-1]._id).not.to.equal(id);
                    } else {
                      expect(response4).to.have.json([]);
                    }
                    return chakram.wait();
                });
            });
        });
    });

    it('Unban an user - unbanned user', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            return request.headBackend('/user/'+id+'/unban',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                return request.getBackend('/user/banned',200).then(function(response4) {
                    if (response4.body.length>=1) {
                      expect(response4.body[response4.body.length-1]._id).not.to.equal(id);
                    } else {
                      expect(response4).to.have.json([]);
                    }
                    return chakram.wait();
                });
            });
        });
    });

    it('Unban an user - The user doesnt exist', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            var idRandom = new ObjectID();
            return request.headBackend('/user/'+idRandom+'/unban',404,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                return request.getBackend('/user/banned',200).then(function(response4) {
                    if (response4.body.length>=1) {
                      expect(response4.body[response4.body.length-1]._id).not.to.equal(idRandom);
                    } else {
                      expect(response4).to.have.json([]);
                    }
                    return chakram.wait();
                });
            });
        });
    });

    it('Unban an user - Invalid token', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        var idRandom = new ObjectID();
        return request.headBackend('/user/'+idRandom+'/unban',401,{headers:{'Authorization':'Bearer '+token}}).then(function() {
            return chakram.wait();
        });
    });

// GET /

    it('Get list of users', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            return request.getBackend('/user',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function(response2) {
                expect(response2.body).not.to.have.json([]);
                return chakram.wait();
            });
        });
    });

    it('Get list of users - invalid token', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        return request.postBackend('/auth/local',200,config.adminLogin).then(function() {
            return request.getBackend('/user',401,{headers:{'Authorization':'Bearer '+token}}).then(function(response2) {
                expect(response2.body).not.to.have.json([]);
                return chakram.wait();
            });
        });
    });

//GET /email/:email Return id of user
    it('Get id at email - the user exists', function() {
        var userRandom = user.generateRandomUser();
        return request.postBackend('/user',200,userRandom).then(function(res) {
          return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+res.body.token}}).then(function(res2) {
              return request.getBackend('/user/email/'+encodeURIComponent(userRandom.email),200).then(function(res3) {
                  expect(res3.body.user).to.equal(res2.body._id);
                  return chakram.wait();
              });
          });
        });
    });

    it('Get id at email - the user doesnt exist', function() {
        var response = request.getBackend('/user/email/'+encodeURIComponent('emailfakefake@emailake.es'),400);
        expect(response).to.have.json('error','This email is not registered');
        return chakram.wait();
    });

    it('Get id at email - the email is incorrect', function() {
        var response = request.getBackend('/user/email/'+encodeURIComponent('emailfakefakeemailake.es'),400);
        expect(response).to.have.json('error','This email is not registered');
        return chakram.wait();
    });

    it('Get banned users', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            var userRandom = user.generateRandomUser();
            return request.postBackend('/user',200,userRandom).then(function(response2) {
                return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response2.body.token}}).then(function(response3) {
                    return request.headBackend('/user/'+response3.body._id+'/ban',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function(){
                        return request.getBackend('/user/banned',200).then(function() {
                            expect(response).not.to.have.json([]);
                        });
                    });
                });
            });
        });
    });

//GET /me Get info for user

    it('Get user information - new User', function() {
        var userRandom = user.generateRandomUser();
        return request.postBackend('/user',200,userRandom).then(function(response) {
            return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function(response2) {
                expect(response2.body.email).to.equal(userRandom.email);
                return chakram.wait();
            });
        });
    });

    it('Get user information - old user', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function(response2) {
                expect(response2.body.email).to.equal(config.adminLogin.email);
                return chakram.wait();
            });
        });
    });

    it('Get user information - invalid token', function() {
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        return request.getBackend('/user/me',401,{headers:{'Authorization':'Bearer '+token}}).then(function() {
            return chakram.wait();
        });
    });

//Get /:id Get user profile

    it('Get user profile - new user', function() {
        var userRandom = user.generateRandomUser();
        return request.postBackend('/user',200,userRandom).then(function(response) {
            return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function(response2) {
                return request.getBackend('/user/'+response2.body._id,200).then(function(response3) {
                    expect(response3.body.username).to.equal(userRandom.username);
                    expect(response3.body.role).to.equal('user');
                    return chakram.wait();
                });
            });
        });
    });

    it('Get user profile - old user', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function(response2) {
                return request.getBackend('/user/'+response2.body._id,200).then(function(response3) {
                    expect(response3.body.username).to.equal(response2.body.username);
                    expect(response3.body.role).to.equal('admin');
                    return chakram.wait();
                });
            });
        });
    });

    it('Get user profile - The user doesnt exist', function() {
        var idRandom = new ObjectID();
        return request.getBackend('/user/'+idRandom,404).then(function() {
            return chakram.wait();
        });
    });

//PUT /me Update user data

    it('Update user data - new user', function() {
        var userRandom = user.generateRandomUser();
        return request.postBackend('/user',200,userRandom).then(function(response) {
            userRandom.lastName = 'Changed';
            return request.putBackend('/user/me',200,userRandom,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function(response2) {
                    var userMod = response2.body;
                    expect(userMod.lastName).to.equal(userRandom.lastName);
                });
            });
        });
    });

    it('Update user data - old user', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function(response2) {
                var user = response2.body;
                user.lastName = 'Changed'+Number(new Date()) + Math.floor((Math.random() * 100000) + 1);
                return request.putBackend('/user/me',200,user,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                    return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function(response3) {
                        var userMod = response3.body;
                        expect(userMod.lastName).to.equal(user.lastName);
                        user.lastName = 'Test';
                        return request.putBackend('/user/me',200,user,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                            return chakram.wait();
                        });
                    });
                });
            });
        });
    });

    it('Update user data - invalid token', function() {
        var userRandom = user.generateRandomUser();
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        return request.putBackend('/user/me',401,userRandom,{headers:{'Authorization':'Bearer '+token}}).then(function() {
            return chakram.wait();
        });
    });

//PUT /me/password Update user data

    it('Update user password (Logged) - new user', function() {
        var userRandom = user.generateRandomUser();
        return request.postBackend('/user',200,userRandom).then(function(response) {
            var password = {
              newPassword:'aaaaaa'
            };
            return request.putBackend('/user/me/password',200,password,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                return request.postBackend('/auth/local',200,{email:userRandom.email,password:password.newPassword}).then(function(response2) {
                    return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response2.body.token}}).then(function() {
                        chakram.wait();
                    });
                });
            });
        });
    });

    it('Update user password (Logged) - old user', function() {
        return request.postBackend('/auth/local',200,config.adminLogin).then(function(response) {
            var password = {
              newPassword:'aaaaaa'
            };
            return request.putBackend('/user/me/password',200,password,{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                return request.postBackend('/auth/local',200,{email:config.adminLogin.email,password:password.newPassword}).then(function(response2) {
                    return request.getBackend('/user/me',200,{headers:{'Authorization':'Bearer '+response2.body.token}}).then(function() {
                        return request.putBackend('/user/me/password',200,{newPassword:config.adminLogin.password},{headers:{'Authorization':'Bearer '+response.body.token}}).then(function() {
                            chakram.wait();
                        });
                    });
                });
            });
        });
    });

    it('Update user password (Logged) - invalid token', function() {
        var password = {
          newPassword:'aaaaaa'
        };
        var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        return request.putBackend('/user/me/password',401,password,{headers:{'Authorization':'Bearer '+token}}).then(function() {
            return chakram.wait();
        });
    });

//POST /

    it('Create a user - valid info', function() {
        var userRandom = user.generateRandomUser();
        return request.postBackend('/user',200,userRandom).then(function() {
            return request.postBackend('/auth/local',200,{email:userRandom.email,password:userRandom.password}).then(function() {
                return chakram.wait();
            });
        });
    });

    it('Create a user - the user exists', function() {
      var userRandom = user.generateRandomUser();
      return request.postBackend('/user',200,userRandom).then(function() {
          return request.postBackend('/user',409,userRandom).then(function(response2) {
              expect(response2.body.errors.username.message).to.equal('The specified username is already in use.');
              expect(response2.body.errors.email.message).to.equal('The specified email address is already in use.');
              return chakram.wait();
          });
      });
    });

    it('Create a user - without info', function() {
        return request.postBackend('/user/',400,{}).then(function() {
            return chakram.wait();
        });
    });

});
