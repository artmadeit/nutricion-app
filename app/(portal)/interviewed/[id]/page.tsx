"use client";

import GeneralData from "@/app/(components)/GeneralData";
import { Button, Grid, Typography } from "@mui/material";
import { FormContainer } from "react-hook-form-mui";

function EditInterview() {
  return (
    <div>
      <Typography variant="h4">Editar persona</Typography>
      <FormContainer>
        <Grid container spacing={2} margin={2}>
          <GeneralData />
          <Grid size={12}>
            <Button variant="contained">Guardar</Button>
          </Grid>
        </Grid>
      </FormContainer>
    </div>
  );
}

export default EditInterview;
