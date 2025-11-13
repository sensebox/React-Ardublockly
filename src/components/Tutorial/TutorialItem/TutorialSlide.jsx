import { motion } from "framer-motion";
import { Box, Card, CardContent } from "@mui/material";

const variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

const TutorialSlide = ({ children, title, stepNumber }) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{
        position: "absolute", // wichtig: übereinander stapeln
        top: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          overflow: "auto",
          maxHeight: "80vh",
          p: 2,
          boxShadow: 0,
        }}
      >
        <CardContent>
          {(title || stepNumber !== undefined) && (
            <Box
              sx={{
                p: 0.5,
                border: "1px solid #ddd",
                borderRadius: "10%",
                display: "inline-flex",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.9rem",
                mb: 2,
              }}
            >
              {title ? title : `Schritt ${stepNumber}`}
            </Box>
          )}

          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TutorialSlide;
