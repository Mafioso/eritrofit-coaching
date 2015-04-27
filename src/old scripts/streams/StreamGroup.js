'use strict';

var Kefir = require('kefir');
var _ = require('lodash');

var StreamGroup = function(streamNames) {
  var instance = {};

  function init(streamNames) {
    var instance = {};

    _.each(streamNames, function(streamName) {
      instance[streamName] = new Kefir.emitter();
    });

    return instance;
  }


  if (_.isEmpty(instance)) {
    instance = init(streamNames);
  }

  return instance;

};

module.exports = StreamGroup;
