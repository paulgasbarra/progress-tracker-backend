exports.up = function (knex) {
  return knex.schema.createTable("projects", function (table) {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.text("description");
    table.integer("created_by").unsigned().references("id").inTable("admins");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("projects");
};
