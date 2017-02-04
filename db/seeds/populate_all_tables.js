
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () { return knex('resource_categories').del() })
    .then(function () { return knex('ratings').del() })
    .then(function () { return knex('likes').del() })
    .then(function () { return knex('categories').del() })
    .then(function () { return knex('resources').del() })
    .then(function () { return knex('users').del() })
    .then(function () {
      return Promise.all([
        // Inserts users seed entries
        knex('users').insert({id: 1, name: 'Alice', email: 'resourcewall@yahoo.com', password: '123'}),
        knex('users').insert({id: 2, name: 'Bob', email: 'misterveale@gmail.com', password: '123'}),
        knex('users').insert({id: 3, name: 'Charlie', email: 'resourcewall@gmail.com', password: '123'})
      ])
    }).then(function () {
      return Promise.all([
        // Inserts resources seed entries
        knex('resources').insert({id: 1, user_id: 1, url: 'www.lighthouselabs.ca', title: 'We make developers!',
          description: 'Chocolate bar cake cotton candy oat cake dragée. Caramels pie bear claw gummi bears. Pie cake tootsie roll gingerbread marshmallow. Jujubes pie topping sugar plum cookie. Soufflé bear claw muffin carrot cake bonbon muffin marzipan pudding dragée.',
          likes_count: 2, avg_rating: 3, comments_count: 2, media_src: "http://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/Q-Z/sun-bear-tongue.jpg"}),
        knex('resources').insert({id: 2, user_id: 3, url: 'www.yahoo.com', title: 'Yahoo!',
          description: 'Yahoo homepage yo!', likes_count: 2, avg_rating: 3, comments_count: 1,
          media_src: "http://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/Q-Z/sun-bear-tongue.jpg"}),
        knex('resources').insert({id: 3, user_id: 1, url: 'http://mashable.com/', title: 'mashable  wtf - whats dis4',
          description: 'random mashable', likes_count: 0, avg_rating: 5, comments_count: 1,
          media_src: "http://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/Q-Z/sun-bear-tongue.jpg"})
      ])
    }).then(function () {
      return Promise.all([
        // Inserts categories seed entries
        knex('categories').insert({id: 1, name: 'foo'}),
        knex('categories').insert({id: 2, name: 'bar'}),
        knex('categories').insert({id: 3, name: 'bazz'})
      ])
    }).then(function () {
      return Promise.all([
        // Inserts likes seed entries
        knex('likes').insert({resource_id: 2, user_id: 1}),
        knex('likes').insert({resource_id: 1, user_id: 2}),
        knex('likes').insert({resource_id: 2, user_id: 3}),
        knex('likes').insert({resource_id: 1, user_id: 3})
      ])
    }).then(function () {
      return Promise.all([
        // Inserts ratings seed entries
        knex('ratings').insert({resource_id: 3, user_id: 1, value: 5}),
        knex('ratings').insert({resource_id: 1, user_id: 2, value: 4}),
        knex('ratings').insert({resource_id: 2, user_id: 3, value: 3}),
        knex('ratings').insert({resource_id: 1, user_id: 3, value: 1})
      ])
    }).then(function () {
      return Promise.all([ 
        // Inserts resource_categories seed entries
        knex('resource_categories').insert({resource_id: 3, category_id: 1}),
        knex('resource_categories').insert({resource_id: 1, category_id: 2}),
        knex('resource_categories').insert({resource_id: 2, category_id: 3}),
        knex('resource_categories').insert({resource_id: 1, category_id: 3})
      ])
    }).then(function () {
      return Promise.all([  
        // Inserts comments seed entries
        knex('comments').insert({id: 1, resource_id: 3, user_id: 1, text: 'Great resource thanks - i can only wonder'}),
        knex('comments').insert({id: 2, resource_id: 1, user_id: 2, text: 'That absolutely suck -wtf are u thinkin'}),
        knex('comments').insert({id: 3, resource_id: 2, user_id: 3, text: 'meh'}),
        knex('comments').insert({id: 4, resource_id: 1, user_id: 3, text: 'feels like sushi from cosco'})
      
      ]);
    });
};
