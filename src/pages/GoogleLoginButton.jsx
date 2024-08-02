import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import axios from "axios";

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const REACT_APP_GOOGLE_AUTH_CLIENT_ID =
    "64914608678-347k5m0ag08q2sqpu504b2j9b0n0eapr.apps.googleusercontent.com";
  const navigate = useNavigate();
  const clientId = REACT_APP_GOOGLE_AUTH_CLIENT_ID;
  console.log(clientId);

  const handle_user_authentication = async (user_info) => {
    try {
      const response = await axios.post("/api/v1/account/login", {
        loginId: user_info.sub,
        name: user_info.name,
      });
      //
      // http://15.165.116.155:8080/api/v1/account/login
      console.log("response", response);
      const accessToken = response.headers.authorization;
      const refreshToken = response.headers.refreshtoken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      onLoginSuccess(); // Call the callback function on successful login
      navigate("/");
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <div className="login-page">
          <div className="login-container">
            <GoogleLogin
              onSuccess={(res) => {
                // console.log(jwtDecode(res.credential));
                handle_user_authentication(jwtDecode(res.credential));
              }}
              onFailure={(err) => {
                console.log(err);
              }}
            />
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default GoogleLoginButton;
