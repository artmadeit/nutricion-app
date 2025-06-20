"use client";

import GeneralData from "@/app/(components)/GeneralData";
import { Button, Grid, Typography } from "@mui/material";
import { useMask } from "@react-input/mask";
import React from "react";
import { FormContainer } from "react-hook-form-mui";

function EditInterview() {
  const codeRef = useMask({ mask: "______", replacement: { _: /\d/ } });

  return (
    <div>
      <Typography variant="h4">Editar persona</Typography>
      <FormContainer>
        <Grid container spacing={2} margin={2}>
          <GeneralData codeRef={codeRef} />
          <Grid size={12}>
            <Button variant="contained">Guardar</Button>
          </Grid>
        </Grid>
      </FormContainer>
    </div>
  );
}

export default EditInterview;
