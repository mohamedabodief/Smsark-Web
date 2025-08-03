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
  {/* الجزء المتمركز في النص */}
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
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
          padding: "0 10px",
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
      sx={{ mt: 3, mb: 3, width: "100%", maxWidth: "80vw" }}
      dir="rtl"
      separator="›"
    >
    
      {searchInput && (
        <Typography
          color="text.primary"
          sx={{ fontSize: "18px", display: "flex", alignItems: "center" }}
        >
          نتائج البحث عن "{searchInput}"
        </Typography>
      )}
    </Breadcrumbs>
  </Box>

  {/* الكروت تترندر عادي مش متوسطة */}
  {loading && (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  )}

  {error && (
    <Typography color="error">
      حدث خطأ: {typeof error === "object" ? JSON.stringify(error) : error}
    </Typography>
  )}

  
{filteredAds.length === 0 ? (
  <Typography sx={{ fontWeight: "800", color: "red", mt: 4, textAlign: "center" }}>
    لا يوجد إعلانات حالياً
  </Typography>
) : (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {filteredAds.map((ad) => (
      <Box key={ad.id} sx={{ display: "flex", justifyContent: "center" }}>
        <Link
          to={`/details/developmentAds/${ad.id}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            width: "100%", // أو ثابت زي 80% لو حبيت
            maxWidth: "800px", // ده بيحافظ إن الكارد مش يبقى أعرض من اللازم
          }}
        >
          <HorizontalCard
            title={ad.developer_name}
            price={`من ${ad.price_start_from} إلى ${ad.price_end_to}`}
            adress={`${ad.location?.governorate} - ${ad.location?.city}`}
            type={ad.project_types}
            id={ad.id}
          />
        </Link>
      </Box>
    ))}
  </Box>
)}

</Container>

  );
};

export default DeveloperAdsPage;
