import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import store from "../store";
import ReactMarkdown from "react-markdown";
import * as Blockly from "blockly";

export default function LabTabs() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // get the description in the current language if no lang is give return english or the first one
  function filterLanguage(options) {
    var lang;
    if (window.localStorage.getItem("locale")) {
      lang = window.localStorage.getItem("locale").split("_")[0];
    } else {
      lang = "en";
    }
    for (var i = 0; i < options.length; i++) {
      if (options[i].languageCode === lang) {
        return options[i].text;
      }
    }
    return options[0].text;
  }
  var currentStore = store.getState();
  // ALL SENSOR DATA FROM WIKI
  var sensorData = currentStore.sensorwiki;
  // NAME OF SELECTED BLOCK
  var sensorName = currentStore.workspace.code.data.name;
  // SEARCH ALL DATA FOR SELECTED BLOCK NAME
  var sensorInfo = sensorData.find(function (element) {
    return element.slug === sensorName;
  });
  if (sensorInfo) {
    sensorInfo.markdown = "Coming soon...";

    // GET DESCRIPTION OF SELECTED BLOCK
    sensorInfo.details = `# ${sensorName.toUpperCase()}
${Blockly.Msg.sensorinfo_explanation} [${sensorName.toUpperCase()}](https://sensors.wiki/sensor/detail/${sensorName})
## ${Blockly.Msg.sensorinfo_description}
${filterLanguage(sensorInfo.description.item)}
## ${Blockly.Msg.sensorinfo_measurable_phenos}
## ${Blockly.Msg.sensorinfo_manufacturer}
${sensorInfo.manufacturer}
## ${Blockly.Msg.sensorinfo_lifetime}
${sensorInfo.lifePeriod}`;
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab label="Basic Information" value="1" />
            <Tab label="Details" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {sensorInfo ? (
            <ReactMarkdown>{sensorInfo.markdown}</ReactMarkdown>
          ) : (
            "No data available"
          )}
        </TabPanel>
        <TabPanel value="2">
          {sensorInfo ? (
            <ReactMarkdown>{sensorInfo.details}</ReactMarkdown>
          ) : (
            "No data available"
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
}
