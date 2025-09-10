// Enrutador de Express para blogs
const blogsRouter = require("express").Router();
// Modelo Blog de Mongoose
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//aisla el token
const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

// Obtener todos los blogs
blogsRouter.get("/", async (req, res, next) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
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
  const body = req.body;

  try {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id,
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
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
