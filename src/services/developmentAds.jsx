import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDeveloperAds } from "../feature/ads/developerAdsSlice";
import HorizontalCard from "../searchCompoents/CardSearch";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Breadcrumbs,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const DeveloperAdsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();
  const { all: allDeveloperAds, loading, error } = useSelector(
    (state) => state.developerAds
  );

  useEffect(() => {
    if (allDeveloperAds.length === 0) {
      dispatch(fetchAllDeveloperAds());
    }
  }, [dispatch, allDeveloperAds]);

  const filteredAds = allDeveloperAds.filter((ad) => {
    const search = searchInput.trim().toLowerCase();
    return (
      ad.org_name?.toLowerCase().includes(search) ||
      ad.description?.toLowerCase().includes(search)
    );
  });

  return (
    <Container sx={{ mt: "100px" }} dir="rtl">
      <Typography sx={{ m: "20px" }} variant="h3" color="#6E00FE">
        أبرز عروض المطورين
      </Typography>

      <TextField
        placeholder="ادخل اسم المطور أو وصف العرض"
        variant="outlined"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{
          width: "50vw",
          margin: "20px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "100px",
            height: "50px",
            backgroundColor: "#F7F7F7",
          },
          "& input": { fontSize: "20px" },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon style={{ color: "#666" }} />
            </InputAdornment>
          ),
        }}
      />

      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ mt: 3, mb: 3, mr: "25px" }}
        dir="rtl"
        separator="›"
      >
        <Link
          style={{
            color: "inherit",
            display: "flex",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
          }}
          to="/"
        >
          <HomeIcon sx={{ mr: 0.5, ml: "3px" }} fontSize="medium" />
        </Link>
        {searchInput && (
          <Typography
            color="text.primary"
            sx={{ fontSize: "18px", display: "flex", alignItems: "center" }}
          >
            نتائج البحث عن "{searchInput}"
          </Typography>
        )}
      </Breadcrumbs>

      {loading && (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {error && <p>حدث خطأ: {error}</p>}

      {filteredAds.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography sx={{ fontWeight: "800", color: "red" }}>
            لا يوجد إعلانات حالياً
          </Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {filteredAds.map((ad) => (
             <HorizontalCard
               key={ad.id}
                title={ad.developer_name}
                price={`من ${ad.price_start_from} إلى ${ad.price_end_to}`}
                adress={ad.location}
              
                type={ad.project_types}
               
              />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default DeveloperAdsPage;
