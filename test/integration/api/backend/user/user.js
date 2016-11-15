'use strict';
var User = function() {

    this.generateRandomUser = function() {
        var user = {
          birthday:'1986-12-31T23:00:00.000Z',
          cookiePolicyAccepted:true,
          email:'usertest'+Number(new Date()) +
          Math.floor((Math.random() * 100000) + 1)+'@fake.es',
          firstName:'',
          hasBeenAskedIfTeacher:true,
          language:'es-ES',
          lastName:'',
          newsletter:false,
          password:'123456',
          takeTour:false,
          username:'usertest'+Number(new Date()) +
          Math.floor((Math.random() * 100000) + 1)
        };
        return user;
    };

};
module.exports = User;
