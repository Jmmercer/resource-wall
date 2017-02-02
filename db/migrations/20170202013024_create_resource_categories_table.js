
exports.up = function(knex, Promise) {
  return knex.schema.createTable('resource_categories', function (table) {
    table.integer('resource_id');
    table.integer('category_id');
    table.foreign('resource_id')
    .references('resources.id').onUpdate('CASCADE');
    table.foreign('category_id')
    .references('categories.id').onUpdate('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('resource_categories');
};
