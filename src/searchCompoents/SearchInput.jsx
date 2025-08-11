// import React, { useContext, useState } from 'react';
// import {
//   Container,
//   TextField,
//   InputAdornment,
//   Button,
//   Menu,
//   MenuItem,
//   Popover,
//   Divider,
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import {SearchContext} from '../context/searchcontext'
// function SearchInput() {
//    const { filters, setFilters, searchWord, setSearchWord } = useContext(SearchContext);
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

//   const handleSearch = (e) => {
//     // dispatch(setSearchTerm(e.target.value));
//   };

//   const handleOpenPrice = (event) => {
//     setAnchorPrice(event.currentTarget);
//   };

//   const handleClosePrice = () => {
//     setAnchorPrice(null);
//   };

//   const isPriceOpen = Boolean(anchorPrice);

//   const menuItems = {
//     purpose: ['بيع', 'إيجار', 'مطور عقارى', 'ممول عقارى'],
//     propertyType: ['منزل', 'شقة', 'فيلا', 'دوبلكس','محل'],
//   };

//   return (
//     <>
//     <Container dir="rtl" maxWidth="lg" className="mt-5 d-flex" style={{ gap: '10px', flexWrap: 'wrap' }}>
//       {/* SEARCH INPUT*/}
//      <TextField
//   placeholder="ادخل اسم المدينة أو المنطقة"
//   onChange={(e) => setSearchWord(e.target.value)}
//   variant="outlined"
//   value={searchWord}
//  sx={{
//   width: '30vw',
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '100px',
//     height: '50px',
//     padding: '0 10px',
//     backgroundColor: '#F7F7F7',
//     color: '#333',
//     transition: 'none', 
//     '& fieldset': {
//       border: '0',
//     },
//     '&:hover fieldset': {
//       border: '0',
//     },
//     '&.Mui-focused fieldset': {
//       border: '2px solid #1976d2',
//     },
//     '&.Mui-focused': {
//       backgroundColor: '#F7F7F7 !important', 
//       boxShadow: 'none !important', 
//     },
//   },
//   '& input': {
//     color: '#333',
//     fontSize:'20px'
//   },
//   'input:-webkit-autofill': {
//   WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
//   backgroundColor: 'transparent !important',
// },
// }}

//   InputProps={{
//     endAdornment: (
//       <InputAdornment position="end">
//         <SearchIcon style={{ color: '#666' }} />
//       </InputAdornment>
//     ),
//   }}
// />
//   {/*  الغرض ونوع العقار */}
//       {['purpose', 'propertyType'].map((type) => (
//         <div key={type}>
//           <Button
//             variant="contained"
//             onClick={handleOpenMenu(type)}
//             endIcon={<ArrowDropDownIcon />}
//             style={{
//               backgroundColor: filters[type] === (type === 'purpose' ? 'الغرض' : 'نوع العقار') ? 'white' : '#F7F7FC',
//               color: filters[type] === (type === 'purpose' ? 'الغرض' : 'نوع العقار') ? '#666' : '#6E00FE',
//               borderRadius: '10px',
//               height: '50px',
//               minWidth: '110px',
//               fontSize: '18px',
//               boxShadow: 'none',
//               border: filters[type] !== (type === 'purpose' ? 'الغرض' : 'نوع العقار') ? '1px solid rgb(178, 128, 245)' : '1px solid #ccc',
//             }}
//           >
//             {filters[type]}
//           </Button>

//           <Menu
//             anchorEl={menuAnchor[type]}
//             open={Boolean(menuAnchor[type])}
//             onClose={handleCloseMenu(type)}
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             transformOrigin={{ vertical: 'top', horizontal: 'center' }}
//             dir="rtl"
//           >
//             {menuItems[type].map((option) => (
//               <MenuItem
//                 key={option}
//                 selected={filters[type] === option}
//                 onClick={handleSelect(type, option)}
//                 sx={{
//                   backgroundColor: filters[type] === option ? '#f0f0f0' : 'transparent',
//                   color: filters[type] === option ? '#6E00FE' : '#333',
//                   fontWeight: filters[type] === option ? 'bold' : 'normal',
//                   '&:hover': {
//                     backgroundColor: '#e0e0e0',
//                   },
//                 }}
//               >
//                 {option}
//               </MenuItem>
//             ))}
//           </Menu>
//         </div>
//       ))}

