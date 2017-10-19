'use strict';

var deleteMeasurement = require('../../streams/measurementStreams.js').actionstreams.deleteMeasurement;
var deleteMeasurementResult = require('../../streams/measurementStreams.js').datastreams.deleteMeasurementResult;
var updateChartOnDelete = require('../../streams/measurementStreams.js').datastreams.updateChartOnDelete;
var measurementStreams = require('../../streams/measurementStreams.js');

var updateRes = require('../../streams/measurementStreams.js').datastreams.updateRes;
var Preloader = require('../../../common/components/Preloader.jsx');
var deleteAvg = measurementStreams.datastreams.deleteAvg;
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
      mode: 'DEFAULT'
    };
  },
  onSubmit: function(event) {
    event.preventDefault();

    deleteMeasurement.emit(this.props.measurement.id);
  },  
  measurementResultHandler: function(payload) {
    console.log('id: '+payload);
    updateChartOnDelete.emit(payload.id);
    deleteAvg.emit(payload);

    this.setState({
      error: '',
      mode: 'SUCCESS'
    });
    this.props.closeModal();
    this.props.closeUpdateModal();
  },
  measurementErrorHandler: function() {
    this.setState({
      error: 'Обязательно выберите фото для загрузки',
      mode: 'DEFAULT'
    });
  },
  componentWillMount: function() {
    document.body.className += ' overflow-hidden';
    deleteMeasurementResult.onValue(this.measurementResultHandler);
  },
  componentWillUnmount: function() {
    document.body.className = document.body.className.replace(/\boverflow-hidden\b/, '');
    deleteMeasurementResult.offValue(this.measurementResultHandler);
  },
  render: function() {

    var error;
    var yesButton;
    var noButton;

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
              className='rounded bg-red white m2'
              type='button'>
              Нет
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
                  Вы уверены?
                </div>
              </div>

              <form
                className='p2'
                onSubmit={this.onSubmit}>

                <div className='center mb1'>
                  {yesButton}
                  {noButton}
                </div>

              </form>

            </div>
          </div>
          <div className='flex-auto' style={{minHeight: '4rem'}}/>
        </div>
      </div>
    );
  }
});

module.exports = DeleteMeasurementModal;
