import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1) 
        Limit
          1
        ;`,
      values: [username],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O usuario informado não foi encontrado no sistema",
        action: "Verifique se o username esta digitado corretamente",
      });
    }

    return result.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueUser(userInputValues.email, userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueUser(email, username) {
    const result = await database.query({
      text: `
        SELECT
          email, username
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1) OR
          LOWER(username) = LOWER($2)
        ;`,
      values: [email, username],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message:
          "Não foi permitido realizar o cadastro, dados invalidos ou em uso",
        action: "Verifique seus dados e tente novamente",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
        INSERT INTO users 
          (username, email, password)
        VALUES 
          ($1, $2, $3)
        RETURNING 
          *
        ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
}

const user = {
  create,
  findOneByUsername
};

export default user;
