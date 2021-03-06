"use strict";

const scraper         = require('../public/scripts/scraper.js');
const cheerio         = require('cheerio');
const scraper_request = require('../public/scripts/scraper.js');
const url_parser      = require('../public/scripts/url_parser');

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
    console.log('req.user: ',  req.user);
    let user = req.user;
    let templateVars = {};
    if (req.session.error_message) {

      templateVars.error_message = req.session.error_message;
      console.log('error:', req.session.error_message);

      req.session.error_message = null;
    } else {

      templateVars.error_message = '';

    }

    //const user_id = req.session.user.id;
    let url       = req.body.url;

    if (url.substr(0, 4) != 'http') {
      url = 'http://' + url;
    }

    const parsed_url = url_parser.getLocation(url);

    scraper(url, function(body){

      const $ = cheerio.load(body);

      const imgs = $('img');
      const title = $('title').text();
      const description = $('meta[name="description"]').attr('content');


      //Oh god
      //Prepend hostname if not present
      let img_sources = [];
      for (let img in imgs) {
        if (imgs[img].hasOwnProperty('attribs')) {
          let img_url = imgs[img].attribs.src;
          if (img_url) {
            if (img_url.substr(0, 4) != 'http') {
              img_url = 'http://' + parsed_url.hostname + img_url;
            }
            img_sources.push(img_url);
          }
        }
      }

      img_sources.push(url);

      templateVars.img_sources   = img_sources;
      templateVars.title         = title;
      templateVars.description   = description;
      templateVars.url           = url;
      templateVars.user          = user;

      res.render("new_choice", templateVars);
    })
  })

  router.get("/search", (req, res) => {

    let searchArr = req.query;
    console.log('searchArr in route', searchArr);
    db.getResourcesBySearch(searchArr, function(resources) {
      res.json(resources);
    })
  })

  router.post("/", (req, res) => {
    //Create new resource
    const user_id     = req.session.user.id;
    const title       = req.body.title;
    const url         = req.body.url;
    const description = req.body.description;
    const img_src     = req.body.img_src;
    const categories  = req.body.category;

    const resource = {user_id:      user_id,
                      url:          url,
                      title:        title,
                      description:  description,
                      media_src:    img_src,
                      categories:   [categories]
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

  router.post("/:resource_id/comments", (req, res) => {
    // returns number and content of comments for that resource
    if (req.user) {
      const commentObj = {
        user_id:        req.user.id,
        resource_id:    req.params.resource_id,
        text:           req.body.text
      };
      db.saveComment(commentObj, function(commentInfo) {
        commentInfo[0].commenter = req.user.name;
        res.status(200).json(commentInfo)
      });
    } else{
      req.session.error_message = "Login first";
      res.status(403).redirect("/");
    }
  })

  router.get("/:resource_id/comments", (req, res) => {
    // returns number and content of comments for that resource
    let resource_id = req.params.resource_id;
    const user_id = req.user ? req.user.id : undefined
    db.getComments([resource_id, user_id], function(results) {
      const result = {comments: results.comments, ratedValue: results.ratedValue, isLoggedIn: !!req.user}
      res.status(200).json(result);
    });
  })

  router.get("/:resource_id/ratings", (req, res) => {
    // returns ratings and average rating for that resource
    if (req.user) {
      const ratingObj = {};
      ratingObj.resource_id = req.params.resource_id;
      ratingObj.user_id = req.user.id;
      ratingObj.value = req.query.value;
      db.updateRating(ratingObj, function(newMean) {
        res.status(200).send(`${newMean}`);
      })
    } else{
      req.session.error_message = "Login first";
      res.status(403).redirect("/");
    }
  })

  return router;
}
