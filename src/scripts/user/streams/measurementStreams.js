'use strict';

var StreamGroup = require('../../common/StreamGroup');


module.exports = {
  actionstreams: new StreamGroup([
    'createMeasurement',
    'getMeasurements',
    'update',
    'show',
    'hide',
    'updateMeasurement',
    'deleteMeasurement',
    'updateChartOnDelete',
    'forceUpdate',
    'onListUpdate'
  ]),
  datastreams: new StreamGroup([
    'createMeasurementResult',
    'getMeasurementsRes',
    'updateRes',
    'show',
    'hide',
    'updateMeasurementResult',
    'updateChart',
    'deleteMeasurementResult',
    'updateChartOnDelete',
    'updateAvg',
    'deleteAvg'
  ])
}