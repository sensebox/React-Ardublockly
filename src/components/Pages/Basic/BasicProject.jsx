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
import BasicWithSerial from "./BasicWithSerial";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const BasicProject = () => {
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
        if (!found) {
          throw new Error(`Project with id ${id} not found`);
        }
        setProject(found);
        console.log("Fetched project:", found, id);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        navigate("/basic");
      });

    return () => {
      dispatch(resetProject());
      workspaceName(null);
    };
  }, [id]);

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

  return (
    <div>
      <Breadcrumbs
        content={[
          { link: "/basic", title: "Basic Projekte" },
          { link: `/basic/${id}`, title: project.title },
        ]}
      />
      <BasicWithSerial initialXml={project.xml} />
    </div>
  );
};

export default BasicProject;
