import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import * as Blockly from "blockly";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { FaqQuestions } from "../../data/faq";

export default function Faq({ button }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [panel, setPanel] = useState("");

  const handleChange = (panelId) => {
    setPanel((prev) => (prev === panelId ? "" : panelId));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Breadcrumbs
        content={[
          {
            link: location.pathname,
            title: "FAQ",
          },
        ]}
      />

      <Container fixed>
        <div style={{ margin: "0px 24px" }}>
          <h1>FAQ</h1>

          {FaqQuestions().map((item, i) => (
            <Accordion
              key={i}
              expanded={panel === `panel${i}`}
              onChange={() => handleChange(`panel${i}`)}
            >
              <AccordionSummary
                expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
              >
                <Typography variant="h6">{item.question}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography component="div">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {item.answer}
                  </ReactMarkdown>
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            onClick={() => (button ? navigate(button.link) : navigate("/"))}
          >
            {button ? button.title : Blockly.Msg.button_back}
          </Button>
        </div>
      </Container>
    </div>
  );
}
