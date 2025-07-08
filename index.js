// Importa la aplicación Express desde app.js
const app = require("./app");
// Importa la configuración, como el puerto y la URI de MongoDB
const config = require("./utils/config");
// Importa el logger personalizado
const logger = require("./utils/logger");

// Inicia el servidor para que escuche las peticiones en el puerto definido en la configuración
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
