'use strict';

window.React = require('react/addons');
window.Parse = require('parse').Parse;
Parse.initialize("b6YvZJi26wQdC3spp2hjq7b2eJhyrMVtaXYLUymu", 
         "gtfl1go7Nh1bmmbx6NQTUctKbBPDquJed0F0EV7F");

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
var Tracks = require('./views/Tracks.jsx');
var Chart = require('./views/Chart.jsx');
var Messages = require('./views/Messages.jsx');
var Timeline = require('./views/Timeline.jsx');

var ModeSwitch = require('../common/components/ModeSwitch.jsx');
var Shell = require('../common/components/Shell.jsx');
var Portal = require('../common/components/Portal.jsx');
var TimeoutTransitionGroup = require('../common/components/TimeoutTransitionGroup.jsx');
var NewMessagesModal = require('./components/messages/NewMessagesModal.jsx');
var TracksList = require('./components/tracks/TracksList.jsx');
var FormButton = require('./components/FormButton.jsx');

/////////////////////////////// STREAMS //////////////////////////////
var routerActionstreams = require('./streams/routerStreams').actionstreams;
var routerDatastreams = require('./streams/routerStreams').datastreams;
var messageStreams = require('./streams/messageStreams.js');

// warm-up stores and dataAPI
require('../common/DataAPI').call();
var routerStore = require('./stores/routerStore');
require('./stores/authStore');
require('./stores/goalsStore');
require('./stores/userStore');
require('./stores/trackStore');
require('./stores/messageStore');
require('./stores/measurementStore');
require('./stores/timelineStore');

var reloadNewMessages = true;

///////////////////////////////// APP ////////////////////////////////
var App = React.createClass({
  getInitialState: function() {
    return {
      currentUrl: window.location.hash.substring(1),
      view: '',
      newMessages: {
        comments: {},
        messages: []
      },
      showNewMessages: false
    };
  },
  getUnreadMessagesResultHandler: function(data) {
    this.setState({
      newMessages: data,
      showNewMessages: true
    });
  },
  closeNewMessagesModal: function(e) {
    e.preventDefault();
    this.setState({
      showNewMessages: false
    });
    messageStreams.actionstreams.markAllNewMessagesAsRead.emit({
      umMaps: this.state.newMessages.umMaps
    });
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
    messageStreams.datastreams.getUnreadMessagesResult.onValue(this.getUnreadMessagesResultHandler);
    messageStreams.datastreams.createCommentResult.onValue(this.createCommentResultHandler);
    messageStreams.datastreams.removeCommentResult.onValue(this.removeCommentResultHandler);
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

    if (reloadNewMessages && payload.params.currentUser) {
      messageStreams.actionstreams.getUnreadMessages.emit({
        userId: payload.params.currentUser.id,
        date: new Date()
      });
      reloadNewMessages = false;
    }

  },
  createCommentResultHandler: function(comment) {
    var data = _.clone(this.state.newMessages);
    if (data.comments[comment.get('message').id]) {
      data.comments[comment.get('message').id].push(comment);
    } else {
      data.comments[comment.get('message').id] = [comment];
    }
    this.setState({
      newMessages: data
    });
  },
  removeCommentResultHandler: function(comment) {
    var data = _.clone(this.state.newMessages);
    var index = _.findIndex(data.comments[comment.get('message').id], { id: comment.id });
    data.comments[comment.get('message').id].splice(index, 1);
    this.setState({
      newMessages: data
    });
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
    messageStreams.datastreams.getUnreadMessagesResult.offValue(this.getUnreadMessagesResultHandler);
    messageStreams.datastreams.createCommentResult.offValue(this.createCommentResultHandler);
    messageStreams.datastreams.removeCommentResult.offValue(this.removeCommentResultHandler);
  },
  render: function() {
    // in case of redirect
    var params = _.assign(this.state.params, {
      currentUrl: this.state.currentUrl,
      currentView: this.state.view
    });

    var newMessagesModal;
    if (this.state.showNewMessages && this.state.newMessages.messages.length > 0) {
      newMessagesModal = (
        <NewMessagesModal
          userId={this.state.params.currentUser.id}
          closeModal={this.closeNewMessagesModal}
          data={this.state.newMessages} />
      );
    }

    return(
      <div className='flex-auto flex'>
        <ModeSwitch mode={this.state.view}>
          <Login key={routerStore.views.LOGIN} params={params} />
          <LoginResetPassword key={routerStore.views.RESET_PASSWORD} params={params} />
          <Goals key={routerStore.views.GOALS} params={params} />
          <GoalDetails key={routerStore.views.GOAL_DETAILS} params={params} />
          <Messages key={routerStore.views.MESSAGES} params={params} />
          <Settings key={routerStore.views.SETTINGS} params={params} />
          <Tracks key={routerStore.views.TRACKS} params={params} />
          <Timeline key={routerStore.views.TIMELINE} params={params} />
          <Shell key={routerStore.views.NOT_FOUND}>
            <div>Nothing found</div>
          </Shell>
          <Chart key={routerStore.views.TEST} params={params} />
        </ModeSwitch>

        <Portal>
          <TimeoutTransitionGroup
            enterTimeout={100}
            leaveTimeout={100}
            component='div'
            transitionName='NewMessagesModalTransition'>
            {newMessagesModal}
          </TimeoutTransitionGroup>
        </Portal>

      </div>
    );

  }
});

React.render(<App />, document.getElementById('app'));

fastclick(document.body);
