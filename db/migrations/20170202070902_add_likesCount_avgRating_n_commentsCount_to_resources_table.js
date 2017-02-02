
exports.up = function(knex, Promise) {
  return knex.schema.table("resources", (table) => {
    table.integer("likes_count");
    table.integer("avg_rating");
    table.integer("comments_count");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", (table) => {
    table.dropColumns("likes_count", "avg_rating", "comments_count");
  });
};
