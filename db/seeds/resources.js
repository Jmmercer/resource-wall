
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('resources').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('resources').insert({id: 1, user_id: 1, url: 'www.lighthouselabs.ca', title: 'We make developers!', description: 'Chocolate bar cake cotton candy oat cake dragée. Caramels pie bear claw gummi bears. Pie cake tootsie roll gingerbread marshmallow. Jujubes pie topping sugar plum cookie. Soufflé bear claw muffin carrot cake bonbon muffin marzipan pudding dragée.'}),
        knex('resources').insert({id: 2, user_id: 3, url: 'www.yahoo.com', title: 'Yahoo!', description: 'Yahoo homepage yo!'}),
        knex('resources').insert({id: 3, user_id: 1, url: 'http://mashable.com/', title: 'mashable  wtf - whats dis4', description: 'random mashable'})
      ]);
    });
};
