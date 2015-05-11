'use strict';

var authActionstreams = require('../streams/authStreams').actionstreams;
var authDatastreams = require('../streams/authStreams').datastreams;

var Icon = require('../../common/components/Icon.jsx');

var LoginResetPassword = React.createClass({
  getInitialState: function() {
    return {
      success: '',
      error: ''
    };
  },
  authResultHandler: function() {
    this.setState({
      success: 'На указанный email будет выслано письмо с инструкциями'
    });
  },
  authResultErrorHandler: function() {
    this.setState({
      error: 'Неправильный email'
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
      error: '',
      success: ''
    });

    var props = {
      email: this.refs.username.getDOMNode().value
    };

    authActionstreams.resetPassword.emit(props);

  },
  render: function() {
    var error;
    var success;

    if (this.state.error) {
      error = (
        <div className='red h5 mb1'>
          {this.state.error}
        </div>
      );
    }

    if (this.state.success) {
      success = (
        <div className='green h5 mb1'>
          {this.state.success}
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
          {success}

          <div className='mb2'>
            <input
              className='field-light full-width'
              ref='username'
              placeholder='Email'
              type='text'
              name='username'
              autoFocus />
          </div>

          <div>
            <button type='submit' className='button-outline blue full-width'>
              Сбросить пароль
            </button>
          </div>

          <div className='mb1 right-align h5'>
            <a className='blue' href='/#/login'>
              или вернуться назад
            </a>
          </div>


        </form>
      </div>
    );
  }
});

module.exports = LoginResetPassword;
