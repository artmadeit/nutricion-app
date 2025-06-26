import React from "react";
import { Grid, TextField, Tooltip, Fab, Divider, Autocomplete, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextFieldElement, SelectElement, AutocompleteElement } from "react-hook-form-mui";
import { api } from "@/app/(api)/api";
import useDebounce from "@/app/(components)/helpers/useDebounce";
import useSWR from "swr";
import { Page } from "@/app/(api)/pagination";

interface IngredientFieldsProps {
  ingredient: any;
  ingredientIndex: number;
  foodIndex: number;
  ingredientsLength: number;
  removeIngredient: (foodIndex: number, ingredientIndex: number) => void;
}

interface Food {
  id: number;
  code: string;
  name: string;
}

export const IngredientFields: React.FC<IngredientFieldsProps> = ({
  ingredient,
  ingredientIndex,
  foodIndex,
  ingredientsLength,
  removeIngredient,
}) => {
  const { weightInGrams, weigthInGramsResidue } = ingredient;
  const quantityConsumed = (
    weightInGrams - weigthInGramsResidue
  ).toFixed(1);

  const [searchTextFood, setSearchTextFood] = React.useState("");

  const [searchTextDebounced] = useDebounce(
    searchTextFood,
    500
  );
  const { data: foods } = useSWR<Page<Food>>([
    `/foods/search/findByNameContainsIgnoringCase?searchText=${encodeURIComponent(searchTextDebounced)}&page=0&size=20`
  ]);

  return (
    <React.Fragment>
      <Grid size={1}>
        <TextField
          variant="outlined"
          label="N° Orden de Alimento"
          value={ingredientIndex + 1}
          disabled
          fullWidth
        />
      </Grid>
      <Grid size={3}>
        <TextField
          label="Código alimento tabla"
          value={ingredient.foodIngredient?.code || "-"}
          disabled
          fullWidth
        />
      </Grid>
      <Grid size={7}>
        <AutocompleteElement
          autocompleteProps={{
            freeSolo: true,
            onInputChange: (_event, newInputValue) => {
              setSearchTextFood(newInputValue);
            },
          }}
          label="Ingrediente (nombre del Alimento)"
          name={`foods.${foodIndex}.ingredients.${ingredientIndex}.foodIngredient`}
          options={
            foods?._embedded?.foods.map((x) => ({
              id: x.id,
              label: x.name,
              code: x.code
            })) || []
          }
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
        {ingredientsLength > 1 && (
          <Tooltip title="Eliminar ingrediente">
            <Fab size="small" onClick={() => removeIngredient(foodIndex, ingredientIndex)}>
              <DeleteIcon />
            </Fab>
          </Tooltip>
        )}
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
      <Grid size={12}>
        <Divider />
      </Grid>
    </React.Fragment>
  );
};
