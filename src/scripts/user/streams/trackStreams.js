  'use strict';

var StreamGroup = require('../../common/StreamGroup');



module.exports = {
  actionstreams: new StreamGroup([
    'getDefaultTrackData',
    'createTrack',  
    'getTracks',
    'subscribe',
    'getMyTracks',
    'unSubscribe',
    'getMeasurements'
  ]),
  datastreams: new StreamGroup([
    'getDefaultTrackDataResult',
    'getTracksRes',
    'subscribeRes',
    'getMyTracks',
    'unSubscribe',
    'getMeasurementsRes',
    'onListUpdate',
    'addTrackRes'
  ])
};
