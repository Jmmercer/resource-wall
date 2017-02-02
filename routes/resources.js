"use strict";

//const db = require('../db');

const express = require('express');
const router  = express.Router();

module.exports = () => {

  router.get("/", (req, res) => {
    //knex select query here
    
  });

  router.get("/search", (req, res) => {
    //knex select query here
  })

  return router;
}
