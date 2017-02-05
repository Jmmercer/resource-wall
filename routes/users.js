"use strict";
const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const db = require('../db/queries.js')(knex);

  router.get("/liked", (req, res) => {
    // Returns the resources that a user has liked
    const user = {id: req.session.user.id}
    console.log('user', user);

    db.getResourcesByUserLiked(user.id, function (resources) {
      res.send(resources);
    })

  })

  router.get("/submitted", (req, res) => {
    // Returns the resources that a user has liked
    // Similar to get /:user_id, but using ajax for speed
    const user = {id: req.session.user.id}
    console.log('user', user);

    db.getResourcesByUser(user.id, function (resources) {
      res.send(resources);
    })

  })

  router.get("/:user_id", (req, res) => {
    // Show user page
    const user = {id: req.params.user_id}

    db.getResourcesByUser(user.id, function (resources) {

      const templateVars = {resources: resources,
                            user: user}

      res.render('user', templateVars);
    })

  });

  return router;
}