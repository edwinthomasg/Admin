const { execFile } = require("child_process")
const path = require("path")

const generateData = () => {
    console.log("generate data...")
    execFile(`${path.dirname(__dirname)}/executables/utilities.sh`, (err, stdout, stderr) => {
        if(err) {
            console.log("dynamic error : ",err)
            throw err
        }
        if(stderr) console.log("std err : ",stderr)
        console.log("stdout : ",stdout) 
    })
}

module.exports = generateData