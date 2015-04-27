'use strict';

var isMobile = require('is-mobile');

var InputTextarea = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    value: React.PropTypes.string,
    autoFocus: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onKeyUp: React.PropTypes.func
  },
  onChange: function(event) {
    this.props.onChange(event.target.value);
  },
  onKeyDown: function(event) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  },
  onKeyUp: function(event) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event);
    }
  },
  render: function() {
    return (
      <div className='input input--textarea'>
        <div className='input-shadow'>
          {this.props.value + '\n'}
        </div>
        <textarea
          disabled={this.props.disabled || false}
          value={this.props.value}
          ref={this.props.name}
          autoFocus={!isMobile() && this.props.autoFocus}
          className='input-field'
          placeholder={this.props.placeholer}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          />
      </div>
    );
  }
});

module.exports = InputTextarea;
