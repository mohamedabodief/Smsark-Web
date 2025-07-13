import { Label } from '@mui/icons-material'
import { Box, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'

function addClientAds() {
  return (
   <Container dir='rtl' maxWidth='lg' sx={{padding:'20px'}}>
 <Typography variant='h4' sx={{mt:'40px',padding:'20px'}}>اضف اعلانك</Typography>
 <Typography variant='h6' sx={{fontWeight:'thin'}}>يمكنك اضافه اعلانك والتواصل مع العملاء!</Typography>
 <Box sx={{border:'1px solid #f0eeeb',borderRadius:'20px',padding:'20px'}} width={'100%'}>
<Typography>اكمال التفاصبل الاتيه</Typography>
<Box  width={'50%'} sx={{border:'1px solid #f0eeeb',borderRadius:'20px',padding:'20px'}}>
   
 <TextField
      variant="outlined"
         placeholder='اضف عنوان للاعلان'
      sx={{
        mb:"5px",
        mt:'5px',
        width:'100%',
        '& .MuiInputBase-root': {
          borderRadius: '12px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ccc',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#6E00FE',
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#6E00FE',
        },
        '& label': {
          fontSize: '16px',
          right: 'auto',
          left: 'auto',
        },
      }}
      dir="rtl"
    />
      <FormControl fullWidth sx={{ minWidth: 200,mt:'5px' }}>
      <InputLabel id="purpose-label" dir='rtl'>نوع العقار</InputLabel>
      <Select
        labelId="purpose-label"
        sx={{
          borderRadius: '12px',
         
        }}
        dir="rtl"
      >
        <MenuItem value="بيع">شقة</MenuItem>
        <MenuItem value="إيجار">فيلا</MenuItem>
        <MenuItem value="تمويل">محل تجارى</MenuItem>
           <MenuItem value="بيع">دوبلكس</MenuItem>
        <MenuItem value="إيجار">فيلا</MenuItem>
        <MenuItem value="تمويل">منزل</MenuItem>
      </Select>
    </FormControl>
     <TextField
      placeholder="اكتب تفاصيل الإعلان هنا..."
      multiline
      rows={4}
      fullWidth
      variant="outlined"
      sx={{
        mt: 2,
        '& .MuiInputBase-root': {
          borderRadius: '12px',
         
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ccc',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#6E00FE',
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#6E00FE',
        },
      }}
      dir="rtl"
    />

      <TextField
      label="السعر"
      variant="outlined"
      fullWidth
      placeholder="حدد سعر مناسب"
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      sx={{
        borderRadius: '12px',
        mt: 2,
        '& .MuiInputBase-root': {
          borderRadius: '12px',
        },
      }}
      dir="rtl"
    />
    {/* العنوان بالتفاصيل */}
    <Typography sx={{m:'20px 0 0 0',fontWeight:'bold'}}>اضف العنوان بالتفاصيل</Typography>
    <Box sx={{display:'flex',gap:'30px'}}>
      
       <TextField
      label="المحافظه"
      variant="outlined"
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      sx={{
        borderRadius: '12px',
        mt: 2,
        '& .MuiInputBase-root': {
          borderRadius: '12px',
        },
      }}
      dir="rtl"
    />
    
       <TextField
      label="المدينه"
      variant="outlined"
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      sx={{
        borderRadius: '12px',
        mt: 2,
        '& .MuiInputBase-root': {
          borderRadius: '12px',
        },
      }}
      dir="rtl"
    />
    <TextField
      label="الشارع"
      variant="outlined"
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      sx={{
        borderRadius: '12px',
        mt: 2,
        '& .MuiInputBase-root': {
          borderRadius: '12px',
        },
      }}
      dir="rtl"
    />
    </Box>
    
   <FormControl fullWidth sx={{ minWidth: 200,mt:'15px' }}>
      <InputLabel id="purpose-label" dir='rtl'>الغرض</InputLabel>
      <Select
        labelId="purpose-label"
        sx={{
          borderRadius: '12px',
         
        }}
        dir="rtl"
      >
        <MenuItem value="بيع">ايجار</MenuItem>
        <MenuItem value="إيجار">بيع</MenuItem>
    
      </Select>
    </FormControl>
   
</Box>
 </Box>
   </Container>
  )
}

export default addClientAds
