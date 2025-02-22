const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { restricted, validateAuth } = require("./middleware/restricted.js");

const authRouter = require("./auth/auth-router.js");
const jokesRouter = require("./jokes/jokes-router.js");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", validateAuth, authRouter);
server.use("/api/jokes", restricted, jokesRouter); // only logged-in users should have access!

server.use((err, req, res) => {
  return res.status(500).json({
    message: "error, catch all",
    stack: err.stack,
  });
});

module.exports = server;
