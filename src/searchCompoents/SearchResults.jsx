import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Breadcrumbs, Container, Typography, CircularProgress, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HorizontalCard from './CardSearch';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisemen';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { SearchContext } from '../context/searchcontext';
import { Link, useNavigate } from 'react-router-dom';

function SearchResults() {
  const { filters, searchWord } = useContext(SearchContext);
  const [clientAds, setClientAds] = useState([]);
  const [financingAds, setFinancingAds] = useState([]);
  const [developerAds, setDeveloperAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const clientResults = await ClientAdvertisement.getAll();
      const financingResults = await FinancingAdvertisement.getAll();
      const developerResults = await RealEstateDeveloperAdvertisement.getAll();
      setClientAds(clientResults);
      setFinancingAds(financingResults);
      setDeveloperAds(developerResults);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const shouldShowResults =
    searchWord.trim() !== '' ||
    filters.purpose !== 'الغرض' ||
    filters.propertyType !== 'نوع العقار' ||
    filters.priceFrom !== '' ||
    filters.priceTo !== '';

  // For client ads
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
        ad.address?.toLowerCase().includes(searchWord.toLowerCase()) ||
        ad.city?.toLowerCase().includes(searchWord.toLowerCase()) ||
        ad.governorate?.toLowerCase().includes(searchWord.toLowerCase()) ||
        ad.title?.toLowerCase().includes(searchWord.toLowerCase());
        const isApproved = ad.reviewStatus ? ad.reviewStatus === 'approved' : false;
      return matchesPurpose && matchesType && matchesPriceFrom && matchesPriceTo && matchesCity&& isApproved;;
    });
  }, [clientAds, filters, searchWord]);

  // Financing ads
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
       const isApproved = ad.reviewStatus ? ad.reviewStatus === 'approved' : false;
      return matchesSearch && matchesPriceFrom && matchesPriceTo && isApproved;;
    });
  }, [financingAds, filters, searchWord]);

  // Developer ads
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
const isApproved = ad.reviewStatus ? ad.reviewStatus === 'approved' : false;
      return matchesSearch && matchesPriceFrom && matchesPriceTo&& isApproved;;
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
          style={{ color: 'inherit', display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold' }}
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
            <Typography component="span" sx={{ fontSize: '20px' }}>
              نتائج البحث عن "{searchWord}"
            </Typography>
          )}
        </Typography>
      </Breadcrumbs>

      {!shouldShowResults ? (
        <Typography
          variant="h6"
          color="text.primary"
          textAlign="center"
          mt={4}
          marginBottom={6}
        >
          🏡 ابحث عن عقارك المفضل! أدخل اسم المحافظة أو نوع العقار أو الغرض لبدء البحث.
        </Typography>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            {['بيع', 'إيجار', 'الغرض'].includes(filters.purpose) &&
              filteredClientAds.map((ad) => (
                <HorizontalCard
                  key={ad.id}
                  title={ad.title}
                  price={ad.price}
                  adress={ad.address}
                  image={ad.images}
                  type={ad.type}
                  status={ad.ad_status}
                  city={ad.city}
                  governoment={ad.governoment}
                  phone={ad.phone}
                  id={ad.id}
                  onClickCard={() => navigate(`/details/clientAds/${ad.id}`)}
                />
              ))}

            {filters.purpose === 'ممول عقارى' &&
              filteredFinancingAds.map((ad, idx) => (
                <HorizontalCard
                  key={ad.id ?? idx}
                  title={ad.title}
                  price={`من ${ad.start_limit} إلى ${ad.end_limit}`}
                  adress={ad.org_name}
                  image={ad.images}
                  type={ad.financing_model}
                  id={ad.id}
                  phone={ad.phone}
                  onClickCard={() => navigate(`/details/financingAds/${ad.id}`)}
                />
              ))}

            {filters.purpose === 'مطور عقارى' &&
              filteredDeveloperAds.map((ad, idx) => (
                <HorizontalCard
                  key={ad.id ?? idx}
                  title={ad.developer_name}
                  price={`من ${ad.price_start_from} إلى ${ad.price_end_to}`}
                  adress={ad.location}
                  image={ad.images}
                  type={ad.project_types}
                  id={ad.id}
                  phone={ad.phone}
                  onClickCard={() => navigate(`/details/developmentAds/${ad.id}`)}
                />
              ))}
          </Box>

          {filteredClientAds.length === 0 &&
            filteredFinancingAds.length === 0 &&
            filteredDeveloperAds.length === 0 && (
              <Typography
                variant="h6"
                color="error"
                textAlign="center"
                mt={4}
              >
                {searchWord
                  ? `لا توجد نتائج تطابق "${searchWord}"`
                  : 'لا توجد نتائج مطابقة لبحثك'}
              </Typography>
            )}
        </>
      )}
    </Container>
  );
}

export default SearchResults;
