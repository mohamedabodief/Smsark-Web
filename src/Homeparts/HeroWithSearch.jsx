// // src/Homeparts/HeroWithSearch.jsx
// import { useState, useEffect } from "react";
// import {
//   Box,
//   IconButton,
//   Container,
//   TextField,
//   InputAdornment,
//   Button,
//   Menu,
//   MenuItem,
//   Popover,
//   Divider,
// } from "@mui/material";
// import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
// import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
// import SearchIcon from "@mui/icons-material/Search";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import HomepageAdvertisement from "../FireBase/modelsWithOperations/HomepageAdvertisement";
// import { getCachedAds, saveAdsToCache, hasAdsChanged } from "./adsCacheUtils";
// import { SearchProvider, SearchContext } from "../context/searchcontext";
// import { useContext } from "react";
// const CACHE_KEY = "hero_ads_cache";
// function HeroSlider() {
//   const [ads, setAds] = useState([]);
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const cachedAds = getCachedAds(CACHE_KEY);
//     if (cachedAds) {
//       setAds(cachedAds);
//     }

//     const unsubscribe = HomepageAdvertisement.subscribeActiveAds((newAds) => {
//       if (!cachedAds || hasAdsChanged(cachedAds, newAds)) {
//         setAds(newAds);
//         saveAdsToCache(CACHE_KEY, newAds);
//       }
//       setIndex(0);
//     });

//     if (!cachedAds) {
//       HomepageAdvertisement.getActiveAds().then((ads) => {
//         setAds(ads);
//         saveAdsToCache(CACHE_KEY, ads);
//       });
//     }

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (ads.length === 0) return;
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % ads.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [ads.length]);

//   const nextSlide = () => {
//     setIndex((prev) => (prev + 1) % ads.length);
//   };

//   const prevSlide = () => {
//     setIndex((prev) => (prev - 1 + ads.length) % ads.length);
//   };

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         width: "100%",
//         height: { xs: "50vh", md: "70vh" },
//         overflow: "hidden",
//         direction: "rtl",
//         margin: 0,
//         padding: 0,
//       }}
//     >
//       {ads.length > 0 && ads[index] && (
//         <>
//           <Box
//             component="img"
//             src={
//               ads[index] && ads[index].image
//                 ? ads[index].image
//                 : "/no-image.svg"
//             }
//             alt="slider image"
//             sx={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//             }}
//           />
//           {ads[index].title && (
//             <Box
//               sx={{
//                 position: "absolute",
//                 bottom: 24,
//                 right: 24,
//                 background: "rgba(0,0,0,0.5)",
//                 color: "white",
//                 px: 2,
//                 py: 1,
//                 borderRadius: 2,
//                 maxWidth: "60%",
//               }}
//             >
//               {typeof ads[index].title === "object"
//                 ? JSON.stringify(ads[index].title)
//                 : ads[index].title}
//               {ads[index].location && (
//                 <div style={{ fontSize: 14, marginTop: 4 }}>
//                   {typeof ads[index].location === "object"
//                     ? ads[index].location.full ||
//                       JSON.stringify(ads[index].location)
//                     : ads[index].location}
//                 </div>
//               )}
//               {ads[index].description && (
//                 <div style={{ fontSize: 13, marginTop: 4, color: "#ccc" }}>
//                   {typeof ads[index].description === "object"
//                     ? JSON.stringify(ads[index].description)
//                     : ads[index].description}
//                 </div>
//               )}
//             </Box>
//           )}
//         </>
//       )}

//       <IconButton
//         onClick={nextSlide}
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: 16,
//           transform: "translateY(-50%)",
//           color: "white",
//           backgroundColor: "rgba(0,0,0,0.4)",
//           "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
//         }}
//         disabled={ads.length === 0}
//       >
//         <ArrowBackIos />
//       </IconButton>

//       <IconButton
//         onClick={prevSlide}
//         sx={{
//           position: "absolute",
//           top: "50%",
//           right: 16,
//           transform: "translateY(-50%)",
//           color: "white",
//           backgroundColor: "rgba(0,0,0,0.4)",
//           "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
//         }}
//         disabled={ads.length === 0}
//       >
//         <ArrowForwardIos />
//       </IconButton>
//     </Box>
//   );
// }
// function SearchComponent() {
//   const { filters, setFilters, searchWord, setSearchWord } =
//     useContext(SearchContext);
//   const [menuAnchor, setMenuAnchor] = useState({
//     purpose: null,
//     propertyType: null,
//   });
//   const [anchorPrice, setAnchorPrice] = useState(null);