//       {/* PRICE */}
//       <div>
//         <Button
//           variant="outlined"
//           onClick={handleOpenPrice}
//           style={{
//             height: '50px',
//             borderRadius: '10px',
//             color: filters.priceFrom || filters.priceTo ? '#6E00FE' : '#666',
//             border: filters.priceFrom || filters.priceTo ? '1px solid #6E00FE' : '1px solid #ccc',
//             fontWeight: 'bold',
//             backgroundColor: 'white',
//             minWidth: '150px',
//           }}
//         >
//           {filters.priceFrom || filters.priceTo
//             ? `من ${filters.priceFrom || '...'} إلى ${filters.priceTo || '...'} ج.م`
//             : 'السعر (جنيه)'}
//         </Button>

//         <Popover
//           open={isPriceOpen}
//           anchorEl={anchorPrice}
//           onClose={handleClosePrice}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//           transformOrigin={{ vertical: 'top', horizontal: 'center' }}
//           dir="rtl"
//         >
//           <div style={{ padding: '16px', display: 'flex', gap: '10px', alignItems: 'center',flexDirection:'column' }}>
//             <TextField
//               label="من"
//               type="number"
//               size="small"
//               value={filters.priceFrom}
//               onChange={(e) =>
//                 setFilters((prev) => ({ ...prev, priceFrom: e.target.value }))
//               }
//             />
//             <TextField
//               label="إلى"
//               type="number"
//               size="small"
//               value={filters.priceTo}
//               onChange={(e) =>
//                 setFilters((prev) => ({ ...prev, priceTo: e.target.value }))
//               }
//             />
//             <Button
//               onClick={handleClosePrice}
//               variant="contained"
//               size="small"
//               style={{ backgroundColor: '#6E00FE', color: '#fff' }}
//             >
//               تم
//             </Button>
//           </div>
//         </Popover>
//       </div>

     
//       <button
//         className="btn btn-search"
//         style={{
//           backgroundColor: '#6E00FE',
//           color: 'white',
//           height: '50px',
//           borderRadius: '10px',
//           padding: '0 25px',
//           fontWeight:'bold'
//         }}
//       >
//         ابحث
//       </button>
     
//     </Container>
//     <Divider sx={{marginTop:'30px',color:'black',backgroundColor:'#E3E3E3'}} />
//     </>
//   );
// }
// export default SearchInput;



// import React, { useContext, useState, useEffect } from 'react';
// import {
//   Container,
//   Autocomplete,
//   TextField,
//   InputAdornment,
//   Button,
//   Menu,
//   MenuItem,
//   Popover,
//   Divider,
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import { SearchContext } from '../context/searchcontext';
// import { useNavigate } from 'react-router-dom';
// import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisemen';
// import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
// import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
// function SearchInput() {
//   const { filters, setFilters, searchWord, setSearchWord } = useContext(SearchContext);
//   const navigate = useNavigate();
//   const [menuAnchor, setMenuAnchor] = useState({
//     purpose: null,
//     propertyType: null,
//   });
//   const [anchorPrice, setAnchorPrice] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);

//   // جلب اقتراحات من الإعلانات
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       const clientAds = await ClientAdvertisement.getAll();
//       const financingAds = await FinancingAdvertisement.getAll();
//       const developerAds = await RealEstateDeveloperAdvertisement.getAll();

//       const allSuggestions = [
//         ...clientAds.flatMap((ad) => [ad.title, ad.address, ad.city, ad.governorate]),
//         ...financingAds.flatMap((ad) => [ad.title, ad.org_name, ad.description]),
//         ...developerAds.flatMap((ad) => [ad.developer_name, ad.location, ad.description]),
//       ].filter((item) => typeof item === "string" && item.trim() !== "");

//       const uniqueSuggestions = [...new Set(allSuggestions)];
//       setSuggestions(uniqueSuggestions);
//     };

//     fetchSuggestions();
//   }, []);

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

//   const handleSearch = () => {
//     if (searchWord.trim() !== "" || filters.purpose !== "الغرض" || filters.propertyType !== "نوع العقار" || filters.priceFrom || filters.priceTo) {
//       navigate("/search");
//     }
//   };

//   const handleOpenPrice = (event) => {
//     setAnchorPrice(event.currentTarget);
//   };

