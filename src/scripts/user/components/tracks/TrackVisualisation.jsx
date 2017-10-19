var React = require('react');
var rd3 = require('react-d3');
var LineChart = rd3.LineChart;
var trackStreams = require('../../streams/trackStreams.js');
var measurementStreams = require('../../streams/measurementStreams.js');
var updateRes = measurementStreams.datastreams.updateRes;
var updateMeasurementResult = measurementStreams.datastreams.updateMeasurementResult;
var Chart = require('../../views/Chart.jsx');
var _ = require('lodash');
var moment = require('moment');


var TrackVisualisation = React.createClass({
  getInitialState: function() {
    return {
      items: [],
      test: [] 
    };
  },
  update: function(payload){
    console.log('update called successfully!');
    var item = { x: moment(payload.get('date')).format('YYYY-MM-DD'), y:payload.get('value'), id: payload.id };
    var data = this.state.items;
    data.push(item);
    this.setState({
      item: data 
    });
  },
  getMeasurements: function(payload){
    var data = [];
    for(var i=0; i<payload.length; i++){
      data.push({x: moment(payload[i].get('date')).format('YYYY-MM-DD'), y:payload[i].get('value'), id: payload[i].id });
    }
    this.setState({
      items: data
    });
  },
  componentWillMount: function() {
    
  },
  componentDidMount: function() {
    var uId = Parse.User.current().id;
    var tId = this.props.trackId;


    var props = {
      uId: uId,
      tId: tId
    };
   
  },
  render: function() {
    var self = this;

    return (
      <div>
         <Chart
         type = {self.props.type}
         theme = {self.props.theme}
         trackId={self.props.trackId}
         measurements={self.props.measurements} 
         showUpdateMeasurementModal = {self.props.showUpdateMeasurementModal} 
         period = { self.props.period }
         />
      </div>
    );
  }
});

module.exports = TrackVisualisation;

