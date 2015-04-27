'use strict';

var NewWorkoutForm = require('./NewWorkoutForm.jsx');

var DayNav = React.createClass({
  onNewWorkoutSubmit: function(workoutDescription) {
    console.log(workoutDescription);
    this.props.onNewWorkoutSubmit(workoutDescription);
  },
  render: function() {
    return (
      <div>
        <NewWorkoutForm
          onSubmit={this.onNewWorkoutSubmit} />
      </div>
    );
  }
});

module.exports = DayNav;
