"use client";

import GeneralData from "@/app/(components)/GeneralData";
import { Button, Grid, Typography } from "@mui/material";
import React from "react";
// import { useMask } from "@react-input/mask";
import { FormContainer, useForm } from "react-hook-form-mui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/app/(api)/api";
import { useRouter } from "next/navigation";


const schema = z.object({
  code: z.string().trim(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
})

export default function Interviewed() {
  const formContext = useForm({
    defaultValues: {
      code: "",
      firstName: "",
      lastName: "",
    },
    resolver: zodResolver(schema),
  });
  const router = useRouter()

  return (
    <div>
      <Typography variant="h4">Registrar persona</Typography>
      <FormContainer
        formContext={formContext}
        onSuccess={async (values) => {
          const response = await api.post("people", values);
          alert("Información de la persona guardada");
          router.push("/interviewed/" + response.data.id)       
        }}>
        <Grid container spacing={2} margin={2}>
          <GeneralData />
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
