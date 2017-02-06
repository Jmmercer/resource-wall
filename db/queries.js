// database helper functions
module.exports = (knex) => {
  return {

    // getComments returns the comments
    // Output => array of comment objects e.g. {commenter: , commenter_id: , text: , created_at: }
    getComments: (resourceUserArr, callback) => {
      const [resourceID, userID] = resourceUserArr;
      const result = {}
      knex
        .select('users.name as commenter', 'users.id as commenter_id',
          'comments.text as text', 'comments.created_at as created_at')
        .from('comments')
        .innerJoin('users', 'comments.user_id', 'users.id')
        .where('resource_id', resourceID)
      .then((commentsArr) => {
        result.comments = commentsArr;
        if (userID) {
          knex('ratings').select('value').where('resource_id', resourceID).andWhere('user_id', userID)
          .then(function(valueArr) {
            console.log('valueArr', valueArr)
            result.ratedValue = (valueArr.length > 0) ? valueArr[0].value : undefined;
            callback(result);
          });
        } else {
          result.ratedValue = undefined;
          callback(result);
        }
      });
    },

    // getResource returns a resource object
    // Input => resourceID and a callback function to handle the result
    // Output => a resource object including the comments array
    // Example: (1, console.log) logs {id: 1, user_id: '#', url: 'example.com', title: 'tadah',
    //  comments: [{commentobj1},..], ....}
    getResource: (resourceID, callback) => {
      let resrc;
      knex
      .select('*')
      .from('resources')
      .where('resources.id', resourceID)
      .then((thisResourcesArr) => {
        resrc = thisResourcesArr[0];
      }).then(() => {
        knex
        .select('*')
        .from('comments')
        .where('resource_id', resourceID)
        .then((commentsArr) => {
          resrc.comments = commentsArr;
          callback(resrc);
        })
      });
    },

    // getAllResources returns an array resource objects
    // Input => a callback function to handle the result
    // Output => an array resource objects
    // Example: (console.log) logs [{id: 1, user_id: '#', url: 'example.com', title: 'tadah'....},...]
    getAllResources: (callback) => {
      knex
      .select('*')
      .from('resources')
      .then((allResourcesArr) => {
        callback(allResourcesArr);
      });
    },

    // getResourcesByCategory returns an array resource objects filtered by category
    // Input => categoryID and a callback function to handle the result
    // Output => an array resource objects
    // Example: (categoryID, console.log) logs [{id: 1, user_id: '#', url: 'example.com', title: 'tadah'....},...]
    getResourcesByCategory: (categoryID, callback) => {
      knex
      .select('*')
      .from('resources')
      .innerJoin('resource_categories', 'resources.id', 'resource_id')
      .where('category_id', categoryID)
      .then((catResourcesArr) => {
        callback(catResourcesArr);
      });
    },

    // getResourcesBySearch returns an array of resource objects that has the searched term
    // its title, description, url
    // Input => searchTerm, e.g 'some string', categoryIDs[,optional] e.g [1, 2] and a callback function to handle the result
    // Note: if category ids array is not supplied, search is on all resources
    // Output => an array resource objects
    // Example: ('exa', console.log, [1, 2]) logs [{id: 1, user_id: '#', url: 'example.com', title: 'tadah'....},...]
    getResourcesBySearch: (data, callback) => {
      console.log('data in query', data);

      let categoryIDs = data.categoryIDs;
      let searchTerm = data.search;
      console.log('categoryIDs', categoryIDs);
      const approximateTerm = `%${searchTerm}%`.toLowerCase(); // think about escaping searchTerm
      categoryIDs = categoryIDs || knex.select('id').from('categories');

      return knex
      .distinct('resource_id').select().from('resource_categories').where('category_id', 'in', categoryIDs)
      .then((result) => {
        console.log('result', result);
        result = result.map(obj => obj.resource_id);
        return knex.select('*').from('resources').where('id', 'in', result);
      }).then((r) => {
          console.log('r', r);
        let searchResult = r.filter(res => {
          console.log('res', res);
          return (
          (res.title && res.title.toLowerCase().includes(searchTerm)) ||
          (res.url && res.url.toLowerCase().includes(searchTerm)) ||
          (res.description && res.description.toLowerCase().includes(searchTerm)));
        });

        callback(searchResult);
      });
    },

    // getResourcesByUser returns an array resource objects filtered by owner of the resource
    // Input => userID e.g 1, and a callback function to handle the result
    // Output => an array resource objects
    // Example: (1, console.log) logs [{id: 1, user_id: '#', url: 'example.com', title: 'tadah'....},...]
    getResourcesByUser: (userID, callback) => {
      knex
      .select('*')
      .from('resources')
      .where('user_id', userID)
      .then((userResourcesArr) => {
        callback(userResourcesArr);
      });
    },

    // getResourcesByUserLiked returns an array resource objects filtered by liked resources
    // Input => userID e.g 1, and a callback function to handle the result
    // Output => an array resource objects
    // Example: (1, console.log) logs [{id: 1, user_id: '#', url: 'example.com', title: 'tadah'....},...]
    getResourcesByUserLiked: (userID, callback) => {
      knex
      .select('*')
      .from('resources')
      .innerJoin('likes', 'likes.resource_id', 'resources.id')
      .where('likes.user_id', userID)
      .then((userLikedResourcesArr) => {
        callback(userLikedResourcesArr);
      });
    },

    // Gets a user by email
    // Input => email e.g. me@me.me, and a callback
    // Output => a user object
    // Example: (me@me.com, console.log) logs {id: , name: , email: , password: }
    getUserByEmail: (email, callback) => {
      knex
      .select('*')
      .from('users')
      .where('email', email)
      .then((userArr) =>{
        callback(userArr[0]);
      });
    },

    // Set / Save methods

    // saves a new comment
    // Input => comment object e.g {user_id: 1, resource_id: 3, text: 'lorem'} and a callback
    // Output => comment object (now including the id and created_at), andcomments_count update on the resource
    // Example: (commentObj, console.log) logs [{id: , user_id: , resource_id: , text: , created_at: }, 42]
    saveComment: (comment, callback) => {
      const returnedObj = {};
      knex
      .returning(['id', 'created_at'])
      .insert({
        user_id:        comment.user_id,
        resource_id:    comment.resource_id,
        text:           comment.text
      }).into('comments')
      .then((returnedArr) => {
        returnedObj.id = returnedArr[0].id;
        returnedObj.created_at = returnedArr[0].created_at
        returnedObj.commenter_id = comment.user_id;
        returnedObj.resource_id = comment.resource_id;
        returnedObj.text = comment.text;
      })
      .then(() => {
        return knex('resources').where('id', comment.resource_id)
            .increment('comments_count', 1).returning('comments_count');
      })
      .then((count) => {
        callback([returnedObj, count[0]]);
      })
      .catch(function(err){
        console.log('Error', err.message);
      });
    },

    // saves a new resource
    // Input => resource object {user_id: , url: , title: , description: } and a callback
    // Output => saved resource Object
    // Example: (resourceObj, console.log) logs {id: , url: , title: , description: ,...
    // likes_count: , avg_rating: , comments_count: }
    saveResource: (resource, callback) => {
      resource.likes_count = 0;
      resource.avg_rating = 0;
      resource.comments_count = 0;
      knex
      .returning('id')
      .insert({
        user_id:        resource.user_id,
        url:            resource.url,
        title:          resource.title,
        description:    resource.description,
        media_src:      resource.media_src,
        likes_count:    resource.likes_count,
        avg_rating:     resource.avg_rating,
        comments_count: resource.comments_count
      }).into('resources')
      .then((idArr) => {
        resource.id = idArr[0];
        let categoryMap = resource.categories.map(catID => ({category_id: catID, resource_id: resource.id}));
        return knex.insert(categoryMap).into('resource_categories');
      })
      .then(() => {
        callback(resource);
      })
      .catch(function(err){
        console.log('Error', err.message);
      });
    },

    // saves a new user from /register
    // Input => user object e.g {name: , email: , password: } and a callback
    // Output => saved user object now including db generated `id`
    // Example: (user_object, callback) logs {id: , name: , email: , password: }
    saveUser: (user, callback) => {
      knex
      .returning('id')
      .insert({
        name:        user.name,
        email:       user.email,
        password:    user.password
      }).into('users')
      .then((idArr) => {
        user.id = idArr[0];
        console.log('user.id', user.id);
        callback(user);
      })
      .catch(function(err){
        console.log('Error', err.message);
      });
    },


    // Update Methods

    // update likes: if a user hasn't like a resource before increments otherwise decrements
    // Input => like object e.g. {user_id: , resource_id: } and a callback
    // Output => new count of all likes e.g 42. Updates the likes table and the resource's `likes_count`
    // Example: (likeObj, console.log) logs 42
    updateLikes: (likeObj, callback) => {
      knex
      .select('*')
      .from('likes')
      .where('likes.user_id', '=', likeObj.user_id)
      .andWhere('likes.resource_id', '=', likeObj.resource_id)
      .then((likeArr) => {
        if (likeArr.length < 1) {
          return knex.insert(likeObj).into('likes')
          .then(() => {
            return knex('resources').where('id', likeObj.resource_id)
            .increment('likes_count', 1).returning('likes_count');
          });
        } else {
          return knex('likes').where('user_id', likeObj.user_id)
            .andWhere('likes.resource_id', '=', likeObj.resource_id).del()
          .then(() => {
            return knex('resources').where('id', likeObj.resource_id)
            .decrement('likes_count', 1).returning('likes_count');
          });
        }
      }).then((newCountArr) => {
        callback(newCountArr[0]);
      });
    },

    // update rating: if a user hasn't rated a resource before it increments otherwise decrements
    // Input => rating object e.g. {user_id: , resource_id: , value: } and a callback
    // Output => Integer new average of all ratings e.g 4. Updates the ratings table and the resource's `avg_rating`
    // Example: (ratingObj, console.log) logs 4
    updateRating: (ratingObj, callback) => {
      knex
      .select('*')
      .from('ratings')
      .where('ratings.user_id', '=', ratingObj.user_id)
      .andWhere('ratings.resource_id', '=', ratingObj.resource_id)
      .then((ratingArr) => {
        if (ratingArr.length < 1) {
          return knex.insert(ratingObj).into('ratings').then(() => {
          return knex('ratings').avg('value as avgRating').where('resource_id', ratingObj.resource_id)
            .returning('avgRating'); })
          .then((avgRatingArr) => {
            const rating = Math.round(Number(avgRatingArr[0].avgRating));
            return knex('resources').where('id', ratingObj.resource_id)
            .update('avg_rating', rating).returning('avg_rating');
          }).then((newMeanArr) => {
            callback(newMeanArr[0]);
          });
        } else {
          return knex('ratings').where('user_id', ratingObj.user_id)
            .andWhere('ratings.resource_id', '=', ratingObj.resource_id).update('value', ratingObj.value)
          .then(() => {
          return knex('ratings').avg('value as avgRating').where('resource_id', ratingObj.resource_id)
            .returning('avgRating'); })
          .then((avgRatingArr) => {
            const rating = Math.round(Number(avgRatingArr[0].avgRating));
            return knex('resources').where('id', ratingObj.resource_id)
            .update('avg_rating', rating).returning('avg_rating');
          }).then((newMeanArr) => {
            callback(newMeanArr[0]);
          });
        }
      })
    },

    // update user
    updateUser: (userObj, callback) => {
      const thisId = userObj.id;
      userObj.id = undefined;
      console.log('thisId', thisId);
      knex('users').where('id', thisId).update(userObj)
      .then(function(isUpdated) {
        if (isUpdated) {
          userObj.id = thisId;
          callback(userObj);
        }
      });
    }

  };

}