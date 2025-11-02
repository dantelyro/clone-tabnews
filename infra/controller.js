import { MethodNotAllowedError, InternalServerError } from "infra/errors";

function onErrorHandler(error, request, response) {
  const publicErrorOject = new InternalServerError({
    cause: error,
  });

  console.log("Error no next-connect:", error);
  console.error(publicErrorOject);
  response.status(publicErrorOject.statusCode).json(publicErrorOject);
}

function onNoMatchHandler(request, response) {
  const error = new MethodNotAllowedError();
  response.status(error.statusCode).json(error);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
