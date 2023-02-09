
import Header from './components/Header';
import React, { useState } from 'react';
import './App.css';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { trackPromise} from 'react-promise-tracker'


const FormData = require('form-data');

let { saveAs } = require("file-saver");



function App() {
  
  const API_URL = '/';
  const REACT_APP_RECAPTCHA_SITE_KEY = '6LevmTEkAAAAAO7GlaE54yfu_aKwk2nRHSGA4SzT';

  // if(process.env.NODE_ENV === 'production'){
  //   API_URL = '';
  // }
  const numRowsTextBox = "3";
  const [docName, setDocName] = useState('');
  const [reasonForLetter, setReasonForLetter] = useState('');
  const [illness, setIllness] = useState('');
  const [addressedTo, setAddressedTo] = useState('');
  const [isVerifiedRecaptcha, setVerifiedRecaptcha] = useState(false);

  let prompt = `I want you to act as a provider writing a letter for their health provider practice. 
  I will give you the name of the provider that you are impersonating and the person 
  or entity that the letter is addressed to. I will also give you the reason for the 
  letter and an illness that the patient may have. The letter is not addressed to the patient.
  Use these clues to construct a letter in a 
  professional manner that is about 200 words 
  Provider Name: ${docName}
  Addressed To: ${addressedTo}
  Reason for Letter: ${reasonForLetter}
  Illness: ${illness}`;
  

  
  const handleRecaptchaChange = (value) => {
    setVerifiedRecaptcha(true);
    console.log(isVerifiedRecaptcha);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(docName);
    console.log(illness);
    console.log("hello world");
    prompt = `I want you to act as a provider writing a letter for their health provider practice. 
    I will give you the name of the provider that you are impersonating and the person 
    or entity that the letter is addressed to. I will also give you the reason for the 
    letter and an illness that the patient may have. Use these clues to construct a letter in a 
    professional manner that is about 200 words 
    Provider Name: ${docName}
    Addressed To: ${addressedTo}
    Reason for Letter: ${reasonForLetter}
    Illness: ${illness}`;
  console.log(prompt);
  console.log(`API URL = ${API_URL}`);

  trackPromise(
    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: prompt}),

    })
      .then(res => res.blob())
      .then(blob => {
        saveAs(blob, "Letter_Here.docx")
      })
      .catch(err => console.error(err))
  );
  }

  const handleSubmitFile = (e) => {

    e.preventDefault();
    const file = e.target.files[0];

    const form = new FormData();
    form.append('uploadedFile', file);
    fetch('/postFile', {
      method: 'POST',
      body:form
    })
      .then(res => console.log(res))
      .catch(err => console.error(err));

    }
  

  

  return (
    <div className="App">
      <Header />
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 2, width: '120%' },
      }}
      noValidate
      autoComplete="off"
    >
      <div className = "container">
      <TextField
          multiline
          id="outlined"
          label="Provider Name"
          sx={{
            color: 'success.main',
            width: '40px',
            display: 'inline-block'
          }}
          onChange = {(e) => setDocName(e.target.value)}
        />
        <TextField
          multiline
          id="outlined"
          sx={{
            color: 'success.main',
            width: '30%',
            display: 'inline-block'
          }}
          label="Addressed To"
          onChange = {(e) => setAddressedTo(e.target.value)}
        />
        <TextField
          multiline
          id="outlined"
          sx={{
            color: 'success.main',
            width: '30%',
            display: 'inline-block'

          }}
          label="Reason for Letter"
          rows={5}
          onChange = {(e) => setReasonForLetter(e.target.value)}
        />
        <TextField
          multiline
          optional="true"
          sx={{
            color: 'success.main',
            width: '30%',
            display: 'inline-block'
          }}
          id="outlined"
          label="Illness"
          onChange = {(e) => setIllness(e.target.value)}
        />

        {/* <Button variant="contained" component="label"
        sx={{
            margin: '16px',
        }}>
          Upload
          
          <input hidden accept=".docx" 
            type="file"
            onChange =  {(e) => handleSubmitFile(e)}/>
        </Button> */}
      
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
          }}
            variant = "contained"
            disabled = {!isVerifiedRecaptcha}
            onClick = {handleSubmit}>
              Submit
            </Button>
      </div>
      </Box>
      {/* <Footer/> */}
    </div>
   

  );
}

export default App;
