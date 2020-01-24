// include the model (aka DB connection)
const bcrypt = require('bcrypt');
// const uniqid = require('uniqid');
const CONFIG = require('../config/config');
const usermodel = require('../models/usermodel');
const jwt = require('jsonwebtoken');


const MAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]*$/;
const NAME_REGEX = /^[a-zA-Z_.-]*$/;

const jwtkey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;

// create class
const User = {
  getAllusers: function(req, res) {
    const pathname = req._parsedUrl.pathname.split('/');
    const section = pathname[1];
    usermodel.getAllusers(req, function(err, result) {
      let apiResult = {};
      if (err) {
        apiResult.meta = {
          table: section,
          type: 'collection',
          total: 0,
        };
        apiResult.data = [];
      } else {
      let resultJson = JSON.stringify(result);
      resultJson = JSON.parse(resultJson);
      apiResult.meta = {
        table: 'user',
        type: 'collection',
        total: 1,
        total_entries: 0,
      };
      apiResult.data = resultJson;
      res.json(apiResult);
      }
    });
  },
  addUser: function(req, res) {
    const pathname = req._parsedUrl.pathname.split('/');
    const section = pathname[1];
    let {username, name, surname, email, password} = req.body;
    if (!(username || name || surname || email || password)) {
      return res.status(400).json({error: "Missing informations, fill the form"});
    }
    if (!MAIL_REGEX.test(email)) {
      return res.status(400).json({error: 'Invalid mail.'});
    }
    if (!PASSWORD_REGEX.test(password) || password.length < 8) {
      return res.status(400).json({error: 'Invalid password, it should contain at least one capital letter, one numerical character and a minimun of 8 characters.'});
    }
    if (!USERNAME_REGEX.test(username) || username.length < 6) {
      return res.status(400).json({error: 'Invalid username, it should contain only letters, numbers and a minimun of 6 characters'});
    }
    if (!NAME_REGEX.test(name) || name.length < 2) {
      return res.status(400).json({error: 'Invalid name, it should contain only letters'});
    }
    if (!NAME_REGEX.test(surname) || surname.length < 2) {
      return res.status(400).json({error: 'Invalid surname, it should contain only letters'});
    }
    bcrypt.hash(password, 2, function(err, hash) {
      if (err) {
        console.log(err);

        return res.status(500).json({error: 'bcrypt popo' + err});
      }
      const post = [username, name, surname, email, hash];
      usermodel.addUser(post, function(err, result) {
      let apiResult = {};
      if (err) {
        apiResult.meta = {
          table: section,
          type: 'collection',
          total: 0,
          error: err,
        };
        apiResult.data = [];
      } else {
      let resultJson = JSON.stringify(result);
      resultJson = JSON.parse(resultJson);
      apiResult.meta = {
        table: 'user',
        type: 'collection',
      };
      apiResult.data = resultJson;
      }

      return res.json(apiResult);
    });
  });
},
  checkPassword: function(req, res) {
    let {username, password} = req.body;
    usermodel.findOneUser(username, function(err, result) {
      let apiResult = {};
      if (err) {
        apiResult.meta = {
          access: 'error',
          error: err,
        };
        apiResult.data = [];
      } else {
        let resultJson = JSON.stringify(result);
        resultJson = JSON.parse(resultJson);
          if (bcrypt.compareSync(password, resultJson[0].password)) {
            apiResult.meta = {
              access: 'granted',
            };
            apiResult.data = resultJson;
            const token = jwt.sign({username}, jwtkey, {
              algorithm: 'HS256',
              expiresIn: jwtExpirySeconds
            });
            console.log('token:', token);
            res.cookie('token', token, {maxAge: jwtExpirySeconds * 1000});

            return res.json(apiResult).end();
          } else {
            apiResult.meta = {
              access: 'denied',
            };
            apiResult.data = resultJson;
          }

          return res.status(401).json(apiResult)
          .end();
      }
    });
  }
};

module.exports = User;
