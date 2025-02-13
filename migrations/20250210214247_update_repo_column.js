export function up(knex) {
  return knex.schema.table("reports", (table) => {
    table.dropColumn("repo_id"); // Remove the repoId column
    table.string("repo_url"); // Add the repoUrl column as a string
  });
}

export function down(knex) {
  return knex.schema.table("reports", (table) => {
    table.integer("repo_id"); // Re-add the repoId column as an integer
    table.dropColumn("repo_url"); // Remove the repoUrl column
  });
}
