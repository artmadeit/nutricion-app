"use client";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { es as dateFnsEs } from "date-fns/locale/es";

import React from "react";
// import { SWRConfig } from "swr";
// import { useAuthApi } from "../(api)/api";
// import { AxiosRequestConfig } from "axios";


export const Providers = ({ children }: { children: React.ReactNode }) => {
  // const getApi = useAuthApi();

  // const fetcher = (key: string | [string, AxiosRequestConfig]) => {
  //   const [url, config] = typeof key === "string" ? [key] : key;

  //   // if (config) {
  //   //   config.paramsSerializer = (params: any) => {
  //   //     return qs.stringify(params, { arrayFormat: "repeat" });
  //   //   };
  //   // }

  //   return getApi().then((api) => api.get(url, config).then((res) => res.data));
  // };

  return (
    // <SWRConfig value={{ fetcher }}>
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={dateFnsEs}
    >
      {children}
    </LocalizationProvider>
    // </SWRConfig>
  );
};
