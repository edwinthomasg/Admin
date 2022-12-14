const validate = require("../validation/validation");
const path = require("path");
const os = require("os");
const createFile = require("../helpers/fileTask");
const {execFile} = require("child_process")

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
    if(req.payload.resume.length >= 2)
    {
        req.payload.resume.map((file) => {
            let destination = path.join(os.homedir(), process.env.HUGO_SOURCE, file.filename);
            createFile(destination, file)
            console.log("after file creation")
        })
    }
    else{
        let destination = path.join(os.homedir(), process.env.HUGO_SOURCE, req.payload.resume.filename);
        createFile(destination, req.payload.resume)
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
  execFile("./git.sh", (err, stdout, stderr) => {
        if (err) console.log("Command error : ", err);
        if (stderr) console.log("Error : ", stderr);
        if (stdout) console.log(`commited successfully : ${stdout}`);
      });
      return res.response("success").code(200);
}
module.exports = {
  registerController,
  gitPushController
};

// process.on('uncaughtException',(err) => console.log("error : ",err))

// git remote set-url origin https://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@github.com/edwinthomasg/hugo-test.git