import { Meteor } from 'meteor/meteor';
import * as constants from '../../constants'

//Checks if robot is inside the bounds limitation, returns bool
const validRobotMove = () => {
  
}

if(Meteor.isServer){

  Meteor.startup(() => {
    // code to run on server at startup
    Robot = new Meteor.Collection('robot');

    try {
      Robot.insert({
        _id: "robot",
        x: 0,
        y: 0,
        bounds: constants.bounds
      });
    }catch(e){
      //Already initiated
    }

  });

  //Get current location of robot
  Router.route(constants.locationEndpoint, {where: 'server'})
  .get(function(){
    var response = Robot.findOne({ _id: "robot" })
    const result = {
      currentLocation: [response.x, response.y]
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(result));
  });


  //Move robot one step to the north
  Router.route(constants.goNorth, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    Robot.update('robot', { $set: { x: robotData.x - 1 }})
    robotData = Robot.findOne({ _id: "robot" })
    const result = {
      currentLocation: [robotData.x, robotData.y]
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(result));
  });

  //Move robot one step to the south
  Router.route(constants.goSouth, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    Robot.update('robot', { $set: { x: robotData.x + 1 }})
    robotData = Robot.findOne({ _id: "robot" })
    const result = {
      currentLocation: [robotData.x, robotData.y]
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(result));
  });

  //Move robot one step to the west
  Router.route(constants.goWest, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    Robot.update('robot', { $set: { y: robotData.y + 1 }})
    robotData = Robot.findOne({ _id: "robot" })
    const result = {
      currentLocation: [robotData.x, robotData.y]
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(result));
  });

  //Move robot one step to the east
  Router.route(constants.goEast, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    Robot.update('robot', { $set: { y: robotData.y - 1 }})
    robotData = Robot.findOne({ _id: "robot" })
    const result = {
      currentLocation: [robotData.x, robotData.y]
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(result));
  });

}

