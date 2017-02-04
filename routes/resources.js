"use strict";

const scraper = require('../public/scripts/scraper.js');
const cheerio = require('cheerio');
// const db      = require('../db/queries.js');
const scraper_request = require('../public/scripts/scraper.js');

const express = require('express');
const router  = express.Router();

module.exports = (db) => {


  router.get("/", (req, res) => {
    res.redirect("/");
  })

  //Does this do anything anymore?
  // router.post("/new/choice", (req, res) => {
  //   console.log('new/choice');
  //   console.log('req query', req.query);
  //   const sources = req.query['sources'];
  //   console.log('sources', sources);
  //   req.session.templateVars = {sources: sources};
  //   res.redirect("/resources/wenew/we");
  // })

  router.post("/new", (req, res) => {
    const url = req.body.url;
    const user_id = req.session.user.id;

    scraper(url, function(body){

      const $ = cheerio.load(body);

      const imgs = $('img');
      let img_sources = [];

      for (let img in imgs) {
        if (imgs[img].hasOwnProperty('attribs')) {
          if (imgs[img].attribs.src) {
            img_sources.push(imgs[img].attribs.src);
          }
        }
      }

      const templateVars = {img_sources: img_sources,
                            user:    {user_id: user_id}
                           }

      res.render("new_choice", templateVars);
    })
  })

  router.get("/search", (req, res) => {
    let searchTerm = req.query.search;
    db.getResourcesBySearch(searchTerm, function(resources) {
      res.json(resources);
    })
  })

  router.post("/", (req, res) => {
    //Create new resource
    console.log(req.session.user.id);

    const user_id     = req.session.user.id;
    const title       = req.body.title;
    const url         = req.body.url;
    const description = req.body.description;
    const img_src     = req.body.img_src;

    const resource = {user_id:      user_id,
                      url:          url,
                      title:        title,
                      description:  description,
                      media_src:      img_src
                     }
    console.log('resource:', resource);

    db.saveResource(resource, function(resource){
    });
    res.redirect("/");
  })

  // router.get("/:resource_id", (req, res) => {
  //   resource_id = req.params.resource_id;
  //   db.getResource(req.params.resource_id, function(resource) {
  //     res.render('show', resource);
  //   })

  // });

  router.get("/:resource_id/likes", (req, res) => {
    // returns number of likes for that resource
    if (req.user) {
      const likeObj = {};
      likeObj.resource_id = req.params.resource_id;
      likeObj.user_id = req.user.id
      db.updateLikes(likeObj, function(newCount) {
        res.status(200).send(`${newCount}`);
      })
    } else{
      req.session.error_message = "Login first";
      res.status(403).redirect("/");
    }
  })

  router.get("/:resource_id/comments", (req, res) => {
    // returns number and content of comments for that resource
  })

  router.get("/:resource_id/ratings", (req, res) => {
    // returns ratings and average rating for that resource
  })

  return router;
}
