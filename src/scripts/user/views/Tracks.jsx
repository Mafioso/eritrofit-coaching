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
            <div className='m2 gray'>
              <h3>Измерения</h3>
              <div className='mb1'>
                Здесь можно следить за изменениями, происходящими с Вашим организмом и общей статистикой
              </div>
              <div className='h6'>
                Если будет возможность добавлять собственные треки, за чем бы Вы хотели следить? <a href='/#/messages'>Ответить (ответьте пожалуйста в диалоге «Пожелания и доработки»)</a>
              </div>
            </div>
          </div>
        );
        break;
      default:
        break;
    }

    var userpic;
    if (this.props.params.currentUser.get('userpicThumb')) {
      userpic = this.props.params.currentUser.get('userpicThumb').url();
    }

    return (
      <div className={containerClassName}>
        <Nav
          fullname={this.props.params.currentUser.get('fullname')}
          userpic={userpic}
          currentUrl={this.props.params.currentUrl}
          currentView={this.props.params.currentView}
          />
        {body}
      </div>
    );
  }
});

module.exports = Tracks;
