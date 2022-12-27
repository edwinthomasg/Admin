const { execFile } = require("child_process")
const path = require("path")

const discardChanges = (source) => {
    execFile(`${path.dirname(__dirname)}/executables/discard.sh`, [source], (err, stdout, stderr) => {
        if(err) throw err
        if(stderr) console.log("std err : ",stderr)
        console.log("discard output : ",stdout) 
    })
}

module.exports = discardChanges