// src/searchComponents/SearchInput.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '../features/properties/propertySlice.js';
import '../styles/searchInput.css'
function SearchInput() {
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <div className="mt-5 d-flex">
      <input
        className="form form-control"
        placeholder="...ابحث عن شقه, فيلا, بيت, عماره, مزرعه"
        onChange={handleSearch}
      />
      <button className="btn btn-search" style={{backgroundColor:'#6E00FE',color:'white'}}>ابحث</button>
    </div>
  );
}

export default SearchInput;


