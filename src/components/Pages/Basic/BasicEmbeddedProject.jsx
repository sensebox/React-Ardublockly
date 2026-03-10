import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProject,
  getProjects,
  resetProject,
} from "@/actions/projectActions";
import { workspaceName } from "@/actions/workspaceActions";
import { clearMessages, returnErrors } from "@/actions/messageActions";
import BasicPage from "./BasicPage";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const BasicEmbeddedProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [project, setProject] = React.useState(null);
  const projects = useSelector((state) => state.project.projects);
  const progress = useSelector((state) => state.project.progress);
  const message = useSelector((state) => state.message);

  useEffect(() => {
    dispatch(resetProject());
    dispatch(getProjects("gallery"))
      .then((projects) => {
        const found = projects.find((p) => p._id === id);
        setProject(found);
        console.log("Fetched project:", found, id);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      });

    return () => {
      dispatch(resetProject());
      workspaceName(null);
    };
  }, [id]);

  useEffect(() => {
    if (message.id === "PROJECT_EMPTY" || message.id === "GET_PROJECT_FAIL") {
      dispatch(returnErrors("", 404, "GET_PROJECT_FAIL"));
      navigate("/embeddedbasic");
    } else if (message.id === "GET_PROJECT_SUCCESS" && project) {
      workspaceName(project.title);
    }
  }, [message, project, navigate, dispatch]);

  if (progress) {
    return (
      <Backdrop open invisible>
        <CircularProgress color="primary" />
      </Backdrop>
    );
  }

  if (!project) {
    return null;
  }

  return <BasicPage initialXml={project.xml} />;
};

export default BasicEmbeddedProject;
