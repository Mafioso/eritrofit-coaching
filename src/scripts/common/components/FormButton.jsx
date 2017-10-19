var React = require('react');

var FormButton = React.createClass({
  getInitialState: function() {
    return {
      show: false 
    };
  },
  showChild: function(){
    return this.children[0];
  },
  render: function() {
    if( !this.state.show ){
      return (
        <div>
          <button ></button>
        </div>
      );
    } 
    return (
      <div >

      </div>
    );
  }

});

module.exports = FormButton;