//   const handleClosePrice = () => {
//     setAnchorPrice(null);
//   };

//   const isPriceOpen = Boolean(anchorPrice);

//   const menuItems = {
//     purpose: ['بيع', 'إيجار', 'مطور عقارى', 'ممول عقارى'],
//     propertyType: ['منزل', 'شقة', 'فيلا', 'دوبلكس', 'محل'],
//   };

//   return (
//     <>
//       <Container dir="rtl" maxWidth="lg" className="mt-5 d-flex" sx={{ gap: '10px', flexWrap: 'wrap' }}>
//         {/* SEARCH INPUT WITH AUTOCOMPLETE */}
//         <Autocomplete
//           freeSolo
//           options={suggestions}
//           inputValue={searchWord}
//           onInputChange={(event, newInputValue) => setSearchWord(newInputValue)}
//           onChange={(event, newValue) => setSearchWord(newValue || "")}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="ادخل اسم المدينة أو المنطقة"
//               variant="outlined"
//               sx={{
//                 width: '30vw',
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '100px',
//                   height: '50px',
//                   padding: '0 10px',
//                   backgroundColor: '#F7F7F7',
//                   color: '#333',
//                   transition: 'none',
//                   '& fieldset': {
//                     border: '0',
//                   },
//                   '&:hover fieldset': {
//                     border: '0',
//                   },
//                   '&.Mui-focused fieldset': {
//                     border: '2px solid #1976d2',
//                   },
//                   '&.Mui-focused': {
//                     backgroundColor: '#F7F7F7 !important',
//                     boxShadow: 'none !important',
//                   },
//                 },
//                 '& input': {
//                   color: '#333',
//                   fontSize: '20px',
//                 },
//                 'input:-webkit-autofill': {
//                   WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
//                   backgroundColor: 'transparent !important',
//                 },
//               }}
//               InputProps={{
//                 ...params.InputProps,
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <SearchIcon style={{ color: '#666' }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           )}
//         />

//         {/* PURPOSE AND PROPERTY TYPE */}
//         {['purpose', 'propertyType'].map((type) => (
//           <div key={type}>
//             <Button
//               variant="contained"
//               onClick={handleOpenMenu(type)}
//               endIcon={<ArrowDropDownIcon />}
//               sx={{
//                 backgroundColor:
//                   filters[type] === (type === 'purpose' ? 'الغرض' : 'نوع العقار')
//                     ? 'white'
//                     : '#F7F7FC',
//                 color:
//                   filters[type] === (type === 'purpose' ? 'الغرض' : 'نوع العقار')
//                     ? '#666'
//                     : '#6E00FE',
//                 borderRadius: '10px',
//                 height: '50px',
//                 minWidth: '110px',
//                 fontSize: '18px',
//                 boxShadow: 'none',
//                 border:
//                   filters[type] !== (type === 'purpose' ? 'الغرض' : 'نوع العقار')
//                     ? '1px solid rgb(178, 128, 245)'
//                     : '1px solid #ccc',
//               }}
//             >
//               {filters[type]}
//             </Button>

//             <Menu
//               anchorEl={menuAnchor[type]}
//               open={Boolean(menuAnchor[type])}
//               onClose={handleCloseMenu(type)}
//               anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//               transformOrigin={{ vertical: 'top', horizontal: 'center' }}
//               dir="rtl"
//             >
//               {menuItems[type].map((option) => (
//                 <MenuItem
//                   key={option}
//                   selected={filters[type] === option}
//                   onClick={handleSelect(type, option)}
//                   sx={{
//                     backgroundColor: filters[type] === option ? '#f0f0f0' : 'transparent',
//                     color: filters[type] === option ? '#6E00FE' : '#333',
//                     fontWeight: filters[type] === option ? 'bold' : 'normal',
//                     '&:hover': {
//                       backgroundColor: '#e0e0e0',
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
//               height: '50px',
//               borderRadius: '10px',
//               color: filters.priceFrom || filters.priceTo ? '#6E00FE' : '#666',
//               border: filters.priceFrom || filters.priceTo ? '1px solid #6E00FE' : '1px solid #ccc',
//               fontWeight: 'bold',
//               backgroundColor: 'white',
//               minWidth: '150px',
//             }}
//           >
//             {filters.priceFrom || filters.priceTo
//               ? `من ${filters.priceFrom || '...'} إلى ${filters.priceTo || '...'} ج.م`
//               : 'السعر (جنيه)'}
//           </Button>

