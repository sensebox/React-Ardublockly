import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Chip, Box } from "@mui/material";
import { Upload as UploadIcon, Check as CheckIcon } from "@mui/icons-material";
import { uploadAiModel, clearAiModel } from "../../actions/generalActions";
import * as Blockly from "blockly/core";

/**
 * AI Model Upload Component
 * Allows users to upload .cpp files containing TensorFlow Lite models
 */
const AiModelUpload = () => {
  const dispatch = useDispatch();
  const aiModel = useSelector((state) => state.general.aiModel);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".cpp")) {
      alert("Please select a .cpp file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const code = e.target.result;
      dispatch(uploadAiModel(code, file.name));
    };
    reader.readAsText(file);

    // Reset input so same file can be selected again
    event.target.value = "";
  };

  return (
    <Box sx={{ p: 1 }}>
      <input
        type="file"
        accept=".cpp"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <Button
        variant="contained"
        startIcon={aiModel.code ? <CheckIcon /> : <UploadIcon />}
        onClick={() => fileInputRef.current?.click()}
        size="small"
        color={aiModel.code ? "success" : "primary"}
        fullWidth
      >
        {aiModel.code
          ? Blockly.Msg.ai_model_uploaded
          : Blockly.Msg.ai_upload_model}
      </Button>
      {aiModel.filename && (
        <Chip
          label={aiModel.filename}
          size="small"
          sx={{ mt: 1 }}
          onDelete={() => dispatch(clearAiModel())}
        />
      )}
    </Box>
  );
};

export default AiModelUpload;
