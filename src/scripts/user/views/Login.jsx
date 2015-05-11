'use strict';

var authActionstreams = require('../streams/authStreams').actionstreams;
var authDatastreams = require('../streams/authStreams').datastreams;
var routerActionstreams = require('../streams/routerStreams').actionstreams;
var routerStore = require('../stores/routerStore');

var Icon = require('../../common/components/Icon.jsx');


var Login = React.createClass({
  getInitialState: function() {
    return {
      error: ''
    };
  },
  authResultHandler: function(result) {
    console.log('result', result);
    var self = this;
    routerActionstreams.redirect.emit({
      targetUrl: window.location.hash.substring(1),
      currentUrl: self.props.params.currentUrl,
      currentView: routerStore.views.LOGIN
    });
  },
  authResultErrorHandler: function() {
    this.setState({
      error: 'Неправильные email и/или пароль'
    });
  },
  componentWillMount: function() {
    authDatastreams.result.onValue(this.authResultHandler);
    authDatastreams.result.onError(this.authResultErrorHandler);
  },
  componentWillUnmount: function() {
    authDatastreams.result.offValue(this.authResultHandler);
    authDatastreams.result.offError(this.authResultErrorHandler);
  },
  onSubmit: function(event) {
    event.preventDefault();
    this.setState({
      error: ''
    });

    var props = {
      username: this.refs.username.getDOMNode().value,
      password: this.refs.password.getDOMNode().value
    };

    authActionstreams.logIn.emit(props);
  },
  render: function() {
    var error;

    if (this.state.error) {
      error = (
        <div className='red h5 mb1'>
          {this.state.error}
        </div>
      );
    }

    return (
      <div
        className='flex-auto flex flex-center bg-white'>
        <form
          onSubmit={this.onSubmit}
          className='p2'
          style={{width: '100%', maxWidth: '18rem', margin: 'auto'}}>

          <div className='login-logo silver mb3'>
            <Icon name='eritrofit' />
          </div>

          {error}

          <div className='mb1'>
            <input
              className='field-light full-width'
              ref='username'
              placeholder='Email'
              type='text'
              name='username'
              autoFocus />
          </div>

          <div>
            <input
              className='field-light full-width'
              ref='password'
              placeholder='Пароль'
              type='password'
              name='password' />
          </div>

          <div className='mb2 right-align h5'>
            <a className='blue' href='/#/login/reset-password'>
              Забыли пароль?
            </a>
          </div>

          <div>
            <button type='submit' className='button-outline blue full-width'>
              Войти
            </button>
          </div>

        </form>
      </div>
    );
  }
});

module.exports = Login;
