'use strict';
//
// window.React = require('react');
window.Parse = require('parse').Parse;
// Parse.initialize('4ylwbGhxEbyh0qVaH8i2M59ZsRK07JP7mDK9M5rV', 'xvVmKJk9Jumt0i94JTtWLibWRFLCctgh2UfYZQf1');
//
// var moment = require('moment');
// var _ = require('lodash');
// var Kefir = require('kefir');
//
// var test = new Kefir.emitter();
// test.log('test');
//
// require('../common/DataAPI.js').call();
//
// var App = React.createClass({
//   onSubmit: function(event) {
//     event.preventDefault();
//     DataAPI.createGoal({
//       title: 'Goal 1',
//       description: 'test',
//       submissionsCap: 1,
//       finishAt: moment('May 31 2015', 'MMM DD YYYY').toDate(),
//       publishAt: moment('May 1 2015', 'MMM DD YYYY').toDate(),
//       createdBy: Parse.User.current().id,
//       cover: this.refs.file.getDOMNode().files[0]
//     }, ['DNnqLfNFyp']);
//   },
//   render: function() {
//     return (
//       <div className='p1 container'>
//         <form id='form' onSubmit={this.onSubmit}>
//           <input ref='file' type="file" id="input" />
//           <button type='submit'>Submit!</button>
//         </form>
//       </div>
//     );
//   }
// });
//
// React.render(<App />, document.getElementById('app'));

Parse.initialize("b6YvZJi26wQdC3spp2hjq7b2eJhyrMVtaXYLUymu",
                 "gtfl1go7Nh1bmmbx6NQTUctKbBPDquJed0F0EV7F");

/*
//вначале я создал юзера
var user = new Parse.User();
user.set("username", "Pavel");
user.set("password", "123");
user.set("email", "pasha.dunin.94@gmail.com");
user.signUp(null, {
    success: function(user){
        console.log("AAA!");
    },
    error: function(error, user){
        console.log("Error "+error.code+" "+error.message);
    }
});
*/
// Parse.User.logIn("Pavel","123", {
//     success: function(user){
//         //затем зашел через него
//         /*
//         //и поместил его в группу
//         var adminAcl = new Parse.ACL();
//         adminAcl.setWriteAccess(Parse.User.current(), true);
//         adminAcl.setPublicReadAccess(true);
//         var adminRole = new Parse.Role("Admin", adminAcl);
//         adminRole.getUsers().add(Parse.User.current());
//         adminRole.save(null, {
//             success: function(role){
//                 var acl = role.getACL();
//                 acl.setWriteAccess(Parse.User.current(), false);
//                 acl.setRoleWriteAccess(role, true);
//                 role.save(null, {
//                     success: function(saveObj){
//
//                     },
//                     error: function(error, saveObj){
//
//                     }
//                 });
//             },
//             error: function(error, role){
//                 console.log("Error "+error.code+", "+error.message);
//             }
//         });
//         /*
//         //создаю роль автора
//         var authorAcl = new Parse.ACL();
//         authorAcl.setPublicReadAccess(true);
//         var roleQuery = new Parse.Query(Parse.Role);
//         roleQuery.equalTo('name', 'Admin');
//         roleQuery.find().then(function(payload){
//             var role = payload[0];
//             authorAcl.setRoleWriteAccess(role, true);
//             var authorRole = new Parse.Role("Author", authorAcl);
//             authorRole.save(null, {
//                 success: function(role){
//
//                 },
//                 error: function(error, role){
//
//                 }
//             });
//         });
//         */
//         //теперь хочу добавить юзера в авторы
//         var roleQuery = new Parse.Query(Parse.Role);
//         roleQuery.equalTo('name', 'Author');
//         roleQuery.find().then(function(payload){
//             var role = payload[0];
//             var user = new Parse.User();
//             user.set('username', 'trener');
//             user.set('password', '123');
//             user.set('email', 'pashalabrab@gmail.com');
//             user.signUp(null).then(function(payload){
//                 Parse.User.become(Parse.User.current().getSessionToken()).then(function(){
//                     role.getUsers().add(user);
//                     //и тут роль не хочет сохраняться,
//                     //хотя права на изменение есть.
//                     role.save();
//                 });
//         });
//         });
//     },
//     error: function(error, user){
//       console.log(error);
//     }
// });
// Parse.User.logOut();


