import { React, useState } from "react";
import data from "../../data/hardware.json";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { Button } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import { Grid } from "@material-ui/core";
import BlocklyWindow from "../Blockly/BlocklyWindow";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  imageList: {
    width: "100%",
    height: "100%",
  },
  media: {
    height: 140,
  },
});

const Docs = () => {
  const [open, setOpen] = useState(false);
  const [hardwareInfo, setHardwareInfo] = useState({});

  const classes = useStyles();
  return (
    <div>
      Docs
      <Grid container spacing={3}>
        <Grid item lg={4}>
          <ImageList rowHeight={160} className={classes.imageList} cols={5}>
            {data.map((item) => (
              <ImageListItem key={item.src} cols={item.cols || 1}>
                <img src={`/media/hardware/${item.src}`} alt={item.name} />
                <ImageListItemBar
                  title={item.name}
                  //subtitle={<span>by: {item.author}</span>}
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${item.title}`}
                      className={classes.icon}
                      onClick={() => (setHardwareInfo(item), setOpen(true))}
                    >
                      <FontAwesomeIcon icon={faInfo} size="l" />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
        <Grid item lg={8}>
          {hardwareInfo !== {} ? (
            <>
              <h2>{hardwareInfo.name}</h2>
              <img
                src={`/media/hardware/${hardwareInfo.src}`}
                alt={hardwareInfo.name}
              />
              <ReactMarkdown className={"tutorial"}>
                {hardwareInfo.description}
              </ReactMarkdown>
              <h2>Programmierung</h2>
              <BlocklyWindow
                blocklyCSS={{ height: "10vH" }}
                svg
                blockDisabled
                zoom={{
                  startScale: 2,
                  maxScale: 3,
                  minScale: 0.3,
                  scaleSpeed: 1.2,
                }}
                initialXml={`<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sensebox_sensor_temp_hum" id="d0C8|X{Uu*g+%MShV!2$" x="305" y="113">
    <field name="NAME">Temperature</field>
  </block>
</xml>`}
              />
            </>
          ) : null}
        </Grid>
      </Grid>{" "}
    </div>
  );
};

export default Docs;
