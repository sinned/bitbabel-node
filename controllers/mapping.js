var _ = require('underscore');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Mapping = require('../models/Mapping');
var secrets = process.env.NODE_ENV == 'local' ? require('../config/secrets-local') : require('../config/secrets');

/**
 * GET /all
 * Show latest maps.
 */
exports.getMaps= function(req, res) {
  var maps = [];
  Mapping.find(function (err, maps) {
    console.log('found maps: ', maps);
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
    mapfrom: [{
      maptype: req.body.mapfromtype.toLowerCase(),
      address: req.body.mapfromaddress,
      proof: { url: req.body.proofurl }
    }],
    mapto: {
      maptype: req.body.maptotype.toLowerCase(),
      address: req.body.maptoaddress
    }
  });
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
};


/**
 * GET /twitter
 * Show latest twitter maps.
 */
exports.getTwitter = function(req, res) {
  var maps = [];
  
  // find in an array of objects documentation: http://docs.mongodb.org/manual/reference/operator/projection/elemMatch/
  Mapping.find({ mapfrom: { $elemMatch: {maptype: 'twitter'}} }, function (err, maps) {
    //console.log('found maps: ', maps);
    res.render('map/twitter', {
      title: 'Twitter',
      maps: maps
    });
  })
};

/**
 * GET /twitter/new
 * Start the create Map process
 */
exports.getNewTwittermap = function(req, res) {
  res.render('map/new-twitter', {
    title: 'New Twitter Map'
  });
};

/**
 * POST /twitter/new
 * Create Map 
 */
exports.postNewTwittermap = function(req, res) {
  var map = new Mapping({
    mapfrom: [{
      maptype: 'twitter',
      address: req.body.twitter
    }],
    mapto: {
      maptype: 'bitcoin',
      address: req.body.bitcoinaddress
    }
  });
  map.save();
  //console.log(map);

  req.flash('success', { msg: 'Wallet address mapped. ' });
  res.redirect('/twitter');
};