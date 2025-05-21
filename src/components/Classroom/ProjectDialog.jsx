import React, { Component } from "react";
import Dialog from "../Dialog";
import * as Blockly from "blockly";

import BlocklyWindow from "../Blockly/BlocklyWindow";

const ProjectDialog = ({ open, project, title, onClose }) => {
  return (
    <Dialog
      style={{ zIndex: 10000 }}
      fullWidth
      maxWidth={"xl"}
      open={open}
      title={title}
      onClose={onClose}
      onClick={onClose}
      button={Blockly.Msg.button_close}
    >
      {project && <BlocklyWindow initialXml={project.xml} blockDisabled svg />}
    </Dialog>
  );
};

export default ProjectDialog;
