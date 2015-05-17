'use strict';

var goalsActionstreams = require('../streams/goalsStreams').actionstreams;
var goalsDatastreams = require('../streams/goalsStreams').datastreams;

var Store = require('../../common/Store');
var goalsStore = new Store(function() {

  goalsActionstreams.getActiveGoals.onValue(function(conf) {

    DataAPI.getActiveGoalsByRecipientBeforeDate(goalsDatastreams.getActiveGoalsResult, conf.recipientId, conf.date);

  });

  goalsActionstreams.createSubmission.onValue(function(conf) {

    DataAPI.createSubmission(goalsDatastreams.createSubmissionResult, conf.goalId, conf);

  });

  goalsActionstreams.getGoal.onValue(function(conf) {
    DataAPI.getGoalById(goalsDatastreams.getGoalResult, conf.recipientId, conf.goalId);
  });

  goalsActionstreams.removeSubmission.onValue(function(conf) {
    DataAPI.removeSubmission(conf.submissionId);
  });

});

module.exports = goalsStore;
