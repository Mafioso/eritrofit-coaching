'use strict';

var Message = require('./Message.jsx');
var _ = require('lodash');

var MessagesList = React.createClass({
  render: function() {
    var self = this;
    var body = _.map(this.props.data.messages, function(message) {
      return (
        <Message
          userId={self.props.userId}
          key={message.id}
          messageId={message.id}
          data={message}
          comments={self.props.data.comments[message.id]}
          isReadByUser={self.props.data.messageStates[message.id]} />
      );
    });
    return (<div>
      {body}
    </div>);
  }
});

module.exports = MessagesList;
