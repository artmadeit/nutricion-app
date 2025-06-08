import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "Nutricion App",
  description: "App para registrar alimentos y sus valores nutritivos",
};

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <ThemeProvider theme={theme}>
              {children}
            </ThemeProvider>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
