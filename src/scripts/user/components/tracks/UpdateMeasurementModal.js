'use strict';

var updateMeasurement = require('../../streams/measurementStreams.js').actionstreams.updateMeasurement;
var updateMeasurementResult = require('../../streams/measurementStreams.js').datastreams.updateMeasurementResult;
var updateAvg = require('../../streams/measurementStreams.js').datastreams.updateAvg;
var updateChart = require('../../streams/measurementStreams.js').datastreams.updateChart;
var Preloader = require('../../../common/components/Preloader.jsx');
var tabIndex = 1;
var moment = require('moment');

var UpdateMeasurementModal = React.createClass({
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
    var mId = this.props.measurement.id;

    updateMeasurement.emit({mId: mId, value: value});
  },
  removeMeasurement: function(){
    this.props.showDeleteMeasurementModal(this.props.measurement);
  },
  measurementResultHandler: function(payload) {
    this.setState({
      error: '',
      mode: 'SUCCESS'
    });
    updateChart.emit(payload);
    updateAvg.emit(payload);
  },
  measurementErrorHandler: function() {
    this.setState({
      error: 'Обязательно выберите фото для загрузки',
      mode: 'DEFAULT'
    });
  },
  componentWillMount: function() {
    document.body.className += ' overflow-hidden';

    updateMeasurementResult.onValue(this.measurementResultHandler);
    //createMeasurementResult.onError(this.measurementErrorHandler);
  },
  componentWillUnmount: function() {
    document.body.className = document.body.className.replace(/\boverflow-hidden\b/, '');

    updateMeasurementResult.offValue(this.measurementResultHandler);
    //createMeasurementResult.offError(this.measurementErrorHandler);
  },
  render: function() {

    var error;
    var cancelButton;
    var submitButton;
    var deleteButton;

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
        deleteButton = (
          <div className='center mb1'>
            <button
              tabIndex={tabIndex}
              className='rounded bg-red white'
              onClick = {this.removeMeasurement}
              type='button'>
              Удалить
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
                  Обновление измерения
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
                    type='number'
                    ref='value'
                    defaultValue={this.props.measurement.y}
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
                    value={this.props.measurement.x}
                    ref='date'
                    tabIndex={tabIndex}
                    className='field-light full-width' />
                </div>

                {error}
                {submitButton}
                {deleteButton}
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

module.exports = UpdateMeasurementModal;
