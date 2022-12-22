import React, { useEffect, useState } from "react"
import axios from "axios"
import { io } from "socket.io-client"

const FormComponent = () => {
  const [directories, setDirectories] = useState([]);
  const branchOptions = ["Feature", "Master"]
  const [socket, setSocket] = useState("")

  const [details, setDetails] = useState({
    directory: "root",
    branch: "Feature",
    files: "",
  })
  
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
        axios.post("http://localhost:4040/git-branch", {data: "hi"})
  }

  const publishHandler = () => {
    axios.post("http://localhost:4040/git-push",{branch: details.branch})
    .then(res => {
      socket.emit("gitPublish", "published")
    })
  }

  return (
    <>
      <form onSubmit={submitHandler} >
        <br></br>
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
        <label>Select branch : </label>
        <select name="branch" onChange={changeHandler}>
          {branchOptions.map((branch, index) => (<React.Fragment key={index}>
          <option value={branch}>{branch}</option>
          </React.Fragment>))}
        </select>
        <br></br><br></br>
        <input type="submit" value="Upload"></input>-----------
        <input type="button" value="Publish" onClick={publishHandler}></input>
      </form>
    </>
  )
}

export default FormComponent
