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
blogsRouter.get("/", async (request, response, next) => {
  // Utiliza el método `find` del modelo Blog para buscar todos los documentos en la colección.
  // Un objeto de filtro vacío `{}` significa 'traer todos los documentos'.
  // El método `find` devuelve una promesa.
  const blogs = await Blog.find({});
  response.json(blogs);
});

// Define un manejador para las peticiones POST a la ruta raíz ('/api/blogs/').
// Esta ruta se utiliza para crear un nuevo blog.
blogsRouter.post("/", async (request, response, next) => {
  try {
    const blog = new Blog(request.body);
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error); // Deja que el middleware de manejo de errores lo procese
  }
});

// Exporta el enrutador para que pueda ser utilizado en el archivo principal de la aplicación (`app.js`).
module.exports = blogsRouter;