//   const handleOpenMenu = (type) => (event) => {
//     setMenuAnchor((prev) => ({ ...prev, [type]: event.currentTarget }));
//   };

//   const handleCloseMenu = (type) => () => {
//     setMenuAnchor((prev) => ({ ...prev, [type]: null }));
//   };

//   const handleSelect = (type, value) => () => {
//     setFilters((prev) => ({ ...prev, [type]: value }));
//     setMenuAnchor((prev) => ({ ...prev, [type]: null }));
//   };

//   const handleOpenPrice = (event) => {
//     setAnchorPrice(event.currentTarget);
//   };

//   const handleClosePrice = () => {
//     setAnchorPrice(null);
//   };

//   const isPriceOpen = Boolean(anchorPrice);

//   const menuItems = {
//     purpose: ["بيع", "إيجار", "مطور عقارى", "ممول عقارى"],
//     propertyType: ["منزل", "شقة", "فيلا", "دوبلكس", "محل"],
//   };

//   return (
//     <Box
//       sx={{
//         position: "absolute",
//         bottom: 0,
//         left: "50%",
//         transform: "translateX(-50%)",
//         width: "90%",
//         maxWidth: "1200px",
//         backgroundColor: "rgba(255, 255, 255, 0.2)", // شفاف قليل
//         backdropFilter: "blur(10px)", // الضبابية
//         WebkitBackdropFilter: "blur(15px)", // دعم Safari
//         borderRadius: "35px",
//         boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//         padding: "20px",
//         marginBottom: { xs: "20px", md: "40px" },
//         zIndex: 10,
//       }}
//     >
//       <Container
//         dir="rtl"
//         maxWidth="lg"
//         className="mt-5 d-flex"
//         sx={{ gap: "10px", flexWrap: "wrap", justifyContent: "center" }}
//       >
//         {/* SEARCH INPUT */}
//         <TextField
//           placeholder="ادخل اسم المدينة أو المنطقة"
//           onChange={(e) => setSearchWord(e.target.value)}
//           variant="outlined"
//           value={searchWord}
//           sx={{
//             flexGrow: 1,
//             minWidth: "300px",
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "100px",
//               height: "50px",
//               padding: "0 10px",
//               backgroundColor: "#F7F7F7",
//               color: "#333",
//               transition: "none",
//               "& fieldset": {
//                 border: "0",
//               },
//               "&:hover fieldset": {
//                 border: "0",
//               },
//               "&.Mui-focused fieldset": {
//                 border: "2px solid #1976d2",
//               },
//               "&.Mui-focused": {
//                 backgroundColor: "#F7F7F7 !important",
//                 boxShadow: "none !important",
//               },
//             },
//             "& input": {
//               color: "#333",
//               fontSize: "20px",
//             },
//             "input:-webkit-autofill": {
//               WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
//               backgroundColor: "transparent !important",
//             },
//           }}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <SearchIcon style={{ color: "#666" }} />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {/* PURPOSE AND PROPERTY TYPE */}
//         {["purpose", "propertyType"].map((type) => (
//           <div key={type}>
//             <Button
//               variant="contained"
//               onClick={handleOpenMenu(type)}
//               endIcon={<ArrowDropDownIcon />}
//               sx={{
//                 backgroundColor:
//                   filters[type] ===
//                   (type === "purpose" ? "الغرض" : "نوع العقار")
//                     ? "white"
//                     : "#F7F7FC",
//                 color:
//                   filters[type] ===
//                   (type === "purpose" ? "الغرض" : "نوع العقار")
//                     ? "#666"
//                     : "#6E00FE",
//                 borderRadius: "10px",
//                 height: "50px",
//                 minWidth: "110px",
//                 fontSize: "18px",
//                 boxShadow: "none",
//                 border:
//                   filters[type] !==
//                   (type === "purpose" ? "الغرض" : "نوع العقار")
//                     ? "1px solid rgb(178, 128, 245)"
//                     : "1px solid #ccc",
//               }}
//             >
//               {filters[type]}
//             </Button>

