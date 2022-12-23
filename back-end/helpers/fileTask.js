const fs = require("fs");
const path = require("path");
const { bufferData, textData, imageData } = require("../constants/constant");

const createFile = async(destination, file) => {
    if (bufferData.includes(path.extname(file.filename))) {
        await fs.writeFile(destination, file.payload.toString(), () => {
            console.log(`${file.filename} written successfully`)
        });
    } else if (file.headers["content-type"] === "application/json") {
        await fs.writeFile(destination, JSON.stringify(file.payload), () => {
            console.log(`${file.filename} written successfully`)
        });
    } else if (textData.includes(path.extname(file.filename))) {
        await fs.writeFile(destination, file.payload, () => {
            console.log(`${file.filename} written successfully`)
        });
    } else if (imageData.includes(path.extname(file.filename))) {
        await fs.writeFile(destination, file.payload, "binary", () => {
            console.log(`${file.filename} written successfully`)
        });
    }
};

const deleteFile = () => {
    // fs.readdir()
}
module.exports = createFile
