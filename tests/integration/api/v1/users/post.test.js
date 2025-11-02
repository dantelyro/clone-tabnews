import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous User", () => {
    test("With unique and valide data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "unique_username",
          email: "unique_email@example.com",
          password: "hashed_password",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(201);

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "unique_username",
        email: "unique_email@example.com",
        password: "hashed_password",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("Duplicated Email", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailDuplicado1",
          email: "duplicado@example.com",
          password: "hashed_password",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailDuplicado2",
          email: "DUPLICADO@example.com",
          password: "hashed_password",
        }),
      });

      const responseBody2 = await response2.json();

      expect(response2.status).toBe(400);

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message:
          "Não foi permitido realizar o cadastro, dados invalidos ou em uso",
        action: "Verifique seus dados e tente novamente",
        status_code: 400,
      });
    });

    test("Duplicated Username", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usuarioDuplicado",
          email: "duplicado1@example.com",
          password: "hashed_password",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "USUARIODUPLICADO",
          email: "Duplicado2@example.com",
          password: "hashed_password",
        }),
      });

      const responseBody2 = await response2.json();

      expect(response2.status).toBe(400);

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message:
          "Não foi permitido realizar o cadastro, dados invalidos ou em uso",
        action: "Verifique seus dados e tente novamente",
        status_code: 400,
      });
    });
  });
});
