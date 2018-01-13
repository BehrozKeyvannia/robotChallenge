import { Meteor } from 'meteor/meteor';
import * as constants from '../../constants'

//Checks if robot is inside the gridSize limitation, returns bool
const validRobotMove = (direction) => {
  const robotData = Robot.findOne({ _id: "robot" })
  switch (direction) {
    case 'north':
      if( (robotData.x - 1) <= robotData.gridSize && (robotData.x - 1) >= 0 ) return true;
      else return false;
    case 'south':
      if( (robotData.x + 1) <= robotData.gridSize ) return true;
      else return false;
    case 'east':
      if( (robotData.y - 1) <= robotData.gridSize  && (robotData.y - 1) >= 0 ) return true;
      else return false;
    case 'west':
      if( (robotData.y + 1) <= robotData.gridSize ) return true;
      else return false;
  }
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
        gridSize: constants.gridSize
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
    if(validRobotMove('north')){
      Robot.update('robot', { $set: { y: robotData.y - 1 }})
      robotData = Robot.findOne({ _id: "robot" })
      const result = {
        currentLocation: [robotData.y, robotData.y]
      }
      this.response.setHeader('Content-Type','application/json');
      this.response.end(JSON.stringify(result));
    }else{
      this.response.writeHead(400);
      this.response.end("robot_out_of_bounds");
    }
  });

  //Move robot one step to the south
  Router.route(constants.goSouth, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    if(validRobotMove('south')){
      Robot.update('robot', { $set: { y: robotData.y + 1 }})
      robotData = Robot.findOne({ _id: "robot" })
      const result = {
        currentLocation: [robotData.x, robotData.y]
      }
      this.response.setHeader('Content-Type','application/json');
      this.response.end(JSON.stringify(result));
    }else{
      this.response.writeHead(400);
      this.response.end("robot_out_of_bounds");
    }
  });

  //Move robot one step to the west
  Router.route(constants.goWest, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    if(validRobotMove('west')){
      Robot.update('robot', { $set: { x: robotData.x + 1 }})
      robotData = Robot.findOne({ _id: "robot" })
      const result = {
        currentLocation: [robotData.x, robotData.y]
      }
      this.response.setHeader('Content-Type','application/json');
      this.response.end(JSON.stringify(result));
    }else{
      this.response.writeHead(400);
      this.response.end("robot_out_of_bounds");
    }
  });

  //Move robot one step to the east
  Router.route(constants.goEast, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    if(validRobotMove('east')){
      Robot.update('robot', { $set: { x: robotData.x - 1 }})
      robotData = Robot.findOne({ _id: "robot" })
      const result = {
        currentLocation: [robotData.x, robotData.y]
      }
      this.response.setHeader('Content-Type','application/json');
      this.response.end(JSON.stringify(result));
    }else{
      this.response.writeHead(400);
      this.response.end("robot_out_of_bounds");
    }
  });

}

