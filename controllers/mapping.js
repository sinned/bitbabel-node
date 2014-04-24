var _ = require('underscore');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Mapping = require('../models/Mapping');
var secrets = process.env.NODE_ENV == 'local' ? require('../config/secrets-local') : require('../config/secrets');
var Twit = require('twit');

/**
 * GET /all
 * Show latest maps.
 */
exports.getMaps= function(req, res) {
  var maps = [];
  Mapping.find({ state:'published' }, function (err, maps) {
    //console.log('found maps: ', maps);  
    res.render('map/all', {
      title: 'All Maps',
      maps: maps
    });
  })
};

/**
 * GET /new
 * Start the create Map process
 */
exports.getNewmap = function(req, res) {

  if (res.locals.user && res.locals.user.twitter) {
    console.log(res.locals.user.twitter);
  }

  res.render('map/new', {
    title: 'New Map'
  });
};

/**
 * POST /new
 * Create Map 
 */
exports.postNewmap = function(req, res) {
  var map = new Mapping({
    mapfrom: {
      maptype: req.body.mapfromtype.toLowerCase(),
      address: req.body.mapfromaddress,
      proof: { url: req.body.proofurl }
    },
    mapto: {
      maptype: req.body.maptotype.toLowerCase(),
      address: req.body.maptoaddress
    }
  });

  console.log(req.body);

  // if it's a verified mapping for twitter, get the id from the API
  if (req.body.mapverified && res.locals.user && res.locals.user.twitter) {
    
    console.log('Creating Verified Mapping');

    var token = _.findWhere(req.user.tokens, { kind: 'twitter' });
    var T = new Twit({
      consumer_key: secrets.twitter.consumerKey,
      consumer_secret: secrets.twitter.consumerSecret,
      access_token: token.accessToken,
      access_token_secret: token.tokenSecret
    });

    T.get('account/verify_credentials', { }, function(err, reply) {
      if (err) {
        console.log('Error in map save', err);
        req.flash('errors', { msg: 'ERROR. Save did not work.' });
        res.render('map/new', {
          title: 'New Map'
        });            
      } else {
        map.mapfrom.address = reply.screen_name;
        map.mapfrom.verified = true;
        map.mapfrom.proof.type = 'oauth';
        map.save(function (err, map, numberAffected) {
          if (err) {
            console.log('Error in map save', err);
            req.flash('errors', { msg: 'ERROR. Save did not work.' });
            res.render('map/new', {
              title: 'New Map'
            });      
          } else {
            req.flash('success', { msg: 'Yay! Wallet address mapped. ' });
            res.redirect('/maps');      
          }
        });           
      }
    });

  } else {
    
    map.save(function (err, map, numberAffected) {
      if (err) {
        console.log('Error in map save', err);
        req.flash('errors', { msg: 'ERROR. Save did not work.' });
        res.render('map/new', {
          title: 'New Map'
        });      
      } else {
        req.flash('success', { msg: 'Yay! Wallet address mapped. ' });
        res.redirect('/maps');      
      }
    });    
  }
};

/**
 * GET /map/:address/delete
 * Delete a Map 
 */
exports.deleteMap = function(req, res) {
  console.log('Deleting ' + req.params.mapid);

  Mapping.remove({ _id: req.params.mapid }, function(err) {
    if (err) {
      req.flash('errors', { msg: 'Error deleting.' });
      res.redirect('/maps');      
    } else {
      req.flash('success', { msg: 'Deleted.' });
      res.redirect('/maps');      
    }

  });  

};

/**
 * GET /:maptype
 * Show latest maps for a given maptype
 */
exports.getMap = function(req, res) {
  var maps = [];

  Mapping.find({ 'mapfrom.maptype': req.params.maptype, state: 'published' }, function (err, maps) {
    //console.log('found maps: ', maps);
    res.render('map/maptype', {
      title: req.params.maptype,
      maps: maps,
      maptype: req.params.maptype
    });
  })
};

/**
 * GET /:maptype/:address
 * Show detail for single address
 */
exports.getAddress = function(req, res) {
  var maps = [];
  console.log("Finding Maps for " +req.params.maptype+ " address: ", req.params.address)
  Mapping.find({ 'mapfrom.maptype': req.params.maptype, 'mapfrom.address': req.params.address, state: 'published' }, function (err, maps) {
    //console.log(maps);
    res.render('map/address', {
      title: req.params.maptype,
      maps: maps,
      maptype: req.params.maptype,
      address: req.params.address
    });      
  })
};

/**
 * GET /:maptype/:address/json
 * Show JSON detail for single address
 */
exports.getAddressJSON = function(req, res) {
  var maps = [];
  Mapping.find({ 'mapfrom.maptype': req.params.maptype, 'mapfrom.address': req.params.address, state: 'published' }, function (err, maps) {
      //res.send(maps);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(maps));
  })
};

