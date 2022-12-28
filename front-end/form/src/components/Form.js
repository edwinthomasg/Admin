import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import ReactJsAlert from "reactjs-alert";

const FormComponent = () => {
  const [directories, setDirectories] = useState([]);
  const branchOptions = ["Feature", "Master"];
  const [socket, setSocket] = useState("");
  const [status, setStatus] = useState(false)
  const [type, setType] = useState("")
  const [title, setTitle] = useState("")
  const [quotes, setQuotes] = useState(false)
  const [quote, setQuote] = useState("")
  const [publishBranch, setPublishBranch] = useState("");
  const [preview, setPreview] = useState(false);
  const [details, setDetails] = useState({
    directory: "root",
    branch: "Feature",
    files: "",
  });
  
  // STYLES FOR GRID
  const Item = styled(Paper)(({ theme }) => ({
    marginTop: 20,
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#C9C7C8",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: 850,
  }));

  // SOCKET CONNECTION
  useEffect(() => {
    setSocket(io("http://localhost:4040"));
    axios
      .get("http://localhost:4040/directories")
      .then((res) => {
        setDirectories(res.data);
      })
      .catch((err) => console.log("Bad request"));
  }, []);

  // HANDLING SOCKET COMMUNICATION FROM SERVER
  useEffect(() => {
    if (socket) {
      socket.emit("online", "hi server");
      socket.on("notification", (message) => {
        setStatus(true)
        setTitle("Git Push Status")
        setType("success")
        setQuotes(true)
        setQuote(message)
      });
      socket.on("dynamic", (message) => {
        setStatus(true)
        setTitle("Dynamic Files")
        setType("success")
        setQuotes(true)
        setQuote("Files generated successfully")
        setPreview(false)
      });
    }
  }, [socket]);

  // SWITCH BETWEEN MASTER AND FEATURE
  useEffect(() => {
    axios
      .post("http://localhost:4040/git-branch", { branch: details.branch })
      .then((response) => {
        setPublishBranch(response.data.currentBranch);
      });
  }, [details.branch]);

  // UPLOAD FILES
  const submitHandler = async (event) => {
    event.preventDefault();
    let data = new FormData(event.target);
    await axios.post("http://localhost:4040/files", data, {
      "Content-Type": "multipart/form-data",
    });
  };

  // SET VALUES TO FORM INPUTS
  const changeHandler = (event) => {
    setDetails((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
    setPreview(false);
  };

  // PUSH THE CHANGES THE SERVER
  const publishHandler = () => {
    axios
      .post("http://localhost:4040/git-push", { branch: publishBranch })
      .then((res) => {
        socket.emit("gitPublish", "published");
      });
  };

  // DISCARD THE CHANGES TO SERVER
  const discardHandler = () => {
    axios.delete("http://localhost:4040/discard").then(() => {
      console.log("succesfully discarded the changes !!");
      setStatus(true);
      setTitle("Hugo Site")
      setType("error")
      setQuotes(true)
      setQuote("Changes have been discarded successfully")
      setPreview(false)
    });
  };

  // GENERATE DATA FROM SERVER DYNAMICALLY
  const generateHandler = () => {
    axios.post("http://localhost:4040/generate").then((res) => {
      socket.emit("contentAdd", "added");
    });
  };

  // LOAD PREVIEW OF LOCAL CHANGES MADE IN HUGO SITE
  const viewDemoSite = () => {
    axios.get("http://localhost:4040/site-preview").then((response) => {
      setStatus(true);
      setTitle("Hugo Site")
      setType("warning")
      setQuotes(true)
      setQuote("Preview site loaded successfully")
    });
  };

  // LOAD IFRAME TO SHOW PREVIEW
  const showIframe = () => {
    if (preview) {
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
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={16}>
          <Grid item xs={8}>
            <Item>
              <form onSubmit={submitHandler} className="uploadForm">
                <br></br>
                <label>Choose Branch : </label>
                <select
                  name="branch"
                  value={details.branch}
                  onChange={changeHandler}
                >
                  {branchOptions.map((branch, index) => (
                    <React.Fragment key={index}>
                      <option value={branch}>{branch}</option>
                    </React.Fragment>
                  ))}
                </select>
                <Tooltip
                  title={publishBranch && publishBranch}
                  placement="right-start"
                >
                  <InfoIcon className="info" fontSize="small"></InfoIcon>
                </Tooltip>
                <br></br>
                <br></br>
                <label>Choose Files : </label>
                <input type="file" name="files" multiple></input>
                <br></br>
                <br></br>
                <label>Choose Section: </label>
                <select
                  name="directory"
                  onChange={changeHandler}
                  style={{ marginRight: 10 }}
                >
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
                <br></br>
                <br></br>
                <label>Generate Files : </label>
                <input
                  type="button"
                  value="Generate"
                  onClick={generateHandler}
                ></input>
                <br></br>
                <br></br>
                <input
                  type="button"
                  value="Publish"
                  onClick={publishHandler}
                  className="publishButton"
                ></input>
                <input
                  type="button"
                  value="Discard"
                  onClick={discardHandler}
                  className="discardButton"
                ></input>
                <br></br>
                <br></br>
                <input
                  type="button"
                  value="Preview"
                  onClick={viewDemoSite}
                  className="previewButton"
                ></input>
                <a
                  href="https://edwinthomasg.github.io/hugo-project/"
                  target="blank"
                >
                  <input
                    type="button"
                    value="Go Live"
                    className="goLiveButton"
                  ></input>
                </a>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </form>
            </Item>
          </Grid>
          <Grid item xs={8}>
            <Item>{preview && showIframe()}</Item>
          </Grid>
        </Grid>
      </Box>
      <ReactJsAlert 
      status={status}
      type={type}
      title={title}
      quotes={quotes}
      quote={quote}
      Close={() => {
        setStatus(false)
        setPreview(true);
      }}
      />
    </>
  );
};

export default FormComponent;
