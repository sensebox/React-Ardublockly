import React from "react";
import Button from "@mui/material/Button";

const SocialLogin = () => {
    const handleGoogleLogin = () => {
        // Redirect to the backend route that handles Google login
        window.location.href = "http://localhost:8080/user/auth/google";
      };
    
      const handleFacebookLogin = () => {
        // Redirect to the backend route that handles Facebook login
        window.location.href = "http://localhost:8080/user/auth/facebook";
      };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Button variant="contained" color="primary" onClick={handleGoogleLogin}>
        Login with Google
      </Button>
      <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: "10px" }}
        onClick={handleFacebookLogin}
      >
        Login with Facebook
      </Button>
    </div>
  );
};

export default SocialLogin;
