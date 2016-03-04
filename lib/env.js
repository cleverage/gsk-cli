'use strict';

var path = require('path');

module.exports = function (dir) {
  return {
    config: path.join(dir, '.gsk', 'config.json')
  };
};
