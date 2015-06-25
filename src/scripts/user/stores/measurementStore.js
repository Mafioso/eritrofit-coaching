'use strict';

var measurementStreams = require('../streams/measurementStreams.js');

var deleteMeasurement = measurementStreams.actionstreams.deleteMeasurement;
var deleteMeasurementResult = measurementStreams.datastreams.deleteMeasurementResult;

var Store = require('../../common/Store');

var measurementStore = new Store(function() {
  //create track
  measurementStreams.actionstreams.createMeasurement.onValue(function(payload){
    var uId = payload.userId;
    var trackId = payload.trackId;
    var props = payload.props;
    var date = payload.date;
    var emitter = measurementStreams.datastreams.createMeasurementResult;

    DataAPI.createMeasurement(uId, trackId, props, date, emitter);
  });

  measurementStreams.actionstreams.updateMeasurement.onValue(function(payload){
    var emitter = measurementStreams.datastreams.updateMeasurementResult;
    DataAPI.updateMeasurement(payload.mId, payload.value, emitter);
  });

  deleteMeasurement.onValue(function(mId){
    DataAPI.removeMeasurement(mId, deleteMeasurementResult);
  });
  
});


module.epxorts = measurementStore;
