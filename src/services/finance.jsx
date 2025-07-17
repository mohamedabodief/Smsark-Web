import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFinancingAds } from "../feature/ads/financingAdsSlice";
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

const FinancingAdsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();
  const { all: allFinancingAds, loading, error } = useSelector(
    (state) => state.financingAds
  );

  useEffect(() => {
    if (allFinancingAds.length === 0) {
      dispatch(fetchAllFinancingAds());
    }
  }, [dispatch, allFinancingAds]);
  const filteredAds = allFinancingAds.filter((ad) => {
    const search = searchInput.trim().toLowerCase();
    return (
      ad.org_name?.toLowerCase().includes(search) ||
      ad.description?.toLowerCase().includes(search)
    );
  });

  return (
    <Container sx={{ mt: "100px" }} dir="rtl">
      <Typography sx={{ m: "20px" }} variant="h3" color="#6E00FE">
        أبرز عروض التمويل
      </Typography>

      <TextField
        placeholder="ادخل اسم الجهة أو وصف العرض"
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
        sx={{ marginTop: "30px", marginBottom: "30px", marginRight: "25px" }}
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
        <Box sx={{ width: "100%" }}>
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
        <ul>
        {filteredAds.map((ad) => (
    <HorizontalCard
      key={ad.id} 
      title={ad.title}
      price={`${ad.start_limit} - ${ad.end_limit}`}
      adress={ad.org_name}
      image={[ad.image || ""]}
      type={ad.financing_model}
      status={ad.ads ? "مفعّل" : "غير مفعّل"}
      city={"تمويل عقاري"}
      governoment={""}
    />
  ))}
        </ul>
      )}
    </Container>
  );
};

export default FinancingAdsPage;
