import React from "react";
import CookieConsent from "react-cookie-consent";

const consentStyle = {
  background: "#2B373B",
};

const buttonStyle = {
  background: "#FFFFFF",
  color: "#4EAF47",
  fontSize: "1rem",
};

const Cookies = () => (
  <CookieConsent
    location="bottom"
    buttonText="Okay!"
    cookieName="cookieConsent"
    style={consentStyle}
    buttonStyle={buttonStyle}
    expires={150}
  >
    This website uses cookies to enhance the user experience.
  </CookieConsent>
);

export default Cookies;
