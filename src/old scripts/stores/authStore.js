'use strict';

var authActionstreams = require('../streams/authStreams').actionstreams;
var authDatastreams = require('../streams/authStreams').datastreams;
var Store = require('./Store');


var authStore = new Store(function() {

  authActionstreams.logIn.onValue(function(payload) {
    Parse.User.logIn(payload.username, payload.password).then(function(user) {
      authDatastreams.result.emit(user);
    }, function(error) {
      authDatastreams.result.error(error);
    });
  });

  authActionstreams.resetPassword.onValue(function(payload) {
    Parse.User.requestPasswordReset(payload.email).then(function(success) {
      authDatastreams.result.emit(success);
    }, function(error) {
      authDatastreams.result.error(error);
    });
  });

  authActionstreams.logOut.onValue(function() {
    Parse.User.logOut();
  });
});

module.exports = authStore;
