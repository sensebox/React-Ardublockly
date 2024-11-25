import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { socialLogin } from "../../actions/authActions"; // Import the socialLogin action

const SocialLoginRedirect = (props) => {
  const history = useHistory();

  useEffect(() => {
    // Capture the token from the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("Token received from URL:", token); // For debugging

      // Dispatch the socialLogin action to store the token and authenticate the user
      props.socialLogin(token);

      // Clean up the URL by removing the token
      window.history.replaceState({}, document.title, "/user");

      // Redirect the user to the desired protected route (e.g., /user)
      setTimeout(() => history.push("/user"), 1000); // Delay to ensure token is stored
    } else {
      // If no token is found, redirect to the login page
      history.push("/user/login");
    }
  }, [history, props]);

  return (
    <div>
      <h2>Logging you in...</h2>
    </div>
  );
};

export default connect(null, { socialLogin })(SocialLoginRedirect);
