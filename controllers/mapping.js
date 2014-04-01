var _ = require('underscore');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Mapping = require('../models/Mapping');
var secrets = require('../config/secrets');

/**
 * GET /all
 * Show latest maps.
 */
exports.getAll = function(req, res) {
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
 * GET /twitter
 * Show latest twitter maps.
 */
exports.getTwitter = function(req, res) {
  var maps = [];
  Mapping.find(function (err, maps) {
    console.log('found maps: ', maps);
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
exports.getNewmap = function(req, res) {
  res.render('map/new-twitter', {
    title: 'New Twitter Map'
  });
};

/**
 * POST /twitter/new
 * Create Map 
 */
exports.postNewmap = function(req, res) {
  var map = new Mapping({
    mapfrom: {
      maptype: 'twitter',
      address: req.body.twitter
    },
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