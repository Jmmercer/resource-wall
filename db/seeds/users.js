exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Alice', email: 'resourcewall@yahoo.com', password: '123'}),
        knex('users').insert({id: 2, name: 'Bob', email: 'misterveale@gmail.com', password: '123'}),
        knex('users').insert({id: 3, name: 'Charlie', email: 'resourcewall@gmail.com', password: '123'})
      ]);
    });
};
