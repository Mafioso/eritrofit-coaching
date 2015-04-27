'use strict';

var StreamGroup = require('./StreamGroup');

var authActionstreams = new StreamGroup([
  'logIn',
  'logOut',
  'resetPassword'
]);

var authDatastreams = new StreamGroup([
  'result'
]);

module.exports = {
  actionstreams: authActionstreams,
  datastreams: authDatastreams
};
