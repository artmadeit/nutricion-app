"use client";

import { Snackbar } from "@mui/material";
import React, { createContext } from "react";

export const SnackbarContext = createContext({
  message: "",
  showMessage: (message: string) => {
    console.log(message)
  },
});

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [alertMessage, setAlertMessage] = React.useState<string>("");

  const handleClose = () => {
    setAlertMessage("");
  };

  const showAlertMessage = (message: string) => setAlertMessage(message);

  return (
    <SnackbarContext.Provider
      value={{
        message: alertMessage,
        showMessage: showAlertMessage,
      }}
    >
      {children}
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={handleClose}
        message={alertMessage}
      />
    </SnackbarContext.Provider>
  );
};
