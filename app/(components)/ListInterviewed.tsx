"use client";

import { Fab, Stack, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { useRouter } from "next/navigation";
import { esES } from "@mui/x-data-grid/locales";
import Link from "next/link";

type Interviewed = {
  id?: number;
  code: number;
  name: string;
  lastName: string;
};

export default function ListInterviewed() {
  const router = useRouter();

  const [interview] = React.useState({
    _embedded: {
      inter: [],
    },
    page: {
      size: "",
      totalElements: "",
      totalPages: "",
      number: "",
    },
  });

  const columns = React.useMemo(
    () =>
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
      ] as GridColDef<Interviewed>[],
    [router]
  );

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h4">Entrevistados</Typography>
        <Link href="/interviewed">
          <Tooltip title="Crear">
            <Fab color="primary" aria-labelledby="add">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Link>
      </Stack>
      <div style={{ height: "70vh" }}>
        <DataGrid
          columns={columns}
          rows={interview._embedded.inter}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        />
      </div>
    </Stack>
  );
}
