'use strict';

window.Parse = require('parse').Parse;
Parse.initialize("b6YvZJi26wQdC3spp2hjq7b2eJhyrMVtaXYLUymu", 
         "gtfl1go7Nh1bmmbx6NQTUctKbBPDquJed0F0EV7F");

function createUser(email, fullname, password) {
  var user = new Parse.User();

  user.set('username', email);
  user.set('password', password);
  user.set('email', email);

  user.set('fullname', fullname);

  user.signUp(null, {
    success: function(user) {
      // Hooray! Let them use the app now.
      console.log(user, 'has been successfully created');
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      console.log('Error: ' + error.code + ' ' + error.message);
    }
  });
}

function createRoles() {
  createRole('Administrator');
  createRole('Expert');
  createRole('User');
}

function createRole(roleName) {
  // By specifying no write privileges for the ACL, we can ensure the role cannot be altered.
  var roleACL = new Parse.ACL();
  roleACL.setPublicReadAccess(true);
  var role = new Parse.Role(roleName, roleACL);
  role.save();
}

function setRolesHierarchy() {
  getRoles().then(function(roles) {
    console.log(roles, 'roles');

    roles.user.getRoles().add(roles.expert);
    roles.user.save();
    roles.expert.getRoles().add(roles.administrator);
    roles.expert.save();
  });

}

function getRoles() {
  var results = {};
  var adminQuery = new Parse.Query(Parse.Role);
  adminQuery.equalTo('name', 'Administrator');
  var expertQuery = new Parse.Query(Parse.Role);
  expertQuery.equalTo('name', 'Author');
  var userQuery = new Parse.Query(Parse.Role);
  userQuery.equalTo('name', 'User');

  return adminQuery.find().then(function(result1) {
    results.administrator = result1[0];
    return expertQuery.find();
  }).then(function(result2) {
    results.expert = result2[0];
    return userQuery.find();
  }).then(function(result3) {
    results.user = result3[0];
    return results;
  });
}

function setAdminRoleToCurrentUser() {
  var currentUser = Parse.User.current();
  if (currentUser) {
    var adminQuery = new Parse.Query(Parse.Role);
    adminQuery.equalTo('name', 'Administrator');

    adminQuery.find().then(function(role) {
      console.log('role', role);
      role[0].getUsers().add(currentUser);
      role[0].save();
    });
  } else {
    Parse.User.logIn('igeeko@gmail.com', '123');
  }
}


// setRolesHierarchy();
