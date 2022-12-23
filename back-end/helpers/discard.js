const { execFile } = require("child_process")
const path = require("path")

const discardChanges = (source) => {
    console.log(source)
    execFile(`${path.dirname(__dirname)}/executables/discard.sh`, [source], (err, stdout, stderr) => {
        if(err) throw err
        if(stderr) console.log("std err : ",stderr)
        console.log("stdout : ",stdout) 
    })
}

module.exports = discardChanges