"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Grid, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import {
  DatePicker,
  renderTimeViewClock,
  TimePicker,
} from "@mui/x-date-pickers";
import { useMask } from "@react-input/mask";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import { z } from "zod";
import { format } from "date-fns/format";
import { es } from 'date-fns/locale'

const schema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  interviewDate: z.date(),
  interviewTime: z.date(),
  mealtime: z.string(), // TODO: use enum,
  origin: z.string(), // TODO: use enum,
  interviewNumber: z.string(),
  code: z.string(),
  weightInGrams: z
    .number()
    .min(0.1)
    .max(999.9)
    .refine((val) => Number.isInteger(val * 10), {
      message: "Debe tener exactamente un decimal",
    }),
  weigthInGramsResidue: z
    .number()
    .min(0.1)
    .max(999.9)
    .refine((val) => Number.isInteger(val * 10), {
      message: "Debe tener exactamente un decimal",
    }),
});

export default function Home() {
  const formContext = useForm({
    defaultValues: {
      interviewNumber: "001",
      interviewDate: new Date(),
    },
    resolver: zodResolver(schema),
  });


  const interviewDate = formContext.watch("interviewDate");
  const day = interviewDate ? format(interviewDate, "eeee", { locale: es }) : "";

  const codeRef = useMask({ mask: "______", replacement: { _: /\d/ } });

  const weightInGrams = formContext.watch("weightInGrams");
  const weigthInGramsResidue = formContext.watch("weigthInGramsResidue");
  const quantityConsumed = (weightInGrams - weigthInGramsResidue).toFixed(1) || 0;

  return (
    <div>
      <FormContainer
        formContext={formContext}
        onSuccess={(values) => {
          console.log(values);
        }}
      >
        <Grid container spacing={2} margin={4}>
          <Grid size={12}>
            <Typography
              variant="h5"
              gutterBottom
              style={{ paddingTop: "20px" }}
            >
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
          <Grid size={12}>
            <Typography
              variant="h5"
              gutterBottom
              style={{ paddingTop: "20px" }}
            >
              Datos generales de entrevista
            </Typography>
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              fullWidth
              name="interviewNumber"
              label="Número de entrevista"
              required
              disabled
            />
          </Grid>
          <Grid size={6}>
            {/* TODO: automatic */}
            <SelectElement
              label="N° R24H"
              name=""
              options={[
                {
                  id: "1",
                  label: "Primero",
                },
                {
                  id: "2",
                  label: "Segundo",
                },
              ]}
              fullWidth
            />
          </Grid>
          
          <Grid size={6}>
            <DatePicker
              sx={{ width: "100%" }}
              value={interviewDate}
              label="Fecha de encuesta"
              onChange={(value: Date | null) => {
                if (value !== null) {
                  formContext.setValue("interviewDate", value);
                }
              }}
            />
          </Grid>
          <Grid size={6}>
            <TextField label="Día" variant="outlined" value={day} disabled fullWidth />
          </Grid>
          <Grid size={12}>
            <Typography
              variant="h5"
              gutterBottom
              style={{ paddingTop: "20px" }}
            >
              Datos generales de consumo de alimentos
            </Typography>
          </Grid>
          <Grid size={6}>
            {/* TODO: automatic */}
            <TextFieldElement
              fullWidth
              name="orderFood"
              label="N° Orden de Alimento"
            />
          </Grid>
          <Grid size={6}>
            <TimePicker
              label="Hora de consumo"
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
                  id: "1",
                  label: "Desayuno",
                },
                {
                  id: "2",
                  label: "M. mañana",
                },
                {
                  id: "3",
                  label: "Almuerzo",
                },
                {
                  id: "4",
                  label: "M. tarde",
                },
                {
                  id: "5",
                  label: "Cena",
                },
                {
                  id: "6",
                  label: "M. noche",
                },
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
                  id: "1",
                  label: "Casa",
                },
                {
                  id: "2",
                  label: "Vecino",
                },
                {
                  id: "3",
                  label: "Familiar",
                },
                {
                  id: "4",
                  label: "Comedor popular",
                },
                {
                  id: "5",
                  label: "Ambulante",
                },
                {
                  id: "6",
                  label: "Kiosko",
                },
                {
                  id: "7",
                  label: "Tienda/super",
                },
                {
                  id: "77",
                  label: "Otro", // TODO: add observation field
                },
                {
                  id: "99",
                  label: "No sabe",
                },
              ]}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              //TODO
              fullWidth
              name="preparation"
              label="Preparación"
            />
          </Grid>
          <Grid size={6}>
            {/* <Autocomplete
              disablePortal
              options={top100Films}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ingrediente (nombre del Alimento)"
                />
              )}
            /> */}
            <TextFieldElement
              //TODO  
              fullWidth
              name="foodIngredients"
              label="Ingrediente (nombre del Alimento)"
            />
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              //TODO
              fullWidth
              name="foodTableCode"
              label="Código alimento tabla"
            />
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              fullWidth
              name="portionServed"
              label="Porción servida (medida casera)"
            />
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              fullWidth
              name="weightInGrams"
              label="Peso en gramos de la porción servida"
              required
              type="number"
            />
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              fullWidth
              name="portionResidue"
              label="Residuo porción"
            />
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              fullWidth
              name="weigthInGramsResidue"
              label="Peso en gramos del residuo de porción"
              type="number"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Cantidad consumida"
              variant="outlined"
              value={quantityConsumed}
              disabled
              fullWidth />
          </Grid>
          <Grid size={6}>
            <SelectElement
              label="Fuente"
              name="source"
              options={[
                {
                  id: "1",
                  label: "Peso directo",
                },
                {
                  id: "2",
                  label: "Medida casera",
                },
                {
                  id: "3",
                  label: "P. c/agua",
                },
                {
                  id: "4",
                  label: "Foto atlas",
                },
                {
                  id: "5",
                  label: "Modelo",
                },
              ]}
              fullWidth
            />
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
