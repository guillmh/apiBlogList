// Importa la librería Mongoose, que facilita la interacción con la base de datos MongoDB.
const mongoose = require("mongoose");

// Define el esquema (la estructura) para los documentos de la colección de blogs.
// Cada blog en la base de datos deberá tener estos campos con sus respectivos tipos de datos.
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

// Configura cómo se deben transformar los documentos de Mongoose cuando se convierten a formato JSON.
// Esto es útil para limpiar y formatear la respuesta de la API antes de enviarla al cliente.
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // Crea una nueva propiedad 'id' en el objeto de respuesta,
    // convirtiendo el '_id' de Mongoose (que es un objeto) a una cadena de texto.
    returnedObject.id = returnedObject._id.toString();
    // Elimina la propiedad original '_id' para evitar redundancia.
    delete returnedObject._id;
    // Elimina la propiedad '__v' (el número de versión interno de Mongoose) del objeto de respuesta.
    delete returnedObject.__v;
  },
});

// Compila el esquema en un modelo llamado 'Blog' y lo exporta.
// Mongoose creará automáticamente una colección llamada 'blogs' (plural y en minúsculas) en MongoDB.
module.exports = mongoose.model("Blog", blogSchema);
