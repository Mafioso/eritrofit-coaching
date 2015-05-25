'use strict';

var messageStreams = require('../../streams/messageStreams.js');

var Icon = require('../../../common/components/Icon.jsx');
var Userpic = require('../../../common/components/Userpic.jsx');

var moment = require('moment');
var classNames = require('classnames');

var MessageComment = React.createClass({
  propTypes: {
    data: React.PropTypes.object,
    userId: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      isRemoved: false
    };
  },
  removeComment: function(e) {
    e.preventDefault();
    if (!this.state.removed) {
      this.setState(
        {
          isRemoved: true
        },
        function() {
          // make sure to show that object is being deleted
          messageStreams.actionstreams.removeComment.emit({commentId: this.props.data.id});
        }
      );
    }
  },
  render: function() {

    var removeButton;
    if (this.props.data.get('createdBy').id === this.props.userId) {
      removeButton = (
        <div className='absolute top-0 right-0'>
          <a
            href='#'
            onClick={this.removeComment}
            className='block silver'>
            <Icon name='trash' />
          </a>
        </div>
      );
    }

    return (
      <div className={classNames('clearfix mb1', { 'muted': this.state.isRemoved })}>
        <div className='left mr1'>
          <Userpic
            className='icon--userpic-small'
            src={this.props.data.get('createdBy').get('userpicThumb').url()} />
        </div>
        <div className='overflow-hidden h6 relative'>
          <div className='gray mr2 flex flex-wrap'>
            <div className='bold black flex-none mr1'>
              {this.props.data.get('createdBy').get('fullname')}
            </div>
            <div className='flex-auto mr1'>
              {moment(this.props.data.createdAt).format('DD MMM YYYY, HH:mm')}
            </div>
          </div>
          {removeButton}
          {this.props.data.get('text')}
        </div>
      </div>
    );
  }
});

module.exports = MessageComment;
