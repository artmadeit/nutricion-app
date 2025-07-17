import React from "react";
import MenuDrawer from "./MenuDrawer";
import { Box } from "@mui/material";
import { Providers } from "../Providers";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Box
        sx={{
          padding: { xs: "0px", sm: "20px" },
          "& .mui-1v5u2yv": {
            padding: "0px",
          },
        }}
      >
        <MenuDrawer>
          <Box sx={{ p: 2 }}>{children}</Box>
        </MenuDrawer>
      </Box>
    </Providers>
  );
}
