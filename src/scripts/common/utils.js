'use strict';

var _ = require('lodash');
var t = require('tcomb-validation');
var moment = require('moment');

var utils = function() {
  var instance = {};


  if (_.isEmpty(instance)) {
    // contains methods to put necessary information to a provided stream
    instance = {

      getGroups: function(stream) {
        var query = new Parse.Query(Parse.Object.extend('Group'));
        query.find().then(function(payload) {
          stream.emit(payload);
          // how to count new messages???
        }, function(error) {
          stream.error(error);
        });
      },
      getAllUsers: function(stream) {
        var sortBy = arguments[1];
        var order = arguments[2];

        var query = new Parse.Query(Parse.Role);
        query.equalTo('name', 'User');
        query.find().then(function(payload) {
          var userRole = payload[0];
          return userRole.getUsers(); // return relation (not actual users)
        }, function(error) {
          stream.error(error);
        }).then(function(payload) {
          var query = payload.query();
          if (sortBy && order) {
            switch(order) {
              case 'ascending':
                query.ascending(sortBy);
              break;
              case 'descending':
                query.descending(sortBy);
              break;
              default:
              break;
            }
          }
          return query.find(); // now try to find all the users
        }, function(error) {
          stream.error(error);
        }).then(function(payload) {
          stream.emit(payload); // this should contain all the users
        }, function(error) {
          stream.error(error);
        });
      },
      getUsersByGroup: function(stream, groupId, sortBy, order) {
        var query = new Parse.Query(Parse.Object.extend('Group'));
        query.get(groupId).then(function(payload) {
          return payload.get('users');
        }, function(error) {
          stream.error(error);
        }).then(function(payload) {
          var query = payload.query();
          if (sortBy && order) {
            query.ascending(sortBy);
          } else {
            query.descending(sortBy);
          }
          return query.find(); // now try to get users
        }, function(error) {
          stream.error(error);
        }).then(function(payload) {
          stream.emit(payload);
        }, function(error) {
          stream.error(error);
        });
      },

      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////// USERS ///////////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////

      createUser: function(email, fullname, password) {
        var UserType = t.struct({
          email: t.Str,
          fullname: t.Str,
          password: t.Str
        });

        var props = {
          email: email,
          fullname: fullname,
          password: password
        };

        if (t.validate(props, UserType).isValid()) {
          var sessionToken = Parse.User.current().getSessionToken();
          var roleQuery = new Parse.Query(Parse.Role);
          roleQuery.equalTo('name', 'User');

          roleQuery.find().then(function(payload) {
            var userRole = payload[0];
            var user = new Parse.User();
            user.set('username', email);
            user.set('password', password);
            user.set('email', email);
            user.set('fullname', fullname);

            user.signUp(null).then(function(payload) {
              Parse.User.become(sessionToken).then(function() {
                userRole.getUsers().add(payload);
                userRole.save();
              });
            }, function(error) {
              console.log(error);
            });
          }, function(error) {
            console.log(error);
          });
        }
      },
      createUsersFromText: function(text) {
        var self = this;
        // split the text into lines
        var lines = text.split('\n');

        _.forEach(lines, function(line) {
          var props = _.map(line.split(','), function(word) {return _.trim(word);});
          self.createUser(props[0], props[1], props[2]);
        });

      },

      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      ///////////////////////// GOALS & SUBMISSIONS ////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////

      createGoal: function(goal, recipients) {
        var self = this;
        var submissionsCapPredicate = function(x) {
          return x >= 0;
        };
        var GoalType = t.struct({
          title: t.Str,
          description: t.maybe(t.Str),
          submissionsCap: t.subtype(t.Num, submissionsCapPredicate),
          finishAt: t.Dat,
          publishAt: t.Dat,
          createdBy: t.Str
        });

        if (t.validate(goal, GoalType).isValid()) {

          if (!moment(goal.publishAt).isAfter(moment(goal.finishAt), 'day')) {

            var Goal = Parse.Object.extend('Goal');
            var User = Parse.Object.extend('User');
            var g = new Goal();
            var u = new User();

            u.id = goal.createdBy;

            g.set('title', goal.title);
            g.set('description', goal.description);
            g.set('submissionsCap', goal.submissionsCap);
            g.set('finishAt', goal.finishAt);
            g.set('publishAt', goal.publishAt);
            g.set('createdBy', u);


            var gACL = new Parse.ACL();
            gACL.setPublicReadAccess(true);
            gACL.setRoleWriteAccess('Author', true);
            g.setACL(gACL);

            g.save().then(function(payload) {

              if (recipients.length > 0) {
                self.addGoalRecipients(payload.id, recipients);
              }

            }, function(error) {
              console.log(error);
            });

          } else {
            // ERROR!
          }

        } else {
          // ERROR!
        }

      },
      updateGoal: function(goalId, props) {
        var Goal = Parse.Object.extend('Goal');
        var query = new Parse.Query(Goal);

        var submissionsCapPredicate = function(x) {
          return x >= 0;
        };

        query.get(goalId).then(
          function(goal) {

            if (t.validate(props.title, t.maybe(t.Str)).isValid()) {
              goal.set('title', props.title);
            }

            if (t.validate(props.description, t.Str).isValid()) {
              goal.set('description', props.title);
            }

            if (t.validate(props.submissionsCap, t.subtype(t.Num, submissionsCapPredicate)).isValid()) {
              goal.set('submissionsCap', props.submissionsCap);
            }

            // finishAt & publishAt

            if (t.validate(props.finishAt, t.Dat).isValid()) {
              // ok, it's date
              // check vs props.publishAt if there is one
              // else check vs the old publishAt
              if (props.publishAt && t.validate(props.publishAt, t.Dat).isValid()) {
                if (!moment(props.publishAt).isAfter(moment(props.finishAt), 'day')) {
                  goal.set('finishAt', props.finishAt);
                }
              } else {
                if (!moment(goal.get('publishAt')).isAfter(moment(props.finishAt), 'day')) {
                  goal.set('finishAt', props.finishAt);
                }
              }
            }

            if (t.validate(props.publishAt, t.Dat).isValid()) {
              // ok, it's date
              if (props.finishAt && t.validate(props.finishAt, t.Dat).isValid()) {
                if (!moment(props.publishAt).isAfter(moment(props.finishAt), 'day')) {
                  goal.set('publishAt', props.publishAt);
                }
              } else {
                if (!moment(props.publishAt).isAfter(moment(goal.get('finishAt')), 'day')) {
                  goal.set('publishAt', props.publishAt);
                }
              }
            }

            goal.save();

          },
          function(error) {
            console.log(error);
          }
        );
      },
      removeGoal: function(goalId) {
        // remove all the goals entries in UserGoalMap
        // which is the same as removing all goal recipients
        this.removeAllGoalRecipients(goalId);

        var Goal = Parse.Object.extend('Goal');
        var goalQuery = new Parse.Query(Goal);

        goalQuery.get(goalId).then(
          function(goal) {
            goal.destroy();
          },
          function(error) {
            console.log(error);
          }
        );
      },

      addGoalRecipient: function(goalId, recipient) {
        var Goal = Parse.Object.extend('Goal');
        var UGMap = Parse.Object.extend('UserGoalMap');
        var User = Parse.Object.extend('User');

        var g = new Goal();
        g.id = goalId;

        var u = new User();
        u.id = recipient;

        var query = new Parse.Query(UGMap);

        query.equalTo('goal', g);
        query.equalTo('user', u);

        query.find().then(
          function(ugMaps) {
            if (ugMaps.length === 0) {
              var ugMap = new UGMap();

              ugMap.set('goal', g);
              ugMap.set('user', u);

              var ugMapACL = new Parse.ACL();
              ugMapACL.setReadAccess(u, true);
              ugMapACL.setRoleReadAccess('Author', true);
              ugMapACL.setRoleWriteAccess('Author', true);

              ugMap.setACL(ugMapACL);

              ugMap.save();
            }
          }
        );

      },
      addGoalRecipients: function(goalId, recipients) {
        var self = this;
        _.forEach(recipients, function(recipient) {
          self.addGoalRecipient(goalId, recipient);
        });
      },

      removeGoalRecipient: function(goalId, recipient) {
        var Goal = Parse.Object.extend('Goal');
        var UGMap = Parse.Object.extend('UserGoalMap');
        var User = Parse.Object.extend('User');

        var g = new Goal();
        g.id = goalId;

        var u = new User();
        u.id = recipient;

        var query = new Parse.Query(UGMap);

        query.equalTo('goal', g);
        query.equalTo('user', u);

        query.find().then(
          function(ugMaps) {
            _.forEach(ugMaps, function(ugMap) {
              ugMap.destroy();
            });
          },
          function(error) {
            console.log(error);
          }
        );
      },
      removeGoalRecipients: function(goalId, recipients) {
        var self = this;
        _.forEach(recipients, function(recipient) {
          self.removeGoalRecipient(goalId, recipient);
        });
      },
      removeAllGoalRecipients: function(goalId) {
        var Goal = Parse.Object.extend('Goal');
        var UGMap = Parse.Object.extend('UserGoalMap');

        var g = new Goal();
        g.id = goalId;

        var query = new Parse.Query(UGMap);
        query.equalTo('goal', g);

        query.find().then(
          function(ugMaps) {
            _.forEach(ugMaps, function(ugMap) {
              ugMap.destroy();
            });
          },
          function(error) {
            console.log(error);
          }
        );
      },

      getAllGoalsByRecipient: function(stream, recipientId) {
        var Goal = Parse.Object.extend('Goal');
        var User = Parse.Object.extend('User');
        var UGMap = Parse.Object.extend('UserGoalMap');

        var u = new User();
        u.id = recipientId;

        var ugsMapQuery = new Parse.Query(UGMap);
        ugsMapQuery.equalTo('user', u);

        ugsMapQuery.find().then(
          function(ugMaps) {
            var goals = _.map(ugMaps, function(ugMap) {
              return ugMap.get('goal').id;
            });

            var goalQuery = new Parse.Query(Goal);
            goalQuery.containedIn('objectId', goals);
            goalQuery.ascending('publishAt');

            return goalQuery.find();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(goals) {
            stream.emit(goals);
          },
          function(error) {
            stream.error(error);
          }
        );
      },
      getActiveGoalsByRecipientBeforeDate: function(stream, recipientId, date) {

        var Goal = Parse.Object.extend('Goal');
        var User = Parse.Object.extend('User');
        var UGMap = Parse.Object.extend('UserGoalMap');
        var Submission = Parse.Object.extend('Submission');

        var u = new User();
        u.id = recipientId;

        var ugMapQuery = new Parse.Query(UGMap);
        ugMapQuery.equalTo('user', u);

        var result = {
          goals: [],
          submissions: {}
        };

        ugMapQuery.find().then(
          function(ugMaps) {
            var goalIds = _.map(ugMaps, function(ugMap) {
              return ugMap.get('goal').id;
            });

            var goalQuery = new Parse.Query(Goal);
            goalQuery.containedIn('objectId', goalIds);
            goalQuery.greaterThanOrEqualTo('finishAt', date);
            goalQuery.lessThanOrEqualTo('publishAt', date);
            goalQuery.ascending('publishAt');

            return goalQuery.find();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(goals) {
            result.goals = goals;

            var submissionQuery = new Parse.Query(Submission);
            submissionQuery.containedIn('goal', goals);
            return submissionQuery.find();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(submissions) {

            _.map(submissions, function(submission) {
              if (result.submissions[submission.get('goal').id]) {
                result.submissions[submission.get('goal').id].push(submission);
              } else {
                result.submissions[submission.get('goal').id] = [submission];
              }
            });

            stream.emit(result);
          },
          function(error) {
            stream.error(error);
          }
        );
      },

      createSubmission: function(goalId, props) {

        var FileType = t.irreducible('File', function (x) {
          return x instanceof File;
        });

        var SubmissionType = t.struct({
          message: t.maybe(t.Str),
          file: FileType,
          createdBy: t.Str
        });

        if (t.validate(props, SubmissionType).isValid()) {

          var Submission = Parse.Object.extend('Submission');
          var Goal = Parse.Object.extend('Goal');
          var User = Parse.Object.extend('User');
          var g = new Goal();
          var u = new User();
          var s = new Submission();

          g.id = goalId;
          u.id = props.createdBy;

          s.set('goal', g);
          s.set('createdBy', u);
          s.set('message', props.message);
          s.set('file', new Parse.File('submission.jpg', props.file));

          var sACL = new Parse.ACL();
          sACL.setReadAccess(u, true);
          sACL.setWriteAccess(u, true);
          sACL.setRoleReadAccess('Author', true);
          sACL.setRoleWriteAccess('Author', true);
          s.setACL(sACL);

          s.save().then(
            function(submission) {
              console.log(submission);
            },
            function(error) {
              console.log(error);
            }
          );


        } else {
          // Error!
        }

      },
      removeSubmission: function(submissionId) {
        var Submission = Parse.Object.extend('Submission');
        var query = new Parse.Query(Submission);

        query.get(submissionId).then(
          function(submission) {
            submission.destroy();
          }
        );
      },

      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      ///////////////////////// MESSAGES & COMMENTS ////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////

      createMessage: function(props, recipients) {
        var self = this;

        var MessageType = t.struct({
          title: t.maybe(t.Str),
          message: t.Str,
          publishAt: t.Dat,
          createdBy: t.Str
        });

        if (t.validate(props, MessageType).isValid()) {

          var Message = Parse.Object.extend('Message');
          var User = Parse.Object.extend('User');

          var m = new Message();
          var u = new User();

          u.id = props.createdBy;

          m.set('title', props.title);
          m.set('message', props.message);
          m.set('publishAt', props.publishAt);
          m.set('createdBy', u);

          var mACL = new Parse.ACL();
          mACL.setPublicReadAccess(true);
          mACL.setRoleWriteAccess('Author', true);
          m.setACL(mACL);

          m.save().then(
            function(message) {
              if (recipients.length > 0) {
                self.addMessageRecipients(message.id, recipients);
              }
            }, function(error) {
              console.log(error);
            }
          );
        }
      },
      addMessageRecipient: function(messageId, recipient) {

      },
      addMessageRecipients: function(messageId, recipients) {
        var self = this;
        _.forEach(recipients, function(recipient) {
          self.addMessageRecipient(messageId, recipient);
        });
      }

    };
  }

  return instance;
};

module.exports = utils;
