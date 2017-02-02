"use strict";

const queries = require('../db/queries.js');

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    // What does get /resources do?
  })

  router.get("/search", (req, res) => {
    // Takes search term, filters resources. Does not leave page.
    // knex select query here
    // ajax request for new resources
  })

  router.post("/new", (req, res) => {
    // posts new resource. Popup with entry fields for url, title, description
  })

  router.get("/:resource_id", (req, res) => {
    // shows the resource's page
  });

  router.get("/:resource_id/likes", (req, res) => {
    // returns number of likes for that resource
  })

  router.get("/:resource_id/comments", (req, res) => {
    // returns number and content of comments for that resource
  })

  router.get("/:resource_id/ratings", (req, res) => {
    // returns ratings and average rating for that resource
  })

  return router;
}
