'use strict';

var classNames = require('classnames');
var trackStreams = require('../streams/trackStreams');

var getTracks = trackStreams.actionstreams.getTracks;
var getTracksRes = trackStreams.datastreams.getTracksRes;
var getMyTracks = trackStreams.actionstreams.getMyTracks;
var getMyTracksRes = trackStreams.datastreams.getMyTracks;
var measurementStreams = require('../streams/measurementStreams');
var forceUpdate = measurementStreams.actionstreams.forceUpdate;
var onListUpdate = trackStreams.datastreams.onListUpdate;
var addTrackRes = trackStreams.datastreams.addTrackRes;

var updateAvg = measurementStreams.datastreams.updateAvg;
var deleteAvg = measurementStreams.datastreams.deleteAvg;

var Nav = require('../components/Nav.jsx');
var DefaultTrack = require('../components/tracks/DefaultTrack.jsx');
var TracksList = require('../components/tracks/TracksList.jsx');
var Track = require('../components/tracks/Track.jsx');
var FormButton = require('../components/FormButton.jsx');
var Portal = require('../../common/components/Portal.jsx');
var CreateMeasurementModal = require('../components/tracks/CreateMeasurementModal.js');
var UpdateMeasurementModal = require('../components/tracks/UpdateMeasurementModal.js');
var DeleteMeasurementModal = require('../components/tracks/DeleteMeasurementModal.js');
var TrackListModal = require('../components/tracks/TrackListModal.js');
var Periods = require('../components/tracks/Periods.js');
var _ = require('lodash');

