const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and Password most be provided!",
    });
  }
  if (users.username === username) {
    return res
      .status(400)
      .json({ success: false, message: "User already exist. Please login!" });
  }
  users[username] = {
    username,
    password,
  };

  res
    .status(200)
    .json({ success: true, message: `User created with username ${username}` });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  return await res.status(200).json({ success: true, data: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  return await res.status(200).json({ success: true, data: books[isbn] });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  let Book = null;
  // Using Object.entries and forEach
  await Object.entries(books).forEach(([id, book]) => {
    if (book.author === req.params.author) {
      Book = book;
    }
  });
  return res.status(200).json({ success: true, data: Book });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let Book = null;
  // Using Object.entries and forEach
  Object.entries(books).forEach(([id, book]) => {
    if (book.title === req.params.title) {
      Book = book;
    }
  });
  return res.status(200).json({ success: true, data: Book });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const reviews = books[req.params.isbn].reviews;
  return res.status(200).json({ success: true, data: reviews });
});

module.exports.general = public_users;

