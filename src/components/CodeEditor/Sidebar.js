import React from "react";
import Blockly from "blockly";
import { useSelector } from "react-redux";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { LibraryVersions } from "../../data/versions.js";
import { useMonaco } from "@monaco-editor/react";
import { Button } from "@material-ui/core";
import SerialMonitor from "./SerialMonitor.js";
import axios from "axios";

const Sidebar = () => {
  //const [examples, setExamples] = React.useState([]);
  const user = useSelector((state) => state.auth.user);
  // useEffect(() => {
  //   axios
  //     .get("https://coelho.opensensemap.org/items/blocklysamples")
  //     .then((res) => {
  //       setExamples(res.data.data);
  //     });
  // }, []);
  const monaco = useMonaco();
  const loadCode = (code) => {
    monaco.editor.getModels()[0].setValue(code);
  };

  const getOsemScript = (id) => {
    axios
      .get(`https://api.opensensemap.org/boxes/${id}/script/`)
      .then((res) => {
        loadCode(res.data);
      });
  };

  return (
    <div>
      {"serial" in navigator ? (
        <Accordion>
          <AccordionSummary
            expandIcon={""}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Serial Monitor</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <SerialMonitor />
            </Typography>
          </AccordionDetails>
        </Accordion>
      ) : null}
      {/* <Accordion>
        <AccordionSummary
          expandIcon={""}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Beispiele</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {examples.map((object, i) => {
              return (
                <Button
                  style={{ padding: "1rem", margin: "1rem" }}
                  variant="contained"
                  color="primary"
                  key={i}
                  onClick={() => loadCode(object.code)}
                >
                  {object.name}
                </Button>
              );
            })}
          </Typography>
        </AccordionDetails>
      </Accordion> */}
      {user ? (
        <Accordion>
          <AccordionSummary
            expandIcon={""}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Deine openSenseMap Codes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {user.boxes.map((box, i) => {
                return (
                  <Button
                    style={{ padding: "1rem", margin: "1rem" }}
                    variant="contained"
                    color="primary"
                    key={i}
                    onClick={() => getOsemScript(box._id)}
                  >
                    {box.name}
                  </Button>
                );
              })}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ) : null}
      <Accordion>
        <AccordionSummary
          expandIcon={""}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>{Blockly.Msg.codeeditor_libraries_head}</Typography>
        </AccordionSummary>
        <AccordionDetails
          style={{ padding: 0, height: "60vH", backgroundColor: "white" }}
        >
          <Typography
            style={{ overflow: "auto", width: "100%", padding: "1rem" }}
          >
            <p>{Blockly.Msg.codeeditor_libraries_text}</p>
            {LibraryVersions().map((object, i) => {
              return (
                <p>
                  <a href={object.link} target="_blank" rel="noreferrer">
                    {object.library} {object.version}
                  </a>
                </p>
              );
            })}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Sidebar;
