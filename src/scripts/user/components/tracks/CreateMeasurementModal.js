'use strict';

var trackStreams = require('../../streams/trackStreams');
var createMeasurement = require('../../streams/measurementStreams.js').actionstreams.createMeasurement;
var createMeasurementResult = require('../../streams/measurementStreams.js').datastreams.createMeasurementResult;
var onListUpdate = trackStreams.datastreams.onListUpdate;
var updateRes = require('../../streams/measurementStreams.js').datastreams.updateRes;
var Preloader = require('../../../common/components/Preloader.jsx');
var tabIndex = 1;
var moment = require('moment');

var CreateMeasurementModal = React.createClass({
  getInitialState: function() {
    return {
      error: '',
      mode: 'DEFAULT'
    };
  },
  onSubmit: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'LOADING'
    });
    var value = this.refs.value.getDOMNode().value;
    var unit = this.refs.unit.getDOMNode().value;
    var createdBy = this.props.authorId;
    var date = this.refs.date.getDOMNode().value;

    var props = {
      value: value,
      unit: unit,
      createdBy: createdBy
    };

    var trackId = this.props.trackId;
    console.log("modal: "+trackId);
    createMeasurement.emit({
      userId: this.props.authorId,
      trackId: trackId,
      props: props,
      date: date
    });
    

  },
  measurementResultHandler: function(payload) {
    this.setState({
      error: '',
      mode: 'SUCCESS'
    });
    //updateRes.emit({x: moment(payload.get('date')).format('YYYY-MM-DD'), y:payload.get('value'), id: payload.id });
    var trackId = this.props.trackId;
    var res = {
      trackId: trackId,
      measurement: payload
    };
    onListUpdate.emit(res);
  },
  measurementErrorHandler: function() {
    this.setState({
      error: 'Обязательно выберите фото для загрузки',
      mode: 'DEFAULT'
    });
  },
  componentWillMount: function() {
    document.body.className += ' overflow-hidden';

    createMeasurementResult.onValue(this.measurementResultHandler);
    createMeasurementResult.onError(this.measurementErrorHandler);
  },
  componentWillUnmount: function() {
    document.body.className = document.body.className.replace(/\boverflow-hidden\b/, '');

    createMeasurementResult.offValue(this.measurementResultHandler);
    createMeasurementResult.offError(this.measurementErrorHandler);
  },
  render: function() {

    var error;
    var cancelButton;
    var submitButton;
    console.log('track: '+this.props.trackId);
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
        submitButton = (
          <div className='center mb1'>
            <button
              tabIndex={tabIndex}
              className='rounded bg-blue white'
              type='submit'>
              Сохранить
            </button>
          </div>
        );
        cancelButton = (
          <div className='center'>
            <button
              onClick={this.props.closeModal}
              tabIndex={tabIndex}
              className='button-small button-transparent h6 gray'
              type='button'>
              Отмена
            </button>
          </div>
        );
        break;

      case 'SUCCESS':
        submitButton = (
          <div className='center mb1'>
            <button
              onClick={this.props.closeModal}
              tabIndex={tabIndex}
              className='rounded bg-green white'
              type='button'>
              Готово
            </button>
          </div>
        );
        break;

      case 'LOADING':
        submitButton = (
          <div className='center mb1'>
            <button
              disabled={true}
              tabIndex={tabIndex}
              className='rounded bg-blue white'
              type='button'>
              <Preloader /> Сохранить
            </button>
          </div>
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
                  Загрузка результата
                </div>
              </div>

              <form
                className='p2'
                onSubmit={this.onSubmit}>

                <div className='mb1'>
                  <label
                    className='block h5 gray'>
                    Значение
                  </label>
                  <input 
                    type='int'
                    ref='value'
                    tabIndex={tabIndex}
                    className='field-light full-width' />
                </div>

                <div className='mb1'>
                  <label
                    className='block h5 gray'>
                    Величина
                  </label>
                    <input 
                    type='text'
                    ref='unit'
                    tabIndex={tabIndex}
                    className='field-light full-width' />
                </div>

                <div className='mb1'>
                  <label
                    className='block h5 gray'>
                    Дата
                  </label>
                    <input 
                    type='date'
                    defaultValue={currDate}
                    ref='date'
                    tabIndex={tabIndex}
                    className='field-light full-width' />
                </div>

                {error}
                {submitButton}
                {cancelButton}

              </form>

            </div>
          </div>
          <div className='flex-auto' style={{minHeight: '4rem'}}/>
        </div>
      </div>
    );
  }
});

module.exports = CreateMeasurementModal;
