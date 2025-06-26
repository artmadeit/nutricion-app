"use client";

import GeneralData from "@/app/(components)/GeneralData";
import Loading from "@/app/(components)/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider, Fab, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import {
  DatePicker,
  renderTimeViewClock,
  TimePicker,
} from "@mui/x-date-pickers";
import { format } from "date-fns/format";
import { es } from "date-fns/locale";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
  useFieldArray,
  useForm,
} from "react-hook-form-mui";
import useSWR from "swr";
import { z } from "zod";
import { IngredientFields } from "./IngredientFields";

// TODO: andre hacer que todos los campos sean obligatorios requeridos 
// (creo que x defecto es asi en zod, en yup si es necesario required)
// pero corroborar
const schema = z.object({
  code: z.string(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  interviewDate: z.date(),
  interviewNumber: z.string(),
  foods: z.array(
    // TODO: andre hacer que campos coincidan con los del backend (ver swagger POST /interviews)
    // eso nos servira al momento que hagamos el submit como hemos hecho antes
    z.object({
      // TODO: andre aca falta agregar mas campos
      origin: z.string(), // TODO: use enum,
      consumptionTime: z.date(),
      ingredients: z.array(
        z.object({
          // TODO: andre aca falta agregar mas campos
          weightInGrams: z
            .number()
            .min(0.1)
            .max(999.9)
            .refine((val) => Number.isInteger(val * 10), {
              message: "Debe tener exactamente un decimal",
            }),
          weigthInGramsResidue: z
            .number()
            .min(0.0)
            .max(999.9)
            .refine((val) => Number.isInteger(val * 10), {
              message: "Debe tener exactamente un decimal",
            }),
        })
      ),
    })
  ),
});

const mealtimeOptions = [
  {
    id: "1",
    label: "Desayuno",
    startHour: 5,
    endHour: 10,
  },
  {
    id: "2",
    label: "M. mañana",
    startHour: 10,
    endHour: 12,
  },
  {
    id: "3",
    label: "Almuerzo",
    startHour: 12,
    endHour: 15,
  },
  {
    id: "4",
    label: "M. tarde",
    startHour: 15,
    endHour: 18,
  },
  {
    id: "5",
    label: "Cena",
    startHour: 18,
    endHour: 22,
  },
  {
    id: "6",
    label: "M. noche",
    startHour: 22,
    endHour: 5,
  },
];

const mealtime = (consumptionTime: Date) => {
  if (!consumptionTime) return mealtimeOptions[0].label;

  const hour = consumptionTime.getHours();

  const mealTime = mealtimeOptions.find((option) => {
    if (option.startHour > option.endHour) {
      // Handle overnight case (M. noche)
      return hour >= option.startHour || hour < option.endHour;
    }
    return hour >= option.startHour && hour < option.endHour;
  });

  return mealTime?.label || mealtimeOptions[0].label;
};

const emptyIngredient = {
  weightInGrams: 0,
  weigthInGramsResidue: 0,
};

const emptyFood = {
  consumptionTime: new Date(2000, 0, 1, 12, 0, 0),
  origin: "",
  ingredients: [{ ...emptyIngredient }],
};

const defaultInterviewData = {
  interviewNumber: "001",
  interviewDate: new Date(),
  foods: [emptyFood],
}

export function InterviewForm({ personId }: { personId: number }) {
  const searchParams = useSearchParams();
  const interviewNumber = +(searchParams.get("number") || 1);
  const { data: person } = useSWR(personId ? `people/${personId}` : null);

  const formContext = useForm({
    defaultValues: {
      ...defaultInterviewData
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (person) {
      formContext.reset({
        code: person.code,
        firstName: person.firstName,
        lastName: person.lastName,

        ...defaultInterviewData
      })
    }
  }, [person])

  const {
    fields: foodFields,
    append,
    remove,
  } = useFieldArray({
    control: formContext.control,
    name: "foods",
  });

  const interviewDate = formContext.watch("interviewDate");
  const day = interviewDate
    ? format(interviewDate, "eeee", { locale: es })
    : "";


  const handleAddIngredient = (foodIndex: number) => {
    const currentIngredients =
      formContext.getValues(`foods.${foodIndex}.ingredients`) || [];
    formContext.setValue(`foods.${foodIndex}.ingredients`, [
      ...currentIngredients,
      {
        ...emptyIngredient,
      },
    ]);
  };

  const removeIngredient = (foodIndex: number, ingredientIndex: number) => {
    const currentIngredients =
      formContext.getValues(`foods.${foodIndex}.ingredients`) || [];
    const updatedIngredients = currentIngredients.filter(
      (_, index) => index !== ingredientIndex
    );
    formContext.setValue(`foods.${foodIndex}.ingredients`, updatedIngredients);
  };

  if (!person) return <Loading />;
  return (
    <div>
      <FormContainer
        formContext={formContext}
        onSuccess={(values) => {
          console.log(values);
        }}
      >
        <Grid container spacing={2} margin={4}>
          <GeneralData />
          <Grid size={12}>
            <Typography
              variant="h5"
              gutterBottom
              style={{ paddingTop: "20px" }}
            >
              Datos recordatorio - R24H
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
            <FormControl fullWidth>
              <InputLabel id="interviewNumber">N° R24H</InputLabel>
              <Select
                labelId="interviewNumber"
                id="interviewNumber"
                value={interviewNumber}
                label="N° R24H"
                disabled
              >
                <MenuItem value={1}>Primero</MenuItem>
                <MenuItem value={2}>Segundo</MenuItem>
              </Select>
            </FormControl>
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
            <TextField
              label="Día"
              variant="outlined"
              value={day}
              disabled
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <Typography
              variant="h5"
              gutterBottom
              style={{ paddingTop: "20px" }}
            >
              Preparaciones
            </Typography>
          </Grid>
          {foodFields.map((field, foodIndex) => {
            const food = formContext.watch(`foods.${foodIndex}`);
            const { consumptionTime, ingredients } = food;

            return (
              <Grid container key={foodIndex}>
                <Grid size={5}>
                  <TextFieldElement
                    fullWidth
                    name={`foods.${foodIndex}.preparationCode`}
                    label="Código de forma de preparación"
                  />
                </Grid>
                <Grid size={6}>
                  <TextFieldElement
                    fullWidth
                    name={`foods.${foodIndex}.preparationName`}
                    label="Nombre de la preparación"
                  />
                </Grid>
                <Grid
                  size={1}
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {foodFields.length > 1 && (
                    <Tooltip title="Eliminar preparación">
                      <Fab size="small" onClick={() => remove(foodIndex)}>
                        <DeleteIcon />
                      </Fab>
                    </Tooltip>
                  )}
                </Grid>
                <Grid size={4}>
                  <TimePicker
                    label="Hora de consumo"
                    ampm
                    sx={{ width: "100%" }}
                    value={consumptionTime}
                    onChange={(value) => {
                      if (value !== null) {
                        formContext.setValue(
                          `foods.${foodIndex}.consumptionTime`,
                          value
                        );
                      }
                    }}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Tiempo de comida"
                    variant="outlined"
                    value={mealtime(consumptionTime)}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid size={4}>
                  <SelectElement
                    label="Procedencia"
                    name={`foods.${foodIndex}.origin`}
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
                <Grid container sx={{ pl: 8 }}>
                  <Grid size={12}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{ paddingTop: "20px" }}
                    >
                      Ingredientes
                    </Typography>
                  </Grid>
                  {ingredients.map((ingredient, ingredientIndex) => (
                    <IngredientFields
                      key={ingredientIndex}
                      ingredient={ingredient}
                      ingredientIndex={ingredientIndex}
                      foodIndex={foodIndex}
                      ingredientsLength={ingredients.length}
                      removeIngredient={removeIngredient}
                    />
                  ))}
                  <Grid size={12}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      fullWidth
                      onClick={() => handleAddIngredient(foodIndex)}
                    >
                      Agregar ingrediente
                    </Button>
                  </Grid>
                </Grid>
                <Grid size={12}>
                  <Divider />
                </Grid>
              </Grid>
            );
          })}

          <Grid size={12}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => {
                append(emptyFood);
              }}
            >
              Agregar preparación
            </Button>
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
