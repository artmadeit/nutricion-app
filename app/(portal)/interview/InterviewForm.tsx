"use client";

import GeneralData from "@/app/(components)/GeneralData";
import Loading from "@/app/(components)/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fab, Grid, TextField, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import {
  DatePicker,
  renderTimeViewClock,
  TimePicker,
} from "@mui/x-date-pickers";
import { useMask } from "@react-input/mask";
import { format } from "date-fns/format";
import { es } from "date-fns/locale";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
  useFieldArray,
  useForm,
} from "react-hook-form-mui";
import useSWR from "swr";
import { z } from "zod";

const schema = z.object({
  code: z.string(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  interviewDate: z.date(),
  interviewNumber: z.string(),
  foods: z.array(
    z.object({
      origin: z.string(), // TODO: use enum,
      consumptionTime: z.date(),
      ingredients: z.array(
        z.object({
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

  console.log(person)
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
                <Grid container>
                  <Grid size={12}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{ paddingTop: "20px" }}
                    >
                      Ingredientes
                    </Typography>
                  </Grid>
                  {ingredients.map((ingredient, ingredientIndex) => {
                    const { weightInGrams, weigthInGramsResidue } = ingredient;
                    const quantityConsumed = (
                      weightInGrams - weigthInGramsResidue
                    ).toFixed(1);

                    return (
                      <React.Fragment key={ingredientIndex}>
                        <Grid size={2}>
                          <TextField
                            variant="outlined"
                            label="N° Orden de Alimento"
                            value={ingredientIndex + 1}
                            disabled
                            fullWidth
                          />
                        </Grid>
                        <Grid size={4}>
                          <TextFieldElement
                            fullWidth
                            name={`foods.${foodIndex}.ingredients.${ingredientIndex}.foodTableCode`}
                            label="Código alimento tabla"
                            disabled
                          //TODO: automatic
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
                            name={`foods.${foodIndex}.ingredients.${ingredientIndex}.foodIngredients`}
                            label="Ingrediente (nombre del Alimento)"
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextFieldElement
                            fullWidth
                            name={`foods.${foodIndex}.ingredients.${ingredientIndex}.portionServed`}
                            label="Porción servida (medida casera)"
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextFieldElement
                            fullWidth
                            name={`foods.${foodIndex}.ingredients.${ingredientIndex}.weightInGrams`}
                            label="Peso en gramos de la porción servida"
                            required
                            type="number"
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextFieldElement
                            fullWidth
                            name={`foods.${foodIndex}.ingredients.${ingredientIndex}.portionResidue`}
                            label="Residuo porción"
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextFieldElement
                            fullWidth
                            name={`foods.${foodIndex}.ingredients.${ingredientIndex}.weigthInGramsResidue`}
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
                            fullWidth
                          />
                        </Grid>
                        <Grid size={6}>
                          <SelectElement
                            label="Fuente"
                            name={`foods.${foodIndex}.ingredients.${ingredientIndex}.source`}
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
                              {
                                id: "6",
                                label: "Comida del colegio",
                              },
                            ]}
                            fullWidth
                          />
                        </Grid>
                      </React.Fragment>
                    );
                  })}
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
