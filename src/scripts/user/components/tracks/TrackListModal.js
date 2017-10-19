'use strict';

var deleteMeasurement = require('../../streams/measurementStreams.js').actionstreams.deleteMeasurement;
var deleteMeasurementResult = require('../../streams/measurementStreams.js').datastreams.deleteMeasurementResult;
var updateChartOnDelete = require('../../streams/measurementStreams.js').datastreams.updateChartOnDelete;
var updateRes = require('../../streams/measurementStreams.js').datastreams.updateRes;
var trackStreams = require('../../streams/trackStreams');
var getTracks = trackStreams.actionstreams.getTracks;
var getTracksRes = trackStreams.datastreams.getTracksRes;

var subscribe = trackStreams.actionstreams.subscribe;
var subscribeRes = trackStreams.datastreams.subscribeRes;

var addTrackRes = trackStreams.datastreams.addTrackRes;

var Preloader = require('../../../common/components/Preloader.jsx');
var tabIndex = 1;
var moment = require('moment');

var DeleteMeasurementModal = React.createClass({
  propTypes: {
    goalId: React.PropTypes.string,
    authorId: React.PropTypes.string,
    closeModal: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      error: '',
      mode: 'DEFAULT',
      data: []
    };
  },
  onClick: function(event){
    event.preventDefault();
    var id = event.target.href.substr(event.target.href.lastIndexOf('/')+1)
    subscribe.emit(id);
  },
  loadTrackList: function(payload){
    this.setState({
      data: payload 
    });
  },
  subscribeRes: function(payload){
    var id = payload.id;
    var list = this.state.data;
    list = list.filter(function(d){
      if(d.id !== id ) return d;
    });
    this.setState({
      data: list 
    });
    this.props.closeModal();
    addTrackRes.emit(payload);
  },
  componentWillMount: function() {
    document.body.className += ' overflow-hidden';
    getTracksRes.onValue(this.loadTrackList);
    subscribeRes.onValue(this.subscribeRes);
  },
  componentDidMount: function() {
    getTracks.emit(true);
  },
  componentWillUnmount: function() {
    document.body.className = document.body.className.replace(/\boverflow-hidden\b/, '');

  },
  render: function() {
    var self = this;
    var error;
    var yesButton;
    var noButton;
    var body;
    var style = "button block button-transparent border-bottom center";

    body = (
      <div className="center">
        {
          this.state.data.map(function(m){
              return <a href={m.id} className={style} onClick = {self.onClick}>{m.get('title')}</a>
          })
        }
      </div>
    );

    if(this.state.data.length == 0){
      body = (
        <div className="center">No Data</div>
      )
    }
    var currDate = new Date();
    if (this.state.error) {
      error = (
        <div className='red h5 mb2 center'>
          {this.state.error}
        </div>
      );
    }

    switch (this.state.mode) {
      case 'DEFAULT':
        yesButton = (
            <button
              tabIndex={tabIndex}
              className='rounded bg-blue white m2'
              type='submit'>
              Да
            </button>
        );
        noButton = (
            <button
              onClick={this.props.closeModal}
              tabIndex={tabIndex}
              className='rounded bg-blue white m2'
              type='button'>
              Назад
            </button>
        );
        break;


      default:
        break;
    }

    return (
      <div>
        <div
          className='bg-white muted z2'
          style={{
            width: '100vw',
            height: '100vh'
          }} />
        <div className='flex flex-column overflow-auto absolute top-0 left-0 right-0 bottom-0'>
          <div className='flex-auto'/>
          <div
            className='flex-none p1'
            style={{width: '100%', maxWidth: '24rem', margin: 'auto'}}>
            <div className='bg-white rounded modal'>

              <div className='p2 bold center border-bottom'>
                <div>
                  Выберите трек
                </div>
              </div>
              {body}
              {noButton}
            </div>
          </div>
          <div className='flex-auto' style={{minHeight: '4rem'}}/>
        </div>
      </div>
    );
  }
});

module.exports = DeleteMeasurementModal;
