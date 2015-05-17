'use strict';

var _ = require('lodash');
var moment = require('moment');
var classNames = require('classnames');

var Icon = require('../../../common/components/Icon.jsx');

var Goal = React.createClass({
  propTypes: {
    goalId: React.PropTypes.string,
    numberOfTotalSubmissions: React.PropTypes.number,
    cover: React.PropTypes.string,
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    submissions: React.PropTypes.array,
    submissionStates: React.PropTypes.object,
    finishAt: React.PropTypes.instanceOf(Date),
    showCreateSubmissionModal: React.PropTypes.func
  },
  showCreateSubmissionModal: function() {
    this.props.showCreateSubmissionModal(this.props.goalId);
  },
  render: function() {
    var finishAt = moment(this.props.finishAt).fromNow();
    var self = this;

    var numberOfApprovedSubmissions = 0;
    var cardProgress = _.map(this.props.submissions, function(submission) {
      if (self.props.submissionStates[submission.id].get('isApproved')) {
        // submission is approved
        numberOfApprovedSubmissions = numberOfApprovedSubmissions + 1;
        return (
          <div
            key={submission.id}
            className='card-progress bg-lime rounded flex-auto' />
        );
      } else {
        return (
          <div
            key={submission.id}
            className='card-progress bg-yellow rounded flex-auto' />
        );
      }
    });

    var emptySubmissionSlots = this.props.numberOfTotalSubmissions - cardProgress.length;

    for (var i = 0; i < emptySubmissionSlots; i++) {
      cardProgress.push(
        <div
          key={'emptySubmission'+i}
          className='card-progress bg-white rounded flex-auto' />
      );
    }

    return(
      <div className='card overflow-hidden rounded'>
        <div className='rounded-top bg-cover bg-center'
          style={{ backgroundImage: 'url('+ this.props.cover +')' }}>
          <div className='clearfix card-body rounded-top'>
            <div className='left'>
              <Icon name='fitness' />
            </div>
            <div className='overflow-hidden white'>
              <div className='flex flex-baseline'>
                <div className='h3 bold flex-auto'>
                    { this.props.title }
                </div>
                <div className='right-align card-progress-counter flex-none'>
                  <a className='white' href={'/#/goals/' + this.props.goalId }>
                    { numberOfApprovedSubmissions } / { this.props.numberOfTotalSubmissions }
                  </a>
                </div>
              </div>
              <div className='flex'>
                { cardProgress }
              </div>
              <div className='h6 mb1 card-description'>
                { this.props.description }
              </div>
            </div>
          </div>
        </div>
        <div className='h6 bg-white rounded-bottom flex flex-center flex-wrap'>
          <div className='py1 px2 gray flex-none'>
            Финиш { finishAt }
          </div>
          <div className='flex-auto py1 px2 right-align'>
            <button onClick={this.showCreateSubmissionModal} className='button-small button-outline blue' type='button'>
              Загрузить результат
            </button>
          </div>
          <div className='full-width'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Goal;
