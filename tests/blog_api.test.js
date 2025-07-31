const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const Blog = require("../models/blog");

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

afterAll(async () => {
  await mongoose.connection.close();
});
