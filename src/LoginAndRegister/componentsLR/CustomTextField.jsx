import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

export default function CustomTextField({
  label,
  icon,
  value,
  onChange,
  error,
  helperText,
  ...props
}) {
  return (
    <TextField
      fullWidth
      margin="normal"
      label={label}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : null,
        sx: { borderRadius: '12px' },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#6E00FE' },
          '&:hover fieldset': { borderColor: '#5A00D6' },
        },
      }}
      {...props}
    />
  );
}