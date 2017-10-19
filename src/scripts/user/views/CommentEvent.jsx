var React = require('react');

var CommentEvent = React.createClass({

  onClick: function(payload){
    var uId = this.props.uId;
    var text = this.refs.messageText.getDOMNode().value;
    this.props.response({
      cId: payload,
      uId: uId,
      text: text
    });
  },

  render: function() {
    var self = this;
    return (
      <div key = {this.props.key}>
        
        <form className='border-bottom'>
          <div className='bold mb1'>
            Message: {this.props.message}  
          </div>
          <div className='bold mb1'>
            Text: {this.props.text}  
          </div>
          <div className='bold mb1'>
            Author: {this.props.createdBy}  
          </div>
          <div className='mb1'>
            <input ref='messageText' className='field-light full-width' type='text'/>
          </div>
          <button className='button-transparent bg-blue white' onClick = {self.onClick.bind(self, self.props.id)} >Answer</button>
        </form>
      </div>
    );
  }

});

module.exports = CommentEvent;