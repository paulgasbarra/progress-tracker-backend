export function up(knex) {
  return knex.schema.createTable("checkpoints", function (table) {
    table.increments("id").primary();
    table
      .integer("criteria_id")
      .unsigned()
      .references("id")
      .inTable("criteria")
      .onDelete("CASCADE");
    table
      .integer("report_id")
      .unsigned()
      .references("id")
      .inTable("reports")
      .onDelete("CASCADE");
    table.boolean("pass");
  });
}

export function down(knex) {
  return knex.schema.dropTable("checkpoints");
}
