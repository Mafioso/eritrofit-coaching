'use strict';

var _ = require('underscore');
var Image = require('parse-image');

Parse.Cloud.define('getDefaultTrackData', function(request, response) {
  var user = request.user;
  var date = request.params.date;

  // find all the goals before date
  var Goal = Parse.Object.extend('Goal');
  var UGMap = Parse.Object.extend('UserGoalMap');
  var Submission = Parse.Object.extend('Submission');

  var ugMapQuery = new Parse.Query(UGMap);
  ugMapQuery.equalTo('user', user);

  var result = {
    totalCap: 0,
    totalSubmitted: 0,
    totalApproved: 0,
    latestSubmissionDate: ''
  };

  ugMapQuery.find().then(
    function(ugMaps) {
      var goalIds = _.map(ugMaps, function(ugMap) {
        return ugMap.get('goal').id;
      });

      var goalQuery = new Parse.Query(Goal);
      goalQuery.containedIn('objectId', goalIds);
      goalQuery.lessThanOrEqualTo('publishAt', date);
      goalQuery.ascending('publishAt');

      return goalQuery.find();
    },
    function(error) {
      stream.error(error);
    }
  ).then(
    function(goals) {
      // count all the submission caps

      var totalCap = _.reduce(goals, function(memo, goal) {
        return memo + goal.get('submissionsCap');
      }, 0);

      result.totalCap = totalCap;

      var submissionQuery = new Parse.Query(Submission);
      submissionQuery.containedIn('goal', goals);
      submissionQuery.equalTo('createdBy', user);
      submissionQuery.ascending('createdAt');
      return submissionQuery.find();
    },
    function(error) {
      response.error(error);
    }
  ).then(
    function(submissions) {
      if (submissions.length > 0) {
        result.latestSubmissionDate = submissions[0].createdAt;
      }

      var SubmissionState = Parse.Object.extend('SubmissionState');
      var submissionStateQuery = new Parse.Query(SubmissionState);
      submissionStateQuery.containedIn('submission', submissions);
      return submissionStateQuery.find();
    },
    function(error) {
      response.error(error);
    }
  ).then(
    function(submissionStates) {
      result.totalSubmitted = submissionStates.length;
      result.totalApproved = _.reduce(submissionStates, function(memo, state) {
        if (state.get('isApproved')) {
          return memo + 1;
        } else {
          return memo;
        }
      }, 0);

      response.success(result);

    },
    function(error) {
      response.error(error);
    }
  );
});

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  var user = request.object;
  if (!user.dirty('userpic')) {
    // Profile photo isn't being modified
    response.success();
    return;
  }

  Parse.Cloud.httpRequest({
    url: user.get('userpic').url()
  }).then(
    function(response) {
      var image = new Image();
      return image.setData(response.buffer);
    }
  ).then(
    function(image) {
      // make the image square
      var size = Math.min(image.width(), image.height());
      return image.crop({
        left: (image.width() - size)/2,
        top: (image.height() - size)/2,
        width: size,
        height: size
      });
    }
  ).then(
    function(image) {
      // resize now!
      return image.scale({
        width: 64,
        height: 64
      });
    }
  ).then(
    function(image) {
      return image.setFormat('JPEG');
    }
  ).then(function(image) {
    // Get the image data in a Buffer.
    return image.data();

  }).then(
    function(buffer) {
      // save image into a new file
      var base64 = buffer.toString('base64');

      var cropped = new Parse.File('thumbnail.jpg', {base64: base64});
      return cropped.save();
    }
  ).then(
    function(cropped) {
      user.set('userpicThumb', cropped);
    }
  ).then(
    function(result) {
      response.success();
    },
    function(error) {
      response.error(error);
    }
  );

});

Parse.Cloud.beforeSave('Submission', function(request, response) {
  var submission = request.object;
  if (!submission.dirty('file')) {
    // Profile photo isn't being modified
    response.success();
    return;
  }

  Parse.Cloud.httpRequest({
    url: submission.get('file').url()
  }).then(
    function(response) {
      var image = new Image();
      return image.setData(response.buffer);
    }
  ).then(
    function(image) {
      // make the image square
      var size = Math.min(image.width(), image.height());
      return image.crop({
        left: (image.width() - size)/2,
        top: (image.height() - size)/2,
        width: size,
        height: size
      });
    }
  ).then(
    function(image) {
      // resize now!
      return image.scale({
        width: 128,
        height: 128
      });
    }
  ).then(
    function(image) {
      return image.setFormat('JPEG');
    }
  ).then(function(image) {
    // Get the image data in a Buffer.
    return image.data();

  }).then(
    function(buffer) {
      // save image into a new file
      var base64 = buffer.toString('base64');

      var cropped = new Parse.File('thumbnail.jpg', {base64: base64});
      return cropped.save();
    }
  ).then(
    function(cropped) {
      submission.set('fileThumb', cropped);
    }
  ).then(
    function(result) {
      response.success();
    },
    function(error) {
      response.error(error);
    }
  );

});

