"use strict";

const hapi = require("@hapi/hapi");
const generateData = require("./helpers/dynamicData");
const routes = require("./routes/route");
require("dotenv").config();

const establishServer = async () => {
  const server = hapi.server({
    port: process.env.PORT_NUMBER,
    host: "localhost",
    routes: {
      cors: true,
    },
  });
  const io = require("socket.io")(server.listener,{
    cors: {
      origin: "http://localhost:3000"
    }
  })
  io.on("connection", (socket) => {
    socket.on("online", (data) => {
      console.log("from client : ",data)
    })
    socket.on("gitPublish", (data) => {
      io.to(socket.id).emit("notification", "your last commit has been succesfully done !!!")
    })
    socket.on("contentAdd", (data) => {
      io.to(socket.id).emit("dynamic", "hugo content has been added successfully")
    })
  })
  await server.start();
  console.log(`server running (success) ${server.info.uri}`);
  routes(server);
  await generateData()
};

establishServer();

