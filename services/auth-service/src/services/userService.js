const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(__dirname, "../../data");
const usersFile = path.join(dataDirectory, "users.json");

function ensureUsersFileExists() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  }
}

function readUsers() {
  ensureUsersFileExists();

  const fileContents = fs.readFileSync(usersFile, "utf-8");

  try {
    return JSON.parse(fileContents);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  ensureUsersFileExists();

  fs.writeFileSync(
    usersFile,
    JSON.stringify(users, null, 2)
  );
}

function findUserByEmail(email) {
  const users = readUsers();

  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

function findUserById(userId) {
  const users = readUsers();

  return users.find((user) => user.id === userId);
}

function createUser({ name, email, passwordHash }) {
  const users = readUsers();

  const newUser = {
    id:
      users.length === 0
        ? 1
        : Math.max(...users.map((user) => user.id)) + 1,
    name,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  return newUser;
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};