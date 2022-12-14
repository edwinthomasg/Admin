import React, { useState } from "react"
import axios from "axios"

const FormComponent = () => {
  const selectOptions = ["0","1","2","3 or Greater than"]
  
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    experience: "",
    company: "",
    college: "",
    contact: "",
    email: "",
    resume: "",
  })
  const submitHandler = async(event) => {
    event.preventDefault()
    let data = new FormData(event.target)
    await axios.post("http://localhost:4040/registeration", data, {
      "Content-Type": "multipart/form-data"
    })
  }
  const changeHandler = (event) => {
      if(event.target.files)
      {
        let fileName
        if(event.target.files.length > 1)
        {
          fileName = []
          Array.from(event.target.files).forEach(file => fileName.push(file.name))
          setDetails((prev) => {
            return {
              ...prev,
              [event.target.name]: fileName
            }
          })
        }
        else{
          fileName = event.target.files[0].name
          setDetails((prev) => {
            return {
              ...prev,
              [event.target.name]: fileName
            }
          })
        }
      }
      else{
        setDetails((prev) => {
          return {
            ...prev,
            [event.target.name]: event.target.value,
          }
        })
      }
  }
  const publishHandler = () => {
    axios.post("http://localhost:4040/git-push",{message: "push"})
  }

  return (
    <>
      <form onSubmit={submitHandler} >
        <label>First Name : </label>
        <input
          type="text"
          name="firstName"
          value={details.firstName}
          onChange={changeHandler}
        ></input>
        <br></br>
        <label>Last Name : </label>
        <input
          type="text"
          name="lastName"
          value={details.lastName}
          onChange={changeHandler}
        ></input>
        <br></br>
        <label>Age : </label>
        <input
          type="number"
          name="age"
          value={details.age}
          onChange={changeHandler}
        ></input>
        <br></br>
        <label>Gender : </label>
        <input type="radio" name="gender" value="male" onChange={changeHandler}></input>male
        <input type="radio" name="gender" value="female" onChange={changeHandler}></input>female
        <br></br>
        <label>Experience : </label>
        <select name="experience" onChange={changeHandler}>
          {selectOptions.map((options, index) => (
            <React.Fragment key={index}>
              <option value={options}>{options}</option>
            </React.Fragment>
          ))}
        </select> 
        <br></br>
        <label>Company : </label>
        <input type="text" name="company" value={details.company} onChange={changeHandler}></input>
        <br></br>
        <label>College : </label>
        <input type="text" name="college" value={details.college} onChange={changeHandler}></input>
        <br></br>
        <label>Contact : </label>
        <input type="text" name="contact" value={details.contact} onChange={changeHandler}></input>
        <br></br>
        <label>Email : </label>
        <input type="email" name="email" value={details.email} onChange={changeHandler}></input>
        <br></br>
        <label>Resume : </label>
        <input type="file" name="resume" onChange={changeHandler} multiple></input>
        <br></br><br></br>
        <input type="submit" value="Upload"></input>
        <input type="button" value="Publish" onClick={publishHandler}></input>
      </form>
      
    </>
  )
}

export default FormComponent
