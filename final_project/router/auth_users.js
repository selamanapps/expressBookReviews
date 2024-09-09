const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = process.env.SECRET_KEY || "strong-secret-key";

const isValid = (username) => {};

function generateToken(user) {
  return jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" });
}

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(users, username, password);
  if (users[username] && users[username].password === password) {
    req.session.user = { username };
    const token = generateToken({ username });
    res.status(200).json({ success: true, message: "Login successful", token });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
      username,
      password,
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const reviewBody = req.query.review;
  const isbn = req.params.isbn;
  if (!username) {
    return res
      .status(401)
      .json({ success: false, message: "unauthorized user!" });
  }
  const book = books[isbn];
  book[isbn] = {
    ...book,
    reviews: {
      ...book.reviews,
      [username]: reviewBody,
    },
  };
  return res
    .status(201)
    .json({ success: true, message: "Review added successfully!" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;
  if (!username) {
    return res
      .status(401)
      .json({ success: false, message: "unauthorized user!" });
  }
  delete books[isbn].reviews[username];

  return res
    .status(200)
    .json({ success: true, message: "Review removed successfully!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

