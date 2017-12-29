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

  Template.currentLocation.onCreated(function(){
    HTTP.get(constants.baseUrl + constants.locationEndpoint, {}, function(error, response){
      if(response.statusCode === 200) {
        Session.set('currentLocation', response.data);
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
          console.warn('http north >> ' + JSON.stringify(response,null,2));
          Session.set('currentLocation', response.data)
        }
        else {
          console.warn("Error in request: " + JSON.stringify(error,null,2));
        }
      });
    },
    'click  #down': function(){
      HTTP.post(constants.baseUrl + constants.goSouth, {}, function(error, response){
        if(response.statusCode === 200) {
          console.warn('http south >> ' + response.data)
          Session.set('currentLocation', response.data)
        }
        else {
          console.warn("Error in request: " + JSON.stringify(error,null,2));
        }
      });
    },
    'click  #right': function(){
      HTTP.post(constants.baseUrl + constants.goEast, {}, function(error, response){
        if(response.statusCode === 200) {
          console.warn('http east >> ' + response.data);
          Session.set('currentLocation', response.data)
        }
        else {
          console.warn("Error in request: " + JSON.stringify(error,null,2));
        }
      });
    },
    'click  #left': function(){
      HTTP.post(constants.baseUrl + constants.goWest, {}, function(error, response){
        if(response.statusCode === 200) {
          console.warn('http west >> ' + response.data);
          Session.set('currentLocation', response.data)
        }
        else {
          console.warn("Error in request: " + JSON.stringify(error,null,2));
        }
      });
    },
  });
}

