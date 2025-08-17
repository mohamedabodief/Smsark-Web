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
  Button,
  Menu,
  MenuItem,
  Popover,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const SellAds = () => {
  const [searchInput, setSearchInput] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("نوع العقار"); 
  const [priceFrom, setPriceFrom] = useState(""); 
  const [priceTo, setPriceTo] = useState(""); 
  const [anchorPropertyType, setAnchorPropertyType] = useState(null); 
  const [anchorPrice, setAnchorPrice] = useState(null); 
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
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

  const handleOpenPropertyTypeMenu = (event) => {
    setAnchorPropertyType(event.currentTarget);
  };

  const handleClosePropertyTypeMenu = () => {
    setAnchorPropertyType(null);
  };

  const handleSelectPropertyType = (value) => () => {
    setPropertyTypeFilter(value);
    setAnchorPropertyType(null);
  };

  const handleOpenPrice = (event) => {
    setAnchorPrice(event.currentTarget);
  };

  const handleClosePrice = () => {
    setAnchorPrice(null);
  };

  const propertyTypeOptions = ["منزل", "شقة", "فيلا", "دوبلكس", "محل"]; 

  const sellAds = allClientAds
    .filter((ad) => ad.ad_type === "بيع")
    .filter((ad) => {
      const search = searchInput.trim();
      const propertyType = propertyTypeFilter.trim();
      const from = priceFrom ? parseFloat(priceFrom) : null;
      const to = priceTo ? parseFloat(priceTo) : null;

      return (
        (ad.address?.toLowerCase().includes(search.toLowerCase()) ||
         ad.city?.toLowerCase().includes(search.toLowerCase()) ||
         !search) &&
        (propertyType === "نوع العقار" || ad.type?.toLowerCase().includes(propertyType.toLowerCase())) &&
        (!from || ad.price >= from) &&
        (!to || ad.price <= to)
      );
    });

  return (
    <Container sx={{  mt: "20px" }} dir="rtl">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography sx={{ m: "20px" }} variant="h3" color="#6E00FE">
          ابرز العقارات المعروضه للبيع
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <TextField
            placeholder="ادخل اسم المدينة أو المنطقة"
            variant="outlined"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{
              width: "50vw",
              margin: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "100px",
                height: "50px",
                padding: "0 10px",
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
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
                  border: "2px solid #820c99",
                },
                "&.Mui-focused": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
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
          <Button
            variant="contained"
            onClick={handleOpenPropertyTypeMenu}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              backgroundColor: (theme) =>
                propertyTypeFilter === "نوع العقار"
                  ? theme.palette.background.paper
                  : theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[800],
              color: (theme) =>
                propertyTypeFilter === "نوع العقار"
                  ? theme.palette.text.secondary
                  : theme.palette.primary.main,
              borderRadius: "10px",
              height: "50px",
              minWidth: "110px",
              fontSize: "18px",
              boxShadow: "none",
              marginTop: "20px",
              border: (theme) =>
                `1px solid ${
                  propertyTypeFilter !== "نوع العقار"
                    ? theme.palette.primary.light
                    : theme.palette.divider
                }`,
              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[800],
              },
            }}
          >
            {propertyTypeFilter}
          </Button>
          <Menu
            anchorEl={anchorPropertyType}
            open={Boolean(anchorPropertyType)}
            onClose={handleClosePropertyTypeMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            dir="rtl"
            PaperProps={{
              sx: (theme) => ({
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }),
            }}
          >
            {propertyTypeOptions.map((option) => (
              <MenuItem
                key={option}
                selected={propertyTypeFilter === option}
                onClick={handleSelectPropertyType(option)}
                sx={(theme) => ({
                  backgroundColor:
                    propertyTypeFilter === option
                      ? theme.palette.action.selected
                      : "transparent",
                  color:
                    propertyTypeFilter === option
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  fontWeight: propertyTypeFilter === option ? "bold" : "normal",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                })}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
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
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center", fontSize: "18px" }}
          >
            {searchInput && (
              <Typography component="span" sx={{ fontSize: "20px" }}>
                نتائج البحث عن "{searchInput}"
              </Typography>
            )}
          </Typography>
        </Breadcrumbs>
      </Box>

      {loading && (
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <p>
          حدث خطأ: {typeof error === "object" ? JSON.stringify(error) : error}
        </p>
      )}

      {sellAds.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          {/* <Typography sx={{ fontWeight: "800", color: "red" }}>
            لايوجد اعلانات حاليا
          </Typography> */}
        </Box>
      ) : (
        <ul
             style={{
    display: "flex",
    justifyContent: "center",
    listStyle: "none",
    padding: 0,
    gap: "20px",
    flexWrap: "wrap",
    width: "100%", 
    overflowX: "hidden", 
  }}
        >
          {sellAds.map((ad) => (
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
                governoment={ad.governoment}
                id={ad.id}
              />
            </Link>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default SellAds;