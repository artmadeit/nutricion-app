"use client";

import GeneralData from "@/app/(components)/GeneralData";
import { Grid } from "@mui/material";
import { useMask } from "@react-input/mask";
import React from "react";
import { FormContainer } from "react-hook-form-mui";

function EditInterview() {
  const codeRef = useMask({ mask: "______", replacement: { _: /\d/ } });

  return (
    <div>
      <FormContainer>
        <Grid container spacing={2} margin={2}>
          <GeneralData codeRef={codeRef} />
        </Grid>
      </FormContainer>
    </div>
  );
}

export default EditInterview;
