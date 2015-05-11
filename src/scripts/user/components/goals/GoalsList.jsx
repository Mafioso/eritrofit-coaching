'use strict';

var classNames = require('classnames');

var _ = require('lodash');
var Goal = require('./Goal.jsx');

var GoalsList = React.createClass({
  propTypes: {
    goals: React.PropTypes.array,
    submissions: React.PropTypes.object,
    submissionStates: React.PropTypes.object
  },
  render: function() {

    var body = _.map(this.props.goals, function(goal) {
      return (
        <Goal
          key={goal.id}
          goalId={goal.id}
          numberOfTotalSubmissions={goal.get('submissionsCap')}
          cover={goal.get('cover')}
          title={goal.get('title')}
          description={goal.get('description')}
          submissions={this.props.submissions[goal.id]}
          submissionStates={this.props.submissionStates}
          finishAt={goal.get('finishAt')}
        />
      );
    });



    return (
      <div className='cards'>
        {body}
      </div>
    );
  }
});

module.exports = GoalsList;
