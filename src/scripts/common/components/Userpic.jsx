'use strict';

var Userpic = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    src: React.PropTypes.string
  },
  render: function() {
    var src = '/images/default-userpic.jpg';

    if (this.props.src) {
      src = this.props.src;
    }

    return (
      <span className={'icon icon--userpic bg-cover bg-center rounded ' + this.props.className }
        style={{ backgroundImage: 'url('+ src +')' }}>
      </span>
    );
  }
});

module.exports = Userpic;
