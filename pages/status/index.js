import useSWR from "swr";

export async function fetchStatus() {
  const response = await fetch("/api/v1/status");
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <div>
      <h1>Status</h1>
      <UpdatedAt />
    </div>
  );
}

function UpdatedAt() {
  const { data } = useSWR("status", fetchStatus, {
    refreshInterval: 2000,
  });

  return (
    <>
      <div>
        Ultima Atualização:{" "}
        {data?.updated_at
          ? new Date(data.updated_at).toLocaleString("pt-BR")
          : "Carregando..."}
      </div>
      <h2>Detalhes do Banco</h2>
      <div>
        Banco de Dados Versão:{" "}
        {data?.dependencies.database.version ?? "Carregando..."}
      </div>
      <div>
        Conexões Atuais:{" "}
        {data?.dependencies.database.connections ?? "Carregando..."} /{" "}
        {data?.dependencies.database.max_connections ?? "Carregando..."}
      </div>
    </>
  );
}
