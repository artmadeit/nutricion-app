"use client";

import { FileDownload } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Fab,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import React from "react";
import CsvDownloader from "react-csv-downloader";
import useSWR from "swr";
import { api } from "../(api)/api";
import { Page } from "../(api)/pagination";
import { withOutSorting } from "../(components)/helpers/withOutSorting";
import { usePagination } from "../(components)/hook-customization/usePagination";
import Loading from "../(components)/Loading";
import {
  foodTableNutritionCols,
  formatNutritionValue,
} from "./interview/IngredientFields";

type Interviewed = {
  id?: number;
  code: string;
  firstName: string;
  lastName: string;
};

export default function ListInterviewed() {
  const router = useRouter();
  const { paginationModel, setPaginationModel } = usePagination();
  const [searchText, setSearchText] = useQueryState("searchText", {
    defaultValue: "",
    throttleMs: 500,
  });

  const { data: people, isLoading } = useSWR<Page<Interviewed>>([
    `/people?searchText=${searchText}`,
    {
      params: {
        page: paginationModel.page,
        size: paginationModel.pageSize,
      },
    },
  ]);

  const columns = React.useMemo(
    () =>
      (
        [
          { field: "code", headerName: "Código" },
          { field: "firstName", headerName: "Nombre", flex: 1 },
          { field: "lastName", headerName: "Apellidos", flex: 1 },
          {
            field: "actions",
            type: "actions",
            width: 80,
            getActions: (params) => {
              return [
                <Tooltip title="Ver más" key="edit">
                  <GridActionsCellItem
                    icon={<SearchIcon />}
                    label="Ver"
                    onClick={() => router.push("/interviewed/" + params.id)}
                    //This could be replaced with a Link**
                  />
                </Tooltip>,
              ];
            },
          },
        ] as GridColDef<Interviewed>[]
      ).map(withOutSorting),
    [router]
  );

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const searchText = event.target.value;
    setSearchText(searchText);
  };

  const getCsvData = async () => {
    const response = await api.get("/interviews/export");
    const csvData = response.data.map(({ food, ...rest }: any) => ({
      ...rest,
      foodName: food.name,
      foodCode: food.code,
      ...foodTableNutritionCols.reduce(
        (prev, foodProp) => ({
          ...prev,
          [foodProp.id]: formatNutritionValue(
            food,
            rest.quantityConsumed,
            foodProp.id
          ),
        }),
        {}
      ),
    }));
    return csvData;
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack
        direction="row"
        sx={{ display: "flex", justifyContent: "space-between" }}
        alignItems="center"
        spacing={2}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4">Entrevistados</Typography>
          <Link href="/interviewed/create" style={{ paddingLeft: "10px" }}>
            <Tooltip title="Crear">
              <Fab color="primary" aria-labelledby="add">
                <AddIcon />
              </Fab>
            </Tooltip>
          </Link>
        </div>
        <div>
          <CsvDownloader
            datas={getCsvData}
            columns={[
              { displayName: "No encuesta", id: "interviewNumber" },
              { displayName: "Código participante", id: "personCode" },
              { displayName: "Nombre de participante", id: "personFullName" },
              { displayName: "Fecha de la encuesta", id: "interviewDate" },
              { displayName: "N°R24H", id: "interviewPersonNumber" },
              { displayName: "Día", id: "day" },
              { displayName: "Hora de consumo", id: "recipeConsumptionTime" },
              { displayName: "Procedencia", id: "recipeOrigin" },
              {
                displayName: "Código de forma de preparación",
                id: "recipeCode",
              },
              { displayName: "Nombre de preparación", id: "recipeName" },
              {
                displayName: "Porción servida (medida casera)",
                id: "portionServed",
              },
              { displayName: "Porción servida peso g", id: "weightInGrams" },
              { displayName: "Residuo porción", id: "portionResidue" },
              {
                displayName: "Residuo porción peso g",
                id: "weightInGramsResidue",
              },
              {
                displayName: "Cantidad consumida peso g",
                id: "quantityConsumed",
              },
              { displayName: "Código de fuente", id: "source" },
              {
                displayName: "Ingrediente (nombre del alimento)",
                id: "foodName",
              },
              { displayName: "Código alimento - tabla", id: "foodCode" },
              ...foodTableNutritionCols,
            ]}
            filename="entrevistas"
            wrapColumnChar={`"`}
          >
            <Tooltip title="Descargar en CSV">
              <Fab aria-labelledby="add">
                <FileDownload />
              </Fab>
            </Tooltip>
          </CsvDownloader>
        </div>
      </Stack>
      <TextField
        placeholder="Buscar..."
        variant="outlined"
        value={searchText}
        onChange={handleChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        fullWidth
      />
      <Box sx={{ width: "100%", height: "70vh" }}>
        {people ? (
          <DataGrid
            sx={{ overflowX: "scroll" }}
            loading={isLoading}
            columns={columns}
            rowCount={people?.page.totalElements || 0}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            disableColumnFilter
            rows={people._embedded?.people || []}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        ) : (
          <Loading />
        )}
      </Box>
    </Stack>
  );
}
