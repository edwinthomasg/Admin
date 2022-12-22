const {execFile} = require("child_process")
const path = require("path")

const runHugoSite = (source) => {
    console.log("came inside ")
    return new Promise((resolve, reject) => {
        execFile(`${path.dirname(__dirname)}/executables/site.sh`, [source], (err, stdout, stderr) => {
            if(err) reject(err)
            if(stderr) console.log("Hugo site : ",stderr)
            console.log("Hugo output : ",stdout)
            resolve("success")
        })
    })
}
const showSitePreview = (source) => {
    console.log("shos site preview")
    return new Promise(async(resolve, reject) => {
        const response = await runHugoSite(source)
        console.log("end promise : ",response)
        resolve(response)
    })
}

module.exports = showSitePreview