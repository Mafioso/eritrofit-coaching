'use strict';

var StreamGroup = require('../../common/StreamGroup');

var goalsActionstreams = new StreamGroup([
  'getActiveGoals'
]);

var goalsDatastreams = new StreamGroup([
  'list'
]);

module.exports = {
  actionstreams: goalsActionstreams,
  datastreams: goalsDatastreams
};
