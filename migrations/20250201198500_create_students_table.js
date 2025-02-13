export function up(knex) {
  return knex.schema.createTable("students", function (table) {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.text("email").unique().notNullable();
    table.text("github_profile").notNullable();
    table.binary("password_hash").notNullable();
    table.text("initial_password");
    table.integer("created_by").unsigned().references("id").inTable("admins");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("students");
}
