import { Page } from "@/app/(api)/pagination";
import useDebounce from "@/app/(components)/helpers/useDebounce";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider, Fab, Grid, TextField, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import { AutocompleteElement, SelectElement, TextFieldElement } from "react-hook-form-mui";
import useSWR from "swr";

interface IngredientFieldsProps {
  ingredient: any;
  ingredientIndex: number;
  recipeIndex: number;
  ingredientsLength: number;
  removeIngredient: (recipeIndex: number, ingredientIndex: number) => void;
}

interface Food {
  id: number;
  code: string;
  name: string;
}

export const mapFoodToOption = (x: Food) => ({
  id: x.id,
  label: x.name,
  code: x.code
})

export const emptyFood = { id: 0, label: "" }

export const IngredientFields: React.FC<IngredientFieldsProps> = ({
  ingredient,
  ingredientIndex,
  recipeIndex,
  ingredientsLength,
  removeIngredient,
}) => {
  const { weightInGrams, weigthInGramsResidue } = ingredient;
  const quantityConsumed = (
    weightInGrams - weigthInGramsResidue
  ).toFixed(1);

  const [searchTextFood, setSearchTextFood] = React.useState("");
  useEffect(() => {
    if(ingredient) {
      setSearchTextFood(ingredient.food?.label)
    }
  }, [ingredient])

  // TODO: andre probar instalar una libreria parece que esto trae errores
  // const [searchTextDebounced] = useDebounce(
  //   searchTextFood,
  //   500
  // );
  // cambiar la busqueda  useSWR<Page<Food>>(searchTextFoodDebounced? ...revisar este commit fix: page size
  const { data: foods } = useSWR<Page<Food>>(searchTextFood? [
    `/foods/search/findByNameContainsIgnoringCase`,
    {
      params: {
        searchText: searchTextFood,
        page: 0,
        size: 10
      },
    },
  ]: null);

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
          value={ingredient.food?.code || "-"}
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
          name={`recipes.${recipeIndex}.ingredients.${ingredientIndex}.food`}
          options={
            foods?._embedded?.foods.map(mapFoodToOption) || []
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
            <Fab size="small" onClick={() => removeIngredient(recipeIndex, ingredientIndex)}>
              <DeleteIcon />
            </Fab>
          </Tooltip>
        )}
      </Grid>
      <Grid size={6}>
        <TextFieldElement
          fullWidth
          name={`recipes.${recipeIndex}.ingredients.${ingredientIndex}.portionServed`}
          label="Porción servida (medida casera)"
        />
      </Grid>
      <Grid size={6}>
        <TextFieldElement
          fullWidth
          name={`recipes.${recipeIndex}.ingredients.${ingredientIndex}.weightInGrams`}
          label="Peso en gramos de la porción servida"
          required
          type="number"
        />
      </Grid>
      <Grid size={6}>
        <TextFieldElement
          fullWidth
          name={`recipes.${recipeIndex}.ingredients.${ingredientIndex}.portionResidue`}
          label="Residuo porción"
        />
      </Grid>
      <Grid size={6}>
        <TextFieldElement
          fullWidth
          name={`recipes.${recipeIndex}.ingredients.${ingredientIndex}.weigthInGramsResidue`}
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
          name={`recipes.${recipeIndex}.ingredients.${ingredientIndex}.source`}
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
