"use client";

import Button from '@mui/material/Button';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormContainer,
  SelectElement,
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
  mealtime: z.string(), // TODO: use enum,
  origin: z.string() // TODO: use enum,
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
          <Grid size={6}>
            <SelectElement
              label="Tiempo de comida"
              name="mealtime"
              options={[
                {
                  id: '1',
                  label: 'Desayuno'
                },
                {
                  id: '2',
                  label: 'M. mañana'
                },
                {
                  id: '3',
                  label: 'Almuerzo'
                },
                {
                  id: '4',
                  label: 'M. tarde'
                },
                {
                  id: '5',
                  label: 'Cena'
                },
                {
                  id: '6',
                  label: 'M. noche'
                }
              ]}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <SelectElement
              label="Procedencia"
              name="origin"
              options={[
                {
                  id: '1',
                  label: 'Casa'
                },
                {
                  id: '2',
                  label: 'Vecino'
                },
                {
                  id: '3',
                  label: 'Familiar'
                },
                {
                  id: '4',
                  label: 'Comedor popular'
                },
                {
                  id: '5',
                  label: 'Ambulante'
                },
                {
                  id: '6',
                  label: 'Kiosko'
                },
                {
                  id: '7',
                  label: 'Tienda/super'
                },
                {
                  id: '77',
                  label: 'Otro'
                },
                {
                  id: '99',
                  label: 'No sabe'
                }
              ]}
              fullWidth
            />
          </Grid>     
          <Grid size={6}>
            <SelectElement
              label="Fuente"
              name="source"
              options={[
                {
                  id: '1',
                  label: 'Peso directo'
                },
                {
                  id: '2',
                  label: 'Medida casera'
                },
                {
                  id: '3',
                  label: 'P. c/agua'
                },
                {
                  id: '4',
                  label: 'Foto atlas'
                },
                {
                  id: '5',
                  label: 'Modelo'
                },
              ]}
              fullWidth
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
