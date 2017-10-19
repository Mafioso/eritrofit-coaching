'use strict';

var timelineActionstreams = require('../streams/timelineStreams').actionstreams;
var timelineDatastreams = require('../streams/timelineStreams').datastreams;

var loadSubmissions = timelineActionstreams.loadSubmissions;
var loadSubmissionsResult = timelineDatastreams.loadSubmissionsResult;

var loadComments = timelineActionstreams.loadComments;
var loadCommentsResult = timelineDatastreams.loadCommentsResult;

var loadMeasurements = timelineActionstreams.loadMeasurements;
var loadMeasurementsResult = timelineDatastreams.loadMeasurementsResult;

var approveSubmission = timelineActionstreams.approveSubmission;
var approveSubmissionResult = timelineDatastreams.approveSubmissionResult;

var commentResponse = timelineActionstreams.commentResponse;
var commentResponseResult = timelineDatastreams.commentResponseResult;

var readMeasurement = timelineActionstreams.readMeasurement;

var Store = require('../../common/Store');

var timelineStore = new Store(function() {

  loadSubmissions.onValue(
    function(payload){
      DataAPI.getPendingSubmissions(loadSubmissionsResult);
    }
  );

  loadComments.onValue(
    function(payload){
      DataAPI.getUnreadComments(loadCommentsResult);
    }
  );

  commentResponse.onValue(
    function(payload){
      DataAPI.commentResponse(payload, commentResponseResult);
    }
  );

  loadMeasurements.onValue(
    function(payload){
      DataAPI.getNewMeasurements(loadMeasurementsResult);
    }
  );

  readMeasurement.onValue(
    function(payload){
      DataAPI.readMeasurement(payload); 
    }
  )

  approveSubmission.onValue(
    function(payload){
      DataAPI.approveSubmission(payload, approveSubmissionResult);
    }
  );

});

module.exports = timelineStore;
