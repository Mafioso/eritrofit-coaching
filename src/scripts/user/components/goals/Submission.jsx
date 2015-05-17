'use strict';

var moment = require('moment');
var Icon = require('../../../common/components/Icon.jsx');

var Submission = React.createClass({
  removeSubmission: function() {
    this.props.removeSubmission(this.props.submissionId);
  },
  render: function() {

    var createdAt = moment(this.props.createdAt).format('DD MMM YYYY, HH:mm');

    var text;
    if (this.props.text) {
      text = (
        <div className='h4'>
          {this.props.text}
        </div>
      );
    } else {
      text = (
        <div className='h4 italic gray'>
          Без текста
        </div>
      );
    }

    return (
      <div className='clearfix border-top'>
        <div className='left'>
          <a
            target='_blank'
            className='block p1'
            style={{paddingRight: '0'}}
            href={this.props.original}>
            <img
              className='block'
              src={this.props.thumbnail}
              style={{width: '64px', height: '64px' }} />
          </a>
        </div>
        <div className='overflow-hidden p1'>
          <div className='flex flex-wrap flex-center'>
            <div className='gray h6 flex-auto'>
              {createdAt}
            </div>
            <div className='flex-none ml1'>
              <button
                onClick={this.removeSubmission}
                className='button-transparent button-small red'>
                <Icon name='trash' />
              </button>
            </div>
          </div>
          {text}
        </div>
      </div>
    );
  }
});

module.exports = Submission;
