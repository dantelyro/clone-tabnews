import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseMaxConnections = await database.query("show max_connections;");
  const maxConnections = databaseMaxConnections.rows[0].max_connections;

  const databaseVersion = await database.query("show server_version;");
  const version = databaseVersion.rows[0].server_version;

  const dataBaseName = process.env.POSTGRES_DB;
  const databaseConnections = await database.query({
    text: "select count(*)::Int from pg_stat_activity where datname = $1;",
    values: [dataBaseName],
  });
  const connections = databaseConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: version,
        connections: connections,
        max_connections: parseInt(maxConnections),
      },
    },
  });
}

export default status;
