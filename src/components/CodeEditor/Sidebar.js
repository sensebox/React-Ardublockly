import React from "react";
import Blockly from "blockly";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { LibraryVersions } from "../../data/versions.js";
import { ArduinoExamples } from "../../data/arduinoExamples.js";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Button } from "@material-ui/core";
import Dialog from "../Dialog";

const Sidebar = () => {
  const [alert, setAlert] = React.useState(false);

  const monaco = useMonaco();
  const loadCode = (code) => {
    console.log(code);
    console.log(monaco);
    const defaultCode = `
void setup () {
    
}
    
void loop(){
    
}`;
    var currentCode = monaco.editor.getModels()[0].getValue();

    setAlert(true);
    monaco.editor.getModels()[0].setValue(code);
  };

  const toggleDialog = () => {
    setAlert(false);
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={""}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Beispiele</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {ArduinoExamples().map((object, i) => {
              return (
                <Button
                  style={{ padding: "1rem", margin: "1rem" }}
                  variant="contained"
                  color="primary"
                  onClick={() => loadCode(object.code)}
                >
                  {object.name}
                </Button>
              );
            })}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={""}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Installierte Libraries</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <p>
              For Dokumentation take a look at the installed libraries and their
              source
            </p>
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
        <Dialog
          style={{ zIndex: 9999999 }}
          fullWidth
          maxWidth={"sm"}
          open={alert}
          title={Blockly.Msg.tabletDialog_headline}
          content={""}
          onClose={() => toggleDialog()}
          onClick={() => toggleDialog()}
          button={Blockly.Msg.button_close}
        >
          <div>{Blockly.Msg.tabletDialog_text}</div>
          <div>
            {Blockly.Msg.tabletDialog_more}{" "}
            <a href="https://sensebox.de/app" target="_blank" rel="noreferrer">
              https://sensebox.de/app
            </a>
          </div>
        </Dialog>
      </Accordion>
    </div>
  );
};

export default Sidebar;
