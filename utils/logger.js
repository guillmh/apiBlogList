// Este es un módulo de logger simple que envuelve console.log y console.error.
// Se crea para poder extender fácilmente la funcionalidad de logging en el futuro,
// por ejemplo, para enviar logs a un servicio externo como Sentry o Datadog,
// o para escribir en archivos de log, sin tener que cambiar cada llamada a console.log en el código.

const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

module.exports = { info, error };
