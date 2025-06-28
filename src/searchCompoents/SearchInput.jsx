import { Box, TextField } from '@mui/material'
import React from 'react'

function SearchInput() {
  return (
    <>
    
    <Box sx={{ width: 500, maxWidth: '100%' ,mt:'100px'}} >
      <TextField fullWidth label="fullWidth" id="fullWidth" />
    </Box>

    </>
  )
}

export default SearchInput
