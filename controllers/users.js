const bcryptjs = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

//Obtiene todos los recursos users
usersRouter.get("/", async (req, res, next) => {
  try {
    const Users = await User.find({}).populate("blogs", {
      title: 1,
      url: 1,
      likes: 1,
    });
    if (!Users) {
      return res.status(404).json({ error: "uknow endpoint" });
    }
    res.json(Users);
  } catch (error) {
    next(error);
  }
});

//obten un solo recurso por ID
usersRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

//Crea un usuario y encripta la contrasena
usersRouter.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (!password || password.length < 3) {
      return res.status(400).json({
        error: "The password is mandatory and must have at least 3 characters",
      });
    }
    if (!username || username.length < 3) {
      return res.status(400).json({
        error: "The username is mandatory and must have at least 3 characters",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
