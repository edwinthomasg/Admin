const fs = require("fs");
const { execFile } = require("child_process");
const path = require("path");
const { bufferData, textData, imageData } = require("../constants/constant");

// const gitPush = async(filename) => {
//  await execFile("./git.sh", (err, stdout, stderr) => {
//     if (err) console.log("Command error : ", err);
//     if (stderr) console.log("Error : ", stderr);
//     if (stdout) console.log(`${filename} commited successfully : ${stdout}`);
//   });
// };

const createFile = async(destination, file) => {
    if (bufferData.includes(path.extname(file.filename))) {
        await fs.writeFile(destination, file.payload.toString(), () => {
            console.log(`${file.filename} written successfully`)
        // gitPush(file.filename);
        });
    } else if (file.headers["content-type"] === "application/json") {
        await fs.writeFile(destination, JSON.stringify(file.payload), () => {
            console.log(`${file.filename} written successfully`)
        // gitPush(file.filename);
        });
    } else if (textData.includes(path.extname(file.filename))) {
        await fs.writeFile(destination, file.payload.toString(), () => {
            console.log(`${file.filename} written successfully`)
        // gitPush(file.filename);
        });
    } else if (imageData.includes(path.extname(file.filename))) {
        await fs.writeFile(destination, file.payload, "binary", () => {
            console.log(`${file.filename} written successfully`)
        // gitPush(file.filename);
        });
    }
};

module.exports = createFile;
