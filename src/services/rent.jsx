import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClientAds } from "../feature/ads/clientAdsSlice";
import HorizontalCard from "../searchCompoents/CardSearch";
import {
  Box,
  CircularProgress,
  Container,
  LinearProgress,
  Typography,
  TextField,
  InputAdornment,
  Breadcrumbs,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
const RentAds = () => {
  const [serachInput, setSearchInput] = useState("");
  const dispatch = useDispatch();
  const {
    all: allClientAds,
    loading,
    error,
  } = useSelector((state) => state.clientAds);

  useEffect(() => {
    if (allClientAds.length === 0) {
      dispatch(fetchAllClientAds());
    }
  }, [dispatch, allClientAds]);

  const buyAds = allClientAds
    .filter((ad) => ad.ad_type === "إيجار")
    .filter((ad) => {
      const search = serachInput.trim();
      return ad.address?.includes(search) || ad.city?.includes(search);
    });

  return (
    <Container sx={{ mt: "100px" }} dir="rtl">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography sx={{ m: "20px" }} variant="h3" color="#6E00FE">
          ابرز العقارات المعروضه للايجار
        </Typography>
        <TextField
          placeholder="ادخل اسم المدينة أو المنطقة"
          variant="outlined"
          value={serachInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          sx={{
            width: "50vw",
            margin: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "100px",
              height: "50px",
              padding: "0 10px",
              backgroundColor: (theme) => 
                theme.palette.mode === 'light' 
                  ? theme.palette.grey[50] 
                  : theme.palette.grey[900],
              transition: "none",
              "& fieldset": {
                border: "0",
              },
              "&:hover fieldset": {
                border: "0",
              },
              "&.Mui-focused fieldset": {
                border: "2px solid#5d0c92",
              },
              "&.Mui-focused": {
                backgroundColor: (theme) => 
                  theme.palette.mode === 'light' 
                    ? theme.palette.grey[50] 
                    : theme.palette.grey[900],
                boxShadow: "none !important",
              },
            },
            "& input": {
              fontSize: "20px",
            },
            "input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
              backgroundColor: "transparent !important",
            },
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
          {/* <Link
            style={{
              color: "inherit",
              display: "flex",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            to="/"
            underline="hover"
          >
            <HomeIcon sx={{ mr: 0.5, ml: "3px" }} fontSize="medium" />
          </Link> */}
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center", fontSize: "18px" }}
          >
            {serachInput && (
              <Typography component="span" sx={{ fontSize: "20px" }}>
                نتائج البحث عن "{serachInput}"
              </Typography>
            )}
          </Typography>
        </Breadcrumbs>
      </Box>

      {loading && (
       <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
             <CircularProgress />
           </Box>
      )}
      {error && (
        <p>
          حدث خطأ: {typeof error === "object" ? JSON.stringify(error) : error}
        </p>
      )}




      {buyAds.length === 0 ? (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",  // عشان يحط المحتوى في المنتصف أفقياً
      // ما فيش alignItems علشان ما يتحطش في المنتصف عمودياً
      padding: "20px", // مسافة من فوق وتحت (اختياري)
    }}
  >
    <Typography sx={{ fontWeight: "800", color: "red" }}>
      لايوجد اعلانات حاليا
    </Typography>
  </Box>
) : (
  <ul
    style={{
      display: "flex",
      justifyContent: "center",  // عشان الكروت كلها تكون في نص الصفحة أفقياً
      listStyle: "none",
      padding: 0,
      gap: "20px", // مسافة بين الكروت لو حابب
      flexWrap: "wrap", // لو عايزها تنزل تحت لما تضيق الشاشة
    }}
  >
    {buyAds.map((ad) => (
      <Link
        to={`/details/clientAds/${ad.id}`}
        key={ad.id}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <HorizontalCard
          title={ad.title}
          price={ad.price}
          adress={ad.address}
          image={ad.images}
          type={ad.type}
          status={ad.ad_status}
          city={ad.city}
          id={ad.id}
          governoment={ad.governoment}
        />
      </Link>
    ))}
  </ul>
)}

    </Container>
  );
};

export default RentAds;
