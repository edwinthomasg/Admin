const { parentPort } = require("worker_threads")
const { execFile } = require("child_process")
const path = require("path")

// RUN GIT PUSH FROM SHELL SCRIPT
const executeShell = (branch) => {
    return new Promise((resolve, reject) => {
        execFile(`${path.dirname(__dirname)}/executables/git.sh`, [branch], (err, stdout, stderr) => {
            if (err) {
                console.log("Command error : ", err);
                reject(err)
            }
            else if(stderr) {
                console.log("Std error : ", stderr);
                resolve(stderr)
            }
            else{
                console.log(`commited successfully : ${stdout}`);
                resolve(stdout)
            } 
          });
    }) 
}

parentPort.on("message", async(data) => {
    await executeShell(data).then(success => {
        parentPort.postMessage(success)
    })
    .catch(failure => {
        throw new Error(failure)
    })
})


