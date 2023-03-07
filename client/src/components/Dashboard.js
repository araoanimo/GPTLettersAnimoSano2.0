import React, { useState, useEffect } from 'react';
import '../App.css';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { trackPromise} from 'react-promise-tracker';
import { Navigate } from 'react-router-dom';
import { Alert } from 'react-alert'

const FormData = require('form-data');

let { saveAs } = require("file-saver");




const REACT_APP_RECAPTCHA_SITE_KEY = '6LevmTEkAAAAAO7GlaE54yfu_aKwk2nRHSGA4SzT';

  function Dashboard() {

    // const [authenticated, setAuthenticated] = useState(null);
    // useEffect(() => {
    //     const loggedInUser = localStorage.getItem("authenticated");
    //     console.log(loggedInUser);
    //     if (loggedInUser) {
    //         setAuthenticated(loggedInUser);
    //     }
    // }, []);const [authenticated, setauthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated")|| false));
    const [authenticated, setauthenticated] = useState((localStorage.getItem("authenticated")|| false));



  const [docName, setDocName] = useState('');
  const [reasonForLetter, setReasonForLetter] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [addressedTo, setAddressedTo] = useState('');
  const [isVerifiedRecaptcha, setVerifiedRecaptcha] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  let prompt = `You are a health provider writing a letter. The provider is not necessarily a doctor.
  I will give you the name of the provider that you are impersonating and the person 
  or entity that the letter is addressed to. I will also give you the reason for the 
  letter and a diagnosis that the patient may have. The letter is not addressed to the patient.
The letter should be written in first person as though from the provider. Please include the ICD code in parentheses 
for the Diagnosis. Patient name should be indicated in square brackets like [Patient Name] and 
after [Patient Name] indicate a place to insert the patient date of birth in square brackets like [DOB].
  Use these clues to construct a letter in a 
  professional manner that is less than 200 words  
  Provider Name: ${docName}
  Addressed To: ${addressedTo}
  Reason for Letter: ${reasonForLetter}
  Diagnosis: ${diagnosis}`;
  

  
  const handleRecaptchaChange = (value) => {
    setVerifiedRecaptcha(true);
  }

  

  const handleSubmit = (e) => {
    e.preventDefault();
    prompt = `You are a health provider writing a letter. The provider is not necessarily a doctor.
    I will give you the name of the provider that you are impersonating and the person 
    or entity that the letter is addressed to. I will also give you the reason for the 
    letter and a diagnosis that the patient may have. The letter is not addressed to the patient.
  The letter should be written in first person as though from the provider. Please include the ICD code in parentheses 
  for the Diagnosis. Patient name should be indicated in square brackets like [Patient Name] and 
  after [Patient Name] indicate a place to insert the patient date of birth in square brackets like [DOB].
    Use these clues to construct a letter in a 
    professional manner that is less than 200 words  
    Provider Name: ${docName}
    Addressed To: ${addressedTo}
    Reason for Letter: ${reasonForLetter}
    Diagnosis: ${diagnosis}`;
  setIsSubmitting(true);
  trackPromise(
    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + localStorage.getItem('@token'),
      },
      body: JSON.stringify({message: prompt, fileNameUploaded: fileName}),

    })
      .then(res => res.blob())
      .then(blob => {
        saveAs(blob, "Letter_Here.docx")
        setIsSubmitting(false);
      })
      .catch(err => console.error(err))
  );
  }

  const handleSubmitFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setFileName(file.name);
    const form = new FormData();
    form.append('uploadedFile', file);
    fetch('/postFile', {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + localStorage.getItem('@token'),
      },
      body:form
    })
      .then(res => console.log(res))
      .catch(err => {
        console.error(err)
        alert("Please reload the page and try again")
      });
     }
  
     console.log(authenticated + "authenticated");
     if (!authenticated) {
        console.log("not authenticated");
        return <Navigate replace to="/" />;
    }
else{
    return (
        <div><Box
        component="form"
        sx={{
        '& .MuiTextField-root': { m: 1.5, width: '50%'},
        }}
        noValidate
        autoComplete="off"
    >
        <div className = "container">
        <TextField
            multiline
            fullWidth
            id="outlined"
            label="Provider Name"
            align = "left"
            sx={{
            flexDirection: 'column',
            display: 'inline-block'
            }}
            onChange = {(e) => setDocName(e.target.value)}
        />
        <TextField
            multiline
            fullWidth
            id="outlined"
            align="left"
            sx={{
            color: 'success.main',
            display: 'inline-block'
            }}
            label="Addressed To"
            onChange = {(e) => setAddressedTo(e.target.value)}
        />
        <TextField
            multiline
            fullWidth
            id="outlined"
            sx={{
            color: 'success.main',
            display: 'inline-block'

            }}
            label="Reason for Letter"
            rows={5}
            onChange = {(e) => setReasonForLetter(e.target.value)}
        />
        <TextField
            multiline
            fullWidth
            optional="true"
            sx={{
            color: 'success.main',
            display: 'inline-block'
            }}
            id="outlined"
            label="Diagnosis"
            onChange = {(e) => setDiagnosis(e.target.value)}
        />

        <Button variant="contained" component="label" 
        sx={{
            width: '50%',
            margin: '16px',
        }}>
            Upload
            
            <input 
            accept=".docx" 
            type="file"
            onChange =  {(e) => handleSubmitFile(e)}/>
        </Button>
        
            <ReCAPTCHA
            style={{
            margin: '16px',
            }}
            width="30"
            sitekey= {REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
            />
            <Button
            
            sx={{
                margin: '16px',
                backgroundColor: '#07376b',
                maxWidth: '48%',
                minWidth: '48%',
            }}
        
            variant = "contained"
            disabled = {!isVerifiedRecaptcha || isSubmitting}
            onClick = {handleSubmit}>
                Submit
            </Button>
        </div>
        </Box>
        </div>
    )
    }
}


export default Dashboard
