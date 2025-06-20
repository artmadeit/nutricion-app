"use client";

import GeneralData from "@/app/(components)/GeneralData";
import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useMask } from "@react-input/mask";
import { FormContainer } from "react-hook-form-mui";

export default function Interviewed() {
  const codeRef = useMask({ mask: "______", replacement: { _: /\d/ } });

  return (
    <div>
      <Typography variant="h4">Registrar persona</Typography>
      <FormContainer>
        <Grid container spacing={2} margin={2}>
          <GeneralData codeRef={codeRef} />
          <Grid size={12}>
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </Grid>
        </Grid>
      </FormContainer>
    </div>
  );
}
