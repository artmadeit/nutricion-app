import { Page } from "@/app/(api)/pagination";
import { InfoOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dialog, DialogContent, DialogTitle, Divider, Fab, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
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
  calcioMg: number;
  fibra: number;
  energiaKcal: number;
  carbohidratog: number;
  fosforoMg: number;
  grasaTotalG: number;
  hierroMg: number;
  niacinaMg: number;
  potasioMg: number;
  proteinasG: number;
  riboflavinaMg: number;
  tiaminaMg: number;
  vitaminaAG: number;
  vitaminaCMg: number;
  zincMg: number;
}

export const mapFoodToOption = (x: Food) => ({
  label: x.name,
  ...x
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
    if (ingredient) {
      setSearchTextFood(ingredient.food?.label)
    }
  }, [ingredient])

  // TODO: andre probar instalar una libreria parece que esto trae errores
  // const [searchTextDebounced] = useDebounce(
  //   searchTextFood,
  //   500
  // );
  // cambiar la busqueda  useSWR<Page<Food>>(searchTextFoodDebounced? ...revisar este commit fix: page size
  const { data: foods } = useSWR<Page<Food>>(searchTextFood ? [
    `/foods/search/findByNameContainsIgnoringCase`,
    {
      params: {
        searchText: searchTextFood,
        page: 0,
        size: 50,
      },
    },
  ] : null);

  const [openDialog, setOpenDialog] = React.useState(false);

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
      <Grid size={4}>
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
      <Grid size={2}>
        <Tooltip title="Ver información nutricional">
          <IconButton color="primary" onClick={() => setOpenDialog(true)}>
            <InfoOutlined />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Información nutricional
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Energía (kcal)</TableCell>
                  <TableCell>Proteínas (g)</TableCell>
                  <TableCell>Grasa totales (g)</TableCell>
                  <TableCell>Carbohidratos disponibles (g)</TableCell>
                  <TableCell>Fibra (g)</TableCell>
                  <TableCell>Calcio (mg)</TableCell>                  
                  <TableCell>Fósforo (mg)</TableCell>
                  <TableCell>Zinc (mg)</TableCell>
                  <TableCell>Potasio (mg)</TableCell>
                  <TableCell>Hierro (mg)</TableCell>
                  <TableCell>Vitamina A (g)</TableCell>
                  <TableCell>Tiamina (mg)</TableCell>
                  <TableCell>Riboflavina (mg)</TableCell>
                  <TableCell>Niacina (mg)</TableCell>                          
                  <TableCell>Vitamina C (mg)</TableCell>                  
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{ingredient.food?.code ?? '-'}</TableCell>
                  <TableCell>{ingredient.food?.name ?? '-'}</TableCell>
                  <TableCell>{ingredient.food?.calcioMg != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.calcioMg).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.carbohidratog != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.carbohidratog).toFixed(2): '-'}</TableCell>
                  <TableCell>{ingredient.food?.fibra !=null ? getNutritionValue(Number(quantityConsumed), ingredient.food.fibra).toFixed(2): '-'}</TableCell>
                  <TableCell>{ingredient.food?.energiaKcal != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.energiaKcal).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.fosforoMg != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.fosforoMg).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.grasaTotalG != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.grasaTotalG).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.hierroMg != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.hierroMg).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.niacinaMg != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.niacinaMg).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.potasioMg != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.potasioMg).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.proteinasG != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.proteinasG).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.riboflavinaMg != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.riboflavinaMg).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.tiaminaMg != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.tiaminaMg).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.vitaminaAG != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.vitaminaAG).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.vitaminaCMg != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.vitaminaCMg).toFixed(2) : '-'}</TableCell>
                  <TableCell>{ingredient.food?.zincMg != null ? getNutritionValue(Number(quantityConsumed), ingredient.food.zincMg).toFixed(2) : '-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

const getNutritionValue = (quantityConsumed: number, nutrition: number) => 
  quantityConsumed * nutrition / 100.0;
