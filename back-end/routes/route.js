
const fs = require("fs")
const { registerController, gitPushController } = require("../controller/registerController")

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
                multipart: { 
                    output: 'annotated' 
                },
            }
        }
    })
    server.route({
        method: "POST",
        path: "/git-push",
        handler: gitPushController
    })
}

module.exports = routes