const { directoryController, uploadController, gitPushController } = require("../controller/controller")

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
        handler: uploadController,
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
    server.route({
        method: "GET",
        path: "/directories",
        handler: directoryController
    })
}

module.exports = routes