import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ThemePage from './ThemePage';

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: mode,
        ...(mode === 'light'
          ? {
              // الألوان في الوضع الفاتح
              background: {
                default: '#ffffff',
                paper: '#f0f8ff',
              },
              primary: {
                main: '#1976d2',
              },
            }
          : {
              // الألوان في الوضع الداكن
              background: {
                default: '#121212',
                paper: '#1e1e1e',
              },
              primary: {
                main: '#90caf9',
              },
            }),
      },
    }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemePage mode={setMode} />
    </ThemeProvider>
  );
}

export default App;
