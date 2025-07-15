import { AppBar, Box, Button, IconButton, Toolbar, Typography, useTheme } from '@mui/material'
import React from 'react'
import Brightness4Icon from '@mui/icons-material/Brightness4';
function ThemePage({mode}) {
  const theme = useTheme();
  return (
    //  <!-- 6. شريط التطبيق مع زر التبديل -->
     <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            واجهة بسيطة
          </Typography>
          <IconButton 
          onClick={
            ()=>{
       theme.palette.mode=='dark'?mode('light'):mode('dark')

            }
          }
          
          >
             {/* <Brightness4 /> */}
             <Brightness4Icon/>
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* <!-- 7. محتوى التطبيق --> */}
      <Box sx={{ p: 4 }}>
        <Typography variant="body1" gutterBottom>
          هذا مثال بسيط على التبديل بين الوضع الفاتح والداكن باستخدام MUI.
        </Typography>
        <Button variant="contained">زر</Button>
      </Box>
     </>
  )
}

export default ThemePage

