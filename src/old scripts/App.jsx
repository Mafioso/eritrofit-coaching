'use strict';

window.React = require('react/addons');

window.Parse = require('parse').Parse;
Parse.initialize('4ylwbGhxEbyh0qVaH8i2M59ZsRK07JP7mDK9M5rV', 'xvVmKJk9Jumt0i94JTtWLibWRFLCctgh2UfYZQf1');

var moment = require('moment');
require('moment/locale/ru');
moment.locale('ru');

var fastclick = require('fastclick');
var _ = require('lodash');

// STREAMS START
var routerActionstreams = require('./streams/routerStreams').actionstreams;
var routerDatastreams = require('./streams/routerStreams').datastreams;
// STREAMS END

// warm-up router
require('./stores/routerStore');

// VIEWS START
var Login = require('./views/Login.jsx');
var ResetPassword = require('./views/ResetPassword.jsx');
var Day = require('./views/Day.jsx');
// END

var App = React.createClass({
  getInitialState: function() {
    return {
      currentUrl: window.location.hash.substring(1),
      view: 'DEFAULT'
    };
  },
  componentWillMount: function() {
    var self = this;
    window.onpopstate = function() {
      routerActionstreams.popstate.emit({
        targetUrl: window.location.hash.substring(1),
        currentUrl: self.state.currentUrl,
        currentView: self.state.view
      });
    };
  },
  onRouterRouteValue: function(payload) {
    this.setState({
      view: payload.targetView,
      params: payload.params,
      currentUrl: payload.targetUrl
    });

    if (payload.updateUrl) {
      window.history.replaceState({}, '', '#' + this.state.currentUrl);
    }
  },
  componentDidMount: function() {
    routerDatastreams.route.onValue(this.onRouterRouteValue);
  },
  componentWillUnmount: function() {
    routerDatastreams.route.offValue(this.onRouterRouteValue);
  },
  render: function() {
    var view;
    // in case of redirect
    var params = _.assign(this.state.params, { currentUrl: this.state.currentUrl });

    switch(this.state.view) {
      case 'LOGIN':
        view = <Login params={params} />;
        break;
      case 'RESET_PASSWORD':
        view = <ResetPassword params={params} />;
        break;
      case 'DAY':
        view = <Day params={params} />;
        break;
      default:
        view = <div>VIEW NOT SET</div>;
        break;
    }

    return(view);
  }
});

React.render(<App />, document.getElementById('main'));

fastclick(document.body);
