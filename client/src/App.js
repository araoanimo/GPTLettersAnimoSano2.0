
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

  

  return (
    <div className = "App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Login/>}/>
          <Route path = "/dashboard" element = {<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
      {/* <Footer/> */}
    </div>
   

  );
}

export default App;
