import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Stack,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Button
} from '@mui/material';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

export default function Nav({ toggleMode }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  return (
    <AppBar
      sx={{
        bgcolor: "#6E00FE",
        boxShadow: "none",
        color: "#fff",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            maxHeight: "64px",
            overflow: "hidden",
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "200px", width: "200px" }}
          />
        </Box>

        <Stack direction="row" spacing={4} sx={{ direction: "rtl" }}>
          <Typography variant="button" sx={{ cursor: "pointer", px: 4 }} onClick={() => navigate('/home')}>
            الصفحة الرئيسية
          </Typography>
          <Typography variant="button" sx={{ cursor: "pointer" }} onClick={() => navigate('/about')}>
            عن الموقع
          </Typography>
          <Typography variant="button" sx={{ cursor: "pointer" }} onClick={() => navigate('/profile')}>
            الصفحة الشخصية
          </Typography>
          <Typography variant="button" sx={{ cursor: "pointer" }} onClick={() => navigate('/contact')}>
            تواصل معنا
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="قائمة المفضل">
            <Button onClick={() => navigate('/favorite')} sx={{ color: '#fff' }}>
              <FavoriteIcon /> 
            </Button>
          </Tooltip>

          <Tooltip title="تبديل الثيم">
            <IconButton size="small" onClick={toggleMode}>
              <Brightness4Icon />
            </IconButton>
          </Tooltip>

          <Tooltip title="ملفك الشخصي">
            <IconButton size="small" sx={{ color: "#fff" }} onClick={() => navigate('/profile')}>
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
