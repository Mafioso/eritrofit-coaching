var React = require('react');

var Dropdown = React.createClass({
  changeState: function(payload){
    this.props.changeState(payload);
  },
  render: function() {
    var self = this;
    return (
    <div className="inline-block clearfix blue">
      <button type="button" className="left button x-group-item rounded-left button-transparent" onClick = {self.changeState.bind(self, 'submissions')}>Submissions</button>
      <button type="button" className="left button-outline x-group-item not-rounded" onClick = {self.changeState.bind(self, 'comments')}>Comments</button>
      <button type="button" className="left button-outline x-group-item not-rounded" onClick = {self.changeState.bind(self, 'measurements')}>Measurements</button>
    </div>
    );
  }

});

module.exports = Dropdown;