//             <Menu
//               anchorEl={menuAnchor[type]}
//               open={Boolean(menuAnchor[type])}
//               onClose={handleCloseMenu(type)}
//               anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//               transformOrigin={{ vertical: "top", horizontal: "center" }}
//               dir="rtl"
//             >
//               {menuItems[type].map((option) => (
//                 <MenuItem
//                   key={option}
//                   selected={filters[type] === option}
//                   onClick={handleSelect(type, option)}
//                   sx={{
//                     backgroundColor:
//                       filters[type] === option ? "#f0f0f0" : "transparent",
//                     color: filters[type] === option ? "#6E00FE" : "#333",
//                     fontWeight: filters[type] === option ? "bold" : "normal",
//                     "&:hover": {
//                       backgroundColor: "#e0e0e0",
//                     },
//                   }}
//                 >
//                   {option}
//                 </MenuItem>
//               ))}
//             </Menu>
//           </div>
//         ))}

//         {/* PRICE */}
//         <div>
//           <Button
//             variant="outlined"
//             onClick={handleOpenPrice}
//             sx={{
//               height: "50px",
//               borderRadius: "10px",
//               color: filters.priceFrom || filters.priceTo ? "#6E00FE" : "#666",
//               border:
//                 filters.priceFrom || filters.priceTo
//                   ? "1px solid #6E00FE"
//                   : "1px solid #ccc",
//               fontWeight: "bold",
//               backgroundColor: "white",
//               minWidth: "150px",
//             }}
//           >
//             {filters.priceFrom || filters.priceTo
//               ? `من ${filters.priceFrom || "..."} إلى ${
//                   filters.priceTo || "..."
//                 } ج.م`
//               : "السعر (جنيه)"}
//           </Button>

//           <Popover
//             open={isPriceOpen}
//             anchorEl={anchorPrice}
//             onClose={handleClosePrice}
//             anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//             transformOrigin={{ vertical: "top", horizontal: "center" }}
//             dir="rtl"
//           >
//             <Box
//               sx={{
//                 padding: "16px",
//                 display: "flex",
//                 gap: "10px",
//                 alignItems: "center",
//                 flexDirection: "column",
//               }}
//             >
//               <TextField
//                 label="من"
//                 type="number"
//                 size="small"
//                 value={filters.priceFrom}
//                 onChange={(e) =>
//                   setFilters((prev) => ({ ...prev, priceFrom: e.target.value }))
//                 }
//               />
//               <TextField
//                 label="إلى"
//                 type="number"
//                 size="small"
//                 value={filters.priceTo}
//                 onChange={(e) =>
//                   setFilters((prev) => ({ ...prev, priceTo: e.target.value }))
//                 }
//               />
//               <Button
//                 onClick={handleClosePrice}
//                 variant="contained"
//                 size="small"
//                 sx={{ backgroundColor: "#6E00FE", color: "#fff" }}
//               >
//                 تم
//               </Button>
//             </Box>
//           </Popover>
//         </div>

//         {/* SEARCH BUTTON */}
//         <Button
//           variant="contained"
//           sx={{
//             backgroundColor: "#6E00FE",
//             color: "white",
//             height: "50px",
//             borderRadius: "10px",
//             padding: "0 25px",
//             fontWeight: "bold",
//             minWidth: "120px",
//           }}
//         >
//           ابحث
//         </Button>
//       </Container>
//     </Box>
//   );
// }
// export default function HeroWithSearch() {
//   return (
//     <Box sx={{ position: "relative", width: "100%" }}>
//       <SearchProvider>
//         <HeroSlider />
//         <SearchComponent />
//       </SearchProvider>
//     </Box>
//   );
// }


