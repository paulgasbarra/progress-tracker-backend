export function up(knex) {
  return knex.schema.createTable("milestones", function (table) {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description");
    table
      .integer("project_id")
      .unsigned()
      .references("id")
      .inTable("projects")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("milestones");
}
