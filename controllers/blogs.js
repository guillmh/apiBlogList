// Importa y crea una nueva instancia de un enrutador de Express.
// Este enrutador nos permite definir rutas para un módulo específico (en este caso, los blogs)
// y mantener nuestro código principal (app.js) más limpio y organizado.
const blogsRouter = require("express").Router();

// Importa el modelo 'Blog' de Mongoose.
// Este objeto nos permitirá interactuar con la colección de 'blogs' en la base de datos
// para realizar operaciones como crear, leer, actualizar o borrar (CRUD).
const Blog = require("../models/blog");

// Define un manejador para las peticiones GET a la ruta raíz del enrutador ('/api/blogs/').
// Esta ruta se utiliza para obtener todos los blogs.
// NOTA: Se podría mejorar usando async/await para un código más legible.
blogsRouter.get("/", (request, response, next) => {
  // Utiliza el método `find` del modelo Blog para buscar todos los documentos en la colección.
  // Un objeto de filtro vacío `{}` significa 'traer todos los documentos'.
  // El método `find` devuelve una promesa.
  Blog.find({}).then((blogs) => {
    // Cuando la promesa se resuelve (la búsqueda es exitosa), se envía la lista de blogs
    // encontrados como una respuesta JSON al cliente.
    response.json(blogs);
  });
});

// Define un manejador para las peticiones POST a la ruta raíz ('/api/blogs/').
// Esta ruta se utiliza para crear un nuevo blog.
blogsRouter.post("/", (request, response, next) => {
  // Crea una nueva instancia (un nuevo documento) del modelo Blog utilizando los datos
  // que vienen en el cuerpo de la petición (`request.body`).
  // El middleware `express.json()` ya ha parseado el JSON entrante.
  const blog = new Blog(request.body);

  // Guarda la nueva instancia del blog en la base de datos. `save()` también devuelve una promesa.
  blog.save().then((result) => {
    // Si el guardado es exitoso, responde con el código de estado 201 (Created), que es el estándar
    // para indicar que un recurso ha sido creado exitosamente.
    // También se envía el blog recién guardado (con el `id` asignado por MongoDB) de vuelta al cliente.
    response.status(201).json(result);
  });
});

// Exporta el enrutador para que pueda ser utilizado en el archivo principal de la aplicación (`app.js`).
module.exports = blogsRouter;
