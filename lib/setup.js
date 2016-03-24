'use strict';

var path = require('path');
var fs   = require('fs');
var fsx  = require('fs-extra');
var exec = require('child_process').exec;
var CLI  = require('inquirer');
var log  = require('./log');

var gsk = 'git@github.com:cleverage/garden-starter-kit.git';

var UI = {
  continue: function (msg, answer) {
    return new Promise(function (resolve, reject) {
      CLI.prompt([{
        type   : 'confirm',
        name   : 'continue',
        message: String(msg),
        default: !!answer
      }], function (result) {
        if(result.continue) {
          resolve();
        }

        reject();
      });
    });
  }
};

/** cleanDir
 *
 * Supprime tous les fichiers et dossiers présents dans le dossier `dir`
 *
 * @param {String} dir Le chemin vers le dossier à nettoyer
 */
function cleanDir(dir) {
  return new Promise(function (resolve, reject) {
    fsx.emptyDir(dir, function (err) {
      if (err) {
        reject(err);
        return;
      }

      log.info('Le dossier est vide.');
      resolve(dir);
    });
  });
}

/** chkDir
 *
 * Verifie l'état d'un dossier (est-ce bien un dossier et est-il vide ?).
 *
 * @param {String} dir Le chemin du dossier à verifier
 */
function chkDir(dir) {
  var isDir = new Promise(function (resolve, reject) {
    fs.readdir(dir, function (err, files) {
      if (err) {
        reject([dir, 'Est-ce que ce dossier existe ?']);
        return;
      }

      if (files.length > 0) {
        resolve(false);
        return;
      }

      resolve(true);
    });
  });

  return isDir
    .then(function (isEmpty) {
      log.info('Initialisation du projet dans le dossier :');
      log.info(dir);

      if (!isEmpty) {
        log.warn('Le dossier n\'est pas vide');
        log.warn('Tous les fichiers vont être supprimés.');

        return new Promise(function (resolve, reject) {
          // On demande à l'utilisateur s'il veut
          // continuer et perdre ses fichiers ou non
          UI.continue('Souhaitez-vous continuer ?', false)
            .then(function () {
              resolve(dir);
            })
            .catch(reject);
        });
      }

      return Promise.resolve(dir);
    });
}

/** loadGSK
 *
 * Clone le Starter Kit dans le dossier dir
 *
 * @param {String} dir Le chemin du dossier ou cloner le Starter Kit
 */
function loadGSK(dir) {
  log.info('Chargement du Starter Kit.');

  return new Promise(function (resolve, reject) {
    var cmd = exec([
      'cd', dir, '&&',
      'git clone', gsk, '.', '&&',
      'rm -rf .git &&',
      'git init',
    ].join(' '), function (err) {
      if (err) {
        reject(err);
        return;
      }

      log.info('Starter Kit chargé.');
      resolve(dir);
    });

    cmd.stderr.pipe(log.stream.info);
    cmd.stdout.pipe(log.stream.info);
  });
}

/** firstCommit
 *
 * Créé le premier commit avec tous les fichiers du Starter Kit
 *
 * @param {String} dir Le chemin du dossier du depot GIT local.
 */
function firstCommit(dir) {
  log.info('Creation du premier commit.');

  return new Promise(function (resolve, reject) {
    var cmd = exec([
      'cd', dir, '&&',
      'git add --all &&',
      'git commit -m "First commit"'
    ].join(' '), function (err) {
      if (err) {
        reject(err);
        return;
      }

      log.info('Premier commit: OK');
      resolve(dir);
    });

    cmd.stderr.pipe(log.stream.info);
    cmd.stdout.pipe(log.stream.info);
  });
}

function loadThirdParty(dir) {
  log.info('Chargement des modules NPM et des GEMs');

  return new Promise(function (resolve, reject) {
    var str = [
      'cd', dir, '&& ./deploy.sh'
    ].join(' ');

    var cmd = exec(str, function (err) {
      if (err) {
        reject(err);
        return;
      }

      log.info('Chargement des modules: OK');
      resolve(dir);
    });

    cmd.stderr.pipe(log.stream.warn);
    cmd.stdout.pipe(log.stream.info);
  });
}

module.exports = {
  chkDir        : chkDir,
  cleanDir      : cleanDir,
  loadGSK       : loadGSK,
  loadThirdParty: loadThirdParty,
  firstCommit   : firstCommit
};
