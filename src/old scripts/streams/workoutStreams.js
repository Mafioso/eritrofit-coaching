'use strict';

var StreamGroup = require('./StreamGroup');

var workoutActionstreams = new StreamGroup([
  'getWorkoutsByDay',

  'create',
  'update',
  'delete'
]);

var workoutDatastreams = new StreamGroup([
  'workoutsByDay',

  'create',
  'update',
  'delete'
]);

module.exports = {
  actionstreams: workoutActionstreams,
  datastreams: workoutDatastreams
};