import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Container,
  Autocomplete,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Popover,
  Typography,
  Divider,
} from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HomepageAdvertisement from "../FireBase/modelsWithOperations/HomepageAdvertisement";
import { getCachedAds, saveAdsToCache, hasAdsChanged } from "./adsCacheUtils";
import { SearchProvider, SearchContext } from "../context/searchcontext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
const CACHE_KEY = "hero_ads_cache";
function HeroSlider({ ads }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "50vh", md: "70vh" },
        overflow: "hidden",
        direction: "rtl",
        margin: 0,
        padding: 0,
      }}
    >
      {ads.length > 0 && ads[index] && (
        <>
          <Box
            component="img"
            src={
              ads[index] && ads[index].image
                ? ads[index].image
                : "/hero-placeholder.png" // ضع صورة باسم hero-placeholder.jpg في public
            }
            alt="slider image"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {ads[index].title && (
            <Box
              sx={{
                position: "absolute",
                bottom: 24,
                right: 24,
                background: "rgba(0,0,0,0.5)",
                color: "white",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "60%",
              }}
            >
              {typeof ads[index].title === "object"
                ? JSON.stringify(ads[index].title)
                : ads[index].title}
              {ads[index].location && (
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  {typeof ads[index].location === "object"
                    ? ads[index].location.full ||
                      JSON.stringify(ads[index].location)
                    : ads[index].location}
                </div>
              )}
              {ads[index].description && (
                <div style={{ fontSize: 13, marginTop: 4, color: "#ccc" }}>
                  {typeof ads[index].description === "object"
                    ? JSON.stringify(ads[index].description)
                    : ads[index].description}
                </div>
              )}
            </Box>
          )}
        </>
      )}

      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: 16,
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(0,0,0,0.4)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
        }}
        disabled={ads.length === 0}
      >
        <ArrowBackIos />
      </IconButton>

      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(0,0,0,0.4)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
        }}
        disabled={ads.length === 0}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
}
function SearchComponent({ ads }) {
  const { filters, setFilters, searchWord, setSearchWord } =
    useContext(SearchContext);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState({
    purpose: null,
    propertyType: null,
  });
  const [anchorPrice, setAnchorPrice] = useState(null);

  // اقتراحات بناءً على الإعلانات
  const suggestions = ads
    .flatMap((ad) => [
      ad.title,
      typeof ad.location === "object" ? ad.location.full : ad.location,
      ad.description,
    ])
    .filter((item) => typeof item === "string" && item.trim() !== "")
    .reduce(
      (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
      []
    );

  const handleOpenMenu = (type) => (event) => {
    setMenuAnchor((prev) => ({ ...prev, [type]: event.currentTarget }));
  };

  const handleCloseMenu = (type) => () => {
    setMenuAnchor((prev) => ({ ...prev, [type]: null }));
  };

  const handleSelect = (type, value) => () => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setMenuAnchor((prev) => ({ ...prev, [type]: null }));
  };

  const handleOpenPrice = (event) => {
    setAnchorPrice(event.currentTarget);
  };

  const handleClosePrice = () => {
    setAnchorPrice(null);
  };

  const handleSearch = () => {
    if (
      searchWord.trim() !== "" ||
      filters.purpose !== "الغرض" ||
      filters.propertyType !== "نوع العقار" ||
      filters.priceFrom ||
      filters.priceTo
    ) {
      navigate("/search");
    }
  };

  const isPriceOpen = Boolean(anchorPrice);

  const menuItems = {
    purpose: ["بيع", "إيجار", "مطور عقارى", "ممول عقارى"],
    propertyType: ["منزل", "شقة", "فيلا", "دوبلكس", "محل"],
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "1200px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(15px)",
        borderRadius: "35px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        marginBottom: { xs: "20px", md: "40px" },
        zIndex: 10,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          position: "absolute",
          // top: "20%",
          bottom: "130%",

          right: "35%",
          color: "white",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          maxWidth: "50%",
          textAlign: "center",
          direction: "rtl",
        }}
      >
        دوّر على بيتك عندنا
      </Typography>

      <Container
        dir="rtl"
        maxWidth="lg"
        className="mt-5 d-flex"
        sx={{ gap: "10px", flexWrap: "wrap", justifyContent: "center" }}
      >
        {/* SEARCH INPUT WITH AUTOCOMPLETE */}
        <Autocomplete
          freeSolo
          options={suggestions}
          inputValue={searchWord}
          onInputChange={(event, newInputValue) => setSearchWord(newInputValue)}
          onChange={(event, newValue) => setSearchWord(newValue || "")}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="ادخل اسم المدينة أو المنطقة"
              variant="outlined"
              sx={{
                flexGrow: 1,
                minWidth: "300px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "100px",
                  height: "50px",
                  padding: "0 10px",
                  backgroundColor: "#F7F7F7",
                  color: "#333",
                  transition: "none",
                  "& fieldset": {
                    border: "0",
                  },
                  "&:hover fieldset": {
                    border: "0",
                  },
                  "&.Mui-focused fieldset": {
                    border: "2px solid #1976d2",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#F7F7F7 !important",
                    boxShadow: "none !important",
                  },
                },
                "& input": {
                  color: "#333",
                  fontSize: "20px",
                },
                "input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
                  backgroundColor: "transparent !important",
                },
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ color: "#666" }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* PURPOSE AND PROPERTY TYPE */}
        {["purpose", "propertyType"].map((type) => (
          <div key={type}>
            <Button
              variant="contained"
              onClick={handleOpenMenu(type)}
              endIcon={<ArrowDropDownIcon />}
              sx={{
                backgroundColor:
                  filters[type] ===
                  (type === "purpose" ? "الغرض" : "نوع العقار")
                    ? "white"
                    : "#F7F7FC",
                color:
                  filters[type] ===
                  (type === "purpose" ? "الغرض" : "نوع العقار")
                    ? "#666"
                    : "#6E00FE",
                borderRadius: "10px",
                height: "50px",
                minWidth: "110px",
                fontSize: "18px",
                boxShadow: "none",
                border:
                  filters[type] !==
                  (type === "purpose" ? "الغرض" : "نوع العقار")
                    ? "1px solid rgb(178, 128, 245)"
                    : "1px solid #ccc",
              }}
            >
              {filters[type]}
            </Button>

            <Menu
              anchorEl={menuAnchor[type]}
              open={Boolean(menuAnchor[type])}
              onClose={handleCloseMenu(type)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              dir="rtl"
            >
              {menuItems[type].map((option) => (
                <MenuItem
                  key={option}
                  selected={filters[type] === option}
                  onClick={handleSelect(type, option)}
                  sx={{
                    backgroundColor:
                      filters[type] === option ? "#f0f0f0" : "transparent",
                    color: filters[type] === option ? "#6E00FE" : "#333",
                    fontWeight: filters[type] === option ? "bold" : "normal",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        ))}

        {/* PRICE */}
        <div>
          <Button
            variant="outlined"
            onClick={handleOpenPrice}
            sx={{
              height: "50px",
              borderRadius: "10px",
              color: filters.priceFrom || filters.priceTo ? "#6E00FE" : "#666",
              border:
                filters.priceFrom || filters.priceTo
                  ? "1px solid #6E00FE"
                  : "1px solid #ccc",
              fontWeight: "bold",
              backgroundColor: "white",
              minWidth: "150px",
            }}
          >
            {filters.priceFrom || filters.priceTo
              ? `من ${filters.priceFrom || "..."} إلى ${
                  filters.priceTo || "..."
                } ج.م`
              : "السعر (جنيه)"}
          </Button>

          <Popover
            open={isPriceOpen}
            anchorEl={anchorPrice}
            onClose={handleClosePrice}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            dir="rtl"
          >
            <Box
              sx={{
                padding: "16px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <TextField
                label="من"
                type="number"
                size="small"
                value={filters.priceFrom}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priceFrom: e.target.value }))
                }
              />
              <TextField
                label="إلى"
                type="number"
                size="small"
                value={filters.priceTo}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priceTo: e.target.value }))
                }
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
        </div>

        {/* SEARCH BUTTON */}
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            backgroundColor: "#6E00FE",
            color: "white",
            height: "50px",
            borderRadius: "10px",
            padding: "0 25px",
            fontWeight: "bold",
            minWidth: "120px",
          }}
        >
          ابحث
        </Button>
      </Container>
    </Box>
  );
}
export default function HeroWithSearch() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const cachedAds = getCachedAds(CACHE_KEY);
    if (cachedAds) {
      setAds(cachedAds);
    }

    const unsubscribe = HomepageAdvertisement.subscribeActiveAds((newAds) => {
      if (!cachedAds || hasAdsChanged(cachedAds, newAds)) {
        setAds(newAds);
        saveAdsToCache(CACHE_KEY, newAds);
      }
    });

    if (!cachedAds) {
      HomepageAdvertisement.getActiveAds().then((ads) => {
        setAds(ads);
        saveAdsToCache(CACHE_KEY, ads);
      });
    }

    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <SearchProvider>
        <HeroSlider ads={ads} />
        <SearchComponent ads={ads} />
      </SearchProvider>
    </Box>
  );
}


