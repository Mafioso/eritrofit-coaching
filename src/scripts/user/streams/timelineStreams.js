'use strict';

var StreamGroup = require('../../common/StreamGroup');

var timelineActionstreams = new StreamGroup([
  'loadSubmissions',
  'loadComments',
  'loadMeasurements',
  'approveSubmission',
  'commentResponse',
  'readMeasurement'
]);

var timelineDatastreams = new StreamGroup([
  'loadSubmissionsResult',
  'loadCommentsResult',
  'loadMeasurementsResult',
  'approveSubmissionResult',
  'commentResponseResult'
]);

module.exports = {
  actionstreams: timelineActionstreams,
  datastreams: timelineDatastreams
};
