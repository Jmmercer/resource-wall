
exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('comments');
};

exports.down = function(knex, Promise) {
  return knex.schema.createTable('comments', function (table) {
    table.increments();
    table.integer('resource_id');
    table.integer('user_id');
    table.text('text');
    table.timestamp('created_at');
    table.foreign('resource_id')
    .references('resources.id').onUpdate('CASCADE');
    table.foreign('user_id')
    .references('users.id').onUpdate('CASCADE');
  });
};
