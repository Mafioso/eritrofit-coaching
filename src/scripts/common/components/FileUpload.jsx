'use strict';

var FileUpload = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    getValue: React.PropTypes.func,
    tabIndex: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
  },
  getInitialState: function() {
    return {
      filename: '',
      mode: 'DEFAULT',
      buttonStyle: {}
    };
  },
  onFocus: function() {
    this.setState({
      buttonStyle: {
        outline: '0',
        border: '1px solid currentcolor',
        boxShadow: '0 0 0 2px'
      }
    });
  },
  onBlur: function() {
    this.setState({
      buttonStyle: { }
    });
  },
  onChange: function(event) {
    this.setState({
      filename: event.target.files[0].name
    });
    this.props.getValue(event.target.files[0]);
  },
  render: function() {
    var filename;

    if (this.state.filename) {
      filename = (
        <div className='relative' style={{height:'1rem'}}>
          <div className='h6 gray truncate center absolute left-0 bottom-0 right-0 top-0'>
            {this.state.filename}
          </div>
        </div>
      );
    }

    return (
      <div className='clearfix'>
        <div className='left'>
          <div
            style={this.state.buttonStyle}
            className='button button-outline blue relative overflow-hidden'>
            <input
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChange={this.onChange}
              tabIndex={this.props.tabIndex}
              ref={this.props.name}
              id={this.props.name}
              className='input-file'
              type='file'
              name={this.props.name}
              style={{ opacity: 0 }} />
            <div>
              {this.props.label}
            </div>
          </div>
          {filename}
        </div>
      </div>
    );
  }
});

module.exports = FileUpload;
