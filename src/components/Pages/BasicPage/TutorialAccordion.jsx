import {
  Code,
  ConnectWithoutContact,
  PlayArrow,
  Shortcut,
  Upload,
  Usb,
} from "@mui/icons-material";
import {
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const TutorialAccordion = () => {
  return (
    <List dense disablePadding>
      <ListItem
        sx={{ mb: 2, borderRadius: 2, bgcolor: "grey.50", boxShadow: 1 }}
      >
        {" "}
        <ListItemIcon>
          <Upload color="primary" />
        </ListItemIcon>
        <ListItemText
          primary="SenseBoxOS Sketch aufspielen"
          secondary="Über Arduino IDE oder senseBox:MCU Flasher aufspielen"
        />
      </ListItem>

      <ListItem
        sx={{ mb: 2, borderRadius: 2, bgcolor: "grey.50", boxShadow: 1 }}
      >
        <ListItemIcon>
          <Usb color="primary" />
        </ListItemIcon>
        <ListItemText primary="Mit PC verbinden" />
      </ListItem>

      <ListItem
        sx={{ mb: 2, borderRadius: 2, bgcolor: "grey.50", boxShadow: 1 }}
      >
        {" "}
        <ListItemIcon>
          <Shortcut color="primary" />
        </ListItemIcon>
        <ListItemText
          primary="Auf „Verbinden“ klicken"
          secondary="SenseBox im erscheinenden Dialog auswählen"
        />
      </ListItem>

      <ListItem
        sx={{ mb: 2, borderRadius: 2, bgcolor: "grey.50", boxShadow: 1 }}
      >
        {" "}
        <ListItemIcon>
          <Code color="primary" />
        </ListItemIcon>
        <ListItemText
          primary="Code mit „Code senden“ übertragen"
          secondary="Dein Blockly-Code wird an die MCU geschickt"
        />
      </ListItem>

      <ListItem
        sx={{ mb: 2, borderRadius: 2, bgcolor: "grey.50", boxShadow: 1 }}
      >
        {" "}
        <ListItemIcon>
          <PlayArrow color="primary" />
        </ListItemIcon>
        <ListItemText
          primary="Mit Play oder Loop starten"
          secondary={
            <>
              <Typography component="span" fontWeight="bold">
                Play:
              </Typography>{" "}
              führt den Code einmal aus –{" "}
              <Typography component="span" fontWeight="bold">
                Loop:
              </Typography>{" "}
              wiederholt ihn endlos.
            </>
          }
        />
      </ListItem>
    </List>
  );
};

export default TutorialAccordion;
