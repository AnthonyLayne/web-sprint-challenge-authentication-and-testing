const db = require("../../data/dbConfig");

function findByUsername(username) {
  return db("users").select("username as u").where("u", username);
}

function findById(id) {
  return db("users").where({ id }).first();
}

async function addUser(user) {
  const [id] = await db("users").insert(user);
  return findById(id);
}

module.exports = { addUser, findByUsername, findById };
