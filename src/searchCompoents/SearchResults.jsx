import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProperties } from '../features/properties/propertySlice.js';
import CardSearch from './CardSearch';

function SearchResults() {
  const dispatch = useDispatch();
  const { properties, isLoading, searchTerm } = useSelector((state) => state.property);

  useEffect(() => {
    dispatch(getProperties());
  }, [dispatch]);

  const filtered = properties.filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="row">
        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p>لا توجد نتائج.</p>
        ) : (
          filtered.map((property) => (
            <div className="col-md-4" key={property.id}>
              <CardSearch property={property} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchResults
;

