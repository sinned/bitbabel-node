var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var mapSchema = new mongoose.Schema({
  name: String, // pretty formatted name, like "Dennis Yang",
  image_url: String, 

  mapfrom: [{
    maptype: {
      type: String,
      enum: ['twitter', 'facebook', 'email', 'sms', 'website']
    },
    address: String, 

    proof: {
      url: String, // the URL of the public "proof" of the mapping ie. https://twitter.com/jimmy_wales/status/441634501265862657
      last_checked: { type: Date, default: Date.now },
    },    
    // has this been verified
    verified: { type: Boolean, default: false },
    verifystring: String,    
  }],

  // wallet addresses to map to
  mapto: {
    maptype: {
      type: String,
      enum: ['bitcoin', 'dogecoin', 'litecoin']
    },
    address: String,
    hashcheck: String // SHA256 (address+salt) 
  },
  
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Mapping', mapSchema); // export this model