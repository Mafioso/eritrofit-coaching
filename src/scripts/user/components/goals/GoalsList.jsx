'use strict';

var _ = require('lodash');
var Goal = require('./Goal.jsx');
var CreateSubmissionModal = require('./CreateSubmissionModal.jsx');
var Portal = require('../../../common/components/Portal.jsx');

var GoalsList = React.createClass({
  propTypes: {
    goals: React.PropTypes.array,
    submissions: React.PropTypes.object,
    submissionStates: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      goalId: ''
    };
  },
  showCreateSubmissionModal: function(goalId) {
    this.setState({goalId: goalId});
  },
  render: function() {
    var self = this;


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
        {this.state.goalId}
        <Portal>
          <CreateSubmissionModal />
        </Portal>
      </div>
    );
  }
});

module.exports = GoalsList;