//           <Popover
//             open={isPriceOpen}
//             anchorEl={anchorPrice}
//             onClose={handleClosePrice}
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             transformOrigin={{ vertical: 'top', horizontal: 'center' }}
//             dir="rtl"
//           >
//             <div style={{ padding: '16px', display: 'flex', gap: '10px', alignItems: 'center', flexDirection: 'column' }}>
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
//                 sx={{ backgroundColor: '#6E00FE', color: '#fff' }}
//               >
//                 تم
//               </Button>
//             </div>
//           </Popover>
//         </div>

//         {/* SEARCH BUTTON */}
//         <Button
//           variant="contained"
//           onClick={handleSearch}
//           sx={{
//             backgroundColor: '#6E00FE',
//             color: 'white',
//             height: '50px',
//             borderRadius: '10px',
//             padding: '0 25px',
//             fontWeight: 'bold',
//             minWidth: '120px',
//           }}
//         >
//           ابحث
//         </Button>
//       </Container>
//       <Divider sx={{ marginTop: '30px', color: 'black', backgroundColor: '#E3E3E3' }} />
//     </>
//   );
// }
// export default SearchInput;


import React, { useContext, useState, useEffect } from 'react';
import {
  Container,
  Autocomplete,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Popover,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SearchContext } from '../context/searchcontext';
import { useNavigate } from 'react-router-dom';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisemen';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';

