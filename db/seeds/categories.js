
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('categories').insert({id: 1, name: 'foo'}),
        knex('categories').insert({id: 2, name: 'bar'}),
        knex('categories').insert({id: 3, name: 'bazz'})
      ]);
    });
};
