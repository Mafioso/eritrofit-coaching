'use strict';

var moment = require('moment');
var classNames = require('classnames');

var DayNav = React.createClass({
  propTypes: {
    day: React.PropTypes.string.isRequired
  },
  render: function() {
    var today = moment(this.props.day, 'DDMMYY');
    var weekScrollerItems = [];
    for (var i = 1; i < 8; i++) {
      var day = today.clone();
      day.isoWeekday(i);
      var classes = classNames({
        'weekScroller-day': true,
        'weekScroller-day--active': today.isSame(day, 'day')
      });
      weekScrollerItems.push(
        <li className='weekScroller-item' key={day.format('DDMMYY')}>
          <a className={classes}
            href={'/#/day/' + day.format('DDMMYY')}
            title={day.format('D MMMM')}>
            {day.format('ddd')}
          </a>
        </li>
      );
    }
    return (
      <div className='weekScroller'>
        <ul className='weekScroller-items'>
          {weekScrollerItems}
        </ul>
      </div>
    );
  }
});

module.exports = DayNav;