function SearchInput() {
  const { filters, setFilters, searchWord, setSearchWord } = useContext(SearchContext);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState({
    purpose: null,
    propertyType: null,
  });
  const [anchorPrice, setAnchorPrice] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // جلب اقتراحات من الإعلانات
  useEffect(() => {
    const fetchSuggestions = async () => {
      const clientAds = await ClientAdvertisement.getAll();
      const financingAds = await FinancingAdvertisement.getAll();
      const developerAds = await RealEstateDeveloperAdvertisement.getAll();

      const allSuggestions = [
        ...clientAds.flatMap((ad) => [ad.title, ad.address, ad.city, ad.governorate]),
        ...financingAds.flatMap((ad) => [ad.title, ad.org_name, ad.description]),
        ...developerAds.flatMap((ad) => [ad.developer_name, ad.location, ad.description]),
      ].filter((item) => typeof item === "string" && item.trim() !== "");

      const uniqueSuggestions = [...new Set(allSuggestions)];
      setSuggestions(uniqueSuggestions);
    };

    fetchSuggestions();
  }, []);

  // التأكد من إن searchWord بيظهر في الحقل
  useEffect(() => {
    if (searchWord) {
      // لو فيه searchWord في الـ context، التأكد إنه بيظهر في الحقل
      setSearchWord(searchWord);
    }
  }, [searchWord, setSearchWord]);

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

  const handleSearch = () => {
    if (searchWord.trim() !== "" || filters.purpose !== "الغرض" || filters.propertyType !== "نوع العقار" || filters.priceFrom || filters.priceTo) {
      navigate("/search");
    }
  };

  const handleOpenPrice = (event) => {
    setAnchorPrice(event.currentTarget);
  };

  const handleClosePrice = () => {
    setAnchorPrice(null);
  };

  const isPriceOpen = Boolean(anchorPrice);

  const menuItems = {
    purpose: ['بيع', 'إيجار', 'مطور عقارى', 'ممول عقارى'],
    propertyType: ['منزل', 'شقة', 'فيلا', 'دوبلكس', 'محل'],
  };

  return (
    <>
      <Container dir="rtl" maxWidth="lg" className="mt-5 d-flex" sx={{ gap: '10px', flexWrap: 'wrap' }}>
        {/* SEARCH INPUT WITH AUTOCOMPLETE */}
        <Autocomplete
          freeSolo
          options={suggestions}
          inputValue={searchWord}
          onInputChange={(event, newInputValue) => setSearchWord(newInputValue || "")}
          onChange={(event, newValue) => setSearchWord(newValue || "")}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="ادخل اسم المدينة أو المنطقة أو عنوان الاعلان"
              variant="outlined"
              sx={{
                width: '30vw',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '100px',
                  height: '50px',
                  padding: '0 10px',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[50]
                      : theme.palette.grey[900],
                  color: (theme) => theme.palette.text.primary,
                  transition: 'none',
                  '& fieldset': {
                    border: '0',
                  },
                  '&:hover fieldset': {
                    border: '0',
                  },
                  '&.Mui-focused fieldset': {
                    border: (theme) => `2px solid ${theme.palette.primary.main}`,
                  },
                  '&.Mui-focused': {
                    backgroundColor: (theme) =>
                      `${theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900]} !important`,
                    boxShadow: 'none !important',
                  },
                },
                '& input': {
                  color: (theme) => theme.palette.text.primary,
                  fontSize: '20px',
                },
                'input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                  backgroundColor: 'transparent !important',
                },
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* PURPOSE AND PROPERTY TYPE */}
        {['purpose', 'propertyType'].map((type) => (
          <div key={type}>
            <Button
              variant="contained"
              onClick={handleOpenMenu(type)}
              endIcon={<ArrowDropDownIcon />}
              sx={{
                backgroundColor: (theme) => {
                  const isPlaceholder = filters[type] === (type === 'purpose' ? 'الغرض' : 'نوع العقار');
                  if (isPlaceholder) return theme.palette.background.paper;
                  return theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
                },
                color: (theme) =>
                  filters[type] === (type === 'purpose' ? 'الغرض' : 'نوع العقار')
                    ? theme.palette.text.secondary
                    : theme.palette.primary.main,
                borderRadius: '10px',
                height: '50px',
                minWidth: '110px',
                fontSize: '18px',
                boxShadow: 'none',
                border: (theme) => `1px solid ${
                  filters[type] !== (type === 'purpose' ? 'الغرض' : 'نوع العقار')
                    ? theme.palette.primary.light
                    : theme.palette.divider
                }`,
                '&:hover': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
                },
              }}
            >
              {filters[type]}
            </Button>

            <Menu
              anchorEl={menuAnchor[type]}
              open={Boolean(menuAnchor[type])}
              onClose={handleCloseMenu(type)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              dir="rtl"
              PaperProps={{
                sx: (theme) => ({
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }),
              }}
            >
              {menuItems[type].map((option) => (
                <MenuItem
                  key={option}
                  selected={filters[type] === option}
                  onClick={handleSelect(type, option)}
                  sx={(theme) => ({
                    backgroundColor:
                      filters[type] === option ? theme.palette.action.selected : 'transparent',
                    color:
                      filters[type] === option ? theme.palette.primary.main : theme.palette.text.primary,
                    fontWeight: filters[type] === option ? 'bold' : 'normal',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  })}
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
              height: '50px',
              borderRadius: '10px',
              color: (theme) =>
                (filters.priceFrom || filters.priceTo)
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              border: (theme) => `1px solid ${
                (filters.priceFrom || filters.priceTo)
                  ? theme.palette.primary.light
                  : theme.palette.divider
              }`,
              fontWeight: 'bold',
              backgroundColor: (theme) => theme.palette.background.paper,
              minWidth: '150px',
              '&:hover': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[800],
              },
            }}
          >
            {filters.priceFrom || filters.priceTo
              ? `من ${filters.priceFrom || '...'} إلى ${filters.priceTo || '...'} ج.م`
              : 'السعر (جنيه)'}
          </Button>

          <Popover
            open={isPriceOpen}
            anchorEl={anchorPrice}
            onClose={handleClosePrice}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            dir="rtl"
          >
            <div style={{ padding: '16px', display: 'flex', gap: '10px', alignItems: 'center', flexDirection: 'column' }}>
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
                sx={{ backgroundColor: '#6E00FE', color: '#fff' }}
              >
                تم
              </Button>
            </div>
          </Popover>
        </div>

        {/* SEARCH BUTTON */}
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            backgroundColor: '#6E00FE',
            color: 'white',
            height: '50px',
            borderRadius: '10px',
            padding: '0 25px',
            fontWeight: 'bold',
            minWidth: '120px',
          }}
        >
          ابحث
        </Button>
      </Container>
      <Divider sx={{ marginTop: '30px', color: 'black', backgroundColor: '#E3E3E3' }} />
    </>
  );
}

export default SearchInput;
