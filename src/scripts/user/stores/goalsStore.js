'use strict';

var goalsActionstreams = require('../streams/goalsStreams').actionstreams;
var goalsDatastreams = require('../streams/goalsStreams').datastreams;

var Store = require('../../common/Store');
var goalsStore = new Store(function() {

  goalsActionstreams.getActiveGoals.onValue(function(conf) {

    DataAPI.getActiveGoalsByRecipientBeforeDate(goalsDatastreams.list, conf.recipientId, conf.date);

  });

});

module.exports = goalsStore;
