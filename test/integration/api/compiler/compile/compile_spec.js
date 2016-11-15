'use strict';
var chakram = require('chakram'),
    expect = chakram.expect,
    Request = require('../../commons/request.js'),
    request = new Request(),
    Compile = require('./compile.js'),
    compile = new Compile();

describe('Compiler test', function() {

    it('bbb-323:Compile a correct code',function() {
        request.postCompiler('/compile',200,compile.correctCode);
        request.postCompiler('/compile',200,compile.correctCodebt328);
        return chakram.wait();
    });

    it('bbb-324:Compile an incorrect correct',function() {
        return request.postCompiler('/compile',200,compile.incorrectCode).then(function(response1) {
            expect(response1).to.comprise.of.json(compile.errorNoFile);
            return request.postCompiler('/compile',200,compile.incorrectCodebt328).then(function(response2) {
                expect(response2).to.comprise.of.json(compile.errorNoFile);
                return chakram.wait();
            });
        });

    });

    it('bbb-325:Compile a code without BOARD',function() {
        return request.postCompiler('/compile',400,compile.codeWithoutBoard).then(function(response) {
          expect(response.body).to.equal(compile.errorBoardorCode);
          return chakram.wait();
        });
    });

    it('bbb-326:Compile a code without CODE',function() {
        return request.postCompiler('/compile',400,compile.codeWithoutCode).then(function(response) {
          expect(response.body).to.equal(compile.errorBoardorCode);
          return request.postCompiler('/compile',400,compile.codeWithoutCodebt328).then(function(response2) {
            expect(response2.body).to.equal(compile.errorBoardorCode);
            return chakram.wait();
          });
        });
    });

    it('bbb-327:Compile a code without CODE and without BOARD',function() {
        return request.postCompiler('/compile',400,{}).then(function(response) {
          expect(response.body).to.equal(compile.errorBoardorCode);
          return chakram.wait();
        });
    });

    it('bbb-328:Compile a code with an incorrect BOARD',function() {
        return request.postCompiler('/compile',400,compile.codeWithBoardIncompatible).then(function(response) {
          expect(response.body).to.equal(compile.errorBoardIncompatible);
          return chakram.wait();
        });
    });

    it('bbb-329:Compile a code twice',function() {
        return request.postCompiler('/compile',200,compile.correctCode).then(function(response) {
          return request.postCompiler('/compile',200,compile.correctCode).then(function(response2){
              expect(response.body.hex).to.equal(response2.body.hex);
              return chakram.wait();
          });
        });
    });

    it('bbb-330:Compile different codes',function() {
        return request.postCompiler('/compile',200,compile.correctCode).then(function(response) {
            return request.postCompiler('/compile',200,compile.correctCodeDiff).then(function(response2) {
              expect(response.body.hex).not.to.equal(response2.body.hex);
              return chakram.wait();
            });
        });
    });

});
