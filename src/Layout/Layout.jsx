// src/Layout.jsx
import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import Nav from "../componenents/Nav";
import Footer from "../componenents/Footer";
import { useLocation } from "react-router-dom";
import { UnreadMessagesProvider } from "../context/unreadMessageContext";
export default function Layout({ children }) {
  const [mode, setMode] = useState("light");
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

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

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
          {!isDashboardNav && <Nav toggleMode={toggleMode} />}
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
