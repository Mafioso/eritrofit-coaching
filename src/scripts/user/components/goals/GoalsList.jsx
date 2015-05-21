'use strict';

var _ = require('lodash');
var Goal = require('./Goal.jsx');
var CreateSubmissionModal = require('./CreateSubmissionModal.jsx');
var Portal = require('../../../common/components/Portal.jsx');

var GoalsList = React.createClass({
  propTypes: {
    goals: React.PropTypes.array,
    submissions: React.PropTypes.object,
    submissionStates: React.PropTypes.object,
    currentUser: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      goalId: ''
    };
  },
  showCreateSubmissionModal: function(goalId) {
    this.setState({goalId: goalId});
  },
  closeCreateSubmissionModal: function(event) {
    event.preventDefault();
    this.setState({goalId: ''});
  },
  render: function() {
    var self = this;
    var modal;

    if (this.state.goalId) {
      modal = (
        <CreateSubmissionModal
          closeModal={this.closeCreateSubmissionModal}
          goalId={this.state.goalId}
          authorId={this.props.currentUser} />
      );
    }

    var body = _.map(this.props.goals, function(goal) {
      return (
        <Goal
          key={goal.id}
          goalId={goal.id}
          numberOfTotalSubmissions={goal.get('submissionsCap')}
          cover={goal.get('cover').url()}
          title={goal.get('title')}
          description={goal.get('description')}
          submissions={self.props.submissions[goal.id]}
          submissionStates={self.props.submissionStates}
          finishAt={goal.get('finishAt')}
          showCreateSubmissionModal={self.showCreateSubmissionModal}
        />
      );
    });

    return (
      <div className='cards'>
        <div style={{marginTop: '4.25rem'}} />
        {body}
        <Portal>
          {modal}
        </Portal>
      </div>
    );
  }
});

module.exports = GoalsList;
