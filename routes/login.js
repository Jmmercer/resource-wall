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

      if (bcrypt.compareSync(req.body.password, user.password)) {

        req.session.user = user; //changed it to user from user_id cos we will be needing email too
        res.status(200).redirect("/");
      } else {

        req.session.error_message = 'Incorrect login information';
        res.status(401).redirect('/');
        return;

      }
    })
  })

  router.get("/", (req, res) => {
    res.render("login_test");
  });

  return router;
}