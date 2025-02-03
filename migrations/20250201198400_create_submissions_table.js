exports.up = function (knex) {
  return knex.schema.createTable("submissions", function (table) {
    table.increments("id").primary();
    table.text("student_name").notNullable();
    table.text("repo_link").notNullable();
    table.text("accomplishments");
    table.text("reflection");
    table
      .integer("milestone_id")
      .unsigned()
      .references("id")
      .inTable("milestones");
    table.integer("submitted_by").unsigned().references("id").inTable("admins");
    table.jsonb("ai_analysis");
    table.timestamp("submission_date").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("submissions");
};
