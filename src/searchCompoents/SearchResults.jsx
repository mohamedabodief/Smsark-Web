import React from 'react'
import CardSearch from './CardSearch'
import SearchInput from './SearchInput'

function SearchResults() {
  return (
    <>
     <div className='container bg-danger'>
        <SearchInput/>
        <div className='row'>
            <div className='col-md-12'>
                <CardSearch/>
            </div>
        </div>
        </div> 
    </>
  )
}

export default SearchResults
