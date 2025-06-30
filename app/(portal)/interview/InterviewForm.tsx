"use client";

import { api } from "@/app/(api)/api";
import GeneralPersonData from "@/app/(components)/GeneralPersonData";
import Loading from "@/app/(components)/Loading";
import { parseDate, parseTime } from "@/app/date";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Divider,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import {
  DatePicker,
  renderTimeViewClock,
  TimePicker,
} from "@mui/x-date-pickers";
import { lightFormat } from "date-fns/lightFormat";
import { format } from "date-fns/format";
import { es } from "date-fns/locale";
import { useRouter, useSearchParams } from "next/navigation";
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
import { emptyFood, IngredientFields, mapFoodToOption } from "./IngredientFields";

const schema = z.object({
  code: z.string(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  interviewDate: z.date(),
  interviewNumber: z.string(),
  recipes: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      consumptionTime: z.date(),
      origin: z.string(), // TODO: use enum,
      ingredients: z.array(
        z.object({
          food: z.object({
            id: z.number()
          }).refine((food) => food.id > 0, {
            message: "Debe seleccionar un alimento",
          }),
          portionServed: z.string(),
          portionResidue: z.string(),
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
          source: z.string(),
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
  portionServed: "",
  portionResidue: "",
  source: "",
  food: emptyFood
};

const emptyRecipe = {
  code: "",
  name: "",
  consumptionTime: new Date(2000, 0, 1, 12, 0, 0),
  origin: "",
  ingredients: [{ ...emptyIngredient }],
};

const defaultInterviewData = {
  interviewNumber: "-",
  interviewDate: new Date(),
  recipes: [emptyRecipe],
};

export function InterviewForm({ personId }: { personId: number }) {
  const router = useRouter()
  const searchParams = useSearchParams();
  const interviewPersonNumber = +(searchParams.get("number") || 1);
  const { data: person } = useSWR(personId ? `people/${personId}` : null);
  const { data: interview } = useSWR(personId ? [
    `interviews/search/findByPersonIdAndInterviewPersonNumber`, {
      params: {
        personId,
        interviewPersonNumber,
      },
    }] : null);

  const formContext = useForm({
    defaultValues: {
      ...defaultInterviewData,
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (person) {
      formContext.reset({
        code: person.code,
        firstName: person.firstName,
        lastName: person.lastName,

        ...defaultInterviewData,
      });
    }
  }, [person]);

  useEffect(() => {
    if (interview) {
      console.log(interview)
      formContext.reset({
        ...formContext.getValues(),
        interviewDate: parseDate(interview.interviewDate),
        interviewNumber: interview.interviewNumber,
        recipes: interview.recipes.map((x: any) => ({
          code: x.code,
          name: x.name,
          consumptionTime: parseTime(x.consumptionTime),
          origin: x.origin,
          ingredients: x.ingredients.map((i: any) => ({
            ...i,
            food: mapFoodToOption(i.food)
          }))
        }))
      });
    }
  }, [interview]);

  const {
    fields: recipeFields,
    append,
    remove,
  } = useFieldArray({
    control: formContext.control,
    name: "recipes",
  });

  const interviewDate = formContext.watch("interviewDate");
  const day = interviewDate
    ? format(interviewDate, "eeee", { locale: es })
    : "";

  const handleAddIngredient = (recipeIndex: number) => {
    const currentIngredients =
      formContext.getValues(`recipes.${recipeIndex}.ingredients`) || [];
    formContext.setValue(`recipes.${recipeIndex}.ingredients`, [
      ...currentIngredients,
      {
        ...emptyIngredient,
      },
    ]);
  };

  const removeIngredient = (recipeIndex: number, ingredientIndex: number) => {
    const currentIngredients =
      formContext.getValues(`recipes.${recipeIndex}.ingredients`) || [];
    const updatedIngredients = currentIngredients.filter(
      (_, index) => index !== ingredientIndex
    );
    formContext.setValue(`recipes.${recipeIndex}.ingredients`, updatedIngredients);
  };

  if (!person) return <Loading />;
  return (
    <div>
      <FormContainer
        formContext={formContext}
        onSuccess={async (values) => {
          const payload = {
            "interviewDate": lightFormat(values.interviewDate, "yyyy-MM-dd"),
            "personId": +personId,
            "recipes": values.recipes.map(r =>
            ({
              "code": r.code,
              "name": r.name,
              "origin": r.origin,
              "consumptionTime": lightFormat(r.consumptionTime, "HH:mm:ss"),
              "ingredients": r.ingredients.map(x => ({
                "foodId": x.food.id,
                "portionServed": x.portionServed,
                "weightInGrams": x.weightInGrams,
                "portionResidue": x.portionResidue,
                "weigthInGramsResidue": x.weigthInGramsResidue,
                "source": x.source
              }))
            }))
          }

          await api.post(`/interviews`, payload);
          alert("Entrevista guardada"); // TODO: andre mostrar el codigo (code) de la entrevista guardada, obtenerlo del response 
          router.push(`/interviewed/${personId}`)
        }}
      >
        <Grid container spacing={2} margin={4}>
          <GeneralPersonData disabled />
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
              <InputLabel id="interviewPersonNumber">N° R24H</InputLabel>
              <Select
                labelId="interviewPersonNumber"
                id="interviewPersonNumber"
                value={interviewPersonNumber}
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
          {recipeFields.map((field, recipeIndex) => {
            const recipe = formContext.watch(`recipes.${recipeIndex}`);
            const { consumptionTime, ingredients } = recipe;

            return (
              <Grid container key={recipeIndex}>
                <Grid size={5}>
                  <TextFieldElement
                    fullWidth
                    name={`recipes.${recipeIndex}.code`}
                    label="Código de forma de preparación"
                  />
                </Grid>
                <Grid size={6}>
                  <TextFieldElement
                    fullWidth
                    name={`recipes.${recipeIndex}.name`}
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
                  {recipeFields.length > 1 && (
                    <Tooltip title="Eliminar preparación">
                      <Fab size="small" onClick={() => remove(recipeIndex)}>
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
                          `recipes.${recipeIndex}.consumptionTime`,
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
                    name={`recipes.${recipeIndex}.origin`}
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
                  {ingredients.map((ingredient, ingredientIndex) => (
                    <IngredientFields
                      key={ingredientIndex}
                      ingredient={ingredient}
                      ingredientIndex={ingredientIndex}
                      recipeIndex={recipeIndex}
                      ingredientsLength={ingredients.length}
                      removeIngredient={removeIngredient}
                    />
                  ))}
                  <Grid size={12}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      fullWidth
                      onClick={() => handleAddIngredient(recipeIndex)}
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
                append(emptyRecipe);
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
