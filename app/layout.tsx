import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Providers } from "./Providers";
import theme from './theme';

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
        <NuqsAdapter>
          <AppRouterCacheProvider>
            <Providers>
              <ThemeProvider theme={theme}>
                {children}
              </ThemeProvider>
            </Providers>
          </AppRouterCacheProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
