import { Box, CircularProgress } from "@mui/material";
import * as React from "react";

const Loading = () => {
  return (
    <Box display="flex">
      <CircularProgress />
    </Box>
  );
};

export default Loading;
