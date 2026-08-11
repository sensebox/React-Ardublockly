import { motion } from "framer-motion";
import { Box, Card, CardContent } from "@mui/material";

const variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

const TutorialSlide = ({ children }) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{
        width: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          boxShadow: 0,
        }}
      >
        <CardContent
          sx={{
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 2,

              overflow: "auto",
            }}
          >
            {children}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TutorialSlide;
