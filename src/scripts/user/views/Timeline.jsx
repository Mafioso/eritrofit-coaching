var React = require('react');

var timelineActionstreams = require('../streams/timelineStreams').actionstreams;
var timelineDatastreams = require('../streams/timelineStreams').datastreams;

var loadSubmissions = timelineActionstreams.loadSubmissions;
var loadSubmissionsResult = timelineDatastreams.loadSubmissionsResult;

var loadComments = timelineActionstreams.loadComments;
var loadCommentsResult = timelineDatastreams.loadCommentsResult;

var loadMeasurements = timelineActionstreams.loadMeasurements;
var loadMeasurementsResult = timelineDatastreams.loadMeasurementsResult;

var approveSubmission = timelineActionstreams.approveSubmission;
var approveSubmissionResult = timelineDatastreams.approveSubmissionResult;

var commentResponse = timelineActionstreams.commentResponse;

var readMeasurement = timelineActionstreams.readMeasurement;

var Submission = require('../components/goals/Submission.jsx');

var Dropdown = require('./Dropdown.jsx');
var SubmissionEvent = require('./SubmissionEvent.jsx');
var CommentEvent = require('./CommentEvent.jsx');
var MeasurementEvent = require('./MeasurementEvent.jsx');
var Send = require('../components/messages/Send.jsx');

var Portal = require('../../common/components/Portal.jsx');


var moment = require('moment');
var _ = require('lodash');

