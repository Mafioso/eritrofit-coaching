var React = require('react');

var SubmissionEvent = React.createClass({
  approve: function(){
    this.props.approve(this.props.submissionId);
  },
  render: function() {
    var self = this;
    return (
      <div>
        <div>Goal: {this.props.goal}</div>
        <div>Submission text: {this.props.text}</div>
        <div>Image: <img src={this.props.thumbnail} /></div>
        <div>Created By: {this.props.createdBy}</div>
        <button className='button-transparent bg-blue white' onClick = {this.approve}>Approve</button>
        <hr />
      </div>
    );
  }

});

module.exports = SubmissionEvent;