module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "paulgasbarra",
      password: "password",
      database: "progress_tracker",
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
