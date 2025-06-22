"use client";

import { Fab, Stack, Tooltip, Typography } from "@mui/material";
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
    () => (
      [
        { field: "code", headerName: "Código" },
        { field: "name", headerName: "Nombre" },
        { field: "lastName", headerName: "Apellido" },
        {
          field: "actions",
          type: "actions",
          width: 80,
          getActions: () => {
            return [
              <Tooltip title="a" key="edit">
                <GridActionsCellItem
                  icon={<SearchIcon />}
                  label="Ver"
                  onClick={() => router.push("")}
                />
              </Tooltip>,
            ];
          },
        },
      ] as GridColDef<Interviewed>[]).map(withOutSorting),
    [router]
  );

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h4">Entrevistados</Typography>
        <Link href="/interviewed/create">
          <Tooltip title="Crear">
            <Fab color="primary" aria-labelledby="add">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Link>
      </Stack>
      <div style={{ height: "70vh" }}>
        {
          people ?
            <DataGrid
              loading={isLoading}
              columns={columns}
              rowCount={people?.page.totalElements || 0}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              disableColumnFilter
              rows={people._embedded?.persons || []}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            /> : <Loading />
        }
      </div>
    </Stack>
  );
}
