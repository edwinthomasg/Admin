const {execFile} = require("child_process")
const path = require("path")

const runHugoSite = (source) => {
    return new Promise((resolve, reject) => {
            setImmediate(() => {
                execFile(`${path.dirname(__dirname)}/executables/site.sh`, [source], (err, stdout, stderr) => {
                    if(err) reject(err)
                    if(stderr) console.log("Hugo site : ",stderr)
                    console.log("Hugo output : ",stdout)
                })
                resolve("ok")
            })
    })
}
const showSitePreview = (source) => {
    return new Promise(async(resolve, reject) => {
        const response = await runHugoSite(source)
        resolve(response)
    })
}

module.exports = showSitePreview