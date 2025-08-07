const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");
const usersRouter = require("./controllers/users");

// Mongoose 7 cambiará el valor por defecto de strictQuery a true.
// Se establece en false para prepararse para este cambio y suprimir la advertencia.
mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

// Conexión a la base de datos MongoDB utilizando la URI del archivo de configuración.
mongoose
  .connect(config.MONGODB_URI)
  .then((result) => {
    // Se ejecuta si la promesa de conexión se resuelve (conexión exitosa).
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    // Se ejecuta si la promesa de conexión se rechaza (error en la conexión).
    logger.error("error connecting to MongoDB:", error.message);
  });

// Middleware para permitir peticiones de origen cruzado (Cross-Origin Resource Sharing).
app.use(cors());
// Middleware para parsear los cuerpos de las peticiones entrantes con formato JSON.
// Transforma el JSON en un objeto JavaScript accesible en `request.body`.
app.use(express.json());

// Define el enrutador para las rutas que comienzan con /api/blogs.
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

// Middleware para manejar endpoints desconocidos (rutas no encontradas).
// Se ejecuta si ninguna ruta anterior ha manejado la petición.
app.use(middleware.unknownEndpoint);
// Middleware para manejar errores. Debe ser el último middleware que se carga.
app.use(middleware.errorHandler);

module.exports = app;
