import { Meteor } from 'meteor/meteor';
import * as constants from '../../constants'


if(Meteor.isServer){

  Meteor.startup(() => {
    // code to run on server at startup
    Robot = new Meteor.Collection('robot');

    try {
      Robot.insert({
        _id: "robot",
        currentLocation: [], //Array with 4 indexes: [ n, s, e, w ]
        north: 0,
        south: 0,
        east: 0,
        west: 0
      });
    }catch(e){
      //Already initiated
    }

  });

  //Get current location of robot
  Router.route(constants.locationEndpoint, {where: 'server'})
  .get(function(){
    //On start, return the robot's current location
    var response = Robot.findOne({ _id: "robot" })
    response.currentLocation.push(response.north, response.south, response.east, response.west)
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(response.currentLocation));
  });


  //Move robot one step to the north
  Router.route(constants.goNorth, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    Robot.update('robot', { $set: { north: robotData.north + 1 }})
    robotData = Robot.findOne({ _id: "robot" })
    robotData.currentLocation.push(robotData.north, robotData.south, robotData.east, robotData.west)
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(robotData.currentLocation));
  });

  //Move robot one step to the south
  Router.route(constants.goSouth, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    Robot.update('robot', { $set: { south: robotData.south + 1 }})
    robotData = Robot.findOne({ _id: "robot" })
    robotData.currentLocation.push(robotData.north, robotData.south, robotData.east, robotData.west)
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(robotData.currentLocation));
  });

  //Move robot one step to the west
  Router.route(constants.goWest, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    Robot.update('robot', { $set: { west: robotData.west + 1 }})
    robotData = Robot.findOne({ _id: "robot" })
    robotData.currentLocation.push(robotData.north, robotData.south, robotData.east, robotData.west)
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(robotData.currentLocation));
  });

  //Move robot one step to the east
  Router.route(constants.goEast, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    Robot.update('robot', { $set: { east: robotData.east + 1 }})
    robotData = Robot.findOne({ _id: "robot" })
    robotData.currentLocation.push(robotData.north, robotData.south, robotData.east, robotData.west)
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(robotData.currentLocation));
  });

}

