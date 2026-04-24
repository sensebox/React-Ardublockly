// src/components/Navbar/routesConfig.js
import {
  faPuzzlePiece,
  faChalkboardTeacher,
  faLightbulb,
  faLayerGroup,
  faCode,
  faTools,
  faQuestionCircle,
  faCog,
  faSignInAlt,
  faSignOutAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

export default {
  main: [
    { text: "Blockly", icon: faPuzzlePiece, link: "/" },
    { text: "Tutorials", icon: faChalkboardTeacher, link: "/tutorial" },
    { text: "Gallery", icon: faLightbulb, link: "/gallery" },
    { text: "Projects", icon: faLayerGroup, link: "/project", auth: true },
    { text: "Code Editor", icon: faCode, link: "/codeeditor" },
    { text: "Teachable Machine", icon: faEye, link: "/teachable" },
    {
      text: "Builder",
      icon: faTools,
      link: "/tutorial/builder",
      authRole: (role) => role !== "user",
    },
  ],
  secondary: [
    { text: "FAQ", icon: faQuestionCircle, link: "/faq" },
    { text: "Settings", icon: faCog, link: "/settings" },
    // Login/Logout behandeln wir dynamisch im Navbar selbst
  ],
};
