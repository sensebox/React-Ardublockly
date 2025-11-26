"use client";

import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { ESPLoader, Transport } from "esptool-js";

let esploader = null;
let transport = null;
let device = null;

export default function FlashToolMini() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sketch, setSketch] = useState("");

  const serial = navigator.serial;

  /** 🔌 Board verbinden */
  const connectBoard = async () => {
    try {
      setError("");
      setSuccess(false);
      setConnecting(true);

      device = await serial.requestPort({
        filters: [{ usbVendorId: 0x303a }],
      });

      transport = new Transport(device, true);

      const loaderOptions = {
        transport,
        baudrate: 921600,
        terminal: {
          writeLine(data) {
            const match = data.match(/\((\d+)%\)/);
            if (match) setProgress(parseInt(match[1], 10));
          },
          write() {},
          clean() {},
        },
      };

      esploader = new ESPLoader(loaderOptions);

      await esploader.main(); // kann einige Sekunden dauern
      const response = await fetch("/mergedBasic.bin");
      if (!response.ok) throw new Error("Sketch wurde nicht gefunden");

      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer]);
      const reader = new FileReader();

      reader.onload = function () {
        setSketch(reader.result);
      };
      reader.onerror = function () {
        console.error("Fehler beim Lesen der Datei:", reader.error);
        setError("Fehler beim Lesen der Datei.");
      };

      reader.readAsBinaryString(blob);
      setConnected(true);
    } catch (err) {
      console.error(err);
      setError("Fehler beim Verbinden: " + err.message);
    } finally {
      setConnecting(false);
    }
  };

  const flashSketch = async () => {
    try {
      setFlashing(true);
      setError("");
      setSuccess(false);
      setProgress(0);

      const flashOptions = {
        fileArray: [{ data: sketch, address: 0x0 }],
        flashSize: "keep",
        eraseAll: true,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          setProgress((written / total) * 100);
        },
      };
      await esploader.writeFlash(flashOptions);
      await esploader.after();

      transport.disconnect();

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Fehler beim Flashen: " + err.message);
    } finally {
      setFlashing(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        background: "#f5f5f5",
        textAlign: "center",
      }}
    >
      {/* 🔄 Ladeanimation beim Verbinden */}
      {connecting && (
        <Box sx={{ py: 2 }}>
          <CircularProgress size={36} thickness={4} />
          <Typography sx={{ mt: 1, opacity: 0.75 }}>
            Verbinde mit Board …
          </Typography>
        </Box>
      )}

      {/* 🔘 Verbindung */}
      {!connected && !connecting && (
        <Button variant="outlined" fullWidth onClick={connectBoard}>
          Mit Board verbinden
        </Button>
      )}

      {/* 🚀 Flash Button */}
      {connected && (
        <Button
          variant="contained"
          color="success"
          fullWidth
          disabled={flashing}
          onClick={flashSketch}
        >
          Sketch flashen
        </Button>
      )}

      {/* 📊 Fortschritt */}
      {flashing && (
        <Box sx={{ my: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography sx={{ mt: 1 }}>{Math.round(progress)}%</Typography>
        </Box>
      )}

      {/* ✔ Erfolg */}
      {success && (
        <Typography sx={{ mt: 1, color: "green" }}>
          Upload erfolgreich! Starte die senseBox neu.
        </Typography>
      )}

      {/* ❌ Fehler */}
      {error && (
        <Typography sx={{ mt: 1, color: "red", fontWeight: 600 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
