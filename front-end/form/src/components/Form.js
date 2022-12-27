import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const FormComponent = () => {
  const [directories, setDirectories] = useState([]);
  const branchOptions = ["Feature", "Master"];
  const [socket, setSocket] = useState("");
  const [publishBranch, setPublishBranch] = useState("");
  const [preview, setPreview] = useState(false);
  const [dynamicData, setDynamicData] = useState("")
  const [details, setDetails] = useState({
    directory: "root",
    branch: "Feature",
    files: "",
  });

  useEffect(() => {
    setSocket(io("http://localhost:4040"));
    axios
      .get("http://localhost:4040/directories")
      .then((res) => {
        setDirectories(res.data);
      })
      .catch((err) => console.log("Bad request"));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("online", "hi server");
      socket.on("notification", (message) => {
        alert(message);
      });
      socket.on("dynamic", (message) => {
        alert(message);
      })
    }
  }, [socket]);

  useEffect(() => {
    axios
      .post("http://localhost:4040/git-branch", { branch: details.branch })
      .then((response) => {
        setPublishBranch(response.data.currentBranch);
      });
  }, [details.branch]);

  const submitHandler = async (event) => {
    event.preventDefault();
    let data = new FormData(event.target);
    await axios.post("http://localhost:4040/files", data, {
      "Content-Type": "multipart/form-data",
    });
  };

  const changeHandler = (event) => {
    setDetails((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const publishHandler = () => {
    axios
      .post("http://localhost:4040/git-push", { branch: publishBranch })
      .then((res) => {
        socket.emit("gitPublish", "published");
      });
  };
  
  const discardHandler = () => {
    axios.delete("http://localhost:4040/discard")
    .then(() => {
      console.log("succesfully discarded the changes !!")
    })
  }

  const generateHandler = () => {
    axios.post("http://localhost:4040/generate")
    .then(res => {
      socket.emit("contentAdd", "added")
    })
  }

  const viewDemoSite = () => {
    axios.get("http://localhost:4040/site-preview").then((response) => {
      setPreview(true);
    });
  };

  const showIframe = () => {
    if (preview === true) {
      alert("changes getting loaded, click ok");
      return (
        <>
          <iframe
            src="http://localhost:1313/hugo-project/"
            title="demo-site"
            height="800"
            width="800"
          ></iframe>
        </>
      );
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <br></br>
        <label>Select branch : </label>
        <select name="branch" onChange={changeHandler}>
          {branchOptions.map((branch, index) => (
            <React.Fragment key={index}>
              <option value={branch}>{branch}</option>
            </React.Fragment>
          ))}
        </select>{publishBranch && <i> {publishBranch} </i>}
        <br></br>
        <br></br>
        <label>Choose files : </label>
        <input type="file" name="files" multiple></input>
        <br></br>
        <br></br>
        <label>Upload To : </label>
        <select name="directory" onChange={changeHandler} style={{ marginRight: 10 }} >
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
        <input type="submit" value="Upload"></input>
        <br></br><br></br>
        Generate Files : <input type="button" value="Generate" onClick={generateHandler}></input>
        <br></br><br></br>
        <input type="button" value="Publish" onClick={publishHandler}></input>------
        <input type="button" value="Discard" onClick={discardHandler}></input>
        <br></br>
        <br></br>
        <input type="button" value="Preview" onClick={viewDemoSite}></input>
        ------
        <a href="https://edwinthomasg.github.io/hugo-project/" target="blank">
          <input type="button" value="Go Live"></input>
        </a>
        <br></br>
        <br></br>
        <br></br>
        {preview === true && showIframe()}
        <br></br>
      </form>
    </>
  );
};

export default FormComponent;
