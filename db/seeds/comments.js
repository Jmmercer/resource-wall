
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('comments').insert({resource_id: 3, user_id: 1, text: 'Great resource thanks - i can only wonder'}),
        knex('comments').insert({resource_id: 1, user_id: 2, text: 'That absolutely suck -wtf are u thinkin'}),
        knex('comments').insert({resource_id: 2, user_id: 3, text: 'meh'}),
        knex('comments').insert({resource_id: 1, user_id: 3, text: 'feels like sushi from cosco'})
      ]);
    });
};
