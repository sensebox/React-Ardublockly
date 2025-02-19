import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Link,
  Paper,
} from "@mui/material";
import * as Blockly from "blockly";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown, faChevronDown, faExternalLink } from "@fortawesome/free-solid-svg-icons";

const LibrariesAccordion = ({ libraries }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
        aria-controls="libraries-content"
        id="libraries-header"
      >
        <Typography variant="h6">
          {Blockly.Msg.codeeditor_libraries_head}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            width: "100%",
            maxHeight: "60vh",
            overflowY: "auto",
            backgroundColor: "#fff",
            p: 2,
          }}
        >
          <Typography variant="body1" paragraph>
            {Blockly.Msg.codeeditor_libraries_text}
          </Typography>
          <List>
            {libraries.map((library, index) => (
              <ListItem key={`${library.name}-${index}`} disableGutters>
                <Paper
                  elevation={2}
                  sx={{
                    width: "100%",
                    p: 1,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Link
                        href={library.website}
                        target="_blank"
                        rel="noreferrer"
                        underline="hover"
                      >
                        {library.name} <FontAwesomeIcon icon={faExternalLink} />
                      </Link>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          Version: {library.version}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Author: {library.author}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {Blockly.Msg.sensorinfo_description}: {library.sentence}
                        </Typography>
                      </>
                    }
                  />
                </Paper>
              </ListItem>
            ))}
          </List>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default LibrariesAccordion;
