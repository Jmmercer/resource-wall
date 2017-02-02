// database helper functions
module.exports = (knex) => {
  return {
    getResource: (resourceID, callback) => {
      knex
      .select('*')
      .from('resources')
      .where('id', resourceID)
      .then((allResourcesArr) => {
        console.log(allResourcesArr[0]);
      });
    },

    getAllResources: (callback) => {
      knex
      .select('*')
      .from('resources')
      .then((allResourcesArr) => {
        console.log(allResourcesArr);
      });
    },

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

    getResourcesByUser: (userID, callback) => {
      knex
      .select('*')
      .from('resources')
      .where('user_id', userID)
      .then((userResourcesArr) => {
        console.log(userResourcesArr);
      });
    },

    getResourcesByUserLiked: (userID, callback) => {
      knex
      .select('*')
      .from('resources')
      .innerJoin('likes', 'likes.resource_id', 'resources.id')
      .where('likes.user_id', userID)
      .then((userLikedResourcesArr) => {
        console.log(userLikedResourcesArr);
      });
    }
  };

}