// Parse.User.logIn('Pavel', '123').then(
//   function(user) {
//
//     var sessionToken = Parse.User.current().getSessionToken();
//
//     console.log('successful login', user);
//     var roleQuery = new Parse.Query(Parse.Role);
//     roleQuery.equalTo('name', 'Author');
//     roleQuery.find().then(
//       function(roles) {
//         var role = roles[0];
//         var user = new Parse.User();
//         user.set('username', 'test2');
//         user.set('password', '123');
//         user.set('email', 'test1@test.com');
//         user.signUp(null).then(
//           function(savedUser) {
//             Parse.User.become(sessionToken).then(
//               function() {
//                 role.getUsers().add(savedUser);
//                 return role.save();
//               },
//               function(error) {
//                 console.log('become',error);
//               }
//             ).then(
//               function(savedRole) {
//                 console.log(savedRole);
//               },
//               function(error) {
//                 console.log('role', error);
//               }
//             );
//           }
//         );
//       }
//     );
//   },
//   function(error) {
//     console.log(error);
//   }
// );

// Parse.User.logIn('Pavel', '123').then(
//   function(user) {
//     console.log(1, user);
//     var sessionToken = Parse.User.current().getSessionToken();
//
//     var u = new Parse.User();
//     u.set('username', '1');
//     u.set('password', '1');
//
//     var s = {};
//
//     u.signUp(null).then(
//       function(su) {
//         console.log(2, su);
//         s = su;
//         var q = new Parse.Query(Parse.role);
//         q.equalTo('name', 'Author');
//         return q.find();
//       },
//       function(e) {
//         console.log(2, e);
//       }
//     ).then(
//       function(rs) {
//         var r = rs[0];
//         console.log(3, r);
//
//         return Parse.User.become(sessionToken);
//       },
//       function(e) {
//         console.log(3, e);
//       }
//     ).then(
//       function() {
//         console.log(4);
//
//       }
//     );
//
//   },
//   function(error) {
//     console.log(1, error);
//   }
// );

// 1) login
// Parse.User.logIn('Pavel', '123').then(
//   function() {
//     // 2) get role
//     // 3) create user
//     // 4) reset session
//     // 5) add this user to role's users
//     var rq = new Parse.Query(Parse.Role);
//     rq.equalTo('name', 'Author');
//     return rq.first();
//   }
// ).then(
//   function(role) {
//     var sessionToken = Parse.User.current().getSessionToken();
//     var user = new Parse.User();
//     user.set('username', '1');
//     user.set('password', '1');
//
//     console.log(sessionToken);
//
//     user.signUp(null).then(
//       function(u) {
//
//         Parse.User.become(sessionToken).then(
//           function() {
//             role.getUsers().add(u);
//             return role.save();
//           },
//           function(error) {
//             console.log('become doesn\'t work', error);
//           }
//         ).then(
//           function() {
//             console.log('saved!');
//           }
//         );
//       }
//     );
//   },
//   function(error) {
//     console.log('user sign up doesn\'t work', error);
//   }
// );

Parse.User.logIn('Pavel', '123').then(
  function() {
    var rq = new Parse.Query(Parse.Role);
    rq.equalTo('name', 'Author');
    rq.first().then(
      function(role) {
        // console.log('before', role.getUsers());
        //
        var u = new Parse.User();
        u.set('username', '4');
        u.set('password', '4');

        // don't keep chaining, as we need role later
        u.save().then(
          function(savedUser) {
            console.log('saved', savedUser);
            role.getUsers().add(savedUser);
            role.save();
          },
          function(error) {
            console.log(error);
          }
        );
      },
      function(error) {
        console.log(error);
      }
    );
  },
  function(e) {
    console.log('no way!', e);
  }
);
