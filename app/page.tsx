"use client";

import Button from '@mui/material/Button';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormContainer,
  TextFieldElement,
  useForm
} from "react-hook-form-mui";
import { DatePicker, renderTimeViewClock, TimePicker } from "@mui/x-date-pickers";
import { Grid, Typography } from '@mui/material';

const schema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  interviewDate: z.date(),
  interviewTime: z.date(),
});

export default function Home() {
  const formContext = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <div>
      <FormContainer formContext={formContext} onSuccess={(values) => {
        console.log(values)
      }}>
        <Grid container spacing={2} margin={4}>
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>
              Datos generales de persona
            </Typography>
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              fullWidth
              name="firstName"
              label="Nombre"
              required
            />
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              fullWidth
              name="lastName"
              label="Apellido"
              required
            />
          </Grid>
          <Grid size={6}>
            <DatePicker
              sx={{ width: "100%" }}
              value={formContext.getValues().interviewDate}
              label="Fecha de entrevista"
              onChange={(value: Date | null) => {
                if (value !== null) {
                  formContext.setValue("interviewDate", value);
                }
              }}
            />
          </Grid>
          <Grid size={6}>
            <TimePicker
              ampm
              sx={{ width: "100%" }}
              value={formContext.getValues().interviewTime}
              onChange={(value) => {
                if (value !== null) {
                  formContext.setValue("interviewTime", value);
                }
              }}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />
          </Grid>
          <Grid size={12}>
            + alimento

            alimento (autocomplete)
            gramos

          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained">
              Guardar
            </Button>
          </Grid>
        </Grid>
      </FormContainer>
    </div>
  );
}
