'use strict';

var StreamGroup = require('../../common/StreamGroup');

var goalsActionstreams = new StreamGroup([
  'getActiveGoals',
  'createSubmission',
  'getGoal',
  'removeSubmission'
]);

var goalsDatastreams = new StreamGroup([
  'getActiveGoalsResult',
  'createSubmissionResult',
  'getGoalResult',
  'removeSubmissionResult'
]);

module.exports = {
  actionstreams: goalsActionstreams,
  datastreams: goalsDatastreams
};
