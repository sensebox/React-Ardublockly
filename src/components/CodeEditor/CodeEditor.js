import React from "react";
import { useState, useRef } from "react";
import { default as MonacoEditor } from "@monaco-editor/react";
import { withRouter } from "react-router-dom";
import { Button, Grid } from "@mui/material";
import Blockly from "blockly/core";
import Divider from "@mui/material/Divider";
import { saveAs } from "file-saver";
import Drawer from "@mui/material/Drawer";
import Sidebar from "./Sidebar";
import Dialog from "../Dialog";
import SaveIcon from "./SaveIcon";
import store from "../../store";
import DeviceSelection from "../DeviceSelection";

const CodeEditor = (props) => {
  //const [filehandle, setFileHandle] = useState();
  const [fileContent, setFileContent] = useState("");
  const [progress, setProgress] = useState(false);
  // const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const editorRef = useRef(null);
  const [autoSave, setAutoSave] = useState(false);
  const [time, setTime] = useState(null);
  const [value, setValue] = useState("");
  const [resetDialog, setResetDialog] = useState(false);

  const compile = () => {
    setProgress(true);
    const data = {
      board: store.getState().board.board === "mcu" || store.getState().board.board ==="mini" ? "sensebox-mcu" : "sensebox-esp32s2",
      sketch: editorRef.current.getValue(),
    };
    fetch(`${process.env.REACT_APP_COMPILER_URL}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "Internal Server Error") {
          setProgress(false);
          setOpen(true);
          setError(data.message);
        }
        setProgress(false);
        const result = data.data.id;
        //setId(result);
        const filename = "sketch";
        window.open(
          `${process.env.REACT_APP_COMPILER_URL}/download?id=${result}&board=${store.getState().board.board === "mcu" ? "sensebox-mcu" : "sensebox-esp32s2"}&filename=${filename}`,
          "_self"
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveIno = () => {
    var filename = "sketch";
    var code = editorRef.current.getValue();

    filename = `${filename}.ino`;
    var blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
  };

  const openIno = async () => {
    const [myFileHandle] = await window.showOpenFilePicker();
    //setFileHandle(myFileHandle);

    const file = await myFileHandle.getFile();
    const contents = await file.text();
    setFileContent(contents);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(false);
  };

  const resetCode = () => {
    const resetCode = `
#include <senseBoxIO.h> //needs to be always included
    
void setup () {
             
}
              
void loop() {
              
}`;
    editorRef.current.setValue(resetCode);
  };

  const resetTimeout = (id, newID) => {
    clearTimeout(id);
    return newID;
  };

  const editValue = (value) => {
    setTime(resetTimeout(time, setTimeout(saveValue, 400)));
    setValue(value);
  };

  const saveValue = () => {
    localStorage.setItem("ArduinoCode", value);
    setAutoSave(true);
    setTimeout(() => setAutoSave(false), 1000);
  };

  const getBlocklyCode = () => {
    var code = store.getState().workspace.code.arduino;
    editorRef.current.setValue(code);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Drawer
          anchor={"bottom"}
          open={open}
          onClose={toggleDrawer("bottom", false)}
        >
          <h2
            style={{
              color: "#4EAF47",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            {Blockly.Msg.drawer_ideerror_head}
          </h2>
          <p
            style={{
              color: "#4EAF47",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            {Blockly.Msg.drawer_ideerror_text}
          </p>
          <Divider style={{ backgroundColor: "white" }} />
          <p
            style={{
              backgroundColor: "black",
              color: "#E47128",
              padding: "1rem",
            }}
          >
            {" "}
            {`${error}`}{" "}
          </p>
        </Drawer>
        <Grid item lg={8} md={8}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1>Code Editor</h1>
            <SaveIcon loading={autoSave} />
          </div>

          <MonacoEditor
            height="80vh"
            onChange={(value) => {
              editValue(value);
            }}
            defaultLanguage="cpp"
            defaultValue={
              localStorage.getItem("ArduinoCode")
                ? localStorage.getItem("ArduinoCode")
                : `#include <senseBoxIO.h> //needs to be always included
      
void setup () {
                              
}
             
void loop() {
                               
}`
            }
            value={fileContent}
            onMount={(editor, monaco) => {
              editorRef.current = editor;
              saveValue();
            }}
          />
        </Grid>
        <DeviceSelection />
        <Grid item lg={4} md={4}>
          <Button
            style={{ padding: "1rem", margin: "1rem" }}
            variant="contained"
            color="primary"
            onClick={() => compile()}
          >
            Kompilieren
          </Button>
          <Button
            style={{ padding: "1rem", margin: "1rem" }}
            variant="contained"
            color="primary"
            onClick={() => saveIno()}
          >
            {Blockly.Msg.codeeditor_save_code}
          </Button>
          <Button
            style={{ padding: "1rem", margin: "1rem" }}
            variant="contained"
            color="primary"
            onClick={() => openIno()}
          >
            {Blockly.Msg.codeeditor_open_code}
          </Button>
          <Button
            style={{ padding: "1rem", margin: "1rem" }}
            variant="contained"
            color="primary"
            onClick={() => setResetDialog(true)}
          >
            {Blockly.Msg.codeeditor_reset_code}
          </Button>
          <Button
            style={{ padding: "1rem", margin: "1rem" }}
            variant="contained"
            color="primary"
            onClick={() => getBlocklyCode()}
          >
            {Blockly.Msg.codeeditor_blockly_code}
          </Button>
          <Sidebar />
          <Dialog
            style={{ zIndex: 9999999 }}
            fullWidth
            maxWidth={"sm"}
            open={progress}
            title={"Code wird kompiliert"}
            content={""}
          >
            <div>{Blockly.Msg.codeeditor_compile_progress}</div>
          </Dialog>{" "}
          <Dialog
            open={resetDialog}
            title={Blockly.Msg.resetDialog_headline}
            content={Blockly.Msg.resetDialog_text}
            onClose={() => {
              setResetDialog(false);
            }}
            onClick={() => {
              setResetDialog(false);
            }}
            button={Blockly.Msg.button_cancel}
          >
            {" "}
            <div style={{ marginTop: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  resetCode();
                  setResetDialog(false);
                }}
              >
                Zurücksetzen
              </Button>
            </div>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(CodeEditor);
