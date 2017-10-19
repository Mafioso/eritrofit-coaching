var React = require('react');

var MeasurementEvent = React.createClass({
  onClick: function(payload){
    this.props.read(payload);
  },
  render: function() {
    var self = this;
    return (
      <div>
        <div>Track: {this.props.track}</div>
        <div>Value: {this.props.value}</div>
        <div>Unit: {this.props.unit}</div>
        <div>User: {this.props.user}</div>
        <div>Created By: {this.props.createdBy}</div>
        <button className='button-transparent bg-blue white' onClick = {self.onClick.bind(self, self.props.id)} >OK</button>
        <hr />
      </div>
    );
  }

});

module.exports = MeasurementEvent;