'use strict';

var StreamGroup = require('../../common/StreamGroup');

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
