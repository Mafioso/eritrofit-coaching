var React = require('react');
var trackStreams = require('../../streams/trackStreams.js');

//views
var CreateMeasurementModal = require('./CreateMeasurementModal.jsx');
var FormButton = require('../FormButton.jsx');
var TrackVisualisation = require('./TrackVisualisation.jsx');

var rd3 = require('react-d3');


var Track = React.createClass({
  showCreateMeasurementModal: function() {
    this.props.showCreateMeasurementModal(this.props.id);
  },
  onClick: function(id){
    trackStreams.actionstreams.unSubscribe.emit(id);
  },
  render: function() {
    var self = this;
    var theme = self.props.theme;
    var themeHead = theme+"-head"; 
    console.log(self.props.theme);
    return (
      <div className="border bg-lighter-gray rounded mt2">
        <div>
          <div className={themeHead} >
           <div className="inline-block">
              <div className='h3 bold flex-auto'>
                {self.props.title}
              </div>
              <div className='h6'>
                Средне: {self.props.average}
              </div>
            </div>
            <div className="inline-block right">
              <div className='h3 bold flex-auto'>
                <span>467</span><span className="h5">{self.props.unit}</span>
              </div>
              <div className='h6'>
                Сегодня
              </div>
            </div>
           </div>

           <div>
           <TrackVisualisation type = {self.props.type} theme={self.props.theme} measurements = {self.props.measurements} trackId = { self.props.id } period={self.props.period} showUpdateMeasurementModal = {self.props.showUpdateMeasurementModal}/>
           </div>
        </div>
        <div className='h6 bg-white rounded-bottom flex flex-center flex-wrap py1'>
          <div className='px2 gray flex-auto mt1 mb1'>
            Финиш 
          </div>
          <div className='flex-none px2 mt1 mb1'>
            <button onClick={this.showCreateMeasurementModal} className='button-small button-outline blue' type='button'>
              Загрузить результат
            </button>
          </div>
          <div className='full-width'>
            {this.props.children}
          </div>
        </div>
        </div>
    );
  }

});

module.exports = Track;