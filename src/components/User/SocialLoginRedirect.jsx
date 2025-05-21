import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { socialLogin } from "../../actions/authActions"; // Import the socialLogin action

const SocialLoginRedirect = (props) => {
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("Token from URL:", token);
    if (token) {
      console.log("Token received from URL:", token);
      props
        .socialLogin(token)
        .then(() => {
          window.history.replaceState({}, document.title, "/user");
          history.push("/user");
        })
        .catch(() => {
          history.push("/user/login");
        });
    } else {
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
