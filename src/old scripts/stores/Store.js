'use strict';

var _ = require('lodash');


var Store = function(def) {
  var instance = {};


  if (_.isEmpty(instance)) {
    if (!def) { throw 'Store: You need to instantiate Store first'; }
    instance.init = def;
    instance.init();
  }

  return instance;
};

module.exports = Store;
