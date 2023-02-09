import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { usePromiseTracker } from "react-promise-tracker";
import {BeatLoader} from 'react-spinners';

const LoadingIndicator = props => {
     const { promiseInProgress } = usePromiseTracker();
  
     return (
       promiseInProgress && 
       <div
             style={{
               width: "30%",
               height: "30",
             }}
           >
             <BeatLoader style={{
              margin: '16px',
              }}
          type="ThreeDots" color="rgba(7, 55, 107, 1)" height="40" width="40"  />
           </div>
    );  
   }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <LoadingIndicator/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
