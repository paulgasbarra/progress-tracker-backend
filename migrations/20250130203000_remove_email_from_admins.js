exports.up = function (knex) {
  return knex.schema.table("admins", function (table) {
    table.dropColumn("email");
  });
};

exports.down = function (knex) {
  return knex.schema.table("admins", function (table) {
    table.text("email").unique();
  });
};
