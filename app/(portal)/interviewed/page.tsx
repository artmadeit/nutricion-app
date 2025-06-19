"use client";

import { Fab, Stack, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { useRouter } from "next/navigation";

type Interviewed = {
  id?: number;
  code: number;
};

export default function ListInterviewed() {
  const router = useRouter();

  const [interview, ] = React.useState({
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
        { field: "code", headerName: "código" },
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
        <Tooltip title="Crear">
          <Fab color="primary" aria-labelledby="add">
            <AddIcon />
          </Fab>
        </Tooltip>
      </Stack>
      <div>
        <DataGrid columns={columns} rows={interview._embedded.inter} />
      </div>
    </Stack>
  );
}
