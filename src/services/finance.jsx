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
import {
  Button,
  Popover,
} from "@mui/material";
const FinancingAdsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
const [priceTo, setPriceTo] = useState("");
const [anchorPrice, setAnchorPrice] = useState(null);
  const dispatch = useDispatch();
  const {
    all: allFinancingAds,
    loading,
    error,
  } = useSelector((state) => state.financingAds);
const handleOpenPrice = (event) => {
  setAnchorPrice(event.currentTarget);
};
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
const handleClosePrice = () => {
  setAnchorPrice(null);
};
  useEffect(() => {
    if (allFinancingAds.length === 0) {
      dispatch(fetchAllFinancingAds());
    }
  }, [dispatch, allFinancingAds]);
 const filteredAds = allFinancingAds.filter((ad) => {
  const search = searchInput.trim().toLowerCase();
  const from = priceFrom ? parseFloat(priceFrom) : null;
  const to = priceTo ? parseFloat(priceTo) : null;
    const isApproved = ad.reviewStatus ? ad.reviewStatus === 'approved' : false;
  let priceCondition = true;
  if (from && to) {
    priceCondition = from <= ad.end_limit && to >= ad.start_limit;
  } else if (from) {
    priceCondition = ad.start_limit >= from;
  } else if (to) {
    priceCondition = ad.end_limit <= to;
  }

  return (
    ((ad.org_name || "").toLowerCase().includes(search) ||
     ad.title.toLowerCase().includes(search) ||
     !search) &&
    priceCondition&&
        isApproved
  );
});

  return (
    <Container sx={{  mt: "20px",px: { xs: 0, sm: 2 }, // إزالة padding الجانبي على الشاشات الصغيرة
    overflowX: "hidden", }}  dir="rtl">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography sx={{ m: "20px" }} variant="h3" color="#6E00FE">
          أبرز عروض التمويل
        </Typography>
<Box  sx={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <TextField
          placeholder="ادخل اسم الممول أو عنوان الاعلان"
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
          >
            <HomeIcon sx={{ mr: 0.5, ml: "3px" }} fontSize="medium" />
          </Link> */}
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
      {loading && (
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" ,justifyContent:'center',height:'100%'}}>
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
    {/* <Typography sx={{ fontWeight: "800", color: "red" }}>
      لا يوجد إعلانات حالياً
    </Typography> */}
  </Box>
) : (
  <ul
   style={{
    display: "flex",
    justifyContent: "center",
    listStyle: "none",
    paddingTop: 10,
    gap: "20px",
    flexWrap: "wrap",
    width: "100%", 
    overflowX: "hidden",
      paddingBottom: 10,
  }}
  >
    {filteredAds.map((ad) => (
      <Link
        to={`/details/financingAds/${ad.id}`}
        key={ad.id}   // مهم جداً المفتاح هنا
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <HorizontalCard
          title={ad.title}
          price={`من ${ad.start_limit} إلى ${ad.end_limit}`}
          adress={ad.org_name}
          image={ad.images}
          type={ad.financing_model}
          id={ad.id}
        />
      </Link>
    ))}
  </ul>
)}

    </Container>
  );
};

export default FinancingAdsPage;
