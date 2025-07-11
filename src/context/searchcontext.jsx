import  React, { createContext, useContext, useState } from 'react';
export const SearchContext=createContext();
export const SearchProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    purpose: 'الغرض',
    propertyType: 'نوع العقار',
    priceFrom: '',
    priceTo: '',
  });
  const [searchWord, setSearchWord] = useState('');
  return (
   <SearchContext.Provider value={{ filters, setFilters, searchWord, setSearchWord }}>
      {children}
    </SearchContext.Provider>
  );
};