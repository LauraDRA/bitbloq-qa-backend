'use strict';
var chakram = require('chakram'),
    expect = chakram.expect,
    RequestCompiler = require('../../commons/requestCompiler.js'),
    request = new RequestCompiler(),
    Compile = require('./compile.js'),
    compile = new Compile();

describe('Compiler test', function() {

    it('bbb-323:Compile a correct code',function() {
        return request.compiler(compile.correctCode).then(function(response) {
            expect(response).to.have.status(200);
            return request.compiler(compile.correctCodebt328).then(function(response2) {
                expect(response2).to.have.status(200);
                return chakram.wait();
            });
        });


    });

    it('bbb-324:Compile an incorrect correct',function() {
        return request.compiler(compile.incorrectCode).then(function(response1) {
            expect(response1).to.have.status(200);
            expect(response1).to.comprise.of.json(compile.errorNoFile);
            return request.post(compile.incorrectCodebt328).then(function(response2) {
                expect(response2).to.have.status(200);
                expect(response2).to.comprise.of.json(compile.errorNoFile);
                return chakram.wait();
            });
        });

    });

    it('bbb-325:Compile a code without BOARD',function() {
        return request.compiler(compile.codeWithoutBoard).then(function(response) {
            expect(response).to.have.status(400);
            expect(response.body).to.equal(compile.errorBoardorCode);
            return chakram.wait();
        });
    });

    it('bbb-326:Compile a code without CODE',function() {
        return request.compiler(compile.codeWithoutCode).then(function(response) {
            expect(response.body).to.equal(compile.errorBoardorCode);
            expect(response).to.have.status(400);
            return request.compiler(compile.codeWithoutCodebt328).then(function(response2) {
              expect(response2.body).to.equal(compile.errorBoardorCode);
              expect(response2).to.have.status(400);
              return chakram.wait();
            });
        });
    });

    it('bbb-327:Compile a code without CODE and without BOARD',function() {
        return request.compiler({}).then(function(response) {
            expect(response).to.have.status(400);
            expect(response.body).to.equal(compile.errorBoardorCode);
            return chakram.wait();
        });
    });

    it('bbb-328:Compile a code with an incorrect BOARD',function() {
        return request.compiler(compile.codeWithBoardIncompatible).then(function(response) {
          expect(response).to.have.status(400);
          expect(response.body).to.equal(compile.errorBoardIncompatible);
          return chakram.wait();
        });
    });

    it('bbb-329:Compile a code twice',function() {
        return request.compiler(compile.correctCode).then(function(response) {
            expect(response).to.have.status(200);
            return request.compiler(compile.correctCode).then(function(response2){
                expect(response2).to.have.status(200);
                expect(response.body.hex).to.equal(response2.body.hex);
                return chakram.wait();
            });
        });
    });

    it('bbb-330:Compile different codes',function() {
        return request.compiler(compile.correctCode).then(function(response) {
            expect(response).to.have.status(200);
            return request.compiler(compile.correctCodeDiff).then(function(response2) {
                expect(response2).to.have.status(200);
                expect(response.body.hex).not.to.equal(response2.body.hex);
                return chakram.wait();
            });
        });
    });

});
