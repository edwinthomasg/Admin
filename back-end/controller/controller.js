const path = require("path");
const os = require("os");
const createFile = require("../helpers/fileTask");
const createFeatureBranch = require("../helpers/branch");
const { hugoContentSource } = require("../constants/constant");
const getDirectories = require("../helpers/directory");
const gitWorkFlow = require("../helpers/gitWorkFlow");
const switchBranch = require("../helpers/switchBranch");
const showSitePreview = require("../helpers/siteDemo");

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
      req.payload.branch === "Master" ? "main" : req.payload.branch;
      console.log("publish branch : ",branch)
    await gitWorkFlow(branch); //changes
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

const gitBranchController = (req, res) => {
  console.log(req.payload)
  let {branch} = req.payload
  const currentBranch = switchBranch(branch, path.join(os.homedir(), "/Desktop/hugo-project"))
  return res.response({currentBranch}).code(200)
}

const sitePreviewController = async(req, res) => {
  console.log("start")
  const response = await showSitePreview(path.join(os.homedir(), process.env.HUGO_SITE_PATH))
  console.log("end task : ",response)
  return "live demo running"
}

module.exports = {
  uploadController,
  gitPushController,
  directoryController,
  gitBranchController,
  sitePreviewController
};

// process.on('uncaughtException',(err) => console.log("error : ",err))

// git remote set-url origin https://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@github.com/edwinthomasg/hugo-project.git