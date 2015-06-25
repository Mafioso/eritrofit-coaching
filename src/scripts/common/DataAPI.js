'use strict';

var _ = require('lodash');
var t = require('tcomb-validation');
var moment = require('moment');

var dataAPI = function() {
  var instance = window.DataAPI;

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
      updateCurrentUser: function(stream, props) {
        var user = Parse.User.current();
        var FileType = t.irreducible('File', function (x) {
          return x instanceof File;
        });

        if (t.validate(props.fullname, t.Str).isValid()) {
          user.set('fullname', props.fullname);
        }

        if (t.validate(props.userpic, FileType).isValid()) {
          user.set('userpic', new Parse.File('original.jpg', props.userpic));
        }

        user.save().then(
          function(result) {
            console.log('saved!');
            stream.emit(result);
          },
          function(error) {
            console.log('error!', error);
            stream.error(error);
          }
        );

      },
      updateUser: function(stream, userId, props) {
        var User = Parse.Object.extend('User');
        var uQuery = new Parse.Query(User);
        var FileType = t.irreducible('File', function (x) {
          return x instanceof File;
        });

        uQuery.get(userId).then(
          function(user) {
            if (t.validate(props.fullname, t.Str).isValid()) {
              user.set('fullname', props.fullname);
            }

            if (t.validate(props.userpic, FileType).isValid()) {
              user.set('userpic', new Parse.File('original.jpg', props.userpic));
            }

            return user.save();

          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(result) {
            stream.emit(result);
          },
          function(error) {
            stream.error(error);
          }
        );
      },
      updateCurrentUserPassword: function(stream, props) {
        var user = Parse.User.current();

        var predicate = function(x) {
          return x.length >= 6;
        };

        var PwdStrType = t.subtype(t.Str, predicate);

        var PasswordType = t.struct({
          newPassword: PwdStrType,
          newPasswordAgain: PwdStrType
        });

        if (t.validate(props, PasswordType).isValid()) {
          if (props.newPassword === props.newPasswordAgain) {
            user.setPassword(props.newPassword);
            user.save().then(
              function(result) {
                stream.emit(result);
              },
              function(error) {
                stream.error(error);
              }
            );
          } else {
            stream.error('passwords should match');
          }
        } else {
          stream.error(t.validate(props, PasswordType).errors);
        }

      },
      updatePassword: function(userId, props) {
        var PasswordType = t.struct({
          newPassword: t.Str,
          newPasswordAgain: t.Str
        });

        if (t.validate(props, PasswordType).isValid()) {
          if (props.newPassword === props.newPasswordAgain) {
            var User = Parse.Object.extend('User');
            var uQuery = new Parse.Query(User);
            uQuery.get(userId).then(
              function(user) {
                user.setPassword(props.newPassword);
              },
              function(error) {
                console.log(error);
              }
            );
          }
        }
      },
      requestPasswordReset: function(email) {
        Parse.User.requestPasswordReset(email).then(
          function(result) {
            console.log(result);
          },
          function(error) {
            console.log(error);
          }
        );
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
        var FileType = t.irreducible('File', function (x) {
          return x instanceof File;
        });
        var GoalType = t.struct({
          cover: FileType,
          title: t.Str,
          description: t.maybe(t.Str),
          submissionsCap: t.subtype(t.Num, submissionsCapPredicate),
          finishAt: t.Dat,
          publishAt: t.Dat,
          createdBy: t.Str
        });
        console.log("uid: "+Parse.User.current().id);
        console.log('befor validation');
        if (t.validate(goal, GoalType).isValid()) {
          console.log('VALID!');
          if (!moment(goal.publishAt).isAfter(moment(goal.finishAt), 'day')) {

            var Goal = Parse.Object.extend('Goal');
            var User = Parse.Object.extend('User');
            var g = new Goal();
            var u = new User();

            u.id = goal.createdBy;

            g.set('cover', new Parse.File('original.jpg', goal.cover));
            g.set('title', goal.title);
            g.set('description', goal.description);
            g.set('submissionsCap', goal.submissionsCap);
            g.set('finishAt', goal.finishAt);
            g.set('publishAt', goal.publishAt);
            g.set('createdBy', u);

            //setting goal ACL
            var gACL = new Parse.ACL();
            gACL.setPublicReadAccess(true);
            //let's get a role first
            var roleQuery = new Parse.Query(Parse.Role);
            roleQuery.equalTo('name', 'Author');
            roleQuery.first().then(function(role){
              gACL.setRoleWriteAccess(role, true);
              g.setACL(gACL);
              console.log("INSIDE CREATING A GOAL, MUTHAFUKKA!");
              g.save().then(function(payload) {

                if (recipients.length > 0) {
                  self.addGoalRecipients(payload.id, recipients);
                }

              }, function(error) {
                console.log("WTF?");
                console.log(error);
              });

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
        var FileType = t.irreducible('File', function (x) {
          return x instanceof File;
        });

        query.get(goalId).then(
          function(goal) {

            if (t.validate(props.cover, FileType).isValid()) {
              goal.set('cover', new Parse.File('original.jpg', props.cover));
            }

            if (t.validate(props.title, t.Str).isValid()) {
              goal.set('title', props.title);
            }

            if (t.validate(props.description, t.maybe(t.Str)).isValid()) {
              goal.set('description', props.description);
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

      _setUserGoalMapPropIsReadByUser: function(goalId, userId, prop) {
        var Goal = Parse.Object.extend('Goal');
        var UGMap = Parse.Object.extend('UserGoalMap');
        var User = Parse.Object.extend('User');

        var g = new Goal();
        g.id = goalId;

        var u = new User();
        u.id = userId;

        var query = new Parse.Query(UGMap);

        query.equalTo('goal', g);
        query.equalTo('user', u);

        query.first().then(
          function(ugMap) {
            if (ugMap) {
              ugMap.set('isReadByUser', prop);
              ugMap.save();
            }
          },
          function(error) {
            console.log(error);
          }
        );
      },
      markGoalAsReadByUser: function(goalId, userId) {
        this._setUserGoalMapPropIsReadByUser(goalId, userId, true);
      },
      markGoalAsUnreadByUser: function(goalId, userId) {
        this._setUserGoalMapPropIsReadByUser(goalId, userId, false);
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
              ugMap.set('isReadByUser', false);

              var ugMapACL = new Parse.ACL();
              ugMapACL.setReadAccess(u, true);
              ugMapACL.setWriteAccess(u, true);
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

        var ugMapQuery = new Parse.Query(UGMap);
        ugMapQuery.equalTo('user', u);

        ugMapQuery.find().then(
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
          submissions: {},
          submissionStates: {}
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
            submissionQuery.equalTo('createdBy', u);
            submissionQuery.ascending('createdAt');
            return submissionQuery.find();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(submissions) {

            _.forEach(submissions, function(submission) {
              if (result.submissions[submission.get('goal').id]) {
                result.submissions[submission.get('goal').id].push(submission);
              } else {
                result.submissions[submission.get('goal').id] = [submission];
              }
            });
            var SubmissionState = Parse.Object.extend('SubmissionState');
            var submissionStateQuery = new Parse.Query(SubmissionState);
            submissionStateQuery.containedIn('submission', submissions);
            return submissionStateQuery.find();
            // stream.emit(result);
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(submissionStates) {
            _.forEach(submissionStates, function(submissionState) {
              result.submissionStates[submissionState.get('submission').id] = submissionState;
            });

            stream.emit(result);

          },
          function(error) {
            stream.error(error);
          }
        );
      },

      getGoalById: function(stream, recipientId, goalId) {

        var Goal = Parse.Object.extend('Goal');
        var User = Parse.Object.extend('User');
        var Submission = Parse.Object.extend('Submission');

        var u = new User();
        u.id = recipientId;

        var result = {
          goal: {},
          submissions: [],
          submissionStates: {}
        };

        var goalQuery = new Parse.Query(Goal);
        goalQuery.get(goalId).then(
          function(goal) {
            result.goal = goal;
            var submissionQuery = new Parse.Query(Submission);
            submissionQuery.equalTo('goal', goal);
            submissionQuery.equalTo('createdBy', u);
            submissionQuery.ascending('createdAt');
            return submissionQuery.find();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(submissions) {
            result.submissions = submissions;

            var SubmissionState = Parse.Object.extend('SubmissionState');
            var submissionStateQuery = new Parse.Query(SubmissionState);
            submissionStateQuery.containedIn('submission', submissions);
            return submissionStateQuery.find();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(submissionStates) {
            _.forEach(submissionStates, function(submissionState) {
              result.submissionStates[submissionState.get('submission').id] = submissionState;
            });

            stream.emit(result);

          },
          function(error) {
            stream.error(error);
          }
        );
      },

      createSubmission: function(stream, goalId, props) {

        var FileType = t.irreducible('File', function (x) {
          return x instanceof File;
        });

        var SubmissionType = t.struct({
          text: t.maybe(t.Str),
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
          s.set('text', props.text);
          s.set('file', new Parse.File('submission.jpg', props.file));

          var sACL = new Parse.ACL();
          sACL.setReadAccess(u, true);
          sACL.setWriteAccess(u, true);
          sACL.setRoleReadAccess('Author', true);
          sACL.setRoleWriteAccess('Author', true);
          s.setACL(sACL);

          s.save().then(
            function(submission) {
              stream.emit(submission);
            },
            function(error) {
              stream.error(error);
            }
          );


        } else {
          stream.error(t.validate(props, SubmissionType).firstError());
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
          text: t.Str,
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
          m.set('text', props.text);
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
        } else {
          console.log(t.validate(props, MessageType));
        }
      },
      updateMessage: function(messageId, props) {
        var Message = Parse.Object.extend('Message');
        var query = new Parse.Query(Message);

        query.get(messageId).then(
          function(message) {

            if (t.validate(props.title, t.maybe(t.Str).isValid())) {
              message.set('title', props.title);
            }

            if (t.validate(props.text, t.Str).isValid()) {
              message.set('text', props.text);
            }

            if (t.validate(props.publishAt, t.Dat).isValid()) {
              message.set('publishAt', props.publishAt);
            }

            message.save();
          },
          function(error) {
            console.log(error);
          }
        );

      },
      removeMessage: function(messageId) {
        this.removeAllMessageRecipients(messageId);

        var Message = Parse.Object.extend('Message');
        var messageQuery = new Parse.Query(Message);

        messageQuery.get(messageId).then(
          function(message) {
            message.destroy();
          },
          function(error) {
            console.log(error);
          }
        );

      },

      _setMessagePropIsReadByUser: function(messageId, userId, prop) {
        var Message = Parse.Object.extend('Message');
        var UMMap = Parse.Object.extend('UserMessageMap');
        var User = Parse.Object.extend('user');

        var m = new Message();
        m.id = messageId;

        var u = new User();
        u.id = userId;

        var query = new Parse.Query(UMMap);

        query.equalTo('message', m);
        query.equalTo('user', u);

        query.first().then(
          function(umMap) {
            if (umMap) {
              umMap.set('isReadByUser', prop);
              umMap.save();
            }
          },
          function(error) {
            console.log(error);
          }
        );
      },
      markMessageAsReadByUser: function(messageId, userId) {
        this._setMessagePropIsReadByUser(messageId, userId, true);
      },
      markMessageAsUnreadByUser: function(messageId, userId) {
        this._setMessagePropIsReadByUser(messageId, userId, false);
      },

      addMessageRecipient: function(messageId, recipient) {
        var Message = Parse.Object.extend('Message');
        var UMMap = Parse.Object.extend('UserMessageMap');
        var User = Parse.Object.extend('User');

        var m = new Message();
        m.id = messageId;

        var u = new User();
        u.id = recipient;

        var query = new Parse.Query(UMMap);

        query.equalTo('message', m);
        query.equalTo('user', u);

        query.find().then(
          function(umMaps) {
            if (umMaps.length === 0) {
              var umMap = new UMMap();

              umMap.set('message', m);
              umMap.set('user', u);
              umMap.set('isReadByUser', false);

              var umMapACL = new Parse.ACL();
              umMapACL.setReadAccess(u, true);
              umMapACL.setWriteAccess(u, true);
              umMapACL.setRoleReadAccess('Author', true);
              umMapACL.setRoleWriteAccess('Author', true);

              umMap.setACL(umMapACL);

              umMap.save();
            }
          }
        );
      },
      addMessageRecipients: function(messageId, recipients) {
        var self = this;
        _.forEach(recipients, function(recipient) {
          self.addMessageRecipient(messageId, recipient);
        });
      },

      removeMessageRecipient: function(messageId, recipient) {
        var Message = Parse.Object.extend('Message');
        var UMMap = Parse.Pbject.extend('UserMessageMap');
        var User = Parse.Object.extend('User');

        var m = new Message();
        m.id = messageId;

        var u = new User();
        u.id = recipient;

        var query = new Parse.Query(UMMap);

        query.equalTo('message', m);
        query.equalTo('user', u);

        query.find().then(
          function(umMaps) {
            _.forEach(umMaps, function(umMap) {
              umMap.destroy();
            });
          },
          function(error) {
            console.log(error);
          }
        );

      },
      removeMessageRecipients: function(messageId, recipients) {
        var self = this;
        _.forEach(recipients, function(recipient) {
          self.removeMessageRecipient(messageId, recipient);
        });
      },
      removeAllMessageRecipients: function(messageId) {
        var Message = Parse.Object.extend('Messagee');
        var UMMap = Parse.Object.extend('UserMessageMap');

        var m = new Message();
        m.id = messageId;

        var query = new Parse.Query(UMMap);
        query.equalTo('message', m);

        query.find().then(
          function(umMaps) {
            _.forEach(umMaps, function(umMap) {
              umMap.destroy();
            });
          },
          function(error) {
            console.log(error);
          }
        );

      },

      getAllMessagesByRecipient: function(stream, recipientId) {
        var Message = Parse.Object.extend('Message');
        var User = Parse.Object.extend('User');
        var UMMap = Parse.Object.extend('UserMessageMap');

        var u = new User();
        u.id = recipientId;

        var umMapQuery = new Parse.Query(UMMap);
        umMapQuery.equalTo('user', u);

        umMapQuery.find().then(
          function(umMaps) {
            var messages = _.map(umMaps, function(umMap) {
              return umMap.get('message').id;
            });

            var messageQuery = new Parse.Query(Message);
            messageQuery.containedIn('objectId', messages);
            messageQuery.ascending('publishAt');

            return messageQuery.find();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(messages) {
            stream.emit(messages);
          },
          function(error) {
            stream.error(error);
          }
        );
      },
      getPublishedMessagesByRecipientBeforeDate: function(stream, recipientId, date, unreadByRecipient) {
        var Message = Parse.Object.extend('Message');
        var User = Parse.Object.extend('User');
        var UMMap = Parse.Object.extend('UserMessageMap');
        var Comment = Parse.Object.extend('Comment');

        var u = new User();
        u.id = recipientId;

        var umMapQuery = new Parse.Query(UMMap);
        umMapQuery.equalTo('user', u);
        if (unreadByRecipient) {
          umMapQuery.equalTo('isReadByUser', false);
        }

        var result = {
          umMaps: [],
          messages: [],
          comments: {},
          messageStates: {}
        };

        umMapQuery.find().then(
          function(umMaps) {
            result.umMaps = umMaps;
            var messageIds = _.map(umMaps, function(umMap) {
              result.messageStates[umMap.get('message').id] = umMap.get('isReadByUser');
              return umMap.get('message').id;
            });

            var messageQuery = new Parse.Query(Message);
            messageQuery.containedIn('objectId', messageIds);
            messageQuery.lessThanOrEqualTo('publishAt', date);
            messageQuery.descending('publishAt');
            messageQuery.include('createdBy');

            return messageQuery.find();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(messages) {
            result.messages = messages;

            var commentsQuery = new Parse.Query(Comment);
            commentsQuery.containedIn('message', messages);
            commentsQuery.equalTo('user', u);
            commentsQuery.ascending('createdAt');
            commentsQuery.include('createdBy');

            return commentsQuery.find();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(comments) {
            _.forEach(comments, function(comment) {
              if (result.comments[comment.get('message').id]) {
                result.comments[comment.get('message').id].push(comment);
              } else {
                result.comments[comment.get('message').id] = [comment];
              }
            });

            stream.emit(result);
          },
          function(error) {
            stream.error(error);
          }
        );
      },

      markMessagesAsRead: function(umMaps) {
        _.forEach(umMaps, function(umMap) {
          umMap.set('isReadByUser', true);
          umMap.save();
        });
      },

      createComment: function(stream, userId, messageId, props) {
        var CommentType = t.struct({
          text: t.Str,
          createdBy: t.Str
        });

        if (t.validate(props, CommentType).isValid()) {
          if (_.trim(props.text).length > 0) {
            var Comment = Parse.Object.extend('Comment');
            var Message = Parse.Object.extend('Message');
            var User = Parse.Object.extend('User');

            var c = new Comment();
            var m = new Message();
            var u = new User();
            var createdBy = new User();

            u.id = userId;
            m.id = messageId;
            createdBy.id = props.createdBy;

            c.set('user', u);
            c.set('message', m);
            c.set('text', props.text);
            c.set('createdBy', createdBy);

            var cACL = new Parse.ACL();
            cACL.setReadAccess(u, true);
            cACL.setWriteAccess(createdBy, true);
            c.setACL(cACL);

            c.save().then(
              function(comment) {
                var commentQuery = new Parse.Query(Comment);
                commentQuery.include('createdBy');
                return commentQuery.get(comment.id);
              },
              function(error) {
                stream.error(error);
              }
            ).then(
              function(comment) {
                // comment should have user object (createdBy) included
                stream.emit(comment);
              },
              function(error) {
                stream.error(error);
              }
            );
          }
        } else {
          stream.error(t.validate(props, CommentType));
        }
      },
      updateComment: function(commentId, props) {
        var Comment = Parse.Object.extend('Comment');
        var query = new Parse.Query(Comment);

        query.get(commentId).then(
          function(comment) {

            if (t.validate(props.text, t.Str).isValid()) {
              comment.set('text', props.text);
            }

            comment.save();

          },
          function(error) {
            console.log(error);
          }
        );

      },
      removeComment: function(stream, commentId) {
        var Comment = Parse.Object.extend('Comment');
        var query = new Parse.Query(Comment);

        query.get(commentId).then(
          function(comment) {
            return comment.destroy();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(comment) {
            stream.emit(comment);
          },
          function(error) {
            stream.error(error);
          }
        );
      },

      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////// Tracks & Measurements ///////////////////////
      //////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////

      createTrack: function(props, recipients, theme, type) {
        var self = this;
        var TrackType = t.struct({
          title: t.Str,
          unit: t.Str,
          createdBy: t.Str,
          allowUpload: t.Bool
        });

        if (t.validate(props, TrackType).isValid()) {

          var Track = Parse.Object.extend('Track');
          var User = Parse.Object.extend('User');
          var track = new Track();
          var u = new User();

          u.id = props.createdBy;

          track.set('title', props.title);
          track.set('unit', props.unit);
          track.set('createdBy', u);
          track.set('allowUpload', props.allowUpload);
          track.set('theme', theme);
          track.set('type', type);

          var tACL = new Parse.ACL();
          tACL.setPublicReadAccess(true);
          tACL.setRoleWriteAccess('Author', true);
          track.setACL(tACL);

          track.save().then(
            function(track) {
              if (recipients.length > 0) {
                self.addTrackRecipients(track.id, recipients);
              }
            },
            function(error) {
              console.log(error);
            }
          );

        } else {
          // Error with validation!
        }

      },
      updateTrack: function(trackId, props) {
        var Track = Parse.Object.extend('Track');
        var query = new Parse.Query(Track);

        query.get(trackId).then(
          function(track) {
            if (t.validate(props.title, t.Str).isValid()) {
              track.set('title', props.title);
            }

            if (t.validate(props.unit, t.Str).isValid()) {
              track.set('unit', props.unit);
            }

            if (t.validate(props.allowUpload, t.Bool).isValid()) {
              track.set('allowUpload', props.allowUpload);
            }

            track.save();
          },
          function(error) {
            console.log(error);
          }
        );

      },
      removeTrack: function(trackId) {
        this.removeAllTrackRecipients(trackId);

        var Track = Parse.Object.extend('Track');
        var trackQuery = new Parse.Query(Track);

        trackQuery.get(trackId).then(
          function(track) {
            track.destroy();
          },
          function(error) {
            console.log(error);
          }
        );
      },

      addTrackRecipient: function(trackId, recipient) {
        var Track = Parse.Object.extend('Track');
        var UTMap = Parse.Object.extend('UserTrackMap');
        var User = Parse.Object.extend('User');

        var track = new Track();
        track.id = trackId;

        var u = new User();
        u.id = recipient;

        var query = new Parse.Query(UTMap);

        query.equalTo('track', track);
        query.equalTo('user', u);

        query.find().then(
          function(utMaps) {
            if (utMaps.length === 0) {
              var utMap = new UTMap();

              utMap.set('track', track);
              utMap.set('user', u);

              var utMapACL = new Parse.ACL();
              utMapACL.setReadAccess(u, true);
              utMapACL.setRoleReadAccess('Author', true);
              utMapACL.setRoleWriteAccess('Author', true);

              utMap.setACL(utMapACL);

              utMap.save();
            }
          }
        );
      },
      addTrackRecipients: function(trackId, recipients) {
        var self = this;
        _.forEach(recipients, function(recipient) {
          self.addTrackRecipient(trackId, recipient);
        });
      },

      removeTrackRecipient: function(trackId, recipient) {
        var Track = Parse.Object.extend('Track');
        var UTMap = Parse.Object.extend('UserTrackMap');
        var User = Parse.Object.extend('User');

        var track = new Track();
        track.id = trackId;

        var u = new User();
        u.id = recipient;

        var query = new Parse.Query(UTMap);

        query.equalTo('track', track);
        query.equalTo('user', u);

        query.find().then(
          function(utMaps) {
            _.forEach(utMaps, function(utMap) {
              utMap.destroy();
            });
          },
          function(error) {
            console.log(error);
          }
        );

      },
      removeTrackRecipients: function(trackId, recipients) {
        var self = this;
        _.forEach(recipients, function(recipient) {
          self.removeTrackRecipient(trackId, recipient);
        });
      },
      removeAllTrackRecipients: function(trackId) {
        var Track = Parse.Object.extend('Track');
        var UTMap = Parse.Object.extend('UserTrackMap');

        var track = new Track();
        track.id = trackId;

        var query = new Parse.Query(UTMap);
        query.equalTo('track', track);

        query.find().then(
          function(utMaps) {
            _.forEach(utMaps, function(utMap) {
              utMap.destroy();
            });
          },
          function(error) {
            console.log(error);
          }
        );

      },

      getAllTracksByRecipient: function(stream, recipientId) {
        var Track = Parse.Object.extend('Track');
        var User = Parse.Object.extend('User');
        var UTMap = Parse.Object.extend('UserTrackMap');
        var Measurement = Parse.Object.extend('Measurement');

        var u = new User();
        u.id = recipientId;

        var utMapQuery = new Parse.Query(UTMap);
        utMapQuery.equalTo('user', u);

        var result = {
          tracks: [],
          measurements: {}
        };

        utMapQuery.find().then(
          function(utMaps) {
            var tracks = _.map(utMaps, function(utMap) {
              return utMap.get('track').id;
            });

            var trackQuery = new Parse.Query(Track);
            trackQuery.containedIn('objectId', tracks);
            trackQuery.descending('createdAt');

            return trackQuery.find();
          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(tracks) {
            result.tracks = tracks;

            var mQuery = new Parse.Query(Measurement);
            mQuery.containedIn('track', tracks);
            mQuery.equalTo('user', u);
            mQuery.ascending('createdAt');

            return mQuery.find();

          },
          function(error) {
            stream.error(error);
          }
        ).then(
          function(measurements) {
            _.forEach(measurements, function(measurement) {
              if (result.measurements[measurement.get('track').id]) {
                result.measurements[measurement.get('track').id].push(measurement);
              } else {
                result.measurements[measurement.get('track').id] = [measurement];
              }
            });

            stream.emit(result);
          },
          function(error) {
            stream.error(error);
          }
        );

      },

      createMeasurement: function(userId, trackId, props, date, emitter, updateRes) {
        
        var MeasurementType = t.struct({
          value: t.Str,
          unit: t.Str,
          createdBy: t.Str
        });


        if (t.validate(props, MeasurementType).isValid()) {

          var User = Parse.Object.extend('User');
          var Track = Parse.Object.extend('Track');
          var Measurement = Parse.Object.extend('Measurement');

          var track = new Track();
          var user = new User();
          var createdBy = new User();
          var m = new Measurement();

          track.id = trackId;
          user.id = userId;
          createdBy.id = props.createdBy;

          m.set('track', track);
          m.set('user', user);
          m.set('value', props.value);
          m.set('unit', props.unit);
          m.set('createdBy', createdBy);
          m.set('date', date);
          m.set('updated', false);

          var mACL = new Parse.ACL();
          mACL.setReadAccess(user, true);
          mACL.setWriteAccess(user, true);
          mACL.setRoleReadAccess('Author', true);
          mACL.setRoleWriteAccess('Author', true);
          m.setACL(mACL);


          m.save().then(
            function(measurement) {
              console.log(measurement);
              console.log('wtf?');
              emitter.emit(measurement);
              console.log('here we are!');
              //updateRes.emit(measurement);
            },
            function(error) {
              console.log(error);
            }
          );

        }
      },
      updateMeasurement: function(measurementId, value, emitter) {
        var Measurement = Parse.Object.extend('Measurement');
        var query = new Parse.Query(Measurement);

        query.get(measurementId).then(
          function(m) {
            var oldVal = m.get('value');
            if (t.validate(value, t.Str).isValid()) {
              m.set('value', value);
              m.set('updated', true);
              m.set('old', oldVal);
            }

            m.save().then(function(m){
              
              emitter.emit(m);
            });

          },
          function(error) {
            console.log(error);
          }
        );
      },
      removeMeasurement: function(measurementId, emitter) {
        var Measurement = Parse.Object.extend('Measurement');
        var query = new Parse.Query(Measurement);

        query.get(measurementId).then(
          function(m) {
            m.destroy().then(function(){
              emitter.emit(m);
            });
          }
        );
      },
      getDefaultTrackData: function(stream, props) {
        Parse.Cloud.run('getDefaultTrackData', {
          date: props.date
        }).then(
          function(s) {
            stream.emit(s);
          },
          function(e) {
            stream.error(e);
          }
        );
      },

      getTracks: function(stream){
        var Track = Parse.Object.extend("Track");
        var UserTrackMap = Parse.Object.extend("UserTrackMap");


        var utMapQuery = new Parse.Query(UserTrackMap);

        var u = Parse.User.current();
        utMapQuery.equalTo('user', u);
        utMapQuery.find().then(function(utms){
          var ids = _.map(utms, function(utm){
            return utm.get('track').id;
          });
          return ids;
        }).then(function(ids){
          var q = new Parse.Query(Track);
          q.notContainedIn('objectId', ids);
          q.find().then(function(payload){
            stream.emit(payload);
          });
        });
      },
      subscribeToTrack: function(tId, emitter){
        var Track = Parse.Object.extend("Track");
        var UTM = Parse.Object.extend("UserTrackMap");

        var t = new Track();
        var utm = new UTM();
        var u = Parse.User.current();

        t.id = tId;

        utm.set('track', t);
        utm.set('user', u);

        var acl = new Parse.ACL();

        var roleQuery = new Parse.Query(Parse.Role);
        roleQuery.equalTo('name', 'Author');
        roleQuery.find().then(function(payload){
          var role = payload[0];

          acl.setRoleWriteAccess(role, true);
          acl.setRoleReadAccess(role, true);
          acl.setReadAccess(u.id, true);
          acl.setWriteAccess(u.id, true);

          utm.setACL(acl);
          utm.save().then(function(){
            var trackQuery = new Parse.Query(Track);
            trackQuery.get(tId).then(function(track){
              emitter.emit(track);
            });
          });
        });
      },
      getMyTracks: function(emitter){
        console.log('get my tracs called')
        var Track = Parse.Object.extend("Track");
        var UserTrackMap = Parse.Object.extend("UserTrackMap");
        var Measurement = Parse.Object.extend("Measurement");

        var u = Parse.User.current();

        var utmQuery = new Parse.Query(UserTrackMap);
        utmQuery.equalTo('user', u);
        var res = {tracks: [],
                   measurements: {},
                   utms: {}
                  };

        utmQuery.find().then(function(payload){
          
          _.forEach(payload, function(utm){
            var key = utm.get('track').id;
            var value = utm;
            res.utms[key] = value;
          })
          var tIds = _.map(payload, function(utm){
            return utm.get("track").id;
          });
          var q = new Parse.Query(Track);
          q.containedIn('objectId', tIds);
          return q.find();
        }).then(function(tracks){
            res.tracks = tracks;
            var measurementQuery = new Parse.Query(Measurement);
            measurementQuery.containedIn('track', tracks);
            measurementQuery.equalTo('user', u);
            return measurementQuery.find();
        }).then(function(measurements){
            _.forEach(measurements, function(measurement){
                if(res.measurements[measurement.get('track').id]){
                    res.measurements[measurement.get('track').id].push(measurement);
                }else{
                    res.measurements[measurement.get('track').id] = [measurement];
                }
            });
            emitter.emit(res);
        });
      },
      unSubscribe: function(tId, emitter){
        console.log('from the inside');
        var Track = Parse.Object.extend("Track");
        var UserTrackMap = Parse.Object.extend("UserTrackMap");

        var t = new Track();
        t.id = tId;

        var utMapQuery = new Parse.Query(UserTrackMap);
        utMapQuery.equalTo('user', Parse.User.current());
        utMapQuery.equalTo('track', t);
        utMapQuery.find().then(function(payload){
          payload.forEach(function(utm){
            var utmId = utm.id;
            utm.destroy().then(function(obj){
              emitter.emit(tId);
            });
          });
        });
      },
      getMeasurementsByTrack: function(tId, uId, emitter){
        var Measurement = Parse.Object.extend('Measurement');
        var Track = Parse.Object.extend('Track');
        var User = Parse.Object.extend('User');

        var t = new Track();
        t.id = tId;

        var u = new User();
        u.id = uId;

        var measurementQuery = new Parse.Query(Measurement);
        measurementQuery.equalTo('track', t);
        measurementQuery.equalTo('user', u);
        measurementQuery.ascending('date');
        console.log('before query');
        measurementQuery.find().then(function(measurements){
          console.log('after query');
          emitter.emit(measurements);
        });
      },
      getMeasurements: function(tracks, uId, emitter){

        for(var i=0; i<tracks.length; i++){
        var Measurement = Parse.Object.extend('Measurement');
        var Track = Parse.Object.extend('Track');
        var User = Parse.Object.extend('User');

        var t = new Track();
        t.id = tId;

        var u = new User();
        u.id = uId;

        var measurementQuery = new Parse.Query(Measurement);
        measurementQuery.equalTo('track', t);
        measurementQuery.equalTo('user', u);
        measurementQuery.ascending('date');
        console.log('before query');
        measurementQuery.find().then(function(measurements){
          console.log('after query');
          emitter.emit(measurements);
        });
        }
      }
    };
  }

  window.DataAPI = instance;
};

module.exports = dataAPI;
