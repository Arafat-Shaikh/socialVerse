import React from "react";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import { useRecoilValue } from "recoil";
import authState from "../atoms/authAtom";

const AuthPage = () => {
  const authStateValue = useRecoilValue(authState);
  console.log(authStateValue);

  return <>{authStateValue === "login" ? <Login /> : <SignUp />}</>;
};

export default AuthPage;
