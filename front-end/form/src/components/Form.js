import React, { useEffect, useState } from "react"
import axios from "axios"
import { io } from "socket.io-client"

const FormComponent = () => {
  const [directories, setDirectories] = useState([]);
  const branchOptions = ["Feature", "Master"]
  const [socket, setSocket] = useState("")
  const [publishBranch, setPublishBranch] = useState("")
  const [preview, setPreview] = useState(false)
  const [details, setDetails] = useState({
    directory: "root",
    branch: "Feature",
    files: "",
  })
  if(publishBranch)
  console.log("publish at : ",publishBranch)
  useEffect(() => {
    setSocket(io("http://localhost:4040"))
    axios
      .get("http://localhost:4040/directories")
      .then((res) => {
        setDirectories(res.data);
      })
      .catch((err) => console.log("Bad request"));
  },[])
  
  useEffect(() => {
    if(socket)
    {
      socket.emit("online", "hi server")
      socket.on("notification", (message) => {
        alert(message)
      })
    }
  },[socket])

  useEffect(() => {
    axios.post("http://localhost:4040/git-branch", { branch: details.branch })
    .then(response => {
      console.log(response.data)
      setPublishBranch(response.data.currentBranch)
    })
  },[details.branch])

  const submitHandler = async(event) => {
    event.preventDefault()
    let data = new FormData(event.target)
    await axios.post("http://localhost:4040/files", data, {
      "Content-Type": "multipart/form-data"
    })
  }

  const changeHandler = (event) => {
        setDetails((prev) => {
          return {
            ...prev,
            [event.target.name]: event.target.value,
          }
        })
  }

  const publishHandler = () => {
    axios.post("http://localhost:4040/git-push",{branch: publishBranch})
    .then(res => {
      socket.emit("gitPublish", "published")
    })
  }

  const viewDemoSite = () => {
    axios.get("http://localhost:4040/site-preview")
    setPreview(true)
  }

  return (
    <>
      <form onSubmit={submitHandler} >
        <br></br>
        <label>Select branch : </label>
        <select name="branch" onChange={changeHandler}>
          {branchOptions.map((branch, index) => (<React.Fragment key={index}>
          <option value={branch}>{branch}</option>
          </React.Fragment>))}
        </select>
        <br></br><br></br>
        <label>Choose files : </label>
        <input type="file" name="files" multiple></input>
        <br></br><br></br>
        <label>Upload To : </label>
        <select name="directory" onChange={changeHandler}>
          {directories ? (
            directories.map((file, index) => (
              <option key={index} value={file}>
                {file}
              </option>
            ))
          ) : (
            <option value="No Directory">No Directory</option>
          )}
        </select>
        <br></br><br></br>
        <input type="submit" value="Upload"></input>-----------
        <input type="button" value="Publish" onClick={publishHandler}></input>
        <br></br><br></br>
        <input type="button" value="Preview" onClick={viewDemoSite}></input>-------------
        <a href="https://edwinthomasg.github.io/hugo-project/" target="blank"><input type="button" value="Go Live"></input></a>
        <br></br><br></br><br></br>
        { preview && <iframe src="http://localhost:1313/hugo-project/" title="demo-site" height="800" width="800"></iframe>}
        <br></br>
      </form>
    </>
  )
}

export default FormComponent
