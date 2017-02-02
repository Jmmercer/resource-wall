
exports.up = function(knex, Promise) {
  return knex.schema.createTable('likes', function (table) {
    table.integer('resource_id');
    table.integer('user_id');
    table.foreign('resource_id')
    .references('resources.id').onUpdate('CASCADE');
    table.foreign('user_id')
    .references('users.id').onUpdate('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('likes');
};
