'use strict';

var trackStreams = require('../streams/trackStreams.js');


var Store = require('../../common/Store');

var trackStore = new Store(function() {
  trackStreams.actionstreams.getDefaultTrackData.onValue(function(props) {
    console.log("gdt: CALLED");
    DataAPI.getDefaultTrackData(trackStreams.datastreams.getDefaultTrackDataResult, props);
  });
  //create track
  trackStreams.actionstreams.createTrack.onValue(function(props){
    
  });

  //get measurements
  trackStreams.actionstreams.getMeasurements.onValue(function(payload){
    console.log('shit');
    var emitter = trackStreams.datastreams.getMeasurementsRes;
    DataAPI.getMeasurementsByTrack(payload.tId, payload.uId, emitter);
  });
  //datastreams
  //get list of tracks
  trackStreams.actionstreams.getTracks.onValue(function(payload){
    console.log("gts: CALLED");
    var emitter = trackStreams.datastreams.getTracksRes;
    DataAPI.getTracks(emitter);
  });

  //subsribe
  trackStreams.actionstreams.subscribe.onValue(function(id){
    var emitter = trackStreams.datastreams.subscribeRes;
    DataAPI.subscribeToTrack(id, emitter);
  });

  trackStreams.actionstreams.getMyTracks.onValue(function(payload){
    var emitter = trackStreams.datastreams.getMyTracks;
    DataAPI.getMyTracks(emitter);
  });

  trackStreams.actionstreams.unSubscribe.onValue(function(id){
    console.log('REMOVED');
    var emitter = trackStreams.datastreams.unSubscribe;
    DataAPI.unSubscribe(id, emitter);
  });
});


module.exports = trackStore;
