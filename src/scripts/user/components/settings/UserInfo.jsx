'use strict';

var userActionstreams = require('../../streams/userStreams').actionstreams;
var userDatastreams = require('../../streams/userStreams').datastreams;
var routerActionstreams = require('../../streams/routerStreams').actionstreams;
var routerStore = require('../../stores/routerStore');
var Userpic = require('../../../common/components/Userpic.jsx');
var FileUpload = require('../../../common/components/FileUpload.jsx');
var Preloader = require('../../../common/components/Preloader.jsx');

var tabIndex=3;

var UserInfo = React.createClass({
  propTypes: {
    fullname: React.PropTypes.string.isRequired,
    userpic: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      error: '',
      userpic: {},
      loading: false
    };
  },
  onSubmit: function(event) {
    event.preventDefault();

    this.setState({
      loading: true
    });

    userActionstreams.saveUserInfo.emit({
      fullname: this.refs.fullname.getDOMNode().value,
      userpic: this.state.userpic
    });

  },
  setUserpic: function(userpic) {
    this.setState({
      userpic: userpic
    });
  },
  onSubmitResult: function() {
    this.setState({
      loading: false
    });
    // reload the page here
    var self = this;
    routerActionstreams.redirect.emit({
      targetUrl: window.location.hash.substring(1),
      currentUrl: self.props.currentUrl,
      currentView: routerStore.views.SETTINGS
    });
  },
  onSubmitError: function(error) {
    // set the error message here
    this.setState({
      error: error,
      loading: false
    });
  },
  componentWillMount: function() {
    userDatastreams.result.onValue(this.onSubmitResult);
    userDatastreams.result.onError(this.onSubmitError);
  },
  componentWillUnmount: function() {
    userDatastreams.result.offValue(this.onSubmitResult);
    userDatastreams.result.offError(this.onSubmitError);
  },
  render: function() {
    var error;
    var preloader;

    if (this.state.error) {
      error = (
        <div className='red h5'>
          {this.state.error}
        </div>
      );
    }

    if (this.state.loading) {
      preloader = (<Preloader />);
    }

    return (
      <div className='py1 px2 m1 mb2 bg-white rounded'>
        <div className='h3'>
          Имя и фото
        </div>
        <form onSubmit={this.onSubmit}>
          <div className='mb1'>
            <label className='block h5 gray' htmlFor='fullname'>
              Полное имя
            </label>
            <input
              autoComplete='false'
              tabIndex={tabIndex}
              ref='fullname'
              id='fullname'
              className='field-light full-width'
              type='text'
              name='fullname' defaultValue={this.props.fullname} />
          </div>

          <div className='mb1'>
            <label
              className='block h5 gray'
              htmlFor='userpic'>
              Фото
            </label>
            <div className='flex flex-top flex-wrap'>
              <div className='flex-auto'>
                <FileUpload
                  name='userpic'
                  label='Загрузить фотографию'
                  tabIndex={tabIndex}
                  getValue={this.setUserpic}
                  />
              </div>
              <div className='flex-none right-align ml1'>
                <Userpic src={this.props.userpic} />
              </div>
            </div>
          </div>

          <div className='flex flex-center mt2 py1 border-top'>
            <div className='flex-auto'>
              {error}
            </div>
            <div className='flex-none ml1'>
              <button
                tabIndex={tabIndex}
                className='button bg-gray'
                type='submit'>
                {preloader} Сохранить
              </button>
            </div>
          </div>

        </form>
      </div>
    );
  }
});

module.exports = UserInfo;
