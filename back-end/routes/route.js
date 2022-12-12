const registerController = require("../controller/registerController")
const fs = require("fs")

const routes = (server) => {
    server.route({
        method: "GET",
        path: "/",
        handler: (req, res) => {
            return "Server getting started"
        }
    })
    server.route({
        method: "POST",
        path: "/registeration",
        handler: registerController,
        options: {
            payload: {
                parse: true,
                allow: 'multipart/form-data',
                multipart: { output: 'data' },
            }
        }
    })
}

module.exports = routes