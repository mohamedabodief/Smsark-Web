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
  Button,
  Popover,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const DeveloperAdsPage = () => {
  const [searchInput, setSearchInput] = useState("");
   const [priceFrom, setPriceFrom] = useState(""); 
      const [priceTo, setPriceTo] = useState(""); 
      const [anchorPrice, setAnchorPrice] = useState(null); 
  const dispatch = useDispatch();
  const { all: allDeveloperAds, loading, error } = useSelector(
    (state) => state.developerAds
  );
  const handleOpenPrice = (event) => {
    setAnchorPrice(event.currentTarget);
  };

  const handleClosePrice = () => {
    setAnchorPrice(null);
  };
  useEffect(() => {
    if (allDeveloperAds.length === 0) {
      dispatch(fetchAllDeveloperAds());
    }
  }, [dispatch, allDeveloperAds]);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
const filteredAds = allDeveloperAds.filter((ad) => {
    const search = searchInput.trim().toLowerCase();
    const from = priceFrom ? parseFloat(priceFrom) : null;
    const to = priceTo ? parseFloat(priceTo) : null;
    const isApproved = ad.reviewStatus ? ad.reviewStatus === 'approved' : false;
    let priceCondition = true;
    if (from && to) {
      priceCondition = from <= ad.price_end_to && to >= ad.price_start_from;
    } else if (from) {
      priceCondition = ad.price_start_from >= from;
    } else if (to) {
      priceCondition = ad.price_end_to <= to;
    }

    return (
      ((ad.developer_name || "").toLowerCase().includes(search) || !search) &&
      priceCondition&&
        isApproved
    );
  });
  return (
  <Container sx={{ mt: "20px" }} dir="rtl">
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
<Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
    <TextField
      placeholder="ادخل اسم المطور"
      variant="outlined"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      sx={{
       width: { sm: "90vw", lg: "60vw" },
        margin: "20px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "100px",
          height: "50px",
          backgroundColor: (theme) => 
            theme.palette.mode === 'light' 
              ? theme.palette.grey[50] 
              : theme.palette.grey[900],
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
     <Button
                    variant="outlined"
                    onClick={handleOpenPrice}
                    sx={{
                      height: "50px",
                      borderRadius: "10px",
                          marginTop: "20px",
                      color: (theme) =>
                        priceFrom || priceTo
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                      border: (theme) =>
                        `1px solid ${
                          priceFrom || priceTo
                            ? theme.palette.primary.light
                            : theme.palette.divider
                        }`,
                      fontWeight: "bold",
                      backgroundColor: (theme) => theme.palette.background.paper,
                      minWidth: "150px",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "light"
                            ? theme.palette.grey[100]
                            : theme.palette.grey[800],
                      },
                    }}
                  >
                    {priceFrom || priceTo
                      ? `من ${priceFrom || "..."} إلى ${priceTo || "..."} ج.م`
                      : "السعر (جنيه)"}
                  </Button>
                  <Popover
                    open={Boolean(anchorPrice)}
                    anchorEl={anchorPrice}
                    onClose={handleClosePrice}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    dir="rtl"
                  >
                    <Box sx={{ padding: "16px", display: "flex", gap: "10px", alignItems: "center", flexDirection: "column" }}>
                      <TextField
                        label="من"
                        type="number"
                        size="small"
                        value={priceFrom}
                        onChange={(e) => setPriceFrom(e.target.value)}
                      />
                      <TextField
                        label="إلى"
                        type="number"
                        size="small"
                        value={priceTo}
                        onChange={(e) => setPriceTo(e.target.value)}
                      />
                      <Button
                        onClick={handleClosePrice}
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#6E00FE", color: "#fff" }}
                      >
                        تم
                      </Button>
                    </Box>
                  </Popover>
                  </Box>
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

  </Typography>
) : (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 , paddingBottom: 10,}}>
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
            image={ad.images}

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
