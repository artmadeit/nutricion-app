"use client";

import { Fab, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function ListInterviewed() {
  return (
    <Stack direction="column" spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h4">Entrevistados</Typography>
        <Fab>
          <AddIcon />
        </Fab>
      </Stack>
    </Stack>
  );
}
