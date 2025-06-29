// src/pages/SearchPage.jsx
import React from 'react';
import SearchResults from '../searchCompoents/SearchResults';
import SearchInput from '../searchCompoents/SearchInput';

function SearchPage() {
  return (
    <div className="container">
      <h2 className="tileSearch">كل ما تبحث عنه فى عالم العقارات.. تجده هنا</h2>
      <SearchInput/>
      <SearchResults/>
    </div>
  );
}

export default SearchPage;

