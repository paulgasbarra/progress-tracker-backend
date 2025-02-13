export function up(knex) {
  return knex.schema.createTable("admins", function (table) {
    table.increments("id").primary();
    table.text("email").unique().notNullable();
    table.binary("password_hash").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("admins");
}
