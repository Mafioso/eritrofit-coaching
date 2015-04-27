'use strict';

// COMPONENTS START
var Nav = require('../components/Nav.jsx');
var DayNav = require('../components/day/DayNav.jsx');
var DayTitle = require('../components/day/DayTitle.jsx');
var Workouts = require('../components/day/Workouts.jsx');
var WorkoutDetailsModal = require('../components/modals/WorkoutDetailsModal.jsx');
var WorkoutResultSubmitModal = require('../components/modals/WorkoutResultSubmitModal.jsx');
var UserSettingsModal = require('../components/modals/UserSettingsModal.jsx');
// END

var Day = React.createClass({
  getInitialState: function() {
    return {
      mode: 'DEFAULT'
    };
  },
  openWorkoutDetailsModal: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'WORKOUT-DETAILS-MODAL'
    });
  },
  openWorkoutResultSubmitModal: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'WORKOUT-RESULT-SUBMIT-MODAL'
    });
  },
  openUserSettingsModal: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'USER-SETTINGS-MODAL'
    });
  },
  setDefaultMode: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'DEFAULT'
    });
  },
  render: function() {

    var workoutDetailsModalIsOpened = false;
    var workoutResultSubmitModalIsOpened = false;
    var userSettingsModalIsOpened = false;

    switch(this.state.mode) {
      case 'WORKOUT-DETAILS-MODAL':
        workoutDetailsModalIsOpened = true;
        break;
      case 'WORKOUT-RESULT-SUBMIT-MODAL':
        workoutResultSubmitModalIsOpened = true;
        break;
      case 'USER-SETTINGS-MODAL':
        userSettingsModalIsOpened = true;
        break;
      default:
        break;
    }

    return (
      <div>
        <Nav
          user={this.props.params.currentUser}
          openUserSettingsModal={this.openUserSettingsModal} />

        <DayNav
          day={this.props.params.day} />

        <DayTitle
          day={this.props.params.day} />

        <Workouts />

        <WorkoutDetailsModal
          workoutDetailsModalIsOpened={workoutDetailsModalIsOpened}
          close={this.setDefaultMode} />

        <WorkoutResultSubmitModal
          workoutResultSubmitModalIsOpened={workoutResultSubmitModalIsOpened}
          close={this.setDefaultMode} />

        <UserSettingsModal
          userSettingsModalIsOpened={userSettingsModalIsOpened}
          close={this.setDefaultMode} />
      </div>
    );
  }
});

module.exports = Day;
