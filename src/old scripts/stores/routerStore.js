'use strict';

var routerActionstreams = require('../streams/routerStreams').actionstreams;
var routerDatastreams = require('../streams/routerStreams').datastreams;
var authActionstreams = require('../streams/authStreams').actionstreams;
require('./authStore');

var Store = require('./Store');
var RoutePattern = require('route-pattern');
var _ = require('lodash');
var moment = require('moment');

var routerStore = new Store(function() {
  var routes = {
    INDEX: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    RESET_PASSWORD: '/login/reset-password',
    DAY: '/day/:day',
    NOT_FOUND: '/404'
  };
  var views = {
    INDEX: 'INDEX',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    RESET_PASSWORD: 'RESET_PASSWORD',
    DAY: 'DAY',
    NOT_FOUND: 'NOT_FOUND'
  };

  var matchers = [];

  for (var view in routes) {
    var pattern = RoutePattern.fromString(routes[view]);
    matchers.push({
      pattern: pattern,
      view: view
    });
  }

  routerActionstreams.popstate.onValue(function(payload) {
    var nextView = payload;
    // payload should contain:
    // 1. targetUrl - transition to this url
    // 2. currentUrl - transition from this url
    // 3. currentView - transition from this view

    if (nextView.targetUrl === routes.LOGOUT) {
      authActionstreams.logOut.emit(null);
    }

    // CHECK IF VIEW EXISTS
    // after check newState should contain
    // 1. targetView - transition to this view
    // 2. params - props for targetView
    for (var i in matchers) {
      if (matchers[i].pattern.matches(payload.targetUrl)) {
        var params = matchers[i].pattern.match(payload.targetUrl);
        nextView.targetView = matchers[i].view;
        nextView.params = params.pathParams;
      }
    }

    // VIEW DOESN'T EXIST,
    // redirect to 404
    if (!nextView.targetView) {
      nextView.updateUrl = true;
      nextView.targetView = views.NOT_FOUND;
      nextView.targetUrl = routes.NOT_FOUND;

      routerDatastreams.route.emit(nextView);
    }

    // USER LOGGED IN?
    if (Parse.User.current()) {
      // HAVE RIGHTS FOR THIS PAGE?
      // 1. special case for login and password reset:
      //      - if popstate.next doesn't exist, set view to INDEX and target_url to routes.INDEX
      // 2. show 403 if doesn't have rights
      // 3. props or view update both change router's state, so rerender will be initiated,
      //    no need to split them into different channels

      if (_.indexOf([views.LOGIN, views.RESET_PASSWORD, views.INDEX], nextView.targetView) > - 1) {
        // redirect!
        var today = moment.utc().format('DDMMYY');
        nextView.updateUrl = true;
        nextView.targetView = views.DAY;
        nextView.targetUrl = '/day/'+today;
        nextView.params = { day: today };
      }


      _.assign(nextView.params, { currentUser: Parse.User.current().attributes });

    } else {
      // prompt login for pages, that are not LOGIN or RESET_PASSWORD
      if (_.indexOf([views.LOGIN, views.RESET_PASSWORD], nextView.targetView) === -1) {
        nextView.updateUrl = true;
        nextView.targetView = views.LOGIN;
        if (nextView.targetUrl !== routes.LOGOUT) {
          nextView.params.nextUrl = nextView.targetUrl;
        }
        nextView.targetUrl = routes.LOGIN;
      }
    }

    routerDatastreams.route.emit(nextView);
  });

  routerActionstreams.redirect.onValue(function(payload) {
    routerActionstreams.popstate.emit(_.assign(payload, { updateUrl: true }));
  });

});

module.exports = routerStore;
