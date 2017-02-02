
exports.up = function(knex, Promise) {
  return knex.schema.table("users", (table) => {
    table.string("email");
    table.string("password");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", (table) => {
    table.dropColumns("email", "password");
  });
};
