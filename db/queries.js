// database helper functions
module.exports = (knex) => {
  return {

    // getResource returns a resource object
    // Input => resourceID and a callback function to handle the result
    // Output => a resource object
    // Example: (1, console.log) logs {id: 1, user_id: '#', url: 'example.com', title: 'tadah'....}
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

    // getResourcesBySearch returns an array resource objects that has the searched term
    // its title, description, url or its category
    // Input => categoryID and a callback function to handle the result
    // Output => an array resource objects
    // Example: ('exa', console.log) logs [{id: 1, user_id: '#', url: 'example.com', title: 'tadah'....},...]
    getResourcesBySearch: (searchTerm, callback) => {
      const approximateTerm = `%${searchTerm}%`;
      knex
      .select('resources.id', 'resources.url', 'resources.title', 'resources.description', 'resources.likes_count', 'resources.avg_rating', 'resources.comments_count')
      .from('resource_categories')
      .innerJoin('resources', 'resources.id', 'resource_id')
      .innerJoin('categories', 'categories.id', 'category_id')
      .where('resources.title', 'like', approximateTerm)
      .orWhere('resources.description', 'like', approximateTerm)
      .orWhere('resources.url', 'like', approximateTerm)
      .orWhere('categories.name', 'like',approximateTerm)
      .then((catResourcesArr) => {
        callback(catResourcesArr);
      });
    },

    getResourcesBySearchFiltered: (searchTerm, categoryIDS, callback) => {
      const approximateTerm = `%${searchTerm}%`;
      knex
      .select('resources.id', 'resources.url', 'resources.title', 'resources.description', 'resources.likes_count', 'resources.avg_rating', 'resources.comments_count')
      .from('resource_categories')
      .innerJoin('resources', 'resources.id', 'resource_id')
      .innerJoin('categories', 'categories.id', 'category_id')
      .where('resources.title', 'like', approximateTerm)
      .orWhere('resources.description', 'like', approximateTerm)
      .orWhere('resources.url', 'like', approximateTerm)
      .orWhere('categories.name', 'like',approximateTerm)
      .andWhere('category_id', 'in', categoryIDS)
      .then((catResourcesArr) => {
        callback(catResourcesArr);
      });
    },

    // getResourcesByUser returns an array resource objects filtered by owner of the resource
    // Input => userID and a callback function to handle the result
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

    // getResourcesByUser returns an array resource objects filtered by liked resources
    // Input => userID and a callback function to handle the result
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
        likes_count:    resource.likes_count,
        avg_rating:     resource.avg_rating,
        comments_count: resource.comments_count
      }).into('resources')
      .then((idArr) => {
        resource.id = idArr[0];
        callback(resource);
      })
      .catch(function(err){
        console.log('Error', err.message);
      });
    },

    saveUser: (user, callback) => {
      knex
      .returning('id')
      .insert({
        name:        user.name,
        email:       user.email,
        password:    user.password
      }).into('users')
      .then((idArr) => {
        resource.id = idArr[0];
        callback(user);
      })
      .catch(function(err){
        console.log('Error', err.message);
      });
    },


    // Update Methods
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
          });
        } else {
          return knex('ratings').where('user_id', ratingObj.user_id)
            .andWhere('ratings.resource_id', '=', ratingObj.resource_id).del()
          .then(() => {
          return knex('ratings').avg('value as avgRating').where('resource_id', ratingObj.resource_id)
            .returning('avgRating'); })
          .then((avgRatingArr) => {
            const rating = Math.round(Number(avgRatingArr[0].avgRating));
            return knex('resources').where('id', ratingObj.resource_id)
            .update('avg_rating', rating).returning('avg_rating');
          });
        }
      }).then((newCountArr) => {
        callback(newCountArr[0]);
      });
    }
  };

}