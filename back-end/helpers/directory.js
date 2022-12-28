const { readdir } = require("fs").promises;

// GET ALL THE SECTION NAMES FROM HUGO CONTENT FOLDER
const getDirectories = (dirName) => {
  return new Promise(async (resolve, reject) => {
    const files = await readdir(dirName, { withFileTypes: true });
    let directories = ["root"];
    for (let file of files) 
      if (file.isDirectory()) 
            directories.push(file.name); 
    resolve(directories);
  });
};

module.exports = getDirectories;
