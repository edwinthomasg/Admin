const validate = require("../validation/validation");
const path = require("path");
const os = require("os");
const createFile = require("../helpers/fileTask");
const { execFile } = require("child_process");
const { Worker } = require("worker_threads");
const createFeatureBranch = require("../helpers/branch");

const registerController = (req, res) => {
  try {
    let {
      firstName,
      lastName,
      age,
      gender,
      experience,
      company,
      college,
      contact,
      email,
    } = req.payload;
    // let formData = { firstName, lastName, age, gender, experience, company, college, contact, email }
    // await validate(formData, { abortEarly : false })
    if (req.payload.resume.length >= 2) {
      req.payload.resume.map((file) => {
        let destination = path.join(
          os.homedir(),
          process.env.HUGO_SOURCE,
          file.filename
        );
        createFile(destination, file);
      });
    } else {
      let destination = path.join(
        os.homedir(),
        process.env.HUGO_SOURCE,
        req.payload.resume.filename
      );
      createFile(destination, req.payload.resume);
    }
    return res.response("success").code(200);
  } catch (err) {
    if (err.isJoi)
      return res
        .response(err.details.map((data) => ({ [data.path]: data.message })))
        .code(400);
    return res.response(`Bad request : ${err}`).code(400);
  }
};

let gitPromise = (branch) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./helpers/git_worker.js")
    worker.postMessage(branch)
    worker.on("message", resolve)
    worker.on("error", reject)
    worker.on("exit", (code) => console.log(`exited with code : ${code}`))
  })
}

const gitPushController = async(req, res) => {
  try{
    let branch = (req.payload.branch === "Master") ? "Master" : createFeatureBranch()
    await gitPromise(branch)
    return res.response("success").code(200);
  }
  catch(err){
    return res.response("server error").code(500);
  }
  
};

let promise = (num) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./helpers/worker.js", { workerData: num });
    worker.on("message", (data) => {
      console.log("Data : ", data);
      resolve(data);
    });
    worker.on("error", reject);
    worker.on("exit", (code) =>
      console.log(`process exited with code : ${code}`)
    );
  });
};

const taskController = async (req, res) => {
  const result = await promise(req.payload.number);
  console.log("result : ", result);
  return result;
};

module.exports = {
  registerController,
  gitPushController,
  taskController,
};

// process.on('uncaughtException',(err) => console.log("error : ",err))

// git remote set-url origin https://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@github.com/edwinthomasg/hugo-test.git
