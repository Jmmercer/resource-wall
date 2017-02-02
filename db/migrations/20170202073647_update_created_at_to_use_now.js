
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('resources', function(table) {
      table.dropColumn('created_at');
    }).then(()=>{
      knex.schema.table('resources', function(table) {
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
    }),
    knex.schema.table('comments', function(table) {
      table.dropColumn('created_at');
      return table;
    }).then(()=>{
      knex.schema.table('comments', function(table) {
        table.timestamp('created_at').defaultTo(knex.fn.now());
      });
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('resources', function(table) {
      table.dropColumn('created_at');
    }),
    knex.schema.table('comments', function(table) {
      table.dropColumn('created_at');
    })
  ]);
};
