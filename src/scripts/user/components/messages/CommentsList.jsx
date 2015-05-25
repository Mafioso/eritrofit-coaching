'use strict';

var MessageComment = require('./MessageComment.jsx');
var CreateComment = require('./CreateComment.jsx');

var _ = require('lodash');

var CommentsList = React.createClass({
  propTypes: {
    messageId: React.PropTypes.string,
    data: React.PropTypes.array,
    userId: React.PropTypes.string
  },
  render: function() {
    var self = this;
    var body;
    var dialogLength = 0;
    if (this.props.data) {
      dialogLength = this.props.data.length;
      if (dialogLength > 0) {
        body = _.map(this.props.data, function(comment) {
            return (
              <MessageComment key={comment.id} data={comment} userId={self.props.userId} />
            );
          });
      }
    }

    return (
      <div>
        <div className='h6 gray bold py1'>Диалог ({dialogLength})</div>
        {body}
        <CreateComment
          messageId={this.props.messageId}
          userId={this.props.userId} />
      </div>
    );
  }
});

module.exports = CommentsList;
