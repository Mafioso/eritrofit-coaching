var React = require('react');
var _ = require('lodash');

var Periods = React.createClass({
  getInitialState: function() {
      return {
        focused: "WEEK",
        vals: ["WEEK", "MONTH", "YEAR"],
        titles: ["Неделя", "Месяц", "Год"] 
      };
  },
  onClick: function(payload){
    
    this.props.setPeriod(payload);
    this.setState({
      focused: payload 
    });
  },
  render: function() {
    var self = this;
    var styles = {
      "WEEK": "flex-auto button-outline blue rounded-left",
      "MONTH": "flex-auto button-outline blue border-left not-rounded",
      "YEAR": "flex-auto button-outline blue border-left rounded-right"
    };
    styles[this.state.focused]+=' is-active'

    return (
      <div className="flex center">
      {  
        this.state.titles.map(function(title, index){
            return <button className={styles[self.state.vals[index]]} onClick ={self.onClick.bind(self, self.state.vals[index])}>{title}</button>
        })
      }
      </div>
    );
  }

});

module.exports = Periods;