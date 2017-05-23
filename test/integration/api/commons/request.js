'use strict';
var chakram = require('chakram');

var Request = function() {


    this.post =function(url,params,headers) {
      return chakram.post(url,params,headers);
    };

    this.get =function(url,headers) {
      return chakram.get(url,headers);
    };

    this.head =function(url,params,headers) {
      return chakram.head(url,params,headers);
    };

    this.put = function(url,params,headers) {
      return chakram.put(url,params,headers);
    };

    this.delete = function(url,headers) {
      return chakram.delete(url,{},headers);
    };

};
module.exports = Request;
