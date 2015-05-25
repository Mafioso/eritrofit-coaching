'use strict';

var messageStreams = require('../streams/messageStreams.js');

var Store = require('../../common/Store');

var messageStore = new Store(function() {

  messageStreams.actionstreams.markAllNewMessagesAsRead.onValue(function(props) {
    DataAPI.markMessagesAsRead(props.umMaps);
  });

  messageStreams.actionstreams.getUnreadMessages.onValue(function(props) {
    DataAPI.getPublishedMessagesByRecipientBeforeDate(
      messageStreams.datastreams.getUnreadMessagesResult,
      props.userId,
      props.date,
      true
    );
  });

  messageStreams.actionstreams.getAllMessages.onValue(function(props) {
    DataAPI.getPublishedMessagesByRecipientBeforeDate(
      messageStreams.datastreams.getAllMessagesResult,
      props.userId,
      props.date,
      false
    );
  });

  messageStreams.actionstreams.createComment.onValue(function(props) {
    DataAPI.createComment(
      messageStreams.datastreams.createCommentResult,
      props.userId,
      props.messageId,
      props
    );
  });

  messageStreams.actionstreams.removeComment.onValue(function(props) {
    DataAPI.removeComment(
      messageStreams.datastreams.removeCommentResult,
      props.commentId
    );
  });

});

module.exports = messageStore;
