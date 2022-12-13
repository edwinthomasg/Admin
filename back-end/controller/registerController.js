const validate = require("../validation/validation");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFile } = require("child_process");
const createFile = require("../helpers/fileTask");

const registerController = async (req, res) => {
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
    let type = typeof req.payload.resume.payload
    // let formData = { firstName, lastName, age, gender, experience, company, college, contact, email }
    // await validate(formData, { abortEarly : false })
    if(req.payload.resume.length >= 2)
    {
        req.payload.resume.map(file => {
            let destination = path.join(os.homedir(), process.env.HUGO_SOURCE, file.filename);
            createFile(destination, file, type)
        })
    }
    else{
        let destination = path.join(os.homedir(), process.env.HUGO_SOURCE, req.payload.resume.filename);
        createFile(destination, req.payload.resume, type)
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

module.exports = registerController;

// process.on('uncaughtException',(err) => console.log("error : ",err))