// import { useState, useEffect } from "react";
// import {
//   Box,
//   IconButton,
//   Container,
//   Autocomplete,
//   TextField,
//   InputAdornment,
//   Button,
//   Menu,
//   MenuItem,
//   Popover,
//   Divider,
// } from "@mui/material";
// import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
// import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
// import SearchIcon from "@mui/icons-material/Search";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import HomepageAdvertisement from "../FireBase/modelsWithOperations/HomepageAdvertisement";
// import { getCachedAds, saveAdsToCache, hasAdsChanged } from "./adsCacheUtils";
// import { SearchProvider, SearchContext } from "../context/searchcontext";
// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";

// const CACHE_KEY = "hero_ads_cache";

// function HeroSlider({ ads }) {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     if (ads.length === 0) return;
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % ads.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [ads.length]);

//   const nextSlide = () => {
//     setIndex((prev) => (prev + 1) % ads.length);
//   };

//   const prevSlide = () => {
//     setIndex((prev) => (prev - 1 + ads.length) % ads.length);
//   };

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         width: "100%",
//         height: { xs: "50vh", md: "70vh" },
//         overflow: "hidden",
//         direction: "rtl",
//         margin: 0,
//         padding: 0,
//       }}
//     >
//       {ads.length > 0 && ads[index] && (
//         <>
//           <Box
//             component="img"
//             src={
//               ads[index] && ads[index].image
//                 ? ads[index].image
//                 : "/hero-placeholder.jpg" // ضعي صورة باسم hero-placeholder.jpg في public
//             }
//             alt="slider image"
//             sx={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//             }}
//           />
//           {ads[index].title && (
//             <Box
//               sx={{
//                 position: "absolute",
//                 bottom: 24,
//                 right: 24,
//                 background: "rgba(0,0,0,0.5)",
//                 color: "white",
//                 px: 2,
//                 py: 1,
//                 borderRadius: 2,
//                 maxWidth: "60%",
//               }}
//             >
//               {typeof ads[index].title === "object"
//                 ? JSON.stringify(ads[index].title)
//                 : ads[index].title}
//               {ads[index].location && (
//                 <div style={{ fontSize: 14, marginTop: 4 }}>
//                   {typeof ads[index].location === "object"
//                     ? ads[index].location.full ||
//                       JSON.stringify(ads[index].location)
//                     : ads[index].location}
//                 </div>
//               )}
//               {ads[index].description && (
//                 <div style={{ fontSize: 13, marginTop: 4, color: "#ccc" }}>
//                   {typeof ads[index].description === "object"
//                     ? JSON.stringify(ads[index].description)
//                     : ads[index].description}
//                 </div>
//               )}
//             </Box>
//           )}
//         </>
//       )}

