var React = require('react');
var _ = require('lodash');
var trackStreams = require('../../streams/trackStreams.js');

var TracksList = React.createClass({
  subscribe: function(id){
    console.log("id: "+id);
    trackStreams.actionstreams.subscribe.emit(id);
  },
  render: function() {
    var data = this.props.data;
    var self = this; 
    return (
      <div><ul>{_.map(data, function(track){
          return <li><button onClick = {self.subscribe.bind(self, track.id)}>{track.get('title')}</button></li>
      })}</ul></div>
    );
  }

});

module.exports = TracksList;