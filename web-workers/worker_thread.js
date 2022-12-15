const { Worker } = require("worker_threads");

new Promise((resolve, reject) => {
    console.time()
    const worker = new Worker("./task.js");
    worker.on("message",resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      console.log(`Exited with code ${code}`);
      reject(new Error(`stopped due to error code : ${code}`))
    });    
})
.then(data => {
    console.log("OUTPUT : ",data)
    console.timeEnd()
})
.catch(err => {
    console.log("ERROR : ",err)
    console.timeEnd()
})