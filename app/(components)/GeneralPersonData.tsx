"use client";

import { Grid, Typography } from "@mui/material";
import { useMask } from "@react-input/mask";
import { TextFieldElement } from "react-hook-form-mui";

type GeneralPersonDataProps = {
  disabled: boolean;
};

export default function GeneralPersonData({
  disabled = false,
}: GeneralPersonDataProps) {
  const codeRef = useMask({ mask: "______", replacement: { _: /\d/ } });

  return (
    <>
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
          disabled={disabled}
        />
      </Grid>
      <Grid size={6}>
        <TextFieldElement
          fullWidth
          name="firstName"
          label="Nombre"
          required
          disabled={disabled}
        />
      </Grid>
      <Grid size={6}>
        <TextFieldElement
          fullWidth
          name="lastName"
          label="Apellido"
          required
          disabled={disabled}
        />
      </Grid>
    </>
  );
}
