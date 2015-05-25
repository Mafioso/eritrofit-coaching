'use strict';

var trackStreams = require('../streams/trackStreams.js');

var Store = require('../../common/Store');

var trackStore = new Store(function() {
  trackStreams.actionstreams.getDefaultTrackData.onValue(function(props) {
    DataAPI.getDefaultTrackData(trackStreams.datastreams.getDefaultTrackDataResult, props);
  });
});

module.epxorts = trackStore;
