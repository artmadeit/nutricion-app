"use client";

import { Fab, Stack, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { useRouter } from "next/navigation";

export default function ListInterviewed() {
  // const router = useRouter();

  // const columns = React.useMemo(
  //   () =>
  //     [
  //       { field: "code", headerName: "código" },
  //       {
  //         field: "actions",
  //         type: "actions",
  //         width: 80,
  //         getActions: () => {
  //           return [
  //             <Tooltip title="a" key="edit">
  //               <GridActionsCellItem
  //                 icon={<SearchIcon />}
  //                 label="Ver"
  //                 onClick={() => router.push("")}
  //               />
  //             </Tooltip>,
  //           ];
  //         },
  //       },
  //     ] as GridColDef<interviewType>[],
  //   [router]
  // );

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h4">Entrevistados</Typography>
        <Tooltip title="Crear">
          <Fab color="primary" aria-labelledby="add">
            <AddIcon />
          </Fab>
        </Tooltip>
        <div>
          <DataGrid columns={columns} rows={} />
        </div>
      </Stack>
    </Stack>
  );
}
