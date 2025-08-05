// Enrutador de Express para blogs
const blogsRouter = require("express").Router();

// Modelo Blog de Mongoose
const Blog = require("../models/blog");

// Obtener todos los blogs
blogsRouter.get("/", async (req, res, next) => {
  // Utiliza el método `find` del modelo Blog para buscar todos los documentos en la colección.
  // Un objeto de filtro vacío `{}` significa 'traer todos los documentos'.
  // El método `find` devuelve una promesa.
  const blogs = await Blog.find({});
  res.json(blogs);
});

//obtner un solo recurso por ID
blogsRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    next(error);
  }
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
blogsRouter.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  const dataBody = req.body;
  try {
    const update = await Blog.findByIdAndUpdate(id, dataBody, {
      new: true,
      runValidators: true,
    });
    if (!update) {
      return res.status(404).json({ error: "blog not found" });
    }
    res.json(update);
  } catch (error) {
    next(error);
  }
});

// Exportar enrutador
module.exports = blogsRouter;
