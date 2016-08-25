class UserModel {
    constructor(name, request, role){
        this.name = name;
        this.requests = request;
        this.role = role || 'staff';
    }
}

class MaintenanceRequest {
    constructor(objectName, details){
        this.object = objectName;
        this.requestDetails = details || '';
        this.timeOfRequest = new Date();
        this.approved = false;
        this.timeApproved = null;
    }
}

class NewRequest {
    constructor(){
        this.userRequests = [];
    }
    
    createRequest(name, objectName, details){
        var request = new MaintenanceRequest(objectName, details);
        var userRequest = new UserModel(name, request);
        this.userRequests.push(userRequest);
        return userRequest;
    }
    
    viewRequests(requestOwner){
        for (var i = 0; i < this.userRequests.length; i++) {
            if (this.userRequests[i].name == requestOwner) {
                console.log(this.userRequests[i]);
            }else if (this.userRequests[i] + 1 === null){
                console.log(requestOwner + ' has no requests.');
            }
        }
    }
}