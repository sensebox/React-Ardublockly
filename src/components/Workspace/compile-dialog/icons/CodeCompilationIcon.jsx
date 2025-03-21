"use client";

import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { senseboxColors } from "../theme";
import { useEffect } from "react";

export function CodeCompilationIcon() {
  console.log("[CodeCompilationIcon] Rendering");

  useEffect(() => {
    console.debug("[CodeCompilationIcon] Animation cycle started");
    return () => console.debug("[CodeCompilationIcon] Animation cycle cleanup");
  }, []);

  return (
    <Box
      sx={{ position: "relative", width: 400, height: 200 }}
      onMouseEnter={() => console.debug("[CodeCompilationIcon] Mouse entered")}
      onMouseLeave={() => console.debug("[CodeCompilationIcon] Mouse left")}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 16,
          bgcolor: "rgba(24, 24, 27, 0.8)",
          borderRadius: 2,
          border: `1px solid ${senseboxColors.blue}30`,
          overflow: "hidden",
          fontFamily: "monospace",
          fontSize: 18,
        }}
      >
        {/* Code animation content */}
        <motion.div
          style={{
            position: "absolute",
            inset: 15,
            color: senseboxColors.blue,
          }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div>void setup() {"{"}</div>
          <div style={{ paddingLeft: 16 }}>pinMode(13, OUTPUT);</div>
          <div>{"}"}</div>
          <div>void loop() {"{"}</div>
          <div style={{ paddingLeft: 16 }}>digitalWrite(13, HIGH);</div>
          <div>{"}"}</div>
        </motion.div>

        {/* Binary animation content */}
        <motion.div
          style={{
            position: "absolute",
            inset: 15,
            color: senseboxColors.blue,
          }}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div>01001100 01000101 01000100</div>
          <div>01010000 01001001 01001110</div>
          <div>01001000 01001001 01000111</div>
          <div>01001100 01001111 01010111</div>
          <div>01000100 01001001 01000111</div>
        </motion.div>

        {/* Scanning line animation */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 2,
            background: `linear-gradient(90deg, transparent, ${senseboxColors.blue}50, transparent)`,
          }}
          animate={{ y: [0, 160, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </Box>
    </Box>
  );
}
