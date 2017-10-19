var React = require('react');
var rd3 = require('react-d3');
var LineChart = rd3.LineChart;
var FormButton = require('../FormButton.jsx');
var measurementStreams = require('../../streams/measurementStreams.js');
var moment = require('moment');


var CreateMeasurementModal = React.createClass({
  getInitialState: function() {
    return {
      items:[] 
    };
  },
  onSubmit: function(){
    console.log('submit called');
    var self = this;
    var value = this.refs.value.getDOMNode().value;
    var unit = this.refs.unit.getDOMNode().value;
    var date = this.refs.date.getDOMNode().value;
    var user = Parse.User.current();
    console.log('sss: '+user.id);
    var userId = user.id;
    var payload = {
      userId: userId,
      trackId: self.props.trackId,
      props: {value: value, unit: unit, createdBy: user.id},
      date: date
    };
    console.log('wtf?');
    measurementStreams.actionstreams.createMeasurement.emit(payload);
  },
  createMeasurementResHandler: function(payload){
    console.log('MEASUREMENT ADDED');
  },
  componentWillMount: function() {
    measurementStreams.datastreams.createMeasurementRes.onValue(this.createMeasurementResHandler);
  },
  render: function() {
    console.log('s reafsd');
    var date = new Date();
    return (
      <div>
        <form onSubmit = {this.onSubmit}>
          <input type = 'int' ref='value' /><br />
          <input type = 'text' ref='unit' /><br />
          <input type = 'date' ref='date' value = {date} /><br />
          <input type = 'submit' value = 'SUBMIT' /><br />
        </form>
      </div>
    );
  }

});

module.exports = CreateMeasurementModal;