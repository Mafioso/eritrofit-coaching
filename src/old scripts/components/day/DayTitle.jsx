'use strict';

var moment = require('moment');
var Icon = require('../Icon.jsx');

var DayNav = React.createClass({
  propTypes: {
    day: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <div className='scroller'>
        <div className='scroller-nav'>
          <a className='scroller-nav-btn' href={'/#/day/' + moment(this.props.day, 'DDMMYY').subtract(1, 'day').format('DDMMYY')}>
            <Icon name='arrow-left' />
          </a>
        </div>
        <div className='scroller-week'>
          <span className='scroller-week-day'>
            <span className='scroller-week-day-title'>
              {moment(this.props.day, 'DDMMYY').format('dddd')}
            </span>
            <span className='scroller-week-day-date'>{moment(this.props.day, 'DDMMYY').format('D MMMM')}</span>
          </span>
        </div>
        <div className='scroller-nav'>
          <a className='scroller-nav-btn' href={'/#/day/' + moment(this.props.day, 'DDMMYY').add(1, 'day').format('DDMMYY')}>
            <Icon name='arrow-right' />
          </a>
        </div>
      </div>
    );
  }
});

module.exports = DayNav;