//       <IconButton
//         onClick={nextSlide}
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: 16,
//           transform: "translateY(-50%)",
//           color: "white",
//           backgroundColor: "rgba(0,0,0,0.4)",
//           "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
//         }}
//         disabled={ads.length === 0}
//       >
//         <ArrowBackIos />
//       </IconButton>

//       <IconButton
//         onClick={prevSlide}
//         sx={{
//           position: "absolute",
//           top: "50%",
//           right: 16,
//           transform: "translateY(-50%)",
//           color: "white",
//           backgroundColor: "rgba(0,0,0,0.4)",
//           "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
//         }}
//         disabled={ads.length === 0}
//       >
//         <ArrowForwardIos />
//       </IconButton>
//     </Box>
//   );
// }

// function SearchComponent({ ads }) {
//   const { filters, setFilters, searchWord, setSearchWord } =
//     useContext(SearchContext);
//   const navigate = useNavigate();
//   const [menuAnchor, setMenuAnchor] = useState({
//     purpose: null,
//     propertyType: null,
//   });
//   const [anchorPrice, setAnchorPrice] = useState(null);

//   // اقتراحات بناءً على الإعلانات
//   const suggestions = ads
//     .flatMap((ad) => [
//       ad.title,
//       typeof ad.location === "object" ? ad.location.full : ad.location,
//       ad.description,
//     ])
//     .filter((item) => typeof item === "string" && item.trim() !== "")
//     .reduce((unique, item) => (unique.includes(item) ? unique : [...unique, item]), []);

//   const handleOpenMenu = (type) => (event) => {
//     setMenuAnchor((prev) => ({ ...prev, [type]: event.currentTarget }));
//   };

//   const handleCloseMenu = (type) => () => {
//     setMenuAnchor((prev) => ({ ...prev, [type]: null }));
//   };

