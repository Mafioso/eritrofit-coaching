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
  changeState: function(){
    this.setState({
      show: !this.state.show 
    });
  },
  render: function() {
    console.log('state: '+this.state.show);
    var body;
    var value = "SHOW";
    var content = "";
    if( this.state.show ){
      value = "CANCEL";
      content = this.props.children;
    }
    body = (
      <div>
        <button onClick = {this.changeState}>{value}</button>
        <div>{content}</div>
      </div>
    );
    return (
      <div >
        {body}
      </div>
    );
  }

});

module.exports = FormButton;