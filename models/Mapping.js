var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var mapSchema = new mongoose.Schema({
  name: String, // pretty formatted name, like "Dennis Yang"

  mapfrom: {
    maptype: {
      type: String,
      enum: ['twitter', 'facebook', 'email', 'sms']
    },
    address: String // remove the '@' from the front of twitter addresses
  },

  // wallet addresses to map to
  mapto: {
    maptype: {
      type: String,
      enum: ['bitcoin', 'dogecoin', 'litecoin']
    },
    address: String
  },

  proof: {
    url: String, // the URL of the public "proof" of the mapping ie. https://twitter.com/jimmy_wales/status/441634501265862657
    last_checked: { type: Date, default: Date.now },
  },

  // has this been verified
  verified: { type: Boolean, default: false },
  verifystring: String,

  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Mapping', mapSchema); // export this model