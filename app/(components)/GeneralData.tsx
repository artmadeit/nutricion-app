"use client";

import { Grid, Typography } from "@mui/material";
import { TextFieldElement } from "react-hook-form-mui";

type GeneralDataProps = {
  codeRef: any;
};

export default function GeneralData({ codeRef }: GeneralDataProps) {
  return (
    <Grid container spacing={2} margin={4}>
      <Grid size={12}>
        <Typography variant="h5" gutterBottom>
          Datos generales de persona
        </Typography>
      </Grid>
      <Grid size={12}>
        <TextFieldElement
          fullWidth
          name="code"
          label="Código"
          placeholder="0123456"
          required
          inputRef={codeRef}
        />
      </Grid>
      <Grid size={6}>
        <TextFieldElement fullWidth name="firstName" label="Nombre" required />
      </Grid>
      <Grid size={6}>
        <TextFieldElement fullWidth name="lastName" label="Apellido" required />
      </Grid>
    </Grid>
  );
}
