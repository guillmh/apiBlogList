const { info, error } = require("./logger");

// Middleware para registrar información sobre cada petición que llega al servidor.
// Es útil para depurar y ver qué peticiones se están realizando.
const requestLogger = (request, response, next) => {
  info("Method:", request.method);
  info("Path:  ", request.path);
  info("Body:  ", request.body);
  info("---");
  // Llama a next() para pasar el control al siguiente middleware en la cadena.
  next();
};

// Middleware para manejar peticiones a rutas no definidas.
// Si ninguna ruta coincide, esta será la respuesta.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Middleware manejador de errores. Debe tener 4 argumentos (error, request, response, next).
// Express lo reconoce como un manejador de errores especial.
const errorHandler = (err, request, response, next) => {
  // El primer parámetro se renombra a 'err' para evitar el conflicto de nombres (shadowing)
  // con la función 'error' importada del logger. Esta es una convención común en Express.
  error(err.message);

  // Si el error es un CastError de Mongoose (ej. un ID con formato incorrecto),
  // responde con un código de estado 400 Bad Request.
  if (err.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  // Si el error es un ValidationError de Mongoose (ej. campos requeridos que faltan),
  // responde con un código de estado 400 y el mensaje de error.
  else if (err.name === "ValidationError") {
    return response.status(400).json({ error: err.message });
  }

  // Para cualquier otro tipo de error, pasa el error al siguiente middleware de errores.
  // Si no hay más, Express usará su manejador de errores por defecto.
  next(err);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
