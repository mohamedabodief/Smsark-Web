// src/Layout.jsx
import React, { useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import Nav from "../componenents/Nav";
import Footer from "../componenents/Footer";
import { useLocation } from "react-router-dom";
import { UnreadMessagesProvider } from "../context/unreadMessageContext";
import { useTheme } from "../context/ThemeContext";

export default function Layout({ children }) {
  const { mode } = useTheme();
  const location = useLocation();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#6E00FE",
          },
        },
        typography: {
          fontFamily: 'Cairo, sans-serif',
        },
      }),
    [mode]
  );

  // Determine if current route is a dashboard
  const isDashboard = [
    "/admin-dashboard",
    "/client-dashboard",
    "/organization-dashboard",
    "/inbox",
    "/chat",
    "/privateChat"
  ].some((path) => location.pathname.startsWith(path));

  const isDashboardNav = [
    "/admin-dashboard",
    "/client-dashboard",
    "/organization-dashboard",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <UnreadMessagesProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        >
          {!isDashboardNav && <Nav />}
          <Box component="main" sx={{ mt: { xs: 5, md: 8 }, flex: 1 }}>
            {children}
          </Box>
          {/* Only show Footer if not on a dashboard route */}
          {!isDashboard && <Footer />}
        </Box>
      </ThemeProvider>
    </UnreadMessagesProvider>
  );
}
