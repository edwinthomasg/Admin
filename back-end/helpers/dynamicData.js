const { execFile } = require("child_process")
const path = require("path")

const generateData = () => {
    execFile(`${path.dirname(__dirname)}/executables/utilities.sh`, (err, stdout, stderr) => {
        if(err) throw err
        if(stderr) console.log("std err : ",stderr)
        console.log("stdout : ",stdout) 
    })
}

module.exports = generateData