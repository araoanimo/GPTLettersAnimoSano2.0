import {React, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import { auth, firebase } from "../firebaseReact";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    useEffect(() => {
      refreshToken();
     }, []);


    async function refreshToken() {

      //const token = await auth?.currentUser?.getIdToken(true);
      //console.log(token);
      //googleLogin();
      if(localStorage.getItem("authenticated")){
        navigate("/dashboard");
      }
      
      // if(token){
      //   localStorage.setItem("@token", token);
      //   localStorage.setItem("authenticated", true);
      //   navigate("/dashboard")
      // }
      // else{
      //   console.log("No token");
      //   //navigate("/login");
     //}
    }


    console.log("made it to login");
    async function googleLogin() {
        //1 - init Google Auth Provider
        const provider = new firebase.auth.GoogleAuthProvider();
        console.log(auth.currentUser);
        //2 - create the popup signIn
        await auth.signInWithPopup(provider).then(
        async (result) => {
            //3 - pick the result and store the token
            
            const token = await auth?.currentUser?.getIdToken(true);
            console.log("login here");
            //4 - check if have token in the current user
            if (token) {
            //5 - put the token at localStorage (We'll use this to make requests)
            localStorage.setItem("@token", token);
            //console.log(auth.currentUser);
            //localStorage.setItem("@user", auth.currentUser);
            //console.log(localStorage.getItem("@user"));
            console.log(localStorage.getItem("@token"));
            localStorage.setItem("authenticated", true);
            navigate("/");
            //6 - navigate user to the letter manager
            }
            else{
                console.log("No token");
                navigate("/login");
            }
        },
        function (error) {
            console.log(error);
        });
    }
  return (
    <div>
      <button onClick={googleLogin} className="login-button">
        SIGN IN WITH GOOGLE
      </button>
    </div>
  );
}

