'use strict';

var _ = require('lodash');

var ModeSwitch = React.createClass({
  propTypes: {
    mode: React.PropTypes.string
  },
  selectChild: function(key) {
    return (
      _.find(this.props.children, function(child) {
        return child.key === key;
      }) || (<div />)
    );
  },
  render: function() {
    return this.selectChild(this.props.mode);
  }
});

module.exports = ModeSwitch;
