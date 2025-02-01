exports.up = function (knex) {
  return knex.schema.table("projects", function (table) {
    table.dropColumn("email");
    table.dropColumn("password_hash");
    table.dropColumn("initial_password");
  });
};

exports.down = function (knex) {
  return knex.schema.table("projects", function (table) {
    table.text("email").unique();
    table.binary("password_hash");
    table.text("initial_password");
  });
};
