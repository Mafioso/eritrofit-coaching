'use strict';

// COMPONENTS START
var Portal = require('../Portal.jsx');
var TimeoutTransitionGroup = require('../TimeoutTransitionGroup.jsx');
// END

var WorkoutResultSubmitModal = React.createClass({
  propTypes: {
    workoutResultSubmitModalIsOpened: React.PropTypes.bool.isRequired,
    close: React.PropTypes.func.isRequired
  },
  close: function(event) {
    this.props.close(event);
  },
  render: function() {
    var node;
    if (this.props.workoutResultSubmitModalIsOpened) {
      // add class to body
      document.body.className += ' body--stopScroll';

      node = (<TimeoutTransitionGroup
        enterTimeout={100}
        leaveTimeout={150}
        component='div'
        transitionName='WorkoutResultSubmitModalTransition'>

        <div onClick={this.close} className='modal-backdrop' />

        <div className='modal'>
          <div className='modal-body'>
            Hello, world!
          </div>
        </div>
      </TimeoutTransitionGroup>);
    } else {
      // remove class from body
      document.body.className = document.body.className.replace(/\bbody--stopScroll\b/, '');
    }

    return (
      <Portal>
        {node}
      </Portal>
    );
  }
});

module.exports = WorkoutResultSubmitModal;