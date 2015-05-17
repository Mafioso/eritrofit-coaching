'use strict';

window.React = require('react/addons');
window.Parse = require('parse').Parse;
Parse.initialize('4ylwbGhxEbyh0qVaH8i2M59ZsRK07JP7mDK9M5rV', 'xvVmKJk9Jumt0i94JTtWLibWRFLCctgh2UfYZQf1');

var moment = require('moment');
require('moment/locale/ru');
moment.locale('ru');

var _ = require('lodash');
var fastclick = require('fastclick');

//////////////////////////////// VIEWS ///////////////////////////////
var GoalDetails = require('./views/GoalDetails.jsx');
var Goals = require('./views/Goals.jsx');
var Login = require('./views/Login.jsx');
var LoginResetPassword = require('./views/LoginResetPassword.jsx');
var Settings = require('./views/Settings.jsx');

/////////////////////////////// STREAMS //////////////////////////////
var routerActionstreams = require('./streams/routerStreams').actionstreams;
var routerDatastreams = require('./streams/routerStreams').datastreams;

// warm-up stores and dataAPI
require('../common/DataAPI').call();
var routerStore = require('./stores/routerStore');
require('./stores/authStore');
require('./stores/goalsStore');
require('./stores/userStore');

///////////////////////////////// APP ////////////////////////////////
var App = React.createClass({
  getInitialState: function() {
    return {
      currentUrl: window.location.hash.substring(1),
      view: 'DEFAULT'
    };
  },
  componentWillMount: function() {
    var self = this;
    window.addEventListener('popstate', function() {
      routerActionstreams.popstate.emit({
        targetUrl: window.location.hash.substring(1),
        currentUrl: self.state.currentUrl,
        currentView: self.state.view
      });
    });
  },
  onRouterUpdate: function(payload) {
    this.setState({
      view: payload.targetView,
      params: payload.params,
      currentUrl: payload.targetUrl
    });

    if (payload.updateUrl) {
      window.history.replaceState({}, '', '#' + payload.targetUrl);
    }
  },
  componentDidMount: function() {
    var self = this;
    routerDatastreams.route.onValue(this.onRouterUpdate);

    // INITIAL POP
    routerActionstreams.popstate.emit({
      targetUrl: window.location.hash.substring(1),
      currentUrl: self.state.currentUrl,
      currentView: self.state.view
    });
  },
  componentWillUnmount: function() {
    routerDatastreams.route.offValue(this.onRouterUpdate);
  },
  render: function() {
    var view;
    // in case of redirect
    var params = _.assign(this.state.params, {
      currentUrl: this.state.currentUrl,
      currentView: this.state.view
    });

    switch(this.state.view) {
      case routerStore.views.LOGIN:
        view = (<Login params={params} />);
        break;
      case routerStore.views.RESET_PASSWORD:
        view = (<LoginResetPassword params={params} />);
        break;
      case routerStore.views.GOALS:
        view = (<Goals params={params} />);
        break;
      case routerStore.views.GOAL_DETAILS:
        view = (<GoalDetails params={params} />);
        break;
      case routerStore.views.MESSAGES:
        view = (<div>MESSAGES</div>)
        break;
      case routerStore.views.SETTINGS:
        view = (<Settings params={params} />);
        break;
      default:
        view = (<div>
          ERROR: view not set on { this.state.view }
        </div>);
        break;
    }

    return(view);

  }
});

React.render(<App />, document.getElementById('app'));

fastclick(document.body);
