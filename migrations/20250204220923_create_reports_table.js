export function up(knex) {
  return knex.schema.createTable("reports", function (table) {
    table.increments("id").primary();
    table
      .integer("milestone_id")
      .unsigned()
      .references("id")
      .inTable("milestones")
      .onDelete("CASCADE");
    table.integer("repo_id").unsigned(); // Assuming repo_id is an integer
    table.text("evaluation");
    table.timestamp("creation_date").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("reports");
}
