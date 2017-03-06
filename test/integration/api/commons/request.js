'use strict';
var chakram = require('chakram');

var Request = function() {


    this.post =function(url,params,headers) {
      return chakram.post(url,params,headers).then(function(response) {
         return response;
      });
    };

    this.get =function(url,headers) {
      return chakram.get(url,headers).then(function(response) {
        return response;
      });
    };

    this.head =function(url,params,headers) {
      return chakram.head(url,params,headers).then(function(response) {
        return response;
      });
    };

    this.put = function(url,params,headers) {
      return chakram.put(url,params,headers).then(function(response) {
        return response;
      });
    };

    this.delete = function(url,headers) {
      return chakram.delete(url,{},headers).then(function(response){
        return response;
      });
    };

};
module.exports = Request;
