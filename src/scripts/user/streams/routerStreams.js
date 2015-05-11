'use strict';

var StreamGroup = require('../../common/StreamGroup');

var routerActionstreams = new StreamGroup([
  'popstate',
  'redirect'
]);

var routerDatastreams = new StreamGroup([
  'route'
]);

module.exports = {
  actionstreams: routerActionstreams,
  datastreams: routerDatastreams
};
