import React from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import {Button}  from "@chatscope/chat-ui-kit-react";


const cookies = new Cookies(); //to set and get cookies from the browser

export const Auth = ({setIsAuth}) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result); //egy nagy objektum, amiből szükségünk lesz a tokenre
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true)
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="auth">
      <p>Sign in with Google to continue</p>
      <Button  border onClick={signInWithGoogle}>Sign in with Google</Button>
    </div>
  );
};
