import React from "react";
import { useState, useRef } from "react";
import { default as MonacoEditor } from "@monaco-editor/react";
import { withRouter } from "react-router-dom";
import { Button, Grid } from "@mui/material";
import * as Blockly from "blockly/core";
import Divider from "@mui/material/Divider";
import { saveAs } from "file-saver";
import Drawer from "@mui/material/Drawer";
import Sidebar from "./Sidebar";
import Dialog from "@/components/ui/Dialog";
import SaveIcon from "./SaveIcon";
import store from "@/store";
import DeviceSelection from "@/components/DeviceSelection";
import { useSelector } from "react-redux";
import CompilationDialog from "@/components/Workspace/ToolbarItems/CompilationDialog/CompilationDialog";

const CodeEditor = () => {
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
  const compilerUrl = useSelector((state) => state.general.compiler);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const selectedBoard = store.getState().board.board;
  const filename = "sketch";
  const baseCode = `
${selectedBoard === "MCU" || selectedBoard === "MCU:MINI" ? "#include <senseBoxIO.h>" : ""}    
void setup () {
             
}
              
void loop() {
              
}`;

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
    editorRef.current.setValue(baseCode);
    formatCode();
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

  const formatCode = () => {
    var code = editorRef.current.getValue();
    let formattedCode = "";
    let indentLevel = 0;
    const indentSize = 2; // Number of spaces per indentation level
    let previousLineWasEmpty = false; // Track if the previous line was empty

    const lines = code.split("\n");

    lines.forEach((line) => {
      line = line.trim();

      // Skip duplicate empty lines
      if (line === "" && previousLineWasEmpty) {
        return; // Skip this line if it's an empty line after another empty line
      }

      // Mark if the current line is empty
      previousLineWasEmpty = line === "";

      // Adjust indentation for closing braces
      if (line.startsWith("}")) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Special case for 'else if' and 'else' to ensure they align with 'if'
      if (line.startsWith("else if") || line.startsWith("else")) {
        formattedCode += " ".repeat(indentLevel * indentSize) + line + "\n";
      } else {
        // Add the appropriate indentation for normal lines
        formattedCode += " ".repeat(indentLevel * indentSize) + line + "\n";
      }

      // Increase indentation after opening braces
      if (line.endsWith("{")) {
        indentLevel++;
      }
    });

    // Remove any trailing empty lines
    formattedCode = formattedCode.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
    editorRef.current.setValue(formattedCode);
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
                : baseCode
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
            id="compile"
            variant="contained"
            color="primary"
            onClick={handleDialogOpen}
          >
            {Blockly.Msg.codeeditor_compile_code}
          </Button>
          <CompilationDialog
            open={dialogOpen}
            onClose={handleDialogClose}
            selectedBoard={selectedBoard}
            code={editorRef.current?.getValue() || ""}
            filename={filename}
          />
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
          <Button
            style={{ padding: "1rem", margin: "1rem" }}
            variant="contained"
            color="primary"
            onClick={() => formatCode()}
          >
            Code formatieren
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
                {Blockly.Msg.reset_text}
              </Button>
            </div>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(CodeEditor);
