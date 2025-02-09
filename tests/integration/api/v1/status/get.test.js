import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous User", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");

      const responseBody = await response.json();
      const parsedDate = new Date(responseBody.updated_at).toISOString();

      const database = responseBody.dependencies.database;
      expect(response.status).toBe(200);
      expect(responseBody.updated_at).toEqual(parsedDate);
      expect(database.max_connections).toBeGreaterThan(0);
      expect(database.connections).toEqual(1);
      expect(database.version).toEqual("16.6");
    });
  });
});
