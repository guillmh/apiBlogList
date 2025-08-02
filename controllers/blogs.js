// Enrutador de Express para blogs
const blogsRouter = require("express").Router();

// Modelo Blog de Mongoose
const Blog = require("../models/blog");

// Obtener todos los blogs
blogsRouter.get("/", async (requ, res, next) => {
  // Utiliza el método `find` del modelo Blog para buscar todos los documentos en la colección.
  // Un objeto de filtro vacío `{}` significa 'traer todos los documentos'.
  // El método `find` devuelve una promesa.
  const blogs = await Blog.find({});
  res.json(blogs);
});

// Crear un nuevo blog
blogsRouter.post("/", async (req, res, next) => {
  try {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    next(error); // Deja que el middleware de manejo de errores lo procese
  }
});

//Elimina un recurso por ID
blogsRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const blogDelete = await Blog.findByIdAndDelete(id);
    if (!blogDelete) {
      return res.status(404).json({ error: "blog not found" });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

//Actualiza un recurso por ID

// Exportar enrutador
module.exports = blogsRouter;
