'use strict';

var StreamGroup = require('../../common/StreamGroup');

module.exports = {
  actionstreams: new StreamGroup([
    'getUnreadMessages',
    'getAllMessages',
    'createComment',
    'removeComment',
    'markAllNewMessagesAsRead'
  ]),
  datastreams: new StreamGroup([
    'getUnreadMessagesResult',
    'getAllMessagesResult',
    'createCommentResult',
    'removeCommentResult'
  ])
};
