"use client";

import GeneralPersonData from "@/app/(components)/GeneralPersonData";
import { Button, Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import { FormContainer, useForm } from "react-hook-form-mui";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/app/(api)/api";
import { useRouter } from "next/navigation";
import { SnackbarContext } from "@/app/(components)/SnackbarContext";
import { schema } from "./personSchema";

// TODO: andre ver como reusar este schema para editar y crear interviewed

export default function Interviewed() {
  const snackbar = useContext(SnackbarContext);

  const formContext = useForm({
    defaultValues: {
      code: "",
      firstName: "",
      lastName: "",
    },
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  return (
    <div>
      <Typography variant="h4">Registrar persona</Typography>
      <FormContainer
        formContext={formContext}
        onSuccess={async (values) => {
          const response = await api.post("people", values);
          snackbar.showMessage("Información de la persona guardada");
          router.push("/interviewed/" + response.data.id);
        }}
      >
        <Grid container spacing={2} margin={2}>
          <GeneralPersonData disabled={false} />
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
