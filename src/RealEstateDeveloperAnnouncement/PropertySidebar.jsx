// import React from "react";
// import {
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Divider,
//   Typography,
//   Box,
//   styled,
// } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";
// import VillaIcon from "@mui/icons-material/Villa";
// import BeachAccessIcon from "@mui/icons-material/BeachAccess";
// import BusinessIcon from "@mui/icons-material/Business";
// import { useDispatch } from "react-redux";
// import { setFormData } from "./propertySlice";

// const SidebarButton = styled(ListItemButton)(({ theme }) => ({
//   "&.Mui-selected": {
//     backgroundColor: "#6E00FE",
//     color: "white",
//     "& .MuiListItemIcon-root": {
//       color: "white",
//     },
//   },
//   "&.Mui-selected:hover": {
//     backgroundColor: "#200D3A",
//   },
//   borderRadius: theme.shape.borderRadius,
//   margin: theme.spacing(0.5),
// }));

// const propertyTypes = [
//   { text: "شقق للبيع", icon: <HomeIcon /> },
//   { text: "شقق للإيجار", icon: <HomeIcon /> },
//   { text: "فلل للبيع", icon: <VillaIcon /> },
//   { text: "فلل للإيجار", icon: <VillaIcon /> },
//   { text: "عقارات مصايف للبيع", icon: <BeachAccessIcon /> },
//   { text: "عقارات مصايف للإيجار", icon: <BeachAccessIcon /> },
//   { text: "عقار تجارى للبيع", icon: <BusinessIcon /> },
//   { text: "عقار تجارى للإيجار", icon: <BusinessIcon /> },
// ];

// const PropertySidebar = ({ selectedItem, setSelectedItem, isMobile }) => {
//   const dispatch = useDispatch();

//   const handleSelect = (text) => {
//     setSelectedItem(text);
//     dispatch(setFormData({ project_types: [text] }));
//   };

//   return (
//     <Box
//       sx={{
//         width: isMobile ? "100%" : 280,
//         bgcolor: "background.paper",
//         borderLeft: isMobile ? "none" : "1px solid #e0e0e0",
//         borderBottom: isMobile ? "1px solid #e0e0e0" : "none",
//         height: isMobile ? "auto" : "100vh",
//         position: isMobile ? "static" : "sticky",
//         top: 0,
//       }}
//     >
//       <Typography
//         variant="h6"
//         sx={{
//           p: 3,
//           color: "#6E00FE",
//           fontWeight: "bold",
//           display: "flex",
//           alignItems: "center",
//           gap: 1,
//           justifyContent: "flex-end",
//         }}
//       >
//         سمسارك
//         <HomeIcon fontSize="medium" />
//       </Typography>
//       <Divider />
//       <List sx={{ p: 2 }}>
//         {propertyTypes.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <SidebarButton
//               selected={selectedItem === item.text}
//               onClick={() => handleSelect(item.text)}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1.5,
//                   flexDirection: "row-reverse",
//                 }}
//               >
//                 <ListItemText primary={item.text} />
//                 {item.icon}
//               </Box>
//             </SidebarButton>
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );
// };

// export default PropertySidebar;

import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Box,
  styled,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import VillaIcon from "@mui/icons-material/Villa";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import BusinessIcon from "@mui/icons-material/Business";
import { useDispatch } from "react-redux";
import { setFormData } from "./propertySlice";

const SidebarButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: "#6E00FE",
    color: "white",
    "& .MuiListItemIcon-root": {
      color: "white",
    },
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#200D3A",
  },
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5),
}));

const propertyTypes = [
  { text: "شقق للبيع", icon: <HomeIcon /> },
  { text: "شقق للإيجار", icon: <HomeIcon /> },
  { text: "فلل للبيع", icon: <VillaIcon /> },
  { text: "فلل للإيجار", icon: <VillaIcon /> },
  { text: "عقارات مصايف للبيع", icon: <BeachAccessIcon /> },
  { text: "عقارات مصايف للإيجار", icon: <BeachAccessIcon /> },
  { text: "عقار تجارى للبيع", icon: <BusinessIcon /> },
  { text: "عقار تجارى للإيجار", icon: <BusinessIcon /> },
];

const PropertySidebar = ({ selectedItem, setSelectedItem, isMobile }) => {
  const dispatch = useDispatch();

  const handleSelect = (text) => {
    setSelectedItem(text);
    dispatch(setFormData({ project_types: [text] }));
  };

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 280,
        bgcolor: "background.paper",
        borderLeft: isMobile ? "none" : "1px solid #e0e0e0",
        borderBottom: isMobile ? "1px solid #e0e0e0" : "none",
        height: isMobile ? "auto" : "100vh",
        position: isMobile ? "static" : "sticky",
        top: 0,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          p: 3,
          color: "#6E00FE",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "flex-end",
          flexDirection: "row-reverse", // عشان الأيقونة تكون على اليمين
        }}
      >
        <HomeIcon fontSize="medium" />
        سمسارك
      </Typography>
      <Divider />
      <List sx={{ p: 2 }}>
        {propertyTypes.map((item) => (
          <ListItem key={item.text} disablePadding>
            <SidebarButton
              selected={selectedItem === item.text}
              onClick={() => handleSelect(item.text)}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexDirection: "row-reverse",
                  width: "100%",
                }}
              >
                {item.icon}
                <ListItemText primary={item.text} sx={{ textAlign: "right" }} />
              </Box>
            </SidebarButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PropertySidebar;
