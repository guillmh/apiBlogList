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

afterAll(async () => {
  await mongoose.connection.close();
});
