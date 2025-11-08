let users = [];

function isValid(username) {
  return users.some(u => u.username === username);
}

function authenticatedUser(username, password) {
  return users.some(u => u.username === username && u.password === password);
}

module.exports = { users, isValid, authenticatedUser };
