#!/usr/bin/env node

'use strict';

var pkg     = require('./package.json');
var path    = require('path');
var program = require('commander');
var log     = require('./lib/log');
var conf    = require('./lib/conf');
var setup   = require('./lib/setup');


function init(dir) {
  var directory = path.resolve(dir || '.');

  setup.chkDir(directory)
    .then(setup.cleanDir)
    .then(setup.loadGSK)
    .then(function (rep) {
      return conf.getConf(directory)
        .then(conf.cli)
        .then(function (data) {
          return conf.setConf(rep, data);
        })
        .then(function (data) {
          return conf.setConfFiles(rep, data);
        })
        .then(function () {
          return Promise.resolve(rep);
        });
    })
    .then(setup.loadThirdParty)
    .then(setup.firstCommit)
    .catch(log.promise.error);
}

function config(dir) {
  var directory = path.resolve(dir || '.');

  log.info('Configuration du projet');
  log.info(directory);

  conf.getConf(directory)
    .then(conf.cli)
    .then(function (data) {
      return conf.setConf(directory, data);
    })
    .then(function (data) {
      return conf.setConfFiles(directory, data);
    })
    .catch(log.promise.error);
}

program
 .version(pkg.version);

program
  .command('init [dir]')
  .description('Initialise un projet dans le dossier [dir]')
  .action(init);

program
  .command('config [dir]')
  .description('Lance l\'interface de configuration')
  .action(config);

program.parse(process.argv);
