"use client";

import { api } from "@/app/(api)/api";
import GeneralData from "@/app/(components)/GeneralData";
import Loading from "@/app/(components)/Loading";
import { Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FormContainer } from "react-hook-form-mui";
import useSWR from "swr";


export function EditInterview({ id }: { id: number }) {
  
    const router = useRouter()
    const { data: person } = useSWR(id ? `people/${id}` : null);
  
    if (!person) return <Loading />;
    return (
      <div>
        <Typography variant="h4">Editar persona</Typography>
        <FormContainer
          defaultValues={person}
          onSuccess={async (values) => {
            const response = await api.put(`/people/${id}`, values);
            alert("Información de la persona guardada");
            router.push("/")
          }}>
          <Grid container spacing={2} margin={2}>
            <GeneralData />
            <Grid size={12}>
              <Button variant="contained" type="submit">Guardar</Button>
            </Grid>
          </Grid>
        </FormContainer>
      </div>
    );
  }
  