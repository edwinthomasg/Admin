const {execFile} = require("child_process")
const createFeatureBranch = require("../helpers/branch")
const path = require("path")

// CREATE BRANCH FROM SHELL SCRIPT
const switchBranch = (branch, source) => {
    branch = branch === "Master" ? "Master" : createFeatureBranch()
    execFile(`${path.dirname(__dirname)}/executables/switch.sh`,[branch, source], (err, stdout, stderr) => {
        if(err) console.log(err)
        if(stderr) console.log(stderr)
        console.log("stdout : ",stdout)
    })
    return branch
}

module.exports = switchBranch