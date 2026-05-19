import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function extractGroupFromResponse(data, groupId) {
  if (data?.group) return data.group;

  if (data?.groups) {
    if (Array.isArray(data.groups)) {
      return (
        data.groups.find((item) => item?._id?.toString?.() === groupId) || null
      );
    }
    return data.groups;
  }

  if (Array.isArray(data)) {
    return data.find((item) => item?._id?.toString?.() === groupId) || null;
  }

  return data || null;
}

function isArchivedValue(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  if (typeof value === "number") return value === 1;
  return false;
}

export default function MemberArchivedAutoLeave({ children }) {
  const navigate = useNavigate();
  const { groupId, memberId } = useParams();
  const [archiveExitTriggered, setArchiveExitTriggered] = useState(false);

  useEffect(() => {
    if (!memberId || !groupId || archiveExitTriggered) return;

    let isMounted = true;

    const checkArchiveAndLeave = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BLOCKLY_API}/group/getOne/${groupId}`,
        );
        const groupData = extractGroupFromResponse(response.data, groupId);
        if (!isMounted || !isArchivedValue(groupData?.archived)) return;

        setArchiveExitTriggered(true);

        try {
          await axios.put(
            `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/leave`,
            {
              groupId,
              memberId,
            },
          );
        } catch (leaveError) {
          console.error(
            "Auto-Leave bei Archivierung fehlgeschlagen:",
            leaveError,
          );
        }

        navigate("/joinGroup", { replace: true });
      } catch (err) {
        console.error("Archiv-Status konnte nicht geprüft werden:", err);
      }
    };

    checkArchiveAndLeave();
    const interval = setInterval(checkArchiveAndLeave, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [groupId, memberId, navigate, archiveExitTriggered]);

  return children;
}

MemberArchivedAutoLeave.propTypes = {
  children: PropTypes.node.isRequired,
};
