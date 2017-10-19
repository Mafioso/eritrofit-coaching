var React = require('react');
var d3 = require('d3');
var trackStreams = require('../streams/trackStreams');
var measurementStreams = require('../streams/measurementStreams.js');
var updateRes = measurementStreams.datastreams.updateRes;

var updateAvg = measurementStreams.datastreams.updateAvg;

var updateMeasurementResult = measurementStreams.datastreams.updateMeasurementResult;
var updateChartOnDelete = require('../streams/measurementStreams.js').datastreams.updateChartOnDelete;

var show = measurementStreams.actionstreams.show;
var hide = measurementStreams.actionstreams.hide;

var showRes = measurementStreams.datastreams.show;
var hideRes = measurementStreams.datastreams.hide;

var updateChart = require('../streams/measurementStreams.js').datastreams.updateChart;
var forceUpdate = require('../streams/measurementStreams.js').actionstreams.forceUpdate;

var _ = require('lodash');
var moment = require('moment');

var Chart = React.createClass({
  getInitialState: function() {
    return {
      data : [],
      margins: {top:20, right: 20, bottom: 20, left: 50},
      windowWidth: window.innerWidth,
      period: "WEEK"
    };
  },
  update: function(payload){
    var data = this.props.data;
    data.push(payload);
    this.setState({
      data: data 
    });
   // updateAvg.emit(payload);
    this.renderChart(data, this.state.period);
  },
  updateMeasurement: function(payload){
    var data = this.state.data;
    for(var i=0; i<data.length; i++){
      if(data[i].id === payload.id){
        data[i] = payload;
        this.setState({
          data: data 
        });
        break;
      }
    }

    this.renderChart(data, this.state.period);
  },
  handleResize: function(){
    this.setState({
      windowWidth: window.innerWidth 
    });
    this.renderChart(this.state.data, this.state.period);
  },
  deleteMeasurement: function(payload){
    var data = this.state.data;
    for(var i=0; i<data.length; i++){
      if(data[i].id === payload){
        data.splice(i, 1);
        break;
      }
    }
    this.setState({
      data: data 
    });

    this.renderChart(data, this.state.period);
  },
  showUpdateMeasurementModal: function(mId){
    this.props.showUpdateMeasurementModal(mId);
  },
  renderChart: function(data, period){
    var self = this;
    var initWidth = 1193;
    var original = 520;
    var ww = this.state.windowWidth;
    var ratio = ww / 520;
    var k = 1;
    var theme = self.props.theme;
    var type = self.props.type;
    var body = theme+'-body';
    var bottom = theme+'-bottom';
    var m = [];
    if(data){
      for(var i=0; i<data.length; i++){
        m.push({x: moment(data[i].get('date')).format('YYYY-MM-DD'), y:data[i].get('value'), id: data[i].id });
      }
    }
    if( ratio < 1){
      k = ratio;
    }

    var tId = this.props.trackId;

    var t = d3.select("#t"+tId);
    t.selectAll("*").remove();
    var b = d3.select("#bottom"+tId); 
    b.selectAll("*").remove();

    
    var area=d3.select('#'+'t'+tId).classed(body, true);
    var bottom = d3.select("#bottom"+tId).classed(bottom, true);
    var margin = {top: 15, right: 0, bottom: 20, left: 60*k},
    width = 400*k,
    height = 200;

    var minY = 10;
    var maxY = 210;

    var gradient = area
    .append("linearGradient")
    .attr("y1", minY)

    .attr("y2", maxY)
    .attr("x1", "0")
    .attr("x2", "0")
    .attr("id", "gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    
    gradient
    .append("stop")
    .attr("offset", "0")
    .attr("stop-color", "#ECB678")
    .attr("stop-opacity", "0.55");

    gradient
    .append("stop")
    .attr("offset", "80%")
    .attr("stop-color", "#ECB678")
    .attr("stop-opacity", "0");

    area.selectAll('path').remove();

    var arr;
    if(data){
      arr = _.sortBy(m, function(d){ return new Date(d.x)}); 
    }
    var begin;

    console.log("THE PERIOD IS: "+period);
    var tickSize;
    var tikValue;
    switch(period){
      case "WEEK":
        begin = moment().subtract(7,'days').format("YYYY-MM-DD");
        tickSize = 1;
        break;
      case "MONTH":
        begin = moment().subtract(30,'days').format("YYYY-MM-DD");
        tickSize = 1;
        break;
      case "YEAR":
        begin = moment().subtract(365,'days').format("YYYY-MM-DD");
        tickSize = 1;
        break;
      default:
        break;
    }

    if(data){
      arr = _.filter(arr, function(n){
        if(moment(n.x).isSame(begin) || moment(n.x).isAfter(begin)){
          return n;
        }
      })
    }

    if(arr.length == 0){
      area.append('text')
      .attr('x', 100)
      .attr('y', 100)
      .attr('font-size', '22px')
      .text('No Data')
      return;
    }

    console.log('a: '+arr.length);

    var x = d3.time.scale()
    .domain([new Date(arr[0].x), d3.time.day.offset(new Date(arr[arr.length - 1].x), 1)])
    .range([0, width]);




    var max=_.max(arr, function(d){ return d.y; });

    var y = d3.scale.linear()
    .domain([0, max.y])
    .range([height - margin.top, 0]);

    var month = moment(arr[0].x).format('MMMM');
    month = month[0].toUpperCase()+month.substr(1);

 
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(d3.time.days, tickSize)
      .tickFormat(d3.time.format('%d'))
      .tickSize(1)
      .tickPadding(8)

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickSize(1)
      .tickPadding(8);

    var fillarea;
    if(type === 'line'){
      fillarea = d3.svg.area()
      .x(function(d) { return x(new Date(d.x)); })
      .y0(200)
      .y1(function(d) { return y(d.y); });
    }
    var lineGen;
    if(type === 'line'){
      lineGen = d3.svg.line().x(function(d) { return x(new Date(d.x));}).y(function(d) {return y(d.y); });
    }
    //area.append("svg:g").attr("transform", "translate(" + (margin.left) + ","+margin.top+")").call(yAxis);

    bottom.append("svg:g")
    .attr("transform", "translate(" + margin.left+", " + (0) + ")")
    .attr("fill", "none")
    .attr("stroke", "none")
    .call(xAxis);


    var ml = width*0.07;
    var l = width+margin.left;
    ml = l*0.07;
    console.log("margin: "+ml+", "+l+".");

    if(type === 'line'){
      area.append('svg:path')
        .attr('d', lineGen(arr))
        .attr('stroke', '#FFBD99')
        .attr('stroke-width', 1)
        .attr('fill', 'none')
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

      area.append("path")
        .datum(arr)
        //.attr("class", "area")
        .attr("d", fillarea)
        //.attr("class", "area")
        .attr('fill', 'url(#gradient)')
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    }

    d3.selectAll(".tick > text")
    .style("font-size", "14px")
    .attr("fill", "white");


    var selection;
    
    if(type === 'line'){
      selection = area.selectAll("circle").data(arr);
      selection.enter().append("circle");

      selection
      .attr('r', 3)
      .attr('stroke', 'white')
      .attr('cx', function(d) {console.log('x: '+x(new Date(d.x))); return x(new Date(d.x)); })
      .attr('cy', function(d) { console.log('y: '+y(d.y)); return y(d.y); })
      .attr('id', function(d){ return "c"+d.id})
      .attr("transform", "translate(" + (margin.left) + ","+margin.top+")");

      area.selectAll("rect")
      .data(arr)
      .enter().append("rect")
      .attr("height", function(d) { return height + "px"; })
      .attr("width", "8px")
      .attr("x", function(d){ return x(new Date(d.x))})
      .attr("y", function(d){ return 0})
      .attr("fill", "black")
      .attr("transform", "translate(" + (margin.left - 2) + ","+0+")")
      .style("opacity", "0")
      .on('mouseover', function(d) {

        area.select("#"+'c'+d.id)
        .attr('r', 5);

        var items = [d];
        var text = area.selectAll('text').data(items);
        text.enter().append('text');
      
        text
        .attr('x', function(d){return x(new Date(d.x))})
        .attr('y', function(d){return (y(d.y))})
        .text(function(d){ return d.y})
        .attr('font-size', "12px")
        .attr('font-family', 'sans-serif')
        .attr("transform", "translate(" + (margin.left-10) + ","+(margin.top-5)+")")
        .attr('fill', 'black')
        .attr('id', 't'+d.id)
        .style('opacity', 1);


        //text.exit().remove();
        })
      .on('mouseout', function(d) {
          var text = area.select('#'+'t'+d.id);
          text.style('opacity', 0);
          var circle = area.select("#"+'c'+d.id)
          .attr('r', 3);
        })
      .on('click', function(d){
          self.props.showUpdateMeasurementModal(d);
        });


      selection.exit().remove();
    } else {
      area.selectAll("rect")
      .data(arr)
      .enter().append("rect")
      .attr("height", function(d) { return height - y(d.y) - 10; })
      .attr("width", "7px")
      .attr("x", function(d){ return x(new Date(d.x))})
      .attr("y", function(d){ return y(d.y) + 10})
      .attr("rx", "5")
      .attr("ry", "5")
      .attr("fill", "#5DCDFF")
      .attr("transform", "translate(" + (margin.left - 2) + ","+0+")")
      .on('mouseover', function(d) {


        var items = [d];
        var text = area.selectAll('text').data(items);
        text.enter().append('text');
      
        text
        .attr('x', function(d){return x(new Date(d.x))})
        .attr('y', function(d){return (y(d.y))})
        .text(function(d){ return d.y})
        .attr('font-size', "12px")
        .attr('font-family', 'sans-serif')
        .attr("transform", "translate(" + (margin.left-10) + ","+(margin.top-5)+")")
        .attr('fill', 'black')
        .attr('id', 't'+d.id)
        .style('opacity', 1);


        //text.exit().remove();
        })
      .on('mouseout', function(d) {
          var text = area.select('#'+'t'+d.id);
          text.style('opacity', 0);
        })
      .on('click', function(d){
          self.props.showUpdateMeasurementModal(d);
        });
    }

  },
  componentWillMount: function() {
    updateRes.onValue(this.update);
    updateChart.onValue(this.updateMeasurement);
    updateChartOnDelete.onValue(this.deleteMeasurement);
    //forceUpdate.onValue(this.forceUpdate);
  },
  componentDidMount: function() {    
    var data = this.props.measurements;
    window.addEventListener('resize', this.handleResize);
    this.setState({
      data: data 
    });
    this.renderChart(data, this.state.period);
    forceUpdate.onValue(this.forceUpdate);
  },
  forceUpdate: function(period){
    var data = this.props.measurements;
    console.log('period: '+period);
    this.setState({
      period: period 
    });
    this.renderChart(data, period);
  },
  componentWillUpdate: function(nextProps, nextState) {
    console.log("componentWillUpdate is called")
  },
  componentDidUpdate: function() {
    console.log('updating chart');
    var data = this.props.measurements;
    var period = this.state.period;
    this.renderChart(data, period);
  },
  render: function() {
    return (
      <div>
        <svg id={"t"+this.props.trackId}  width="100%" height="220"></svg>
        <div className="track-border"/>
        <svg id={"bottom"+this.props.trackId} width="100%" height="50"></svg>
      </div>
    );
  }

});

module.exports = Chart;