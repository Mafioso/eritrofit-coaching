'use strict';

var Store = require('../../common/Store');
var userActionstreams = require('../streams/userStreams').actionstreams;
var userDatastreams = require('../streams/userStreams').datastreams;

var userStore = new Store(function() {

  userActionstreams.saveUserInfo.onValue(function(props) {
    DataAPI.updateCurrentUser(userDatastreams.result, props);
  });

  userActionstreams.savePassword.onValue(function(props) {
    DataAPI.updateCurrentUserPassword(userDatastreams.pwdResult, props);
  });

});

module.exports = userStore;