var Timeline = React.createClass({
  getInitialState: function() {
    return {
      data: {
        submissions: [],
        comments: [],
        measurements: []
      },
      mode: 'submissions',
      trigger: false ,
      modal: ''
    };
  },
  updateSubmissions: function(submission){
    var submissions = this.state.data.submissions;
    for(prop in submission){
      submission[prop] = decodeURIComponent(submission[prop]);
    }

    submissions.unshift(submission);
    var data = this.state.data;
    data.submissions = submissions;
    this.setState({
       data: data 
    });

  },
  updateComments: function(comment){
    var data = this.state.data;
    var comments = data.comments;
    for(prop in comment){
      comment[prop] = decodeURIComponent(comment[prop]);
    }
    comments.unshift(comment);
    data.comments = comments;
    this.setState({
      data: data 
    });
  },
  updateMeasurement: function(measurement){
    var data = this.state.data;
    var measurements = data.measurements;

    for(var prop in measurement){
      measurement[prop] = decodeURIComponent(measurement[prop]);
    }

    measurements.unshift(measurement);
    data.measurements = measurements;
    this.setState({
      data: data 
    });
  },
  approveSubmission: function(id){
    approveSubmission.emit(id);
  },
  approveSubmissionResult: function(id){
    console.log('the answer');
    var data = this.state.data;
    var submissions = data.submissions;

    var index = _.findIndex(submissions, function(submission){
      return submission.id === id;
    });

    submissions.splice(index, 1);
    data.submissions = submissions;


    this.setState({
      data: data 
    });
  },
  readMeasurement: function(id){
    readMeasurement.emit(id);
  },
  loadSubmissions: function(data){
    var arr = [];
    for(var i in data){
      console.log('gid: '+data[i].get('goal').get('title'));
      arr.push({
        id: data[i].id, 
        text: data[i].get('text'),
        original: data[i].get('file').url(),
        thumbnail: data[i].get('fileThumb').url(),
        createdAt: data[i].createdAt,
        goal: data[i].get('goal').get('title'),
        createdBy: data[i].get('createdBy').get('username')
      });
    }
    var old = this.state.data;
    old.submissions = arr;
    this.setState({
      data: old 
    });
  },
  loadComments: function(data){
    var arr = [];
    for(var i in data){
      arr.push({
        id: data[i].id,
        text: data[i].get('text'),
        createdBy: data[i].get('createdBy').get('username'),
        message: data[i].get('message').get('title'),
        userId: data[i].get('createdBy').id
      });
    }
    var state = this.state.data;
    state.comments = arr;
    this.setState({
      data: state 
    });
  },
  loadMeasurements: function(data){
    var arr = [];
    for(var i in data){
      arr.push({
        id: data[i].id,
        value: data[i].get('value'),
        unit: data[i].get('unit'),
        track: data[i].get('track').get('title'),
        user: data[i].get('user').get('username'),
        createdBy: data[i].get('createdBy').get('username')
      });
    }
    var state = this.state.data;
    state.measurements = arr;
    this.setState({
      data: state 
    });
  },
  deleteSubmission: function(payload){
    var data = _.clone(this.state.data);
    var index = _.findIndex(data.submissions, function(submission){
      return submission.id === payload.id
    });
    data.submissions.splice(index, 1);
    this.setState({
      data: data 
    });
  },
  commentResponse: function(cId){
    console.log('response to: '+cId);
    commentResponse.emit(cId);
  },
  deleteComment: function(payload){
    console.log('delete comment: '+payload.id);
    var data = _.clone(this.state.data);
    var index = _.findIndex(data.comments, function(comment){
      return comment.id === payload.id
    });
    data.comments.splice(index, 1);
    this.setState({
      data: data 
    });
  },
  deleteMeasurement: function(payload){
    var data = _.clone(this.state.data);
    var index = _.findIndex(data.measurements, function(measurement){
      return measurement.id === payload.id
    });
    data.measurements.splice(index, 1);
    this.setState({
      data: data 
    });
  },
  componentWillMount: function() {
    var pusher = new Pusher('d96273fc895ad1c399c9');
    var channel = pusher.subscribe('author_channel');

    channel.bind('submission', this.updateSubmissions);
    channel.bind('comment', this.updateComments);
    channel.bind('measurement', this.updateMeasurement);

    channel.bind('deleteSubmission', this.deleteSubmission);
    channel.bind('deleteComment', this.deleteComment);
    channel.bind('deleteMeasurement', this.deleteMeasurement);

    loadSubmissionsResult.onValue(this.loadSubmissions);
    loadCommentsResult.onValue(this.loadComments);
    loadMeasurementsResult.onValue(this.loadMeasurements);
    approveSubmissionResult.onValue(this.approveSubmissionResult);
  },
  componentDidMount: function() {
    loadSubmissions.emit(true);
  },
  show: function(payload){
    switch(payload){
      case 'submissions':
        loadSubmissions.emit(true);
        break;
      case 'comments':
        loadComments.emit(true);
        break;
      case 'measurements':
        loadMeasurements.emit(true);
        break;
      default:
        break;
    }   
    this.setState({
      mode: payload 
    });
  },
  render: function() {
    var data;
    var dropDown;
    var self = this;

    switch(this.state.mode){
      case 'submissions':
        if(this.state.data.submissions.length != 0){
        console.log('debug: '+this.state.data.submissions.length);
        data = (
            _.map(this.state.data.submissions, function(submission){
              return <div>
                         <SubmissionEvent
                              key={submission.id}
                              submissionId={submission.id}
                              goal = {submission.goal}
                              text={submission.text}
                              original={submission.original}
                              thumbnail={submission.thumbnail}
                              createdAt={submission.createdAt}
                              createdBy={submission.createdBy}
                              approve = {self.approveSubmission}
                          />
                      </div>
            })
          )
        } else {
          data = (
            <div>No Data</div>
          );
        }
        break;
      case 'comments':
        if(this.state.data.comments.length != 0){
          data = (
            _.map(this.state.data.comments, function(comment){
              return <div><CommentEvent
                              key = {comment.id}
                              id = {comment.id}
                              message = {comment.message}
                              text = {comment.text}
                              createdBy = {comment.createdBy}
                              response = {self.commentResponse}
                              uId = {comment.userId}
                           />
                    </div>
            })
          );
        } else {
          data = (
            <div>No Data</div>
          );
        }
        break;
      case 'measurements':
        if(this.state.data.measurements.length != 0){
          data = (
            _.map(this.state.data.measurements, function(measurement){
                return  <div>
                          <MeasurementEvent 
                            id = {measurement.id}
                            track = {measurement.track}
                            value = {measurement.value}
                            unit = {measurement.unit}
                            user = {measurement.user}
                            createdBy = {measurement.createdBy}
                            read = {self.readMeasurement}
                          />
                        </div>
            })
          );
        }else{
           data = (
            <div>No Data</div>
          );
        }
        break;
      default: 
        break;
    }
    return (
      <div className='container'>
          <Dropdown changeState = {self.show}/>
          {data}
      </div>
    );
  }

});

module.exports = Timeline;
