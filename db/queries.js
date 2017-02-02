// database helper functions
module.exports = (knex) => {
  return {
    getAllResources: (callback) => {
      knex
      .select('id', 'title', 'description')
      .count('* as likesCount')
      .avg('value as rating')
      .from('resources')
      .innerJoin('likes', 'resources.id', 'likes.resource_id')
      .innerJoin('ratings', 'resources.id', 'ratings.resource_id')
      .groupBy('id', 'title', 'description')
      .then((results) => {
        console.log(results);
      });
    }
  };

}