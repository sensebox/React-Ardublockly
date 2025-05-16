import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";

const SerialMonitor = () => {
  const [serialPortContent, setSerialPortContent] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const portRef = useRef(null);
  const readerRef = useRef(null);

  const handleClick = () => setChecked(!checked);

  const connectPort = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      portRef.current = port;
      setIsConnected(true);

      while (port.readable) {
        const reader = port.readable.getReader();
        readerRef.current = reader;

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              reader.releaseLock();
              break;
            }
            if (value) {
              const text = String.fromCharCode.apply(null, value);
              setSerialPortContent((prevContent) => [
                ...prevContent,
                [new Date(), text],
              ]);
            }
          }
        } catch (error) {
          setSerialPortContent((prevContent) => [
            ...prevContent,
            [new Date(), error.message],
          ]);
        }
      }
    } catch (error) {
      setSerialPortContent((prevContent) => [
        ...prevContent,
        [new Date(), error.message],
      ]);
    }
  };

  const disconnectPort = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current.releaseLock();
        readerRef.current = null;
      }

      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }

      setIsConnected(false);
    } catch (error) {
      console.error("Failed to disconnect", error);
    }
  };

  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnectPort();
      }
    };
  }, [isConnected]);

  return (
    <>
      <div className="flex items-center">
        <Button
          type="button"
          variant="outlined"
          onClick={() => (isConnected ? disconnectPort() : connectPort())}
        >
          {isConnected ? "Disconnect from senseBox" : "Connect to senseBox"}
        </Button>
        <label className="m-4 text-gray-700 text-base font-semibold px-6 py-3 rounded-lg">
          Show timestamps
          <input
            onChange={handleClick}
            checked={checked}
            type="checkbox"
            className="mx-4"
          />
        </label>
        <Button
          type="button"
          variant="outlined"
          onClick={() => setSerialPortContent([])}
        >
          Clear
        </Button>
      </div>
      <div className="font-mono">
        {serialPortContent.map((log, index) => (
          <p key={index}>
            {checked && (
              <span className="font-medium mr-4">
                {log[0].toISOString()}
              </span>
            )}
            <span>{log[1]}</span>
          </p>
        ))}
      </div>
    </>
  );
};

export default SerialMonitor;
