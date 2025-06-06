import React from "react";
import MenuDrawer from "./MenuDrawer";
import { Box } from "@mui/material";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MenuDrawer>
        <Box sx={{ p: 2}}>{children}</Box>          
      </MenuDrawer>      
    </div>
  );
}
