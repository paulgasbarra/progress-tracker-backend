export function up(knex) {
  return knex.schema.createTable("criteria", function (table) {
    table.increments("id").primary();
    table.string("title").notNullable();
    table
      .integer("milestone_id")
      .unsigned()
      .references("id")
      .inTable("milestones")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("criteria");
}
