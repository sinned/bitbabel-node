var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var Schema = mongoose.Schema; // also use Schema.ObjectId

var mapSchema = new Schema({
  name: String, // pretty formatted name, like "Dennis Yang",
  image_url: String, 

  // the "from" address to map
  mapfrom: {
    maptype: {
      type: String,
      enum: ['twitter', 'facebook', 'email', 'sms', 'website']
    },
    address: String, 

    proof: {
      url: String, // the URL of the public "proof" of the mapping ie. https://twitter.com/jimmy_wales/status/441634501265862657
      last_checked: { type: Date },
    },    
    // has this been verified
    verified: { type: Boolean, default: false },
    verifystring: String,    
  },

  // wallet addresses to map to
  mapto: {
    maptype: {
      type: String,
      enum: ['bitcoin', 'dogecoin', 'litecoin']
    },
    address: String,
    hashcheck: String // bcrypt hash to make sure there's no db tampering.
  },

  created: { type: Date, default: Date.now },
  modified: { type: Date },

  state: {
    type: String,
    enum: ['published', 'flagged', 'deleted'], 
    default: 'published'
  },

  // if the user is logged in, then add the user_id
  added_by: {
    type: Schema.ObjectId,
    ref: 'users'    
  }

});

mapSchema.pre('save', function(next) {
  var map = this;

  if (map.isModified('mapto')) {
    bcrypt.genSalt(5, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(map.mapto.address, salt, null, function(err, hash) {
        if (err) return next(err);
        console.log('hashcheck generated: ', hash);
        map.mapto.hashcheck = hash;
        next();
      });
    });    
  }
});

module.exports = mongoose.model('Mapping', mapSchema); // export this model