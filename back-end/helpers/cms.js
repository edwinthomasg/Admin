const { execFile } = require("child_process")
const path = require("path")
const os = require("os")

// RUN FRONT-END APPLICATION FROM SHELL SCRIPT
const runApplication = (source) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            execFile(`${path.dirname(__dirname)}/executables/react.sh`, [source], (err, stdout, stderr) => {
                if(err) throw err
                if(stderr) console.log("std err : ",stderr)
                console.log("stdout : ",stdout)
            })
            resolve("cms running")
        })
    })
}
const startCms = () => {
    return new Promise(async(resolve, reject) => {
        const response = await runApplication(path.join(os.homedir(), process.env.CMS_SOURCE))
        resolve(response)
    })
}

module.exports = startCms