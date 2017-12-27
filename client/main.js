import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';

import './main.html';

Template.body.helpers({
  tasks: [
    { text: "text1", id: 1},
    { text: "text2", id: 2},
    { text: "text3", id: 3},
  ]
});
