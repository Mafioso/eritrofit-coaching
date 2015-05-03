'use strict';

window.React = require('react');
window.Parse = require('parse').Parse;
Parse.initialize('4ylwbGhxEbyh0qVaH8i2M59ZsRK07JP7mDK9M5rV', 'xvVmKJk9Jumt0i94JTtWLibWRFLCctgh2UfYZQf1');

var moment = require('moment');
var _ = require('lodash');
var Kefir = require('kefir');

var test = new Kefir.emitter();
test.log('test');

// Parse.User.logIn('igeeko@gmail.com', '123');

var utils = require('../common/utils.js').call();



// if (Parse.User.current()) {
// //   console.log(Parse.User.current());
//   utils.createUser('shannon.shaw66@example.com', 'Shannon Shaw', 'coolman');
// } else {
//   Parse.User.logIn('igeeko@gmail.com', '123');
//   console.log('try login');
// }



// utils.getAllUsers(test);


// title: t.union(t.Str, t.Nil),
// description: t.Str,
// submissionsCap: t.subtype(t.Num, submissionsCapPredicate),
// finishAt: t.Dat,
// publishAt: t.Dat,
// createdBy: t.Str

// var goal = {
//   title: 'Test',
//   description: 'Test',
//   submissionsCap: 2,
//   finishAt: new Date(),
//   publishAt: new Date(),
//   createdBy: 'DNnqLfNFyp'
// };
// utils.createGoal(goal, ['DNnqLfNFyp', '14GsPxH5E8']);

// var finishAt = moment('May 20 2015', 'MMM DD YYYY').toDate();
// var publishAt = moment('May 2 2015', 'MMM DD YYYY').toDate();
//
// utils.updateGoal('ncuBMJmXnS', {finishAt: finishAt, publishAt: publishAt});

// utils.removeGoal('ncuBMJmXnS');

// var goals = [
//   {
//     title: 'Goal 1',
//     description: 'test',
//     submissionsCap: 1,
//     finishAt: moment('May 2 2015', 'MMM DD YYYY').toDate(),
//     publishAt: moment('May 1 2015', 'MMM DD YYYY').toDate(),
//     createdBy: Parse.User.current().id
//   },
//   {
//     title: 'Goal 2',
//     description: 'test',
//     submissionsCap: 1,
//     finishAt: moment('May 2 2015', 'MMM DD YYYY').toDate(),
//     publishAt: moment('May 1 2015', 'MMM DD YYYY').toDate(),
//     createdBy: Parse.User.current().id
//   },
//   {
//     title: 'Goal 3',
//     description: 'test',
//     submissionsCap: 1,
//     finishAt: moment('May 2 2015', 'MMM DD YYYY').toDate(),
//     publishAt: moment('May 1 2015', 'MMM DD YYYY').toDate(),
//     createdBy: Parse.User.current().id
//   }
// ];
//
// _.forEach(goals, function(goal) {
//   console.log(goal, 'attempt to create a goal');
//   utils.createGoal(goal, ['DNnqLfNFyp', '14GsPxH5E8']);
// });

// utils.removeGoal('oKbExU9jif');
// utils.addGoalRecipients('j4KR9eVn1D', ['DNnqLfNFyp', '14GsPxH5E8']);
// utils.removeGoalRecipients('j4KR9eVn1D', ['DNnqLfNFyp', '14GsPxH5E8']);
// utils.removeAllGoalRecipients('j4KR9eVn1D');

// utils.removeGoal('uWr48aZJjA');

// var date = moment('May 1 2015', 'MMM D YYYY').toDate();
// utils.addGoalRecipients('uzDPWWT0vF', ['DNnqLfNFyp', '14GsPxH5E8']);
// utils.getActiveGoalsByRecipientBeforeDate(test, 'DNnqLfNFyp', date);
// utils.removeAllSubmissionsByGoal('R0ey9cO3tZ');

// utils.removeGoal('rEZstCtI5Z');

// window.addEventListener('load', function() {
//   var f = document.getElementById('form');
//
//   f.addEventListener('submit', function(event) {
//     utils.createSubmission('uzDPWWT0vF', {
//       createdBy: Parse.User.current().id,
//       message: 'some kind of message',
//       file: document.getElementById('input').files[0]
//     });
//   });
//
// });


var App = React.createClass({
  createGoal: function(event) {
    event.preventDefault();
    var goals = [
      {
        title: 'Goal 1',
        description: 'test',
        submissionsCap: 1,
        finishAt: moment('May 2 2015', 'MMM DD YYYY').toDate(),
        publishAt: moment('May 1 2015', 'MMM DD YYYY').toDate(),
        createdBy: Parse.User.current().id
      },
      {
        title: 'Goal 2',
        description: 'test',
        submissionsCap: 1,
        finishAt: moment('May 2 2015', 'MMM DD YYYY').toDate(),
        publishAt: moment('May 1 2015', 'MMM DD YYYY').toDate(),
        createdBy: Parse.User.current().id
      },
      {
        title: 'Goal 3',
        description: 'test',
        submissionsCap: 1,
        finishAt: moment('May 2 2015', 'MMM DD YYYY').toDate(),
        publishAt: moment('May 1 2015', 'MMM DD YYYY').toDate(),
        createdBy: Parse.User.current().id
      }
    ];

    _.forEach(goals, function(goal) {
      utils.createGoal(goal, ['DNnqLfNFyp', '14GsPxH5E8']);
    });

  },
  removeGoal: function(event) {
    event.preventDefault();
    utils.removeGoal('qlv7Kod7Ep');
  },
  removeSubmission: function(event) {
    event.preventDefault();
    utils.removeSubmission('1biOvxfLoo');
  },
  onSubmit: function(event) {
    event.preventDefault();
    utils.createSubmission('LMpugZLoAr', {
      createdBy: Parse.User.current().id,
      message: 'some kind of message',
      file: this.refs.file.getDOMNode().files[0]
    });
  },
  render: function() {
    return (
      <div className='p1 container'>
        <form id='form' onSubmit={this.onSubmit}>
          <input ref='file' type="file" id="input" />
          <button type='submit'>Submit!</button>
        </form>
        <br/>
        <button type='button' onClick={this.removeSubmission}>
          Remove Submission
        </button>
        <br />
        <br />
        <button type='button' onClick={this.removeGoal}>
          Remove Goal
        </button>
        <br />
        <br />
        <button type='button' onClick={this.createGoal}>
          Create Goal
        </button>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));

utils.createUsersFromText('test@test.com, somUser, blob123 \n turbo@toru.com, blah blah, blobblob');

// utils.addGoalRecipients('8h13P1wZFP', ['DNnqLfNFyp', '14GsPxH5E8']);
// utils.removeGoalRecipients('8h13P1wZFP', ['DNnqLfNFyp']);
