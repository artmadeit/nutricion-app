"use client";

import { api } from "@/app/(api)/api";
import GeneralPersonData from "@/app/(components)/GeneralPersonData";
import { withOutSorting } from "@/app/(components)/helpers/withOutSorting";
import Loading from "@/app/(components)/Loading";
import { SnackbarContext } from "@/app/(components)/SnackbarContext";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Fab, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useMemo } from "react";
import { FormContainer } from "react-hook-form-mui";
import useSWR from "swr";


type Interview = {
  id: number;
  interviewPersonNumber: string,
  interviewDate: Date,
}

export function EditInterview({ id }: { id: number }) {
  const snackbar = useContext(SnackbarContext)
  const router = useRouter()
  const { data: person } = useSWR(id ? `people/${id}` : null);
  const { data: interviews, isLoading } = useSWR(id ? `interviews?personId=${id}` : null);

  const columns = useMemo(
    () => (
      [
        { field: "interviewPersonNumber", headerName: "N° R24H" },
        { field: "interviewDate", headerName: "Fecha" },
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
                  onClick={() => router.push(`/interview/${id}?number=${params.row.interviewPersonNumber}`)}
                  //This could be replaced with a Link**
                />
              </Tooltip>,
            ];
          },
        },
      ] as GridColDef<Interview>[]).map(withOutSorting),
    [router]
  );

  if (!person) return <Loading />;
  return (
    <div>
      <Typography variant="h4">Editar persona</Typography>
      <FormContainer
        defaultValues={person}
        onSuccess={async (values) => {
          await api.put(`/people/${id}`, values);
          snackbar.showMessage("Información de la persona guardada");          
          router.push("/")
        }}>
        <Grid container spacing={2} margin={2}>
          <GeneralPersonData />
          <Grid size={12}>
            <Button variant="contained" type="submit">Guardar</Button>
          </Grid>
          <Grid size={12}>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h5">Entrevistas</Typography>
                <Link href={`/interview/${id}?number=${interviews?.length + 1}`}>
                  <Tooltip title="Crear">
                    <Fab color="primary" aria-labelledby="add">
                      <AddIcon />
                    </Fab>
                  </Tooltip>
                </Link>
              </Stack>
              <div style={{ height: "70vh" }}>
                <DataGrid
                  getRowId={row => row.interviewPersonNumber}
                  loading={isLoading}
                  columns={columns}
                  disableColumnFilter
                  rows={interviews}
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                />
              </div>
            </Stack>
          </Grid>
        </Grid>
      </FormContainer>
    </div>
  );
}
