const path = require("path");
const os = require("os");
const createFile = require("../helpers/fileTask");
const { hugoContentSource } = require("../constants/constant");
const getDirectories = require("../helpers/directory");
const gitWorkFlow = require("../helpers/gitWorkFlow");
const switchBranch = require("../helpers/switchBranch");
const showSitePreview = require("../helpers/siteDemo");
const discardChanges = require("../helpers/discard");
const generateData = require("../helpers/dynamicData");

// UPLOADING HUGO SITE FILES TO SPECIFIED SECTION
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

// PUSH THE CHANGES TO GIT ON SPECIFIED BRANCH
const gitPushController = async (req, res) => {
  try {
    let branch = req.payload.branch === "Master" ? "main" : req.payload.branch;
    await gitWorkFlow(branch);
    return res.response("success").code(200);
  } catch (err) {
    console.log(err);
    return res.response("server error").code(500);
  }
};

// READ DIRECTORIES FROM HUGO CONTENT FOLDER
const directoryController = async (req, res) => {
  try {
    const dirName = path.join(os.homedir(), hugoContentSource);
    const directories = await getDirectories(dirName);
    return directories;
  } catch (err) {
    console.log(err);
  }
};

// SWITCH THE BRANCH EITHER FEATURE OR MAIN
const gitBranchController = (req, res) => {
  let {branch} = req.payload
  const currentBranch = switchBranch(branch, path.join(os.homedir(), "/Desktop/hugo-project"))
  return res.response({currentBranch}).code(200)
}

// RUN PREVIEW HUGO SITE
const sitePreviewController = async(req, res) => {
  const response = await showSitePreview(path.join(os.homedir(), process.env.HUGO_SITE_PATH))
  return response
}

// DISCARD THE CHANGES
const discardController = (req, res) => {
  discardChanges(path.join(os.homedir(), hugoContentSource))
  return "ok"
}

// GENERATE DYNAMIC DATA
const generateController = async(req, res) => {
  const status = await generateData()
  return status
}

module.exports = {
  uploadController,
  gitPushController,
  directoryController,
  gitBranchController,
  sitePreviewController,
  discardController,
  generateController
};

// process.on('uncaughtException',(err) => console.log("error : ",err))

// git remote set-url origin https://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@github.com/edwinthomasg/hugo-project.git