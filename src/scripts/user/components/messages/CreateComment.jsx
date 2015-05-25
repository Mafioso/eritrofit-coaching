'use strict';

var messageStreams = require('../../streams/messageStreams.js');

var CreateComment = React.createClass({
  getInitialState: function() {
    return {
      commentText: '',
      isLoading: false
    };
  },
  createCommentResultHandler: function(result) {
    this.setState({
      isLoading: false,
      commentText: ''
    });
    this.refs.commentText.getDOMNode().value = '';
  },
  createCommentResultErrorHandler: function(error) {

  },
  componentWillMount: function() {
    messageStreams.datastreams.createCommentResult.onValue(
      this.createCommentResultHandler
    );
    messageStreams.datastreams.createCommentResult.onError(
      this.createCommentResultErrorHandler
    );
  },
  componentWillUnmount: function() {
    messageStreams.datastreams.createCommentResult.offValue(
      this.createCommentResultHandler
    );
    messageStreams.datastreams.createCommentResult.offError(
      this.createCommentResultErrorHandler
    );
  },
  submitComment: function(e) {
    e.preventDefault();
    this.setState(
      {
        isLoading: true
      },
      function() {
        messageStreams.actionstreams.createComment.emit({
          text: this.refs.commentText.getDOMNode().value,
          userId: this.props.userId,
          createdBy: this.props.userId,
          messageId: this.props.messageId
        });
      }
    );
  },
  render: function() {
    return (
      <form onSubmit={this.submitComment}>
        <div className='mb1'>
          <input
            ref='commentText'
            type='text'
            className='h5 field-light full-width'
            placeholder='Написать'
            disabled={this.state.isLoading} />
        </div>
      </form>
    );
  }
});

module.exports = CreateComment;
