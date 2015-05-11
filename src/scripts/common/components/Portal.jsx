'use strict';

var Portal = React.createClass({
  node: null,
  portal: null,
  render: function() {
    return null;
  },
  componentDidMount: function() {
    this.node = document.createElement('div');
    this.node.className = 'portal';
    document.body.appendChild(this.node);
    this.renderPortal(this.props);
  },
  componentDidUpdate: function() {
    this.renderPortal(this.props);
  },
  renderPortal: function() {
    this.portal = React.render(<div {...this.props}>{this.props.children}</div>, this.node);
  },
  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.node);
    document.body.removeChild(this.node);
  }
});

module.exports = Portal;
