'use strict';

var classNames = require('classnames');
var Nav = require('../components/Nav.jsx');
var Goal = require('../components/goals/Goal.jsx');
var SubmissionsList = require('../components/goals/SubmissionsList.jsx');
var goalsActionstreams = require('../streams/goalsStreams').actionstreams;
var goalsDatastreams = require('../streams/goalsStreams').datastreams;
var CreateSubmissionModal = require('../components/goals/CreateSubmissionModal.jsx');
var _ = require('lodash');
var Portal = require('../../common/components/Portal.jsx');

var GoalDetails = React.createClass({
  getInitialState: function() {
    return {
      data: {},
      mode: 'LOADING', // DEFAULT
      showModal: false
    };
  },
  getGoalResultHandler: function(data) {
    this.setState({
      data: data,
      mode: 'DEFAULT'
    });
  },
  componentWillMount: function() {
    goalsDatastreams.getGoalResult.onValue(this.getGoalResultHandler);
    goalsDatastreams.createSubmissionResult.onValue(this.addSubmissionToState);
  },
  componentDidMount: function() {
    // FIRST TIME
    goalsActionstreams.getGoal.emit({
      recipientId: this.props.params.currentUser.id,
      goalId: this.props.params.goal
    });
    this.setState({mode: 'LOADING'});
  },
  componentWillUnmount: function() {
    goalsDatastreams.getGoalResult.offValue(this.getGoalResultHandler);
    goalsDatastreams.createSubmissionResult.offValue(this.addSubmissionToState);
  },
  showCreateSubmissionModal: function() {
    this.setState({showModal: true});
  },
  closeCreateSubmissionModal: function() {
    this.setState({
      showModal: false
    });
  },
  removeSubmission: function(submissionId) {
    // clean up state
    var data = _.clone(this.state.data);

    var index = _.findIndex(data.submissions, { id: submissionId });

    // remove key from submissionStates
    // remove item at index from submissions
    data.submissions.splice(index, 1);
    delete data.submissionStates[submissionId];

    this.setState({data:data});

    goalsActionstreams.removeSubmission.emit({
      submissionId: submissionId
    });

  },
  addSubmissionToState: function(newSubmission) {
    var data = _.clone(this.state.data);
    var SubmissionState = Parse.Object.extend('SubmissionState');
    var submissionState = new SubmissionState();

    submissionState.set('isApproved', false);

    data.submissions.push(newSubmission);
    data.submissionStates[newSubmission.id] = submissionState;

    this.setState({data: data});

  },
  render: function() {
    var body;
    var modal;
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
        if (this.state.data.submissions.length === 0) {
          body = (
            <div className='cards'>
              <div style={{marginTop: '4.25rem'}} />
              <Goal
                key={self.state.data.goal.id}
                goalId={self.state.data.goal.id}
                numberOfTotalSubmissions={self.state.data.goal.get('submissionsCap')}
                cover={self.state.data.goal.get('cover').url()}
                title={self.state.data.goal.get('title')}
                description={self.state.data.goal.get('description')}
                submissions={self.state.data.submissions}
                submissionStates={self.state.data.submissionStates}
                showCreateSubmissionModal={self.showCreateSubmissionModal}
                finishAt={self.state.data.goal.get('finishAt')} >

                <div className='py1 px2 border-top h4'>
                  Результатов пока нет
                </div>

              </Goal>
            </div>
          );
        } else {
          body = (
            <div className='cards'>
              <div style={{marginTop: '4.25rem'}} />
              <Goal
                key={self.state.data.goal.id}
                goalId={self.state.data.goal.id}
                numberOfTotalSubmissions={self.state.data.goal.get('submissionsCap')}
                cover={self.state.data.goal.get('cover').url()}
                title={self.state.data.goal.get('title')}
                description={self.state.data.goal.get('description')}
                submissions={self.state.data.submissions}
                submissionStates={self.state.data.submissionStates}
                showCreateSubmissionModal={self.showCreateSubmissionModal}
                finishAt={self.state.data.goal.get('finishAt')} >

                <SubmissionsList
                  removeSubmission={this.removeSubmission}
                  submissions={self.state.data.submissions} />

              </Goal>
            </div>
          );
        }


        if (this.state.showModal) {
          modal = (
            <CreateSubmissionModal
              closeModal={this.closeCreateSubmissionModal}
              goalId={this.state.data.goal.id}
              authorId={this.props.params.currentUser.id} />
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
        <Portal>
          {modal}
        </Portal>
      </div>
    );
  }
});

module.exports = GoalDetails;
