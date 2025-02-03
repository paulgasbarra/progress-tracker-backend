exports.up = function (knex) {
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
};

exports.down = function (knex) {
  return knex.schema.dropTable("project_milestones");
};
