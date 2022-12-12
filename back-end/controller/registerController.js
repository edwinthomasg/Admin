const validate = require("../validation/validation")
const fs = require("fs")
const path = require("path")
const os = require("os")
const { execFile } = require("child_process")

const registerController = async(req, res) => {
    try{
        let { firstName, lastName, age, gender, experience, company, college, contact, email, fileName } = req.payload
        // let formData = { firstName, lastName, age, gender, experience, company, college, contact, email }
        // await validate(formData, { abortEarly : false })
        let destination = path.join(os.homedir(),process.env.HUGO_SOURCE,fileName)
        fs.writeFile(destination, req.payload.resume.toString(), () => {
            console.log("File Uploaded Successfully")
            execFile("./git.sh", (err, stdout, stderr) => {
                if(err)
                    throw err
                if(stderr)
                    throw stderr
                if(stdout)
                console.log("commited successfully")
              })
        })
        return res.response("success").code(200)
    }
    catch(err){
        if(err.isJoi)
            return res.response(err.details.map(data => ({[data.path]:data.message}))).code(400)
        return res.response(`Bad request : ${err}`).code(400)
    }
}

module.exports = registerController