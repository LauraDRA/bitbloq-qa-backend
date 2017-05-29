'use strict';
var Compile = function() {

    //code
    this.correctCode = {board:'uno', code:'/***   Included libraries  ***/\n/***   Global variables and function definition  ***/\n/***   Setup  ***/\nvoid setup() {}\n/***   Loop  ***/\nvoid loop() {\n delay('+Math.floor((Math.random() * 1000) + 1)+');\n}'};
    this.correctCodebt328 = {board:'bt328', code:'/***   Included libraries  ***/\n/***   Global variables and function definition  ***/\n/***   Setup  ***/\nvoid setup() {}\n/***   Loop  ***/\nvoid loop() {\n delay('+Math.floor((Math.random() * 1000) + 1)+');\n}'};
    this.correctCodeDiff ={board:'uno', code:'/***   Included libraries  ***/\n#include <SoftwareSerial.h>\n#include <BitbloqSoftwareSerial.h>\n\n\n/***   Global variables and function definition  ***/\nbqSoftwareSerial puerto_serie_0(0, 1, 9600);\n\n/***   Setup  ***/\nvoid setup() {}\n\n/***   Loop  ***/\nvoid loop() {\npuerto_serie_0.println(puerto_serie_0.readString());\n delay('+Math.floor((Math.random() * 1000) + 1)+');\n}'};
    this.incorrectCode = {board:'uno', code:'/***   Included libraries  ***/\n#include <SftwareSerial.h>\n#include <BitbloqSoftwareSerial.h>\n\n\n/***   Global variables and function definition  ***/\nbqSoftwareSerial puerto_serie_0(0, 1, 9600);\n\n/***   Setup  ***/\nvoid setup() {}\n\n/***   Loop  ***/\nvoid loop() {\npuerto_serie_0.println(puerto_serie_0.readString());\ndelay(2000);\n}'};
    this.incorrectCodebt328 = {board:'bt328', code:'/***   Included libraries  ***/\n#include <SftwareSerial.h>\n#include <BitbloqSoftwareSerial.h>\n\n\n/***   Global variables and function definition  ***/\nbqSoftwareSerial puerto_serie_0(0, 1, 9600);\n\n/***   Setup  ***/\nvoid setup() {}\n\n/***   Loop  ***/\nvoid loop() {\npuerto_serie_0.println(puerto_serie_0.readString());\ndelay(2000);\n}'};

    this.codeWithoutBoard = {code:'/***   Included libraries  ***/\n#include <SoftwareSerial.h>\n#include <BitbloqSoftwareSerial.h>\n\n\n/***   Global variables and function definition  ***/\nbqSoftwareSerial puerto_serie_0(0, 1, 9600);\n\n/***   Setup  ***/\nvoid setup() {}\n\n/***   Loop  ***/\nvoid loop() {\npuerto_serie_0.println(puerto_serie_0.readString());\ndelay(2000);\n}'};
    this.codeWithoutCode = {board:'uno'};
    this.codeWithoutCodebt328 = {board:'bt328'};

    this.codeWithBoardIncompatible = {board:'u8no', code:'/***   Included libraries  ***/\n#include <SftwareSerial.h>\n#include <BitbloqSoftwareSerial.h>\n\n\n/***   Global variables and function definition  ***/\nbqSoftwareSerial puerto_serie_0(0, 1, 9600);\n\n/***   Setup  ***/\nvoid setup() {}\n\n/***   Loop  ***/\nvoid loop() {\npuerto_serie_0.println(puerto_serie_0.readString());\ndelay(2000);\n}'};

    //error
    this.errorNoFile = {
      error:[{
        file: '/home/platformio/pioWS_20258799504d7f3f0bd4a1d61cc289d267e5dfbce971d4ac70cbefa940a1387a/src/main.ino',
        line: '2',
        column: '27',
        error: 'SftwareSerial.h: No such file or directory'
      }]
    };

    this.errorBoardorCode = 'Missing board or code';
    this.errorBoardIncompatible = 'No compatible type of board';


};
module.exports = Compile;
