'use strict';

// MODULES
// ----------------------------------------------------------------------------
var path = require('path');
var _    = require('underscore');
var CLI  = require('inquirer');
var fsx  = require('fs-extra');
var ENV  = require('./env');
var log  = require('./log');

var files = {
  sass  : ['Gemfile','.scss-lint.yml', 'config.rb'],
  less  : ['.lesshintrc'],
  stylus: ['.stylintrc']
};

// UTILITAIRES
// ----------------------------------------------------------------------------

/** Get a value from an object with a "deep" key
 *
 * A deep key is a string representing the target key in dot notation
 *
 * ```js
 * var obj = {
 *   sub: {
 *     foo: 'bar'
 *   }
 * }
 *
 * getWithKey(obj, 'sub.foo'); // bar
 * ```
 *
 * @param {Object} obj L'objet dont on veux extraire une valeure
 * @param {String} key La clé qu'on cherche
 * @return {Any}
 */
function getWithKey(obj, key) {
  if (!Array.isArray(key)) {
    key = key.split('.');
  }

  var k = key.shift();
  var v = obj[k];

  if(v && key.length > 0) {
    return getWithKey(v, key);
  }

  return v;
}

/** Set a value in an object with a "deep" key
 *
 * A deep key is a string representing the target key in dot notation
 *
 * ```js
 * var obj = {
 *   sub: {
 *     foo: 'bar'
 *   }
 * }
 *
 * setWithKey(obj, 'sub.foo', 'baz');
 *
 * obj.sub.foo; // baz
 * ```
 *
 * @param {Object} obj L'objet dont on veux extraire une valeure
 * @param {String} key La clé qu'on cherche
 */
function setWithKey(obj, key, value) {
  if (!Array.isArray(key)) {
    key = key.split('.');
  }

  var k = key.shift();

  if (_.isObject(obj[k]) && key.length > 0) {
    return setWithKey(obj[k], key, value);
  }

  obj[k] = value;
}

function rm(file) {
  return new Promise(function (resolve, reject) {
    fsx.remove(file, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function copy(file, target) {
  return new Promise(function (resolve, reject) {
    fsx.copy(file, target, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function moveConfFiles(dir, ctx) {
  var del,
      src = path.join(dir, '.gsk', 'conf'),
      css = getWithKey(ctx, 'css.engine');

  // clean existing files
  _.each(files, function (v) {
    v.forEach(function (f) {
      if (!del) {
        del = rm(f);
      } else {
        del.then(function () {
          return rm(f);
        });
      }
    });
  });

  // Setup new files
  files[css].forEach(function (f) {
    del.then(function () {
      return copy(path.join(src, f), path.join(dir, f));
    });
  });

  return del;
}

function getCtx(dir) {
  log.info('Lecture de la configuration du projet');

  return new Promise(function (resolve, reject) {
    fsx.readJSON(ENV(dir).config, function (err, data) {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

function setCtx(dir, ctx) {
  var file = ENV(dir).config;

  log.info('Enregistrement de la configuration');

  return new Promise(function (resolve, reject) {
    fsx.outputJson(file, ctx, function (err) {
      if (err) {
        reject(err);
        return;
      }

      log.info(file);

      resolve(ctx);
    });
  });
}

function run(ctx) {
  var questions = require('./map');

  questions.forEach(function (q){
    q.default = getWithKey(ctx, q.name);
    q.message = q.message.replace('%s', q.default);
  });

  return new Promise(function (resolve) {
    CLI.prompt(questions, function (answers) {
      _.each(answers, function (v, k) {
        if (k.indexOf('.') > -1) {
          if ((k === 'css.autoprefixer' ||
               k === 'html.a11y.viewports') &&
              !Array.isArray(v)) {
            v = v.split(',').map(function (s) {
              return s.trim();
            });
          }

          setWithKey(ctx, k, v);
        }
      });

      resolve(ctx);
    });
  });
}

module.exports = {
  getConf: getCtx,
  setConf: setCtx,
  setConfFiles: moveConfFiles,
  cli: run
};


// run(questions, ctx)
//  .then(recordCtx)
//  .catch(error);


