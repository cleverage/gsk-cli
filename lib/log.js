'use strict';

var color   = require('colors');
var moment  = require('moment');
var through = require('through');
moment.locale('fr');

function makeArray(msg) {
  // If the msg is already and Array
  if (Array.isArray(msg)) {
    return msg;
  }

  // If the msg is an Error object
  if (msg.message) {
    return msg.message.split('\n');
  }

  // In every other case we make it a String
  return String(msg).split('\n');
}

function logger(level) {
  var prefix = [
    { fn: 'log',   str: color.cyan('INFO:')   },
    { fn: 'warn',  str: color.yellow('WARN:') },
    { fn: 'error', str: color.red('ERROR:')    }
  ];

  var msg = Array.prototype.slice.call(arguments, 1);

  msg.unshift(prefix[level].str);
  msg.unshift(color.grey('[' + moment().format('HH:mm:ss') + ']'));

  console[prefix[level].fn].apply(console, msg);
}

function buildStream(level) {
  return through(function (data) {
    data.toString().split('\n').forEach(function (str) {
      logger(level, str);
    });
  });
}

function buildPromise(level) {
  function log(str) {
    logger(level, str);
  }

  return function (msg) {
    makeArray(msg).forEach(log);

    if (level !== 2) {
      return this;
    }

    return Promise.reject(msg);
  };
}

logger.info  = logger.bind(null, 0);
logger.warn  = logger.bind(null, 1);
logger.error = logger.bind(null, 2);

logger.stream = {
  info : buildStream(0),
  warn : buildStream(1),
  error: buildStream(2)
};

logger.promise = {
  info : buildPromise(0),
  warn : buildPromise(1),
  error: buildPromise(2)
};

module.exports = logger;