// add submission state, that can be edited only by Authors
Parse.Cloud.afterSave('Submission', function(request) {
  // create a new SubmissionState entry if there is no such record
  Parse.Cloud.useMasterKey();
  console.log("ADASDASDASD");
  var SubmissionState = Parse.Object.extend('SubmissionState');
  var query = new Parse.Query(SubmissionState);

  query.equalTo('submission', request.object);
  console.log("before query");
  query.find().then(
    function(submissionStates) {
      console.log("before cond");
      if (submissionStates.length === 0) {
        console.log("after cond");
        var submissionState = new SubmissionState();
        submissionState.set('submission', request.object);
        submissionState.set('isApproved', false);
        var acl = new Parse.ACL();
        var roleQuery = new Parse.Query(Parse.Role);
        roleQuery.equalTo('name', 'Author');
        roleQuery.find().then(function(payload){
          var role = payload[0];
          acl.setReadAccess(request.object.get('createdBy'), true);
          acl.setRoleWriteAccess(role, true);
          acl.setRoleReadAccess(role, true);
          submissionState.setACL(acl);
          console.log("befor save!");
          submissionState.save();
        });
      }
    }
  );
});

// remove respective submission state
Parse.Cloud.afterDelete('Submission', function(request) {
  // remove all related SubmissionState objects after Submission removal
  var SubmissionState = Parse.Object.extend('SubmissionState');
  var query = new Parse.Query(SubmissionState);

  query.equalTo('submission', request.object);
  Parse.Cloud.useMasterKey();
  query.find().then(
    function(submissionStates) {
      _.forEach(submissionStates, function(submissionState) {
        submissionState.destroy();
      });
    }
  );

});

// remove respective submissions
Parse.Cloud.afterDelete('Goal', function(request) {
  // remove all related UserGoalMaps and Submissions

  var UserGoalMap = Parse.Object.extend('UserGoalMap');
  var Submission = Parse.Object.extend('Submission');

  var ugMapQuery = new Parse.Query(UserGoalMap);
  ugMapQuery.equalTo('goal', request.object);

  ugMapQuery.find().then(
    function(ugms) {
      _.forEach(ugms, function(ugm) {
        ugm.destroy();
      });
    }
  );

  var sQuery = new Parse.Query(Submission);
  sQuery.equalTo('goal', request.object);

  sQuery.find().then(
    function(ss) {
      _.forEach(ss, function(s) {
        s.destroy();
      });
    }
  );

});

// remove respective comments
Parse.Cloud.afterDelete('Message', function(request) {
  var UMMap = Parse.Object.extend('UserMessageMap');
  var Comment = Parse.Object.extend('Comment');

  var umMapQuery = new Parse.Query(UMMap);
  umMapQuery.equalTo('message', request.object);

  umMapQuery.find().then(
    function(umms) {
      _.forEach(umms, function(umm) {
        umm.destroy();
      });
    }
  );

  var cQuery = new Parse.Query(Comment);
  cQuery.equalTo('message', request.object);

  cQuery.find().then(
    function(cs) {
      _.forEach(cs, function(c) {
        c.destroy();
      });
    }
  );
});

// remove respective measurements
Parse.Cloud.afterDelete('Track', function(request) {
  var UTMap = Parse.Object.extend('UserTrackMap');
  var Measurement = Parse.Object.extend('Measurement');

  var utMapQuery = new Parse.Query(UTMap);
  utMapQuery.equalTo('track', request.object);

  utMapQuery.find().then(
    function(utms) {
      _.forEach(utms, function(utm) {
        utm.destroy();
      });
    }
  );

  var mQuery = new Parse.Query(Measurement);
  mQuery.equalTo('track', request.object);

  mQuery.find().then(
    function(ms) {
      _.forEach(ms, function(m) {
        m.destroy();
      });
    }
  );

});

Parse.Cloud.beforeSave('UserTrackMap', function(request, response){
  var UTMap = Parse.Object.extend('UserTrackMap');
  var Track = Parse.Object.extend('Track');

  var utMapQuery = new Parse.Query(UTMap);
  utMapQuery.find().then(function(payload){
    
  });
  response.success();

});

Parse.Cloud.afterSave('Measurement', function(request){
  var Track = Parse.Object.extend('Track');
  var UTM = Parse.Object.extend('UserTrackMap');
  var measurement = request.object;

  var t = new Track();
  t.id = measurement.get('track').id;

  console.log('is updated: '+measurement.get('updated'));
  var utmQuery = new Parse.Query(UTM);
  utmQuery.equalTo('track', t);
  utmQuery.find().then(function(payload){
    var utm = payload[0];
    var oldVal;
    var total = utm.get('total');
    if(!measurement.get('updated')){
      total++;
    }else{
      oldVal = measurement.get('old');
      var avg = utm.get('average');
      var newVal = measurement.get('value');
      var newAvg  = avg + (newVal - oldVal)/(total);
      utm.set('average', newAvg);
      utm.save();
      return;
    }
    var old = utm.get('average');
    console.log('old: '+old);
    console.log('new measurement: '+measurement.get('value'));
    var newOne = old + (measurement.get('value') - old)/(total);
    utm.set('total', total);
    utm.set('average', newOne);
    utm.save();
  });
});

Parse.Cloud.afterDelete('Measurement', function(request) {
  var UTM = Parse.Object.extend('UserTrackMap');
  var Track = Parse.Object.extend('Track');
  var measurement = request.object;

  var u = request.user;
  var t = new Track();
  t.id = measurement.get('track').id;


  var utmQuery = new Parse.Query(UTM);
  utmQuery.equalTo('user', u);
  utmQuery.equalTo('track', t);

  utmQuery.first().then(function(utm){
    console.log('FOUND!');
    var total = utm.get('total');
    var avg = utm.get('average');
    total--;
    if(total <= 0){
      avg = 0;
      total = 0;
    }else{
      avg = (avg*(total+1) - measurement.get('value'))/total;
    }
    console.log('average: '+avg);
    console.log('total: '+total);
    utm.set('total', total);
    utm.set('average', avg);
    utm.save();
  });


});
