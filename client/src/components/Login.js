import {React, useState} from "react";
import { useHistory } from "react-router-dom";
import { auth, firebase } from "../firebaseReact";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();
    
    async function googleLogin() {
        //1 - init Google Auth Provider
        const provider = new firebase.auth.GoogleAuthProvider();

        //2 - create the popup signIn
        await auth.signInWithPopup(provider).then(
        async (result) => {
            //3 - pick the result and store the token
            const token = await auth?.currentUser?.getIdToken(true);
            //4 - check if have token in the current user
            if (token) {
            //5 - put the token at localStorage (We'll use this to make requests)
            localStorage.setItem("@token", token);
            localStorage.setItem("authenticated", true);
            navigate("/Dashboard");
            //6 - navigate user to the letter manager
            }
            else{
                console.log("No token");
                navigate("/");
            }
        },
        function (error) {
            console.log(error);
        }
        );
    }
  return (
    <div>
      <button onClick={googleLogin} className="login-button">
        GOOGLE SIGN IN
      </button>
    </div>
  );
}