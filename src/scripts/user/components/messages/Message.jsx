'use strict';

var Userpic = require('../../../common/components/Userpic.jsx');
var CommentsList = require('./CommentsList.jsx');

var moment = require('moment');

var Message = React.createClass({
  propTypes: {
    messageId: React.PropTypes.string,
    data: React.PropTypes.object,
    comments: React.PropTypes.array,
    isReadByUser: React.PropTypes.bool,
    userId: React.PropTypes.string
  },
  render: function() {
    var timestamp = (<span>
      {moment(this.props.data.get('publishAt')).format('DD MMM YYYY')}  ({moment(this.props.data.get('publishAt')).fromNow()})
    </span>);
    var title;

    if (this.props.data.get('title')) {
      title = (<div className='h3 bold'>
        {this.props.data.get('title')}
      </div>);
    }

    var userpic;
    if (this.props.data.get('createdBy').get('userpicThumb')) {
      userpic = this.props.data.get('createdBy').get('userpicThumb').url();
    }

    return (
      <div className='card bg-white card--message rounded card--expanded'>
        <div className='clearfix card-body rounded'>
          <div className='left ml1'>
            <Userpic
              src={userpic} />
          </div>
          <div className='overflow-hidden px1'>
            <div className='h6 flex flex-wrap flex-baseline'>
              <div className='flex-auto mr1 bold'>
                {this.props.data.get('createdBy').get('fullname')}
              </div>
              <div className='flex-none gray'>
                {timestamp}
              </div>
            </div>
            {title}
            <div>
              {this.props.data.get('text')}
            </div>
            <CommentsList
              userId={this.props.userId}
              messageId={this.props.data.id}
              data={this.props.comments} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Message;
