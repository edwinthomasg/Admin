const validate = require("../validation/validation");
const path = require("path");
const os = require("os");
const createFile = require("../helpers/fileTask");
const { execFile } = require("child_process");
const { Worker, workerData } = require("worker_threads");
const createFeatureBranch = require("../helpers/featureBranch");

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

const gitPushController = (req, res) => {
  let featureBranch = createFeatureBranch()
  execFile("./git.sh", [featureBranch], (err, stdout, stderr) => {
    if (err) console.log("Command error : ", err);
    if (stderr) console.log("Error : ", stderr);
    if (stdout) console.log(`commited successfully : ${stdout}`);
  });
  return res.response("success").code(200);
};

let promise = (num) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./controller/worker.js", { workerData: num });
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
