const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    process.stdout.write("\n 🟢Postgres esta pronto e aceitando conexões");
  }
}

process.stdout.write("\n 🔴Esperando o Postgres aceitar conexões");
checkPostgres();
