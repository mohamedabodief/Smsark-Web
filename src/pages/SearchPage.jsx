import React from 'react';
import SearchResults from '../searchCompoents/SearchResults';
import SearchInput from '../searchCompoents/SearchInput';
import { Container } from '@mui/material';
import '../styles/searchInput.css'
import { SearchProvider } from '../context/searchcontext'
function SearchPage() {
  return (
   <Container maxWidth='lg' sx={{mt:'100px'}} dir='rtl'>
     <h2 className="tileSearch">كل ما تبحث عنه فى عالم العقارات.. تجده هنا</h2>
     <SearchProvider>
      <SearchInput/>
      <SearchResults/>
      </SearchProvider>
   </Container>
     
  
  );
}

export default SearchPage;

