const express = require('express');
const social = require('../../controllers/social');

const handlers = require('../../middleware/handlers');

const editSocial = express.Router();

editSocial.route('/view')
  .post((req, res) => {
    handlers.jwtCheck(req, res, social.addView);
  })
  .get((req, res) => {
    handlers.jwtCheck(req, res, social.getView);
  });
editSocial.route('/like')
  .post((req, res) => {
    handlers.jwtCheck(req, res, social.addLike);
  })
  .get((req, res) => {
    handlers.jwtCheck(req, res, social.getLike);
  });

module.exports = editSocial;