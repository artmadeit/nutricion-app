import React from "react";
import { Grid, TextField, Tooltip, Fab, Divider, Autocomplete, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextFieldElement, SelectElement } from "react-hook-form-mui";
import { api } from "@/app/(api)/api";

interface IngredientFieldsProps {
  ingredient: any;
  ingredientIndex: number;
  foodIndex: number;
  ingredientsLength: number;
  removeIngredient: (foodIndex: number, ingredientIndex: number) => void;
}

interface Food {
  id: number;
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
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly Food[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);

    try {
      const response = await api.get("/foods/search/findByNameContainsIgnoringCase?searchText=a&page=0&size=20")
      const foods = response.data._embedded?.foods
      setOptions(foods);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

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
        <TextFieldElement
          fullWidth
          name={`foods.${foodIndex}.ingredients.${ingredientIndex}.foodTableCode`}
          label="Código alimento tabla"
          disabled
        //TODO: automatic
        />
      </Grid>
      <Grid size={7}>
        {/* <TextFieldElement
          fullWidth
          name={`foods.${foodIndex}.ingredients.${ingredientIndex}.foodIngredients`}
          label="Ingrediente (nombre del Alimento)"
        /> */}
        <Autocomplete
          fullWidth
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          options={options}
          loading={loading}
          noOptionsText="TODO: andre cambiar texto"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Ingrediente (nombre del Alimento)"
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                },
              }}
            />
          )}
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
