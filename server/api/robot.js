import { Meteor } from 'meteor/meteor';


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

  // Router.route('/', function () {
  //   this.render('main');
  // });

  Router.route('/robot/location', {where: 'server'})
  .get(function(){
        //On start, return the robot's current location
        var response = Robot.findOne({ _id: "robot" })
        response.currentLocation.push(response.north, response.south, response.east, response.west)
        this.response.setHeader('Content-Type','application/json');
        this.response.end(JSON.stringify(response.currentLocation));
    })

    .post(function(){
      var response;
      // this.request.body.userName
      this.response.setHeader('Content-Type','application/json');
      this.response.end(JSON.stringify(response));
  });


}

