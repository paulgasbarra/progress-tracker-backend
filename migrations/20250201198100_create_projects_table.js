export function up(knex) {
  return knex.schema.createTable("projects", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("description");
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable("projects");
}
