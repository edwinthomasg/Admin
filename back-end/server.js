"use strict";

const hapi = require("@hapi/hapi");
const routes = require("./routes/route");
const { execFile, spawn, exec } = require("child_process");
require("dotenv").config();

const establishServer = async () => {
  const server = hapi.server({
    port: process.env.PORT_NUMBER,
    host: "localhost",
    routes: {
      cors: true,
    },
  });

  await server.start();
  console.log(`server running (success) ${server.info.uri}`);
  routes(server);

};

establishServer();
