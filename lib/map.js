'use strict';

module.exports = [{
  type: 'checkbox',
  name: 'userchoice',
  message: 'Que souhaitez-vous configurer?',
  choices: ['CSS','HTML','JavaScript','Serveur']
},{
  when    : function (a) { return a.userchoice.indexOf('CSS') > -1; },
  type    : 'list',
  name    : 'css.engine',
  message : 'Quel Pré-processeur CSS souhaitez-vous utiliser ?',
  choices : [
    { value: 'sass',   name: 'Sass'   },
    { value: 'stylus', name: 'Stylus' },
    { value: 'less',   name: 'LESS'   }
  ]
},{
  when    : function (a) { return a.userchoice.indexOf('CSS') > -1; },
  type    : 'input',
  name    : 'css.autoprefixer',
  message : 'Saisissez votre configuration pour AutoPrefixer\n? Plusieurs configuration peuvent être saisie, séparées par des virgules:\n'
},{
  when    : function (a) { return a.userchoice.indexOf('HTML') > -1; },
  type    : 'list',
  name    : 'html.engine',
  message : 'Quel system de template HTML souhaitez-vous utiliser ?',
  choices : [
    { value: 'twig',       name: 'Twig'      },
    { value: 'handlebars', name: 'Handlebars'}
  ]
},{
  when    : function (a) { return a.userchoice.indexOf('HTML') > -1; },
  type    : 'input',
  name    : 'html.a11y.viewports',
  message : 'Quels viewports voulez-vous utiliser pour les test d\'accessibilité ?\n? Plusieurs viewports peuvent être saisie, séparés par des virgules:\n'
},{
  when    : function (a) { return a.userchoice.indexOf('JavaScript') > -1; },
  type    : 'list',
  name    : 'js.engine',
  message : 'Quel workflow JavaScript souhaitez-vous utiliser ?',
  choices : [
    { value: 'simple',     name : 'Simple (Concatenation et minification sans gestion de dépendances ni modules)' },
    { value: 'browserify', name : 'Browserify (Modules, syntaxe ES2015 et gestion des dépendances via NPM)'       }
  ]
},{
  when    : function (a) { return a.userchoice.indexOf('JavaScript') > -1; },
  type    : 'input',
  name    : 'js.filename',
  message : 'Quel doit être le nom du fichier JavaScript concaténé ?',
  validate: function (value) {
    return (/^[\.a-z0-9_-]+\.js$/i).test(value) ||
           'Le nom du fichier ne doit contenir que des lettres, des chiffres, des tirets ou des points et doit se terminer par ".js"';
  }
},{
  when    : function (a) { return a.userchoice.indexOf('Serveur') > -1; },
  type    : 'input',
  name    : 'connect.port',
  message : 'Sur quel port le serveur statique doit-il écouter ?',
  validate: function (value) {
    return (/^\d+$/).test(value) ||
           'Le port à utiliser doit être un nombre.';
  }
},{
  when    : function (a) { return a.userchoice.indexOf('Serveur') > -1; },
  type    : 'confirm',
  name    : 'connect.open',
  message : 'Le navigateur doit-il s\'ouvrir automatiquement au lancement du serveur ?',
},{
  when    : function (a) { return a.userchoice.indexOf('Serveur') > -1; },
  type    : 'confirm',
  name    : 'connect.directory',
  message : 'Sur les URL de dossier, le serveur doit-il lister les fichiers du dossier ?',
}];
