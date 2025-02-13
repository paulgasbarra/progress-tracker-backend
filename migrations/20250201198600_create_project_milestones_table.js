export function up(knex) {
  return knex.schema.createTable("project_milestones", function (table) {
    table.increments("id").primary();
    table
      .integer("project_id")
      .unsigned()
      .references("id")
      .inTable("projects")
      .onDelete("CASCADE");
    table
      .integer("milestone_id")
      .unsigned()
      .references("id")
      .inTable("milestones")
      .onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTable("project_milestones");
}
