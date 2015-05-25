'use strict';

var Shell = React.createClass({
  render: function() {
    if (this.props.show === false) {
      return null;
    } else {
      return this.props.children;
    }
  }
});

module.exports = Shell;
