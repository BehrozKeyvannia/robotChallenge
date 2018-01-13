import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import * as constants from '../constants'
import { Session } from 'meteor/session'
import { $ } from 'meteor/jquery'; //remove package


import './main.html';

if(Meteor.isClient){

  Router.route('/', function () {
    this.render('Home');
  });

  
  Template.currentLocation.onCreated(function(){
    HTTP.get(constants.baseUrl + constants.locationEndpoint, {}, function(error, response){
      if(response.statusCode === 200) {
        Session.set('currentLocation', response.data.currentLocation);
        renderGrid()
        moveRobot(response.data.currentLocation)
      }
      else {
        console.warn("Error in request: " + JSON.stringify(error,null,2));
      }
    });
  });
  
  
  Template.currentLocation.helpers({
    currentLocation () {
      return Session.get('currentLocation')
    },
  });
  
  Template.buttons.events({
    'click  #up': function(){
      HTTP.post(constants.baseUrl + constants.goNorth, function(error, response){
        if(response.statusCode === 200) {
          console.info('Robot >> north' );
          Session.set('currentLocation', response.data.currentLocation)
          moveRobot(response.data.currentLocation)
        }
        else {
          if( response.statusCode === 400 ) reportInvalidMove()
          else{
            console.error("Error in request: " + JSON.stringify(error,null,2));
          }
          
        }
      });
    },
    'click  #down': function(){
      HTTP.post(constants.baseUrl + constants.goSouth, {}, function(error, response){
        if(response.statusCode === 200) {
          console.info('Robot >> south' );
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
    },
    'click  #right': function(){
      HTTP.post(constants.baseUrl + constants.goEast, {}, function(error, response){
        if(response.statusCode === 200) {
          console.info('Robot >> east' );
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
    },
    'click  #left': function(){
      HTTP.post(constants.baseUrl + constants.goWest, {}, function(error, response){
        if(response.statusCode === 200) {
          console.info('Robot >> west' );
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
    },
  });
  
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

  const moveRobot = (coords) => {
    const x = coords[0]
    const y = coords[1]
    grid.getCellAt(x, y).$el.css('background', 'green');
  }
  
}

