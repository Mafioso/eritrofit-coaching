'use strict';

window.React = require('react');
window.Parse = require('parse').Parse;
Parse.initialize('4ylwbGhxEbyh0qVaH8i2M59ZsRK07JP7mDK9M5rV', 'xvVmKJk9Jumt0i94JTtWLibWRFLCctgh2UfYZQf1');

var moment = require('moment');
var _ = require('lodash');
var Kefir = require('kefir');

var test = new Kefir.emitter();
test.log('test');

require('../common/DataAPI.js').call();

// var App = React.createClass({
//   onSubmit: function(event) {
//     event.preventDefault();
//     DataAPI.createGoal({
//       title: 'Goal 1',
//       description: 'test',
//       submissionsCap: 1,
//       finishAt: moment('May 31 2015', 'MMM DD YYYY').toDate(),
//       publishAt: moment('May 1 2015', 'MMM DD YYYY').toDate(),
//       createdBy: Parse.User.current().id,
//       cover: this.refs.file.getDOMNode().files[0]
//     }, ['DNnqLfNFyp']);
//   },
//   render: function() {
//     return (
//       <div className='p1 container'>
//         <form id='form' onSubmit={this.onSubmit}>
//           <input ref='file' type="file" id="input" />
//           <button type='submit'>Submit!</button>
//         </form>
//       </div>
//     );
//   }
// });

var App = React.createClass({
  createUsers: function(e) {
    e.preventDefault();

    _.map(this.refs.users.getDOMNode().value.split('\n'), function(line) {
      var props = _.words(line, /[^,]+/g);
      DataAPI.createUser(props[1], props[0], props[2]);
    });

  },
  createMessage: function(e) {
    e.preventDefault();
    var self = this;
    var User = Parse.Object.extend('User');
    var uquery = new Parse.Query(User);
    uquery.find().then(
      function(users) {
        var uids = _.map(users, function(u) { return u.id; });
        DataAPI.createMessage(
          {
            title: self.refs.messageTitle.getDOMNode().value,
            text: self.refs.messageText.getDOMNode().value,
            publishAt: new Date(),
            createdBy: self.refs.messageCreatedBy.getDOMNode().value
          },
          uids
        );
      },
      function(error) {
        console.log(error);
      }
    );
  },
  createGoal: function(e) {
    e.preventDefault();
    var self = this;
    var User = Parse.Object.extend('User');
    var uquery = new Parse.Query(User);
    uquery.find().then(
      function(users) {
        var uids = _.map(users, function(u) { return u.id; });
        DataAPI.createGoal({
          title: self.refs.goalTitle.getDOMNode().value,
          description: self.refs.goalText.getDOMNode().value,
          submissionsCap: 16,
          finishAt: moment(new Date()).add(4, 'week').toDate(),
          publishAt: new Date(),
          createdBy: self.refs.goalCreatedBy.getDOMNode().value,
          cover: self.refs.goalCover.getDOMNode().files[0]
        },
        uids);
      },
      function(error) {
        console.log(error);
      }
    );
  },
  render: function() {
    return (
      <div className='p4 container'>
        <form className='p2 border-bottom' onSubmit={this.createUsers}>
          <div className='bold mb1'>Создать пользователей</div>
          <textarea className='field-light full-width' ref='users'></textarea>
          <button className='button bg-blue white' type='submit'>
            Создать пользователей
          </button>
        </form>
        <form className='p2 border-bottom' onSubmit={this.createMessage}>
          <div className='bold mb1'>Создать сообщение для всех</div>
          <div className='mb1'>
            <input type='text' className='field-light full-width' ref='messageTitle' placeholder='title' />
          </div>
          <div className='mb1'>
            <textarea className='field-light full-width' ref='messageText' placeholder='text'></textarea>
          </div>
          <div className='mb1'>
            <input type='text' className='field-light full-width' ref='messageCreatedBy' placeholder='createdBy' />
          </div>
          <button className='button bg-blue white' type='submit'>
            Создать сообщение
          </button>
        </form>
        <form className='p2 border-bottom' onSubmit={this.createGoal}>
          <div className='bold mb1'>Создать цель для всех</div>
          <div className='mb1'>
            <input type='text' className='field-light full-width' ref='goalTitle' placeholder='title' />
          </div>
          <div className='mb1'>
            <textarea className='field-light full-width' ref='goalText' placeholder='text'></textarea>
          </div>
          <div className='mb1'>
            <input ref='goalCover' type="file" id="input" />
          </div>
          <div className='mb1'>
            <input type='text' className='field-light full-width' ref='goalCreatedBy' placeholder='createdBy' />
          </div>
          <button className='button bg-blue white' type='submit'>
            Создать цель
          </button>
        </form>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