//   const handleSelect = (type, value) => () => {
//     setFilters((prev) => ({ ...prev, [type]: value }));
//     setMenuAnchor((prev) => ({ ...prev, [type]: null }));
//   };

//   const handleOpenPrice = (event) => {
//     setAnchorPrice(event.currentTarget);
//   };

//   const handleClosePrice = () => {
//     setAnchorPrice(null);
//   };

//   const handleSearch = () => {
//     if (searchWord.trim() !== "" || filters.purpose !== "الغرض" || filters.propertyType !== "نوع العقار" || filters.priceFrom || filters.priceTo) {
//       navigate("/search");
//     }
//   };

//   const isPriceOpen = Boolean(anchorPrice);

//   const menuItems = {
//     purpose: ["بيع", "إيجار", "مطور عقارى", "ممول عقارى"],
//     propertyType: ["منزل", "شقة", "فيلا", "دوبلكس", "محل"],
//   };

//   return (
//     <Box
//       sx={{
//         position: "absolute",
//         bottom: 0,
//         left: "50%",
//         transform: "translateX(-50%)",
//         width: "90%",
//         maxWidth: "1200px",
//         backgroundColor: "rgba(255, 255, 255, 0.2)",
//         backdropFilter: "blur(10px)",
//         WebkitBackdropFilter: "blur(15px)",
//         borderRadius: "35px",
//         boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//         padding: "20px",
//         marginBottom: { xs: "20px", md: "40px" },
//         zIndex: 10,
//       }}
//     >
//       <Container
//         dir="rtl"
//         maxWidth="lg"
//         className="mt-5 d-flex"
//         sx={{ gap: "10px", flexWrap: "wrap", justifyContent: "center" }}
//       >
//         {/* SEARCH INPUT WITH AUTOCOMPLETE */}
//         <Autocomplete
//           freeSolo
//           options={suggestions}
//           inputValue={searchWord}
//           onInputChange={(event, newInputValue) => setSearchWord(newInputValue || "")}
//           onChange={(event, newValue) => setSearchWord(newValue || "")}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="ادخل اسم المدينة أو المنطقة"
//               variant="outlined"
//               sx={{
//                 flexGrow: 1,
//                 minWidth: "300px",
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "100px",
//                   height: "50px",
//                   padding: "0 10px",
//                   backgroundColor: "#F7F7F7",
//                   color: "#333",
//                   transition: "none",
//                   "& fieldset": {
//                     border: "0",
//                   },
//                   "&:hover fieldset": {
//                     border: "0",
//                   },
//                   "&.Mui-focused fieldset": {
//                     border: "2px solid #1976d2",
//                   },
//                   "&.Mui-focused": {
//                     backgroundColor: "#F7F7F7 !important",
//                     boxShadow: "none !important",
//                   },
//                 },
//                 "& input": {
//                   color: "#333",
//                   fontSize: "20px",
//                 },
//                 "input:-webkit-autofill": {
//                   WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
//                   backgroundColor: "transparent !important",
//                 },
//               }}
//               InputProps={{
//                 ...params.InputProps,
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <SearchIcon style={{ color: "#666" }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           )}
//         />

//         {/* PURPOSE AND PROPERTY TYPE */}
//         {["purpose", "propertyType"].map((type) => (
//           <div key={type}>
//             <Button
//               variant="contained"
//               onClick={handleOpenMenu(type)}
//               endIcon={<ArrowDropDownIcon />}
//               sx={{
//                 backgroundColor:
//                   filters[type] ===
//                   (type === "purpose" ? "الغرض" : "نوع العقار")
//                     ? "white"
//                     : "#F7F7FC",
//                 color:
//                   filters[type] ===
//                   (type === "purpose" ? "الغرض" : "نوع العقار")
//                     ? "#666"
//                     : "#6E00FE",
//                 borderRadius: "10px",
//                 height: "50px",
//                 minWidth: "110px",
//                 fontSize: "18px",
//                 boxShadow: "none",
//                 border:
//                   filters[type] !==
//                   (type === "purpose" ? "الغرض" : "نوع العقار")
//                     ? "1px solid rgb(178, 128, 245)"
//                     : "1px solid #ccc",
//               }}
//             >
//               {filters[type]}
//             </Button>

