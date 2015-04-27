'use strict';

var Icon = require('./Icon.jsx');

var moment = require('moment');

var Nav = React.createClass({
  openUserSettingsModal: function(event) {
    this.props.openUserSettingsModal(event);
  },
  render: function() {

    var todayUrl = '/#/day/' + moment.utc().format('DDMMYY');
    var userpic;

    return (
      <header className='body-header'>
        <a href={todayUrl} className='nav-link nav-link--logo'>
          <Icon name='logo' />
        </a>
        <nav className='nav'>
          <ul className='nav-list'>
            <li className='nav-list-item'>
              <a href={todayUrl} className='nav-link nav-link--active'>Тренировки</a>
            </li><li className='nav-list-item nav-list-item--extended'>
              <span className='nav-link nav-link--user'>
                <span className='figure-userpic figure-userpic--nav'>
                  <img src={userpic} alt={this.props.user.fullname} />
                </span>
                <Icon name='arrow-down' />
              </span>
              <ul className='nav-list-extra'>
                <li className='nav-list-extra-item'>
                  <span className='nav-link nav-link--dummy'>
                    Привет, <strong>{this.props.user.fullname}</strong>!
                  </span>
                </li>
                <li className='nav-list-extra-item'>
                  <button
                    onClick={this.openUserSettingsModal}
                    className='nav-link'>
                    Настройки
                  </button>
                </li>
                <li className='nav-list-extra-item'>
                  <a href='/#/logout' className='nav-link'>Выход</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
});

module.exports = Nav;
