"use strict";

const db = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const shortid = require('shortid')


module.exports = function (db) {

  router.post("/", (req, res) => {
    const email = req.body.email;
    db.getUserByEmail(email, function(user) {

      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {

          req.session.user = user;
          res.status(200).redirect("/");

        } else {
            req.session.error_message = 'Wrong email or password';
            res.status(401).redirect('/');
            return;

        }
      } else {

        req.session.error_message = 'Wrong email or password';
        res.status(401).redirect('/');
        return;

      }
    })
  })

  return router;
}