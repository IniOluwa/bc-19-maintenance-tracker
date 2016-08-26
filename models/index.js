var firebase = require('firebase');

// UserModel classs
class UserModel {
  constructor(name, request, role){
    this.name = name;
    this.request = request;
    this.role = role || 'staff';
  }

}

// Maintenance request class
class MaintenanceRequest {
  constructor(objectName, details){
    this.object = objectName;
    this.requestDetails = details || '';
    this.timeOfRequest = Date.now();
    this.approved = false;
    this.timeApproved = null;
  }
}

// New user-request creation class
class NewRequest {
  constructor(){
    this.userRequests = [];
  }

  createRequest(name, objectName, details){
    var request = new MaintenanceRequest(objectName, details);
    var userRequest = new UserModel(name, request);
    this.userRequests.push(userRequest);
    var name = userRequest.name;
    var request = userRequest.request;
    var role = userRequest.role;
    firebase.database().ref('users/').push({
      username: name,
      request: request,
      role: role,
    });
    }
  }


module.exports = NewRequest;
