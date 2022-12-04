import { useState } from "react";
import Button from "@mui/material/Button";

const SerialMonitor = () => {
  const [serialPortContent, setSerialPortContent] = useState([]);

  const [checked, setChecked] = useState(false);
  const handleClick = () => setChecked(!checked);

  const connectPort = async () => {
    try {
      const port = await navigator.serial.requestPort();

      await port.open({ baudRate: 9600 });

      while (port.readable) {
        const reader = port.readable.getReader();

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              // Allow the serial port to be closed later.
              reader.releaseLock();
              break;
            }
            if (value) {
              //   byte array to string: https://stackoverflow.com/a/37542820
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
            [new Date(), error],
          ]);
        }
      }
    } catch (error) {
      setSerialPortContent((prevContent) => [
        ...prevContent,
        [new Date(), error],
      ]);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <Button type="button" variant="outlined" onClick={() => connectPort()}>
          Connect to senseBox
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
        {serialPortContent.map((log) => {
          return (
            <p>
              {checked && (
                <span className="font-medium mr-4">{log[0].toISOString()}</span>
              )}

              <span>{log[1]}</span>
            </p>
          );
        })}
      </div>
    </>
  );
};

export default SerialMonitor;
