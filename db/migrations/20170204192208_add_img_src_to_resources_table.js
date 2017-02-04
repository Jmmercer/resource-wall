
exports.up = function(knex, Promise) {
  return knex.schema.table('resources', (table) => {
    table.string('media_src');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('resources', (table) => {
    table.dropColumn('media_src');
  })
};
