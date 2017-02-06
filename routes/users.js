"use strict";
const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const db = require('../db/queries.js')(knex);

  router.get("/liked", (req, res) => {
    // Returns the resources that a user has liked
    console.log('query submit',req.query)
    let user_id = req.session.user ? req.session.user.id : req.query.ownid;

    db.getResourcesByUserLiked(user_id, function (resources) {
      res.send(resources);
    })

  })

  router.get("/submitted", (req, res) => {
    // Returns the resources that a user has liked
    // Similar to get /:user_id, but using ajax for speed
    console.log('query submit',req.query)
    let user_id = req.session.user ? req.session.user.id : req.query.ownid;

    db.getResourcesByUser(user_id, function (resources) {
      res.send(resources);
    })

  })

  router.get("/:user_id", (req, res) => {
    // Show user page
    if (req.session.error_message) {

      req.templateVars.error_message = req.session.error_message;
      console.log('error:', req.session.error_message);

      req.session.error_message = null;
    } else {

      req.templateVars.error_message = '';

    }
    req.templateVars.owner_id = req.params.user_id;
    req.templateVars.owner = req.query.owner;
    db.getResourcesByUser(req.params.user_id, function (resources) {

      req.templateVars.resources = resources;
      res.render('user', req.templateVars);
    })

  });

  router.post("/", (req, res) => {
    // Update user profile info
    if (req.user.name == req.body.name && req.user.email == req.body.email) {

      res.redirect(`/users/${req.user.id}`);

    } else {

      req.user.name = req.body.name;
      req.user.email = req.user.email;

      db.updateUser(req.user, function (user) {
        console.log('user', user);
        res.redirect(`/users/${user.id}`)
      })
    }
  });

  return router;
}