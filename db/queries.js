// database helper functions
module.exports = (knex) => {
  return {

    // getResource returns a resource object
    // Input => resourceID and a callback function to handle the result
    // Output => a resource object
    // Example: (1, console.log) logs {id: 1, user_id: '#', url: 'example.com', title: 'tadah'....}
    getResource: (resourceID, callback) => {
      knex
      .select('*')
      .from('resources')
      .where('id', resourceID)
      .then((allResourcesArr) => {
        console.log(allResourcesArr[0]);
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
        console.log(catResourcesArr);
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
      .select('*')
      .from('resource_categories')
      .innerJoin('resources', 'resources.id', 'resource_id')
      .innerJoin('categories', 'categories.id', 'category_id')
      .where('resources.title', 'like', approximateTerm)
      .orWhere('resources.description', 'like', approximateTerm)
      .orWhere('resources.url', 'like', approximateTerm)
      .orWhere('categories.name', 'like',approximateTerm)
      .then((catResourcesArr) => {
        console.log(catResourcesArr);
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
        console.log(userResourcesArr);
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
        console.log(userLikedResourcesArr);
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
    }
  };

}