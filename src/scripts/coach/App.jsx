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

var App = React.createClass({
  onSubmit: function(event) {
    event.preventDefault();
    DataAPI.createGoal({
      title: 'Goal 1',
      description: 'test',
      submissionsCap: 1,
      finishAt: moment('May 31 2015', 'MMM DD YYYY').toDate(),
      publishAt: moment('May 1 2015', 'MMM DD YYYY').toDate(),
      createdBy: Parse.User.current().id,
      cover: this.refs.file.getDOMNode().files[0]
    }, ['DNnqLfNFyp']);
  },
  render: function() {
    return (
      <div className='p1 container'>
        <form id='form' onSubmit={this.onSubmit}>
          <input ref='file' type="file" id="input" />
          <button type='submit'>Submit!</button>
        </form>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
