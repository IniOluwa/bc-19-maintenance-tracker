var firebase = require('firebase');

// UserModel classs
class UserModel {
  constructor(name, request, role){
    this.name = name;
    this.request = request;
    this.role = role || 'Staff';
  }

}

// Maintenance request class
class MaintenanceRequest {
  constructor(object, details, owner, contact){
    this.objectName = object;
    this.requestDetails = details || '';
    this.timeOfRequest = Date.now();
    this.approved = false;
    this.timeApproved = false;
    this.requestOwner = owner;
    this.requestOwnerContact = contact;
  }
}

// New user-request creation class
class NewRequest {
  constructor(){
    this.userRequests = [];
  }

  createRequest(requesterId, objectName, objectDetails, objectOwner, objectOwnerContact){
    var request = new MaintenanceRequest(objectName, objectDetails, objectOwner, objectOwnerContact);
    var userRequest = new UserModel(requesterId, request);
    this.userRequests.push(userRequest);
    var name = userRequest.name;
    var request = userRequest.request;
    var role = userRequest.role;
    firebase.database().ref('requests/').push({
      userId: name,
      request: request,
      role: role,
    });
  }
}

module.exports = NewRequest;
