'use strict';

var Icon = require('../components/Icon.jsx');
var authActionstreams = require('../streams/authStreams').actionstreams;
var authDatastreams = require('../streams/authStreams').datastreams;
var routerActionstreams = require('../streams/routerStreams').actionstreams;
require('../stores/authStore');

var Login = React.createClass({
  getInitialState: function() {
    return({
      error: '',
      loading: false
    });
  },
  onAuthResultValue: function() {
    this.setState({ loading: false });
    routerActionstreams.redirect.emit({
      targetUrl: this.props.params.nextUrl || '/',
      currentUrl: this.props.params.currentUrl,
      currentView: 'LOGIN'
    });
  },
  onAuthResultError: function(payload) {
    this.setState({ error: payload.code, loading: false });
  },
  componentDidMount: function() {
    authDatastreams.result.onValue(this.onAuthResultValue);
    authDatastreams.result.onError(this.onAuthResultError);
  },
  componentWillUnmount: function() {
    authDatastreams.result.offValue(this.onAuthResultValue);
    authDatastreams.result.offError(this.onAuthResultError);
  },
  handleSubmit: function(event) {
    event.preventDefault();

    this.setState({ loading: true });

    authActionstreams.logIn.emit({
      username: this.refs.loginEmail.getDOMNode().value,
      password: this.refs.loginPassword.getDOMNode().value
    });

  },
  render: function() {
    var error;

    switch(this.state.error) {
      case 101:
        error = (<div className='login-line login-line--error'>Проверьте введенные данные!</div>);
        break;
      default:
        break;
    }

    return (
      <form className='login' onSubmit={this.handleSubmit}>
        <div className='login-container'>
          <div className='login-heading'>
            <Icon name='logo' />
          </div>
          <input
            autoFocus
            className='login-input login-input--email'
            type='email'
            ref='loginEmail'
            placeholder='Email'  />
          <input
            className='login-input login-input--password'
            type='password'
            ref='loginPassword'
            placeholder='Пароль' />
          <div className='login-line login-line--alignright'>
            <a
              href='/#/login/reset-password'
              className='login-link'>
              Забыли пароль?
            </a>
          </div>

          {error}

          <button
            disabled={this.state.loading}
            className='login-submit'
            type='submit'>
              Войти
          </button>

          <div className='login-line login-line--aligncenter'>
            Регистрация закрыта, ищите нас в Facebook.
          </div>
        </div>
      </form>
    );
  }
});

module.exports = Login;
