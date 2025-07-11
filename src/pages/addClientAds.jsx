import { Label } from '@mui/icons-material'
import { Box, Container, TextField, Typography } from '@mui/material'
import React from 'react'

function addClientAds() {
  return (
   <Container dir='rtl' maxWidth='lg'>
 <Typography variant='h4' sx={{mt:'40px'}}>اضف اعلانك</Typography>
 <Typography variant='h6' sx={{fontWeight:'thin'}}>يمكنك اضافه اعلانك والتواصل مع العملاء!</Typography>
 <Box sx={{border:'1px solid gray',borderRadius:'20px'}} width={'100%'}>
<Typography>اكمال التفاصبل الاتيه</Typography>
<Box >
    عنوان الاعلان
<TextField>

</TextField>
</Box>
 </Box>
   </Container>
  )
}

export default addClientAds
