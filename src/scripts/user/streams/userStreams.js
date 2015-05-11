'use strict';

var StreamGroup = require('../../common/StreamGroup');

var routerActionstreams = new StreamGroup([
  'saveUserInfo',
  'savePassword'
]);

var routerDatastreams = new StreamGroup([
  'result'
]);

module.exports = {
  actionstreams: routerActionstreams,
  datastreams: routerDatastreams
};
