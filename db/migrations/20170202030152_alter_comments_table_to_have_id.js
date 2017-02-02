
exports.up = function(knex, Promise) {
  return knex.schema.table('comments', function (table) {
    table.increments();
  });
};

exports.down = function(knex, Promise) {
  return table.dropColumns("id");
};