//             <Menu
//               anchorEl={menuAnchor[type]}
//               open={Boolean(menuAnchor[type])}
//               onClose={handleCloseMenu(type)}
//               anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//               transformOrigin={{ vertical: "top", horizontal: "center" }}
//               dir="rtl"
//             >
//               {menuItems[type].map((option) => (
//                 <MenuItem
//                   key={option}
//                   selected={filters[type] === option}
//                   onClick={handleSelect(type, option)}
//                   sx={{
//                     backgroundColor:
//                       filters[type] === option ? "#f0f0f0" : "transparent",
//                     color: filters[type] === option ? "#6E00FE" : "#333",
//                     fontWeight: filters[type] === option ? "bold" : "normal",
//                     "&:hover": {
//                       backgroundColor: "#e0e0e0",
//                     },
//                   }}
//                 >
//                   {option}
//                 </MenuItem>
//               ))}
//             </Menu>
//           </div>
//         ))}

//         {/* PRICE */}
//         <div>
//           <Button
//             variant="outlined"
//             onClick={handleOpenPrice}
//             sx={{
//               height: "50px",
//               borderRadius: "10px",
//               color: filters.priceFrom || filters.priceTo ? "#6E00FE" : "#666",
//               border:
//                 filters.priceFrom || filters.priceTo
//                   ? "1px solid #6E00FE"
//                   : "1px solid #ccc",
//               fontWeight: "bold",
//               backgroundColor: "white",
//               minWidth: "150px",
//             }}
//           >
//             {filters.priceFrom || filters.priceTo
//               ? `من ${filters.priceFrom || "..."} إلى ${
//                   filters.priceTo || "..."
//                 } ج.م`
//               : "السعر (جنيه)"}
//           </Button>

//           <Popover
//             open={isPriceOpen}
//             anchorEl={anchorPrice}
//             onClose={handleClosePrice}
//             anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//             transformOrigin={{ vertical: "top", horizontal: "center" }}
//             dir="rtl"
//           >
//             <Box
//               sx={{
//                 padding: "16px",
//                 display: "flex",
//                 gap: "10px",
//                 alignItems: "center",
//                 flexDirection: "column",
//               }}
//             >
//               <TextField
//                 label="من"
//                 type="number"
//                 size="small"
//                 value={filters.priceFrom}
//                 onChange={(e) =>
//                   setFilters((prev) => ({ ...prev, priceFrom: e.target.value }))
//                 }
//               />
//               <TextField
//                 label="إلى"
//                 type="number"
//                 size="small"
//                 value={filters.priceTo}
//                 onChange={(e) =>
//                   setFilters((prev) => ({ ...prev, priceTo: e.target.value }))
//                 }
//               />
//               <Button
//                 onClick={handleClosePrice}
//                 variant="contained"
//                 size="small"
//                 sx={{ backgroundColor: "#6E00FE", color: "#fff" }}
//               >
//                 تم
//               </Button>
//             </Box>
//           </Popover>
//         </div>

//         {/* SEARCH BUTTON */}
//         <Button
//           variant="contained"
//           onClick={handleSearch}
//           sx={{
//             backgroundColor: "#6E00FE",
//             color: "white",
//             height: "50px",
//             borderRadius: "10px",
//             padding: "0 25px",
//             fontWeight: "bold",
//             minWidth: "120px",
//           }}
//         >
//           ابحث
//         </Button>
//       </Container>
//     </Box>
//   );
// }

// export default function HeroWithSearch() {
//   const [ads, setAds] = useState([]);

//   useEffect(() => {
//     const cachedAds = getCachedAds(CACHE_KEY);
//     if (cachedAds) {
//       setAds(cachedAds);
//     }

//     const unsubscribe = HomepageAdvertisement.subscribeActiveAds((newAds) => {
//       if (!cachedAds || hasAdsChanged(cachedAds, newAds)) {
//         setAds(newAds);
//         saveAdsToCache(CACHE_KEY, newAds);
//       }
//     });

//     if (!cachedAds) {
//       HomepageAdvertisement.getActiveAds().then((ads) => {
//         setAds(ads);
//         saveAdsToCache(CACHE_KEY, ads);
//       });
//     }

//     return () => unsubscribe();
//   }, []);

//   return (
//     <Box sx={{ position: "relative", width: "100%" }}>
//       <SearchProvider>
//         <HeroSlider ads={ads} />
//         <SearchComponent ads={ads} />
//       </SearchProvider>
//     </Box>
//   );
// }