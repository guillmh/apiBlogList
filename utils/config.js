// Carga las variables de entorno desde un archivo .env al objeto process.env de Node.
require("dotenv").config();

// Extrae el puerto del servidor de las variables de entorno.
const PORT = process.env.PORT;
// Extrae la URI de conexión de MongoDB de las variables de entorno.
const MONGODB_URI = process.env.MONGODB_URI;

// Exporta las variables para que puedan ser utilizadas en otras partes de la aplicación.
module.exports = { MONGODB_URI, PORT };
