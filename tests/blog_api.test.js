const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcryptjs = require("bcryptjs");
const helper = require("../utils/test_helper");

const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Blog 1",
    author: "Autor 1",
    url: "http://blog1.com",
    likes: 5,
  },
  {
    title: "Blog 2",
    author: "Autor 2",
    url: "http://blog2.com",
    likes: 3,
  },
];
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

//Prueba 1
test("notes are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});
//Prueba 2
test("Check that the blog identifier is called id", async () => {
  const response = await api.get("/api/blogs");

  const blog = response.body[0];
  expect(blog.id).toBeDefined();
});
//prueba 3
test("successfully create a new blog post and check that the total number of blogs", async () => {
  const response = await api.get("/api/blogs");
  const totalBlogs = response.body.length;
  const data = {
    title: "Blog 1",
    author: "Autor 1",
    url: "http://blog1.com",
    likes: 5,
  };
  const postBlog = await api.post("/api/blogs").send(data);
  const newResponse = await api.get("/api/blogs");
  const newTotal = newResponse.body.length;

  expect(newTotal).toBe(totalBlogs + 1);
  expect(postBlog.status).toBe(201);
});
//prueba 4
test("Check that if the likes property, it will have the default value 0", async () => {
  const blogWithoutLikes = {
    title: "Blog sin likes",
    author: "Autor X",
    url: "http://ejemplo.com",
  };

  const sendBlog = await api.post("/api/blogs").send(blogWithoutLikes);
  expect(sendBlog.status).toBe(201);
  expect(sendBlog.body.likes).toBe(0);
});
//Prueba 5
test("Checks if the title or url properties of the requested data are missing", async () => {
  const newBlog = {
    author: "Autor 1",
    likes: 5,
  };

  const senRes = await api.post("/api/blogs").send(newBlog);
  expect(senRes.status).toBe(400);
});

//Pruebas para usuarios
describe("user testing", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcryptjs.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });
  //prueba 1
  test("creation succeeds with a new username", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "AlexaSt",
      name: "Alexa Martinez",
      password: "draco123",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    // Verifica que haya un usuario más que antes
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    // Verifica que el nombre de usuario nuevo esté en la base de datos
    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
  //prueba 2
  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "datasu",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });
  //prueba 3
  test("the username has less than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ag",
      name: "Agusto",
      password: "data2",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  //prueba 4 password corto o noseguro
});

afterAll(async () => {
  await mongoose.connection.close();
});
