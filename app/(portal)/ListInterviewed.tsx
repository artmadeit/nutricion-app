"use client";

import {
  Fab,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { useRouter } from "next/navigation";
import { esES } from "@mui/x-data-grid/locales";
import Link from "next/link";
import { withOutSorting } from "../(components)/helpers/withOutSorting";
import { usePagination } from "../(components)/hook-customization/usePagination";
import { useQueryState } from "../(components)/hook-customization/useQueryState";
import useDebounce from "../(components)/helpers/useDebounce";
import { Page } from "../(api)/pagination";
import useSWR from "swr";
import Loading from "../(components)/Loading";
import { FileDownload } from "@mui/icons-material";
// import { CSVLink } from "react-csv";
import dynamic from "next/dynamic";

const CSVLink = dynamic(() => import("react-csv").then((mod) => mod.CSVLink), {
  ssr: false,
});

type Interviewed = {
  id?: number;
  code: number;
  name: string;
  lastName: string;
};

export default function ListInterviewed() {
  const router = useRouter();
  const { paginationModel, setPaginationModel } = usePagination();
  const [searchText, setSearchText] = useQueryState("searchText", {
    defaultValue: "",
  });

  const debouncedSearch = useDebounce(searchText, 1000);
  const { data: people, isLoading } = useSWR<Page<Interviewed>>([
    `/people?searchText=${debouncedSearch}`,
    {
      params: {
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
      },
    },
  ]);

  const columns = React.useMemo(
    () =>
      (
        [
          { field: "code", headerName: "Código" },
          { field: "firstName", headerName: "Nombre" },
          { field: "lastName", headerName: "Apellido" },
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
                    // TODO: could this be replaced with a Link
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

  const csvData = people?._embedded.people || [];

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
          <CSVLink
            data={csvData}
            headers={[
              { label: "Código", key: "code" },
              { label: "Nombre", key: "firstName" },
              { label: "Apellido", key: "lastName" },
            ]}
            filename="interviewed.csv"
          >
            <Tooltip title="Descargar en CSV">
              <Fab aria-labelledby="add">
                <FileDownload />
              </Fab>
            </Tooltip>
          </CSVLink>
        </div>
      </Stack>
      <TextField
        placeholder="Buscar..."
        variant="outlined"
        value={searchText}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <div style={{ height: "70vh" }}>
        {people ? (
          <DataGrid
            loading={isLoading}
            columns={columns}
            rowCount={people?.page.totalElements || 0}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            disableColumnFilter
            rows={people?._embedded?.people || []}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        ) : (
          <Loading />
        )}
      </div>
    </Stack>
  );
}
