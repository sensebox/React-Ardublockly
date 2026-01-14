import React, { useEffect } from "react";
import * as Blockly from "blockly";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { useMonaco } from "@monaco-editor/react";
import { Button } from "@mui/material";
import SerialMonitor from "./SerialMonitor";
import axios from "axios";
import LibrariesAccordion from "./LibrariesAccordion";

const Sidebar = () => {
  //const [examples, setExamples] = React.useState([]);
  const user = useSelector((state) => state.auth.user);
  const compilerUrl = useSelector((state) => state.general.compiler);

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

  const [libraries, setLibraries] = React.useState([]);
  React.useEffect(() => {
    if (!compilerUrl) return;

    const fetchLibraries = async () => {
      const { data } = await axios.get(`${compilerUrl}/libraries`, {
        params: {
          format: "json",
        },
      });
      const myLibs = data.installed_libraries
        .map(({ library }) => library)
        .filter((lib) => lib.location == "user")
        .sort((a, b) => a.name.localeCompare(b.name));

      setLibraries(myLibs);
    };
    fetchLibraries();
  }, [compilerUrl]);

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
                    style={{
                      padding: "1rem",
                      margin: "1rem",
                    }}
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
      <LibrariesAccordion libraries={libraries} />
    </div>
  );
};

export default Sidebar;
