var NewRequest = require('./index.js')

class NewAdmin extends NewRequest{

  createAdmin(adminName){
    var newRequest = NewRequest('admin', 'admin', 'admin', 'admin')
    var admin = new UserModel(adminName, newRequest.userRequests, 'administrator')
    firebase.database().ref('admins/' + 1).set({
      username: admin.name,
      request: admin.request,
      role: admin.role,
    });
  }
}

module.exports = NewAdmin;