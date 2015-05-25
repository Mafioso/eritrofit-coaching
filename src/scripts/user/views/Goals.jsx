'use strict';

var classNames = require('classnames');

var GoalsList = require('../components/goals/GoalsList.jsx');
var Nav = require('../components/Nav.jsx');
var goalsActionstreams = require('../streams/goalsStreams').actionstreams;
var goalsDatastreams = require('../streams/goalsStreams').datastreams;
var _ = require('lodash');

var Goals = React.createClass({
  getInitialState: function() {
    return {
      data: {},
      mode: 'LOADING' // DEFAULT
    };
  },
  onGoalsListUpdate: function(list) {
    this.setState({data: list, mode: 'DEFAULT'});
  },
  addSubmissionToState: function(newSubmission) {
    var data = _.clone(this.state.data);
    var SubmissionState = Parse.Object.extend('SubmissionState');
    var submissionState = new SubmissionState();

    submissionState.set('isApproved', false);

    if (data.submissions[newSubmission.get('goal').id]) {
      data.submissions[newSubmission.get('goal').id].push(newSubmission);
    } else {
      data.submissions[newSubmission.get('goal').id] = [newSubmission];
    }

    data.submissionStates[newSubmission.id] = submissionState;

    this.setState({data: data});

  },
  componentWillMount: function() {
    goalsDatastreams.getActiveGoalsResult.onValue(this.onGoalsListUpdate);
    goalsDatastreams.createSubmissionResult.onValue(this.addSubmissionToState);
  },
  componentDidMount: function() {
    // FIRST TIME
    goalsActionstreams.getActiveGoals.emit({
      recipientId: this.props.params.currentUser.id,
      date: new Date()
    });
    this.setState({mode: 'LOADING'});
  },
  componentWillUnmount: function() {
    goalsDatastreams.getActiveGoalsResult.offValue(this.onGoalsListUpdate);
    goalsDatastreams.createSubmissionResult.offValue(this.addSubmissionToState);
  },
  componentWillReceiveProps: function() {
    // HANDLE VIEW UPDATES
    goalsActionstreams.getActiveGoals.emit({
      recipientId: this.props.params.currentUser.id,
      date: new Date()
    });
    this.setState({mode: 'LOADING'});
  },
  render: function() {
    var body;
    var self = this;

    var containerClassName = classNames('flex-auto',
      {
        'flex flex-center': self.state.mode === 'LOADING'
      }
    );


    switch(this.state.mode) {
      case 'LOADING':
        body = (
          <div className='view-status gray h1'>
            Загрузка...
          </div>
        );
        break;
      case 'DEFAULT':
        // show goals list
        if (this.state.data.goals.length === 0) {
          containerClassName = 'flex-auto flex flex-center';
          body = (
            <div
              className='view-status gray center'
              style={{marginTop: '4.25rem'}}>
              <div className='h2 mb1'>
                Цели кончились, можно отдохнуть 👍
              </div>
              <img src='/images/giphy.gif' />
              <div className='h6 right-align'>
                <a
                  className='gray'
                  href='http://giphy.com/gifs/animation-illustration-pixel-art-RpykndCCixr9e'>
                  Giphy
                </a>
              </div>
            </div>
          );
        } else {
          body = (
            <GoalsList
              goals={this.state.data.goals}
              submissions={this.state.data.submissions}
              submissionStates={this.state.data.submissionStates}
              currentUser={this.props.params.currentUser.id}
              />
          );
        }

        break;
      default:
        break;
    }

    var userpic;
    if (this.props.params.currentUser.get('userpicThumb')) {
      userpic = this.props.params.currentUser.get('userpicThumb').url();
    }

    return (
      <div className={containerClassName}>
        <Nav
          fullname={this.props.params.currentUser.get('fullname')}
          userpic={userpic}
          currentUrl={this.props.params.currentUrl}
          currentView={this.props.params.currentView}
          />
        {body}
      </div>
    );
  }
});

module.exports = Goals;
