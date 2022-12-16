const { parentPort, workerData } = require("worker_threads")

let sum = 0;

for (var i = 0; i < workerData; i++) {
  if (i % 20000000 === 0) {
    sum = sum + i;
  }
}
parentPort.postMessage(sum)

