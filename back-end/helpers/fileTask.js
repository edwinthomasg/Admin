const fs = require("fs")
const { execFile } = require("child_process")

const createFile = (destination, file, type) => {
    if(type === "string")
    {
        fs.writeFile(destination, file.payload.toString(), () => {
            execFile("./git.sh", (err, stdout, stderr) => {
                if (err)
                console.log("Command error : ",err);
                if (stderr)
                console.log("Error : ",stderr);
                if (stdout) 
                console.log("commited successfully : ",stdout);
            })
        })
    }
    else if(type === "object")
    {
        fs.writeFile(destination, JSON.stringify(file.payload), () => {
            execFile("./git.sh", (err, stdout, stderr) => {
                if (err)
                console.log("Command error : ",err);
                if (stderr)
                console.log("Error : ",stderr);
                if (stdout) 
                console.log("commited successfully : ",stdout);
            })
        })
    }
}


module.exports = createFile