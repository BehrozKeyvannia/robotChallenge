import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import * as constants from '../constants'
import { Session } from 'meteor/session'


import './main.html';

if(Meteor.isClient){

  Router.route('/', function () {
    this.render('Home');
  });

  Meteor.startup(() => {
    Template.currentLocation.onCreated(function(){
      getCurrentLocationApiRequest()
      getObstacles()
    });
  })
  
  
  Template.currentLocation.helpers({
    currentLocation () {
      // $('#currentLocation').val(Session.get('currentLocation'))
      return Session.get('currentLocation')
    },
  });
  
  Template.buttons.events({
    'click  #up': function(){
      moveRobotApiRequest('north')
    },
    'click  #down': function(){
      moveRobotApiRequest('south')
    },
    'click  #right': function(){
      moveRobotApiRequest('east')
    },
    'click  #left': function(){
      moveRobotApiRequest('west')
    },
  });

  const buildUrl = (dir) => {
    switch (dir) {
      case 'north':
        return constants.baseUrl + constants.goNorth;
      case 'south':
        return constants.baseUrl + constants.goSouth;
      case 'east':
        return constants.baseUrl + constants.goEast;
      case 'west':
        return constants.baseUrl + constants.goWest;
    }
  }

  const getCurrentLocationApiRequest = () => {
    return HTTP.get(constants.baseUrl + constants.locationEndpoint, {}, function(error, response){
      if(response.statusCode === 200) {
        Session.set('currentLocation', response.data.currentLocation);
        renderGrid()
        moveRobot(response.data.currentLocation)
        return response.data.currentLocation
      }
      else {
        console.warn("Error in request: " + JSON.stringify(error,null,2));
      }
    });
  }
  const getObstacles = () => {
    return HTTP.get(constants.baseUrl + constants.obstaclesEndpoint, {}, function(error, response){
      if(response.statusCode === 200) {
        renderObstacles(response.data.obstacles)
      }
      else {
        console.warn("Error in request: " + JSON.stringify(error,null,2));
      }
    });
  }
  
  const moveRobotApiRequest = (direction) => {
    const request_url = buildUrl(direction)
    HTTP.post(request_url, {}, function(error, response){
      if(response.statusCode === 200) {
        console.info('Robot >> ' + direction );
        clearCurrentCell()
        Session.set('currentLocation', response.data.currentLocation)
        moveRobot(response.data.currentLocation)
      }
      else {
        if( response.statusCode === 400 ) reportInvalidMove()
        else {
          console.error("Error in request: " + JSON.stringify(error,null,2));
        }
      }
    });
  }

  const reportInvalidMove = () => {
    console.warn("Invalid move, Robot out of bounds");
  }
  
  const renderGrid = () => {
    this.grid = new Grid({
      rows: constants.gridSize + 1,
      cols: constants.gridSize + 1,
      render: {
        placeholder: "#grid"
      }
    });
  }

  const renderObstacles = (coords) => {
    grid.getCellAt(coords[0], coords[1]).$el.css('background', 'red');
  }

  const moveRobot = (coords) => {
    grid.getCellAt(coords[0], coords[1]).$el.css('background', 'green');
  }

  const clearCurrentCell = () => {
    const currentCoords = Session.get('currentLocation')
    grid.getCellAt(currentCoords[0], currentCoords[1]).$el.css('background', 'white');
  }
  
}

