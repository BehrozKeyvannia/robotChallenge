import { Meteor } from 'meteor/meteor';
import * as constants from '../../constants'

//Checks if robot is inside the gridSize limitation, returns bool
const validRobotMove = (direction) => {
  const robotData = Robot.findOne({ _id: "robot" })
  switch (direction) {
    case 'north':
      if( (robotData.y - 1) <= robotData.gridSize && (robotData.y - 1) >= 0 ) return true;
      else return false;
    case 'south':
      if( (robotData.y + 1) <= robotData.gridSize ) return true;
      else return false;
    case 'east':
      if( (robotData.x - 1) <= robotData.gridSize  && (robotData.x - 1) >= 0 ) return true;
      else return false;
    case 'west':
      if( (robotData.x + 1) <= robotData.gridSize ) return true;
      else return false;
  }
}

const initDatabase = () => {
  try {
    Robot.insert({
      _id: "robot",
      x: 0,
      y: 0,
      gridSize: constants.gridSize,
      obstacles: constants.obstacles
    });
  }catch(e){
    //Already initiated
  }
}

if(Meteor.isServer){

  Meteor.startup(() => {
    // code to run on server at startup
    Robot = new Meteor.Collection('robot');
    initDatabase()

  });

  //Get current location of robot
  Router.route(constants.locationEndpoint, {where: 'server'})
  .get(function(){
    var response = Robot.findOne({ _id: "robot" })
    const result = {
      currentLocation: [response.x, response.y] || [0, 0]
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(result));
  });

  //Get current location of robot
  Router.route(constants.obstaclesEndpoint, {where: 'server'})
  .get(function(){
    var response = Robot.findOne({ _id: "robot" })
    const result = {
      obstacles: response.obstacles
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(result));
  });


  //Move robot one step to the north
  Router.route(constants.goNorth, {where: 'server'})
  .post(function(){
    var robotData = Robot.findOne({ _id: "robot" })
    let currentLocation = [robotData.x, robotData.y - 1]
    if(validRobotMove('north') && currentLocation.toString() !== robotData.obstacles.toString() ){
      Robot.update('robot', { $set: { y: robotData.y - 1 }})
      robotData = Robot.findOne({ _id: "robot" })
      const result = {
        currentLocation: currentLocation
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
    let currentLocation = [robotData.x, robotData.y + 1]
    if(validRobotMove('south') &&  currentLocation.toString() !== robotData.obstacles.toString() ){
      Robot.update('robot', { $set: { y: robotData.y + 1 }})
      robotData = Robot.findOne({ _id: "robot" })
      const result = {
        currentLocation: currentLocation
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
    let currentLocation = [robotData.x + 1, robotData.y]
    if(validRobotMove('west') && currentLocation.toString() !== robotData.obstacles.toString() ){
      Robot.update('robot', { $set: { x: robotData.x + 1 }})
      robotData = Robot.findOne({ _id: "robot" })
      const result = {
        currentLocation: currentLocation
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
    let currentLocation = [robotData.x - 1, robotData.y]
    if(validRobotMove('east') && currentLocation.toString() !== robotData.obstacles.toString() ){
      Robot.update('robot', { $set: { x: robotData.x - 1 }})
      robotData = Robot.findOne({ _id: "robot" })
      const result = {
        currentLocation: currentLocation
      }
      this.response.setHeader('Content-Type','application/json');
      this.response.end(JSON.stringify(result));
    }else{
      this.response.writeHead(400);
      this.response.end("robot_out_of_bounds");
    }
  });

}
