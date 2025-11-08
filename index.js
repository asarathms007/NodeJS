const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const books = require('./books');
const { users, isValid, authenticatedUser } = require('./users');

const app = express();
app.use(bodyParser.json());

// Secret key for JWT
const SECRET = "bookstore-secret";

// ---------- TASK 1: Get all books ----------
app.get('/books', (req, res) => {
  res.send(books);
});

// ---------- TASK 2: Get book by ISBN ----------
app.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn] ? books[isbn] : { error: "Book not found" });
});

// ---------- TASK 3: Get books by Author ----------
app.get('/books/author/:author', (req, res) => {
  const author = req.params.author;
  const result = Object.values(books).filter(b => b.author === author);
  res.send(result);
});

// ---------- TASK 4: Get books by Title ----------
app.get('/books/title/:title', (req, res) => {
  const title = req.params.title;
  const result = Object.values(books).filter(b => b.title === title);
  res.send(result);
});

// ---------- TASK 5: Get Book Review ----------
app.get('/books/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn]?.reviews || { error: "No review found" });
});

// ---------- TASK 6: Register New User ----------
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username)) {
    users.push({ username, password });
    res.send("User registered successfully");
  } else {
    res.status(400).send("User already exists");
  }
});

// ---------- TASK 7: Login ----------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    let token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    res.send({ message: "Login successful", token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// ---------- TASK 8: Add/Modify Review ----------
app.put('/auth/review/:isbn', (req, res) => {
  const { username, review } = req.body;
  const isbn = req.params.isbn;
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    res.send("Review added/modified successfully");
  } else {
    res.status(404).send("Book not found");
  }
});

// ---------- TASK 9: Delete Review ----------
app.delete('/auth/review/:isbn', (req, res) => {
  const { username } = req.body;
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    res.send("Review deleted successfully");
  } else {
    res.status(404).send("Review not found");
  }
});

// ---------- TASK 10–13: Async, Callback, Promises ----------
function getBooks() {
  return new Promise(resolve => setTimeout(() => resolve(books), 1000));
}

// Task 10: Async/Await Example
app.get('/async/books', async (req, res) => {
  const allBooks = await getBooks();
  res.send(allBooks);
});

// Task 10: Callback Example
app.get('/callback/books', (req, res) => {
  setTimeout(() => res.send(books), 1000);
});

// Task 11–13 can reuse similar logic with Promise and Callback

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
