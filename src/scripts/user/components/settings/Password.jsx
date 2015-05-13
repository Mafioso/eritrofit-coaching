'use strict';

var userActionstreams = require('../../streams/userStreams').actionstreams;
var userDatastreams = require('../../streams/userStreams').datastreams;
var routerActionstreams = require('../../streams/routerStreams').actionstreams;
var routerStore = require('../../stores/routerStore');
var Preloader = require('../../../common/components/Preloader.jsx');

var tabIndex = 3;

var Password = React.createClass({
  getInitialState: function() {
    return {
      error: '',
      loading: false
    };
  },
  onSubmit: function(event) {
    event.preventDefault();
    this.setState({
      loading: true
    });
    userActionstreams.savePassword.emit({
      newPassword: this.refs.password.getDOMNode().value,
      newPasswordAgain: this.refs.passwordAgain.getDOMNode().value
    });
  },
  onSubmitResult: function(result) {
    console.log(result);
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
  onSubmitError: function() {
    // set the error message here
    this.setState({
      error: 'Пароли должны совпадать и состоять из более чем 6 символов',
      loading: false
    });
  },
  componentWillMount: function() {
    userDatastreams.pwdResult.onValue(this.onSubmitResult);
    userDatastreams.pwdResult.onError(this.onSubmitError);
  },
  componentWillUnmount: function() {
    userDatastreams.pwdResult.offValue(this.onSubmitResult);
    userDatastreams.pwdResult.offError(this.onSubmitError);
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
          Новый пароль
        </div>
        <form onSubmit={this.onSubmit}>
          <div className='mb1'>
            <label className='block h5 gray' htmlFor='password'>
              Пароль
            </label>
            <input
              ref='password'
              id='password'
              className='field-light full-width'
              type='password'
              name='password' />
          </div>
          <div className='mb1'>
            <label className='block h5 gray' htmlFor='passwordAgain'>
              Еще раз
            </label>
            <input
              ref='passwordAgain'
              id='passwordAgain'
              className='field-light full-width'
              type='password'
              name='passwordAgain' />
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

module.exports = Password;
