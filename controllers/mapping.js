var _ = require('underscore');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Mapping = require('../models/Mapping');
var secrets = require('../config/secrets');


/**
 * GET /twitter
 * Show latest twitter maps.
 */
exports.getTwitter = function(req, res) {
  res.render('map/twitter', {
    title: 'Twitter'
  });
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
  req.flash('success', { msg: 'Wallet address mapped.' });
  res.render('map/new-twitter', {
    title: 'New Twitter Map'
  });
};