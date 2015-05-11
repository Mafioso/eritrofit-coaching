'use strict';

var routerStore = require('../stores/routerStore');

var Icon = require('../../common/components/Icon.jsx');
var Userpic = require('../../common/components/Userpic.jsx');
var Portal = require('../../common/components/Portal.jsx');
var TimeoutTransitionGroup = require('../../common/components/TimeoutTransitionGroup.jsx');

var Nav = React.createClass({
  propTypes: {
    fullname: React.PropTypes.string.isRequired,
    userpic: React.PropTypes.string,
    currentUrl: React.PropTypes.string.isRequired,
    currentView: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      mode: 'DEFAULT'
    };
  },
  toggleMode: function(event) {
    event.preventDefault();

    switch(this.state.mode) {
      case 'DEFAULT':
        this.setState({mode: 'EXPANDED'});

        document.body.className += ' overflow-hidden';
        break;
      case 'EXPANDED':
        this.setState({mode: 'DEFAULT'});

        document.body.className = document.body.className.replace(/\boverflow-hidden\b/, '');
        break;
      default:
        break;
    }
  },
  getMenuItemClass: function(view) {
    if (this.props.currentView === view) {
      return 'button navy block button-transparent';
    }
    return 'button block button-transparent';
  },
  componentWillUnmount: function() {
    document.body.className = document.body.className.replace(/\boverflow-hidden\b/, '');
  },
  render: function() {
    var menuNode;
    switch (this.state.mode) {
      case 'EXPANDED':
        menuNode = (
          <div>
            <div
              onClick={this.toggleMode}
              className='0 bg-white muted z2'
              style={{
                width: '100vw',
                height: '100vh',
                top: '3.125rem'
              }} />
            <div
              className='absolute right-0 bottom-0 gray bg-white overflow-hidden z3 ml4 border-left'
              style={{
                top: '3.125rem',
                width: '256px',
                maxWidth: '100vw'
              }}>
              <ul className='h5 list-reset mb0'>
                <li className='py1 px2 bold border-top border-bottom'>
                  Добро пожаловать, <span className='navy'>{ this.props.fullname }!</span>
                </li>
                <li>
                  <a
                    tabIndex='1'
                    href='/#/goals' className={this.getMenuItemClass(routerStore.views.GOALS)}>Цели</a>
                </li>
                <li>
                  <a
                    tabIndex='1'
                    href='/#/tracks' className={this.getMenuItemClass(routerStore.views.TRACKS) + ' border-bottom'}>
                    Измерения
                  </a>
                </li>
                <li>
                  <a
                    tabIndex='1'
                    href='/#/messages' className={this.getMenuItemClass(routerStore.views.MESSAGES)}>
                    Сообщения
                  </a>
                </li>
                <li>
                  <a
                    tabIndex='1'
                    href='/#/settings' className={this.getMenuItemClass(routerStore.views.SETTINGS) + ' border-bottom'}>Настройки</a>
                </li>
                <li>
                  <a
                    tabIndex='1'
                    href='/#/logout'
                    className='button block button-transparent'>Выход</a>
                </li>
              </ul>
            </div>
          </div>
        );
        break;
      default:
        break;
    }

    return (
      <div>
        <div className='fixed top-0 left-0 right-0 clearfix navy bg-white z4'>
          <div className='left'>
            <a
              tabIndex='2'
              href='/#/goals' className='button m0 button-transparent'>
              <Icon name='eritrofit' />
            </a>
          </div>
          <div className='right'>
            <div id='account-menu' className='inline-block' data-disclosure>
              <div className='relative'>
                <button
                  tabIndex='1'
                  type='button'
                  className='h5 button py1 m0 button-transparent'
                  onClick={this.toggleMode}>
                  <Userpic src={this.props.userpic} /> &#9662;
                </button>
              </div>
            </div>
          </div>
        </div>
        <Portal>
          <TimeoutTransitionGroup
            enterTimeout={100}
            leaveTimeout={100}
            component='div'
            transitionName='NavModalTransition'>
            {menuNode}
          </TimeoutTransitionGroup>
        </Portal>
      </div>
    );
  }
});

module.exports = Nav;
