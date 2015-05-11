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
    finishAt: React.PropTypes.instanceOf(Date)
  },
  getInitialState: function() {
    return {
      mode: 'DEFAULT'
    };
  },
  toggleMode: function(event) {
    event.preventDefault();

    switch(this.state.mode) {
      case 'DEFAULT':
        this.setState({mode: 'EXPANDED'});
        break;
      case 'EXPANDED':
        this.setState({mode: 'DEFAULT'});
        break;
      default:
        break;
    }
  },
  render: function() {

    var finishAt = moment(finishAt).fromNow();
    var numberOfApprovedSubmissions = 0;
    var cardProgress = _.map(this.props.submissions, function(submission) {
      if (this.props.submissionStates[submission.id]) {
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

    var cardClassName = classNames('card', 'bg-cover', 'bg-center', 'rounded',
      {
        'card--expanded': this.state.mode === 'EXPANDED'
      }
    );

    return(
      <div
        className={ cardClassName }
        style={{ backgroundImage: 'url('+ this.props.cover +')' }}
        >
        <div className='clearfix card-body rounded'>
          <div className='left'>
            <Icon name='fitness' />
          </div>
          <div className='overflow-hidden white'>
            <div className='flex flex-baseline'>
              <div className='h3 flex-auto'>
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
            <div className='h6 flex flex-wrap flex-baseline mb1'>
              <div className='flex-auto mr1'>
                { finishAt }
              </div>
            </div>
            <div className='card-extra'>
              <div className='card-description'>{this.props.description}</div>
              <div className='center mb1'>
                <button className='button-outline white full-width' type='button'>
                  Загрузить результат
                </button>
              </div>
            </div>
            <div className='mb1'>
              <button
                onClick={this.toggleMode}
                type='button'
                className='button-transparent card-expand-button'>
                •••
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Goal;
