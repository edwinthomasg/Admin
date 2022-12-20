const { Worker } = require("worker_threads")

const gitPromise = (branch) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./helpers/gitWorker.js")
        worker.postMessage(branch)
        worker.on("message", (data) => {
            console.log(data)
        })
    })
}

module.exports = gitPromise