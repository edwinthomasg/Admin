// const validate = require("../validation/validation");
const path = require("path");
const os = require("os");
const createFile = require("../helpers/fileTask");
const createFeatureBranch = require("../helpers/branch");
const { hugoContentSource } = require("../constants/constant");
const getDirectories = require("../helpers/directory");
const gitPromise = require("../helpers/gitPromise");


const uploadController = (req, res) => {
  const { directory, files } = req.payload;
  try {
    if (files.length >= 2) {
      files.map((file) => {
        const destination =
          directory !== "root"
            ? path.join(
                os.homedir(),
                process.env.HUGO_SOURCE,
                directory,
                file.filename
              )
            : path.join(os.homedir(), process.env.HUGO_SOURCE, file.filename);

        createFile(destination, file);
      });
    } else {
      const destination =
        directory !== "root"
          ? path.join(
              os.homedir(),
              process.env.HUGO_SOURCE,
              directory,
              files.filename
            )
          : path.join(os.homedir(), process.env.HUGO_SOURCE, files.filename);
      createFile(destination, files);
    }
    return res.response("success").code(200);
  } catch (err) {
    return res.response(`Bad request : ${err}`).code(400);
  }
};

const gitPushController = async (req, res) => {
  try {
    let branch =
      req.payload.branch === "Master" ? "Master" : createFeatureBranch();
    await gitPromise(branch); //changes
    return res.response("success").code(200);
  } catch (err) {
    console.log(err);
    return res.response("server error").code(500);
  }
};

const directoryController = async (req, res) => {
  try {
    const dirName = path.join(os.homedir(), hugoContentSource);
    const directories = await getDirectories(dirName);
    return directories;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  uploadController,
  gitPushController,
  directoryController,
};

// process.on('uncaughtException',(err) => console.log("error : ",err))

// git remote set-url origin https://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@github.com/edwinthomasg/hugo-project.git