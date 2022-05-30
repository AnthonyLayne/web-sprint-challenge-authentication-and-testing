const db = require("../../data/dbConfig");

function findByUsername(username) {
  return db("users").where("username", username).first();
}
function findById(id) {
  return db("users").where("id", id).first();
}

async function addUser({ username, password }) {
  const [id] = await db("users").insert({ username, password });
  return findById(id);
}

module.exports = { addUser, findByUsername, findById };
