"use strict";

const db = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const shortid = require('shortid')


module.exports = function (knex) {

  router.post("/", (req, res) => {
    const email = req.body.email;
    db.getUserByEmail(email, function(user) {

      if (bcrypt.compareSync(user.password)) {

        req.session_id = user.user_id;

      } else {

        req.session.error_message = 'Incorrect login information';
        res.status(401).redirect('/');

      }
    })
  })

  router.get("/", (req, res) => {
    res.render("login_test");
  });

  return router;
}