const { Worker } = require("worker_threads")

// FORK WORKER THREAD TO EXECUTE GIT PUSH
const gitWorkFlow = (branch) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./helpers/gitWorker.js")
        worker.postMessage(branch)
        worker.on("message", resolve)
        worker.on("error", (err) => {
            console.log(err)
        })
        worker.on("exit", (code) => {
            console.log(`exited with code : ${code}`)
        })
    })
}

module.exports = gitWorkFlow