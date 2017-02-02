"use strict";

const queries = require('../db/queries.js');

const express = require('express');
const router  = express.Router();

module.exports = () => {

  router.get("/", (req, res) => {
    // What does get /users do?
  });

  router.get("/:user_id", (req, res) => {
    // Shows user's page
  });


  return router;
}