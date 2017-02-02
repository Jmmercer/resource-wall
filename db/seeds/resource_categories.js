
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('resource_categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('resource_categories').insert({category_id: 1, resource_id: 3}),
        knex('resource_categories').insert({category_id: 2, resource_id: 1}),
        knex('resource_categories').insert({category_id: 3, resource_id: 2}),
        knex('resource_categories').insert({category_id: 3, resource_id: 1})
      ]);
    });
};
