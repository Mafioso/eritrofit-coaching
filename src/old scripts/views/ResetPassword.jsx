'use strict';

var Icon = require('../components/Icon.jsx');
var authActionstreams = require('../streams/authStreams').actionstreams;
var authDatastreams = require('../streams/authStreams').datastreams;

var ResetPassword = React.createClass({
  getInitialState: function() {
    return {
      error: '',
      loading: false,
      success: false
    };
  },
  onResultValue: function(payload) {
    if (payload.isError && payload.isError()) {
      this.setState({ error: payload.error.code, loading: false });
    } else {
      this.setState({ error: '', success: true, loading: false });
    }
  },
  componentDidMount: function() {
    authDatastreams.result.onValue(this.onResultValue);
  },
  componentWillUnmount: function() {
    authDatastreams.result.offValue(this.onResultValue)
  },
  handleSubmit: function(event) {
    event.preventDefault();
    this.setState({loading: true});
    var email = this.refs.loginEmail.getDOMNode().value;
    authActionstreams.resetPassword.emit({
      email: email
    });
  },
  render: function() {

    var error;

    switch(this.state.error) {
      case 204:
        error = (<div className='login-line login-line--error'>Проверьте введенные данные!</div>);
        break;
      case 205:
        error = (<div className='login-line login-line--error'>Пользователя с таким email не существует</div>);
      default:
        break;
    }

    var success;

    if (this.state.success) {
      success = (<div className='login-line login-line'>
        Письмо с инструкциями было отправлено
      </div>);
    }

    return(
      <form className='login' onSubmit={this.handleSubmit}>
        <div className='login-container'>
          <div className='login-heading'>
            <Icon name='logo' />
          </div>
          <div className='login-line'>Восстановление пароля</div>
          <input
            autoFocus
            className='login-input login-input--single'
            type='email'
            ref='loginEmail'
            placeholder='Email'  />

          {error}
          {success}

          <button className='login-submit' type='submit'>Отправить письмо с инструкциями</button>
          <div className='login-line login-line--alignright'>
            или <a href='/#/login'>вернуться назад</a>
          </div>
        </div>
      </form>
    );
  }
});

module.exports = ResetPassword;
