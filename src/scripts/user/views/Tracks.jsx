'use strict';

var classNames = require('classnames');
var trackStreams = require('../streams/trackStreams');

var Nav = require('../components/Nav.jsx');
var DefaultTrack = require('../components/tracks/DefaultTrack.jsx');

var Tracks = React.createClass({
  getInitialState: function() {
    return {
      mode: 'LOADING',
      defaultTrackData: {}
    };
  },
  getDefaultTrackDataResult: function(data) {
    console.log('data', data);
    this.setState({
      defaultTrackData: data,
      mode: 'DEFAULT'
    });
  },
  componentWillMount: function() {
    trackStreams.datastreams.getDefaultTrackDataResult.onValue(
      this.getDefaultTrackDataResult
    );
  },
  componentDidMount: function() {
    trackStreams.actionstreams.getDefaultTrackData.emit({
      date: new Date()
    });
  },
  componentWillUnmount: function() {
    trackStreams.datastreams.getDefaultTrackDataResult.offValue(
      this.getDefaultTrackDataResult
    );
  },
  render: function() {
    var body;
    var self = this;

    var containerClassName = classNames('flex-auto',
      {
        'flex flex-center': self.state.mode === 'LOADING'
      }
    );

    switch(this.state.mode) {
      case 'LOADING':
        body = (
          <div className='view-status gray h1'>
            Загрузка...
          </div>
        );
        break;
      case 'DEFAULT':
        body = (
          <div className='cards'>
            <div style={{ marginTop: '4.25rem' }} />
            <DefaultTrack
              mode={this.state.mode}
              data={this.state.defaultTrackData} />
          </div>
        );
        break;
      default:
        break;
    }

    return (
      <div className={containerClassName}>
        <Nav
          fullname={this.props.params.currentUser.get('fullname')}
          userpic={this.props.params.currentUser.get('userpicThumb').url()}
          currentUrl={this.props.params.currentUrl}
          currentView={this.props.params.currentView}
          />
        {body}
      </div>
    );
  }
});

module.exports = Tracks;
