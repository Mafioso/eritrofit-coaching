'use strict';


var moment = require('moment');

var DefaultTrack = React.createClass({
  propTypes: {
    mode: React.PropTypes.string,
    data: React.PropTypes.object
  },
  render: function() {

    var total;
    if (this.props.data.totalApproved >= 0 && this.props.data.totalCap >= 0) {
      total = (
        <span>{this.props.data.totalApproved} / {this.props.data.totalCap}</span>
      );
    } else {
      total = (<span>0</span>);
    }

    var latestSubmissionDate;
    if (this.props.data.latestSubmissionDate) {
      latestSubmissionDate = moment(this.props.data.latestSubmissionDate).fromNow();
    } else {
      latestSubmissionDate = 'Дата загрузки неизвестна';
    }

    var totalSubmitted;
    if (this.props.data.totalSubmitted) {
      if (this.props.data.totalSubmitted > 0) {
        totalSubmitted = (
          <span>
            Всего загружено: {this.props.data.totalSubmitted}
          </span>
        );
      } else {
        totalSubmitted = (
          <span>
            Ни одной загрузки
          </span>
        );
      }
    }

    return (
      <div className='card bg-blue white card--track rounded'>
        <div className='clearfix card-body rounded'>
          <div className='left'>
            <div className='icon icon--track h1'>
              В
            </div>
          </div>
          <div className='overflow-hidden'>
            <div className='flex flex-baseline'>
              <div className='h3 flex-auto'>
                Выполненные цели
              </div>
              <div className='card-progress-counter flex-none'>
                {total}
              </div>
            </div>
            <div className='h6 flex flex-wrap flex-baseline mb1'>
              <div className='flex-auto mr1'>
                {totalSubmitted}
              </div>
              <div className='flex-none'>
                {latestSubmissionDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DefaultTrack;
