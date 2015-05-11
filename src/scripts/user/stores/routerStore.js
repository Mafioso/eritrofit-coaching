'use strict';

var routerActionstreams = require('../streams/routerStreams').actionstreams;
var routerDatastreams = require('../streams/routerStreams').datastreams;
var authActionstreams = require('../streams/authStreams').actionstreams;

var Store = require('../../common/Store');
var RoutePattern = require('route-pattern');
var _ = require('lodash');

var routerStore = new Store(function() {

  var self = this;
  self.routes = {
    INDEX: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    RESET_PASSWORD: '/login/reset-password',
    GOALS: '/goals',
    GOAL_DETAILS: '/goals/:goal',
    MESSAGES: '/messages',
    TRACKS: '/tracks',
    TRACK_DETAILS: '/tracks/:track',
    SETTINGS: '/settings',
    NOT_FOUND: '/404'
  };
  self.views = {
    INDEX: 'INDEX',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    RESET_PASSWORD: 'RESET_PASSWORD',
    GOALS: 'GOALS',
    GOAL_DETAILS: 'GOAL_DETAILS',
    MESSAGES: 'MESSAGES',
    TRACKS: 'TRACKS',
    TRACK_DETAILS: 'TRACK_DETAILS',
    SETTINGS: 'SETTINGS',
    NOT_FOUND: 'NOT_FOUND'
  };

  var matchers = [];

  for (var view in this.routes) {
    var pattern = RoutePattern.fromString(self.routes[view]);
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

    if (nextView.targetUrl === self.routes.LOGOUT) {
      authActionstreams.logOut.emit(true);
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
      nextView.targetView = self.views.NOT_FOUND;
      nextView.targetUrl = self.routes.NOT_FOUND;

      routerDatastreams.route.emit(nextView);
      return;
    }

    // USER LOGGED IN?
    if (Parse.User.current()) {
      // HAVE RIGHTS FOR THIS PAGE?
      // 1. special case for login and password reset:
      //      - if popstate.next doesn't exist, set view to INDEX and target_url to routes.INDEX
      // 2. show 403 if doesn't have rights
      // 3. props or view update both change router's state, so rerender will be initiated,
      //    no need to split them into different channels

      if (_.indexOf([self.views.LOGIN, self.views.RESET_PASSWORD, self.views.INDEX], nextView.targetView) > - 1) {
        // redirect!
        nextView.updateUrl = true;
        nextView.targetView = self.views.GOALS;
        nextView.targetUrl = self.routes.GOALS;
      }


      _.assign(nextView.params, {
        currentUser: Parse.User.current()
      });

    } else {
      // prompt login for pages, that are not LOGIN or RESET_PASSWORD
      if (_.indexOf([self.views.LOGIN, self.views.RESET_PASSWORD], nextView.targetView) === -1) {
        nextView.updateUrl = true;
        nextView.targetView = self.views.LOGIN;
        if (nextView.targetUrl !== self.routes.LOGOUT) {
          nextView.params.nextUrl = nextView.targetUrl;
        }
        nextView.targetUrl = self.routes.LOGIN;
      }
    }
    routerDatastreams.route.emit(nextView);
  });

  routerActionstreams.redirect.onValue(function(payload) {
    routerActionstreams.popstate.emit(_.assign(payload, { updateUrl: true }));
  });

});

module.exports = routerStore;
