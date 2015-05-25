'use strict';

var Nav = require('../components/Nav.jsx');
var UserInfo = require('../components/settings/UserInfo.jsx');
var Password = require('../components/settings/Password.jsx');

var Settings = React.createClass({
  render: function() {
    var userpic;
    if (this.props.params.currentUser.get('userpicThumb')) {
      userpic = this.props.params.currentUser.get('userpicThumb').url();
    }
    return (
      <div className='cards'>
        <Nav
          fullname={this.props.params.currentUser.get('fullname')}
          userpic={userpic}
          currentUrl={this.props.params.currentUrl}
          currentView={this.props.params.currentView}
          />
        <div
          className='full-width'
          style={{marginBottom: '4.25rem'}} />
        <UserInfo
          currentUrl={this.props.currentUrl}
          fullname={this.props.params.currentUser.get('fullname')}
          userpic={userpic} />
        <Password />
      </div>
    );
  }
});

module.exports = Settings;
