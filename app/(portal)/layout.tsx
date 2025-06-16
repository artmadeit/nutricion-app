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
      <MenuDrawer>
        <Box sx={{ p: 2 }}>{children}</Box>
      </MenuDrawer>
    </Providers>
  );
}
