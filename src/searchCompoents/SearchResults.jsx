import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Breadcrumbs, Container, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HorizontalCard from './CardSearch';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisemen';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { SearchContext } from '../context/searchcontext';
import { AdsClick } from '@mui/icons-material';
import { Link } from 'react-router-dom';
function SearchResults() {
  const { filters, searchWord } = useContext(SearchContext);
  const [clientAds, setClientAds] = useState([]);
  const [financingAds, setFinancingAds] = useState([]);
  const [developerAds, setDeveloperAds] = useState([]);
  useEffect(() => {
    const fetchAll = async () => {
      const clientResults = await ClientAdvertisement.getAll();
      const financingResults = await FinancingAdvertisement.getAll();
      const developerResults = await RealEstateDeveloperAdvertisement.getAll();
      setClientAds(clientResults);
      setFinancingAds(financingResults);
      setDeveloperAds(developerResults);
    };

    fetchAll();
  }, []);

  const shouldShowResults =
    searchWord.trim() !== '' ||
    filters.purpose !== 'الغرض' ||
    filters.propertyType !== 'نوع العقار' ||
    filters.priceFrom !== '' ||
    filters.priceTo !== '';
  ///for client ads
  const filteredClientAds = useMemo(() => {
    return clientAds.filter((ad) => {
      const matchesPurpose =
        filters.purpose === 'الغرض' || ad.ad_type === filters.purpose;
      const matchesType =
        filters.propertyType === 'نوع العقار' || ad.type === filters.propertyType;
      const matchesPriceFrom =
        !filters.priceFrom || ad.price >= parseFloat(filters.priceFrom);
      const matchesPriceTo =
        !filters.priceTo || ad.price <= parseFloat(filters.priceTo);
      const matchesCity =
        !searchWord ||
        ad.address?.includes(searchWord) ||
        ad.city?.includes(searchWord)
        || ad.governorate?.includes(searchWord);

      return matchesPurpose && matchesType && matchesPriceFrom && matchesPriceTo && matchesCity;
    });
  }, [clientAds, filters, searchWord]);
//  تمويل
const filteredFinancingAds = useMemo(() => {
  if (filters.purpose !== 'ممول عقارى') return [];

  return financingAds.filter((ad) => {
    const matchesSearch =
      !searchWord ||
      ad.title?.includes(searchWord) ||
      ad.description?.includes(searchWord) ||
      ad.org_name?.includes(searchWord);

    const matchesPriceFrom =
      !filters.priceFrom || ad.start_limit >= parseFloat(filters.priceFrom);
    const matchesPriceTo =
      !filters.priceTo || ad.end_limit <= parseFloat(filters.priceTo);

    return matchesSearch && matchesPriceFrom && matchesPriceTo;
  });
}, [financingAds, filters, searchWord]);


//  المطور العقارى
const filteredDeveloperAds = useMemo(() => {
  if (filters.purpose !== 'مطور عقارى') return [];
  return developerAds.filter((ad) => {
    const matchesSearch =
      !searchWord ||
      ad.developer_name?.includes(searchWord) ||
      ad.description?.includes(searchWord) ||
      ad.location?.includes(searchWord);

    const matchesPriceFrom =
      !filters.priceFrom || ad.price_start_from >= parseFloat(filters.priceFrom);
    const matchesPriceTo =
      !filters.priceTo || ad.price_end_to <= parseFloat(filters.priceTo);

    return matchesSearch && matchesPriceFrom && matchesPriceTo;
  });
}, [developerAds, filters, searchWord]);



  return (
    <Container dir="rtl" maxWidth="lg">
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ marginTop: '30px', marginBottom: '30px' }}
        dir="rtl"
        separator="›"
      >
        <Link
        style={{color:'inherit',display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold'}}
         to="/"
          underline="hover"
         
        >
          <HomeIcon sx={{ mr: 0.5, ml: '3px' }} fontSize="medium" />
        </Link>
       <Typography
  color="text.primary"
  sx={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}
>
  {searchWord && (
    <Typography component="span" sx={{fontSize:'20px'}}>
      نتائج البحث عن "{searchWord}"
    </Typography>
  )}
</Typography>

      </Breadcrumbs>

      {shouldShowResults && (
        <>
          {['للبيع', 'للايجار', 'الغرض'].includes(filters.purpose) &&
            filteredClientAds.map((ad, idx) => (
              <Link to={`/details/clientAds/${ad.id}`}  key={`client-${idx}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <HorizontalCard
               
                title={ad.title}
                price={ad.price}
                adress={ad.address}
                image={ad.images}
                type={ad.type}
                 status={ad.ad_status}
                 city={ad.city}
                 governoment={ad.governoment}
              />
              </Link>
            ))}

          {/* إعلانات التمويل */}
          {filters.purpose === 'ممول عقارى' &&
            filteredFinancingAds.map((ad, idx) => (
              <Link key={`financing-${idx}`} to={`/details/financingAds/${ad.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <HorizontalCard
                
                title={ad.title}
                price={`من ${ad.start_limit} إلى ${ad.end_limit}`}
                adress={ad.org_name}
                image={[ad.image]}
                type={ad.financing_model}
              />
              </Link>
            ))}

          {/* إعلانات المطورين */}
          {filters.purpose === 'مطور عقارى' &&
            filteredDeveloperAds.map((ad, idx) => (
              <Link  key={`developer-${idx}`} style={{ textDecoration: 'none', color: 'inherit' }} to={`details/developer-${idx}`} >
              <HorizontalCard
               
                title={ad.developer_name}
                price={`من ${ad.price_start_from} إلى ${ad.price_end_to}`}
                adress={ad.location}
                image={[ad.image]}
                type={ad.project_types}
               
              />
              </Link>
            ))}
        </>
      )}
    </Container>
  );
}

export default SearchResults;

