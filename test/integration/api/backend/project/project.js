'use strict';
var Project = function() {

    this.generateProjectRandom = function() {
        var project = {
          code: '/***   Included libraries  ***/   /***   Global variables and function definition  ***/    /***   Setup  ***/void setup(){ }  /***   Loop  ***/void loop(){}',
          codeProject: false,
          defaultTheme: 'infotab_option_colorTheme',
          description: '',
          hardware: {board: 'bq ZUM', robot: null, components: [], connections: []},
          hardwareTags: ['bq ZUM'],
          name: 'Proyecto sin título'+Number(new Date()) +
          Math.floor((Math.random() * 100000) + 1),
          software: {
            loop: {name: 'loopBloq', content: [[]], enable: true, childs: []},
            setup:{name: 'setupBloq', content: [[]], enable: true, childs: []},
            vars: {name: 'varsBloq', content: [[]], enable: true, childs: []}
          },
          userTags:[],
          videoUrl: ''
        };
        return project;
    };

};
module.exports = Project;
