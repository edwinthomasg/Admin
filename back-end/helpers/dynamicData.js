const { execFile } = require("child_process")
const path = require("path")
 
const createDynamicData = () => {
    return new Promise((resolve, reject) => {
       setImmediate(() => {
        execFile(`${path.dirname(__dirname)}/executables/utilities.sh`, (err, stdout, stderr) => {
            if(err) {
                console.log("dynamic error : ",err)
                reject(err)
            }
            if(stderr) console.log("std err : ",stderr)
            console.log("dynamic data creation output : ",stdout) 
        })
        resolve("success")
       })
    })
}

const generateData = () => {
    return new Promise(async(resolve, reject) => {
        const response = await createDynamicData()
        resolve(response)
    }) 
}

module.exports = generateData