var Tracks = React.createClass({
  getInitialState: function() {
    return {
      mode: 'LOADING',
      defaultTrackData: {},
      tracks: [],
      myTracks: [],
      period: "WEEK"
    };
  },
  showCreateMeasurementModal: function(trackId) {
    this.setState({trackId: trackId});
  },
  closeCreateMeasurementModal: function(event) {
    event.preventDefault();
    this.setState({trackId: ''});
  },
  showUpdateMeasurementModal: function(measurement){
    this.setState({
      measurement: measurement 
    });
  },
  closeUpdateMeasurementModal: function(event){
   // event.preventDefault();
    this.setState({
      measurement: '' 
    });
  },
  showDeleteMeasurementModal: function(measurement){
    this.setState({
      deleteMeasurement: measurement 
    });
  },
  closeDeleteMeasurementModal: function(event){
    //event.preventDefault();
    this.setState({
      deleteMeasurement: '' 
    });
  },
  showTrackListModal: function(event){
    event.preventDefault();
    this.setState({
      showTrackList: true 
    });
  },
  closeTrackListModal: function(event){
    this.setState({
      showTrackList: false 
    });
  },
  getDefaultTrackDataResult: function(data) {
    this.setState({
      defaultTrackData: data,
      mode: 'DEFAULT'
    });
  },
  onClick: function(payload){
    console.log('click');
    this.setState({
      period: payload 
    });
    forceUpdate.emit(payload);
  },

  addTrackRes: function(payload){

    var arr = this.state.myTracks;
    arr.tracks.push(payload);
    this.setState({
      myTracks: arr 
    });
  },
  /*
  unSubscribeRes: function(payload){
    console.log(payload+" deleted");
    var self = this;
    var tracks = this.state.myTracks;
    tracks.forEach(function(track, index){
      if(track.id === payload){
        tracks.splice(index, 1);
        self.setState({
          myTracks: tracks 
        });
      }
    });
  },
  */
  onListUpdate: function(payload){
    console.log('updating list');
    var nextState = this.state.myTracks;
    var utm = nextState.utms[payload.trackId]

    var total = utm.get('total') + 1;

    var old = utm.get('average');
    var newOne = old + (payload.measurement.get('value') - old)/(total);
   
    utm.set('average', newOne);
    utm.set('total', total);

    nextState.measurements[payload.trackId].push(payload.measurement);
    nextState.utms[payload.trackId] = utm;
    this.setState({
      myTracks: nextState 
    });
  },
  loadMyTracks: function(payload){
    this.setState({
      myTracks: payload 
    });
  },
  componentWillMount: function() {

    trackStreams.datastreams.getDefaultTrackDataResult.onValue(
      this.getDefaultTrackDataResult
    );

    trackStreams.datastreams.getMyTracks.onValue(
      this.loadMyTracks
    );

    trackStreams.datastreams.onListUpdate.onValue(
      this.onListUpdate
    );

    addTrackRes.onValue(this.addTrackRes);

    updateAvg.onValue(this.updateAvg);
    deleteAvg.onValue(this.deleteAvg);

  },
  updateAvg: function(measurement){
    console.log('updAVg');
    var utm = this.state.myTracks.utms[measurement.get('track').id];
    var avg = utm.get('average');
    var oldVal;
    var st = this.state.myTracks;
    var total = utm.get('total');
    if(!measurement.get('updated')){
      total++;
    }else{
      oldVal = measurement.get('old');
      var avg = utm.get('average');
      var newVal = measurement.get('value');
      var newAvg  = avg + (newVal - oldVal)/(total);
      utm.set('average', newAvg);
      st.utms[measurement.get('track').id] = utm;
      this.setState({
        myTracks: st 
      });
      return;
    }
    var newAvg = avg + (measurement.get('value') - avg)/(total);

    utm.set('average', newAvg);
    utm.set('total', t);

    st.utms[measurement.get('track').id] = utm;

    this.setState({
      myTracks: st 
    });

  },
  deleteAvg: function(measurement){
    var data = this.state.myTracks;
    var utm = data.utms[measurement.get('track').id];

    var total = utm.get('total');
    var avg = utm.get('average');
    total--;
    if(total <= 0){
      avg = 0;
      total = 0;
    }else{
      avg = (avg*(total+1) - measurement.get('value'))/total;
    }
    utm.set('total', total);
    utm.set('average', avg);
    data.utms[measurement.get('track').id] = utm;
    this.setState({
      myTracks: data 
    });
  },
  componentDidMount: function() {
    trackStreams.actionstreams.getDefaultTrackData.emit({
      date: new Date()
    });

    trackStreams.actionstreams.getMyTracks.emit(
      true 
    );
  },
  componentWillUnmount: function() {
    trackStreams.datastreams.getDefaultTrackDataResult.offValue(
      this.getDefaultTrackDataResult
    );

    trackStreams.datastreams.getTracks.offValue(
      this.loadTracks
    );

    trackStreams.datastreams.getTracks.offValue(
      this.loadMyTracks
    );
  },
  render: function() {
    var body;
    var self = this;
    var modal;

    if (this.state.trackId) {
      modal = (
        <CreateMeasurementModal
          closeModal={this.closeCreateMeasurementModal}
          trackId={this.state.trackId}
          authorId={this.props.params.currentUser.id} />
      );
    }

    if(this.state.measurement) {
      modal = (
        <UpdateMeasurementModal
          closeModal={this.closeUpdateMeasurementModal}
          showDeleteMeasurementModal = {this.showDeleteMeasurementModal}
          authorId={this.props.params.currentUser.id} 
          measurement = {this.state.measurement}/>
      );
    }

    if(this.state.deleteMeasurement) {
      modal = (
        <DeleteMeasurementModal
          closeModal={this.closeDeleteMeasurementModal}
          authorId={this.props.params.currentUser.id} 
          measurement = {this.state.deleteMeasurement} 
          closeUpdateModal={this.closeUpdateMeasurementModal} />
      );
    }

    if(this.state.showTrackList) {
      modal = (
        <TrackListModal closeModal = {this.closeTrackListModal}/>
      );
    }

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
            <div style={{ marginTop: '4.25rem' }} />
            <div>
            <Periods setPeriod = {self.onClick}/>
            {
              _.map(this.state.myTracks.tracks, function(track){
                return <Track id={track.id} 
                              title={track.get('title')}
                              unit={track.get('unit')} 
                              showCreateMeasurementModal={self.showCreateMeasurementModal} 
                              showUpdateMeasurementModal={self.showUpdateMeasurementModal} 
                              period = {self.state.period}
                              measurements = {self.state.myTracks.measurements[track.id]}
                              theme = {track.get('theme')}
                              type = {track.get('type')}
                              average = {self.state.myTracks.utms[track.id].get('average')}
                        />
              })
            }
            </div>
            <button className='button' onClick = {self.showTrackListModal}>Новые Треки</button>
            <div style={{ marginTop: '4.25rem' }} />
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
        <Portal>
          {modal}
        </Portal>
      </div>
    );
  }
});

module.exports = Tracks;
