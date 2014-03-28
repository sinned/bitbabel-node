var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var mapSchema = new mongoose.Schema({
  mapType: { 
    type: String, 
    enum: ['twitter', 'facebook', 'email', 'sms'],
    default: 'twitter'
  },  
  fromid: String, 
  addressType: { 
    type: String, 
    enum: ['bitcoin', 'litecoin', 'dogecoin'],
    default: 'bitcoin'
  },    
  address: String,
  proofurl: String // the URL of the public "proof" of the mapping ie. https://twitter.com/jimmy_wales/status/441634501265862657

});