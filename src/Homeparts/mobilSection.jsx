import React from "react";
import { Box, Container, Grid } from "@mui/material";
import { Button } from "@mui/material";

const MobilSection = () => {
  return (
    <Box
      sx={{
        // backgroundColor: "white",
        pt: 6,
        // pb: { xs: 6, md: 6 },
        minHeight: "100vh",
        // display: "flex",
        // flexDirection: "column",
      }}
    >
        <Box
          component="img"
          src="/src/assets/mobile-pic-nb.png"
          alt="تطبيق سمسارك العقاري"
          sx={{
            width: { xs: "100%", sm: 750 },
            height: { xs: "auto", sm: 650 },
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
            paddingTop: "50px",
            // margin:"0px",
       
          }}
        />
      <Container disableGutters>
      
        <Grid
          container
          alignItems="center"
          dir="rtl"
          spacing={2}
          sx={{
            flexDirection: {
              xs: "column-reverse",
              md: "column-reverse",
              lg: "row",
            },
            px: { xs: 2, md: 6 },
            mt: 0, // إزالة أي margin top
          }}
        >
          {/* النص الرئيسي */}
          <Grid item xs={12} md={12} lg={6} xl={8}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "right" },
                px: { xs: 2, md: 4 },
              }}
            >
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 ">
                حمّل تطبيق البحث عن العقارات الأكثر موثوقية في الوطن العربي
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                قم بتحميل تطبيق سمسارك العقاري الآن على هاتفك، وتمتع بعملية بحث
                عن عقار أسهل، وأسرع، وأكثر دقة.
              </p>
              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  backgroundColor: "#6E00FE",
                  "&:hover": {
                    backgroundColor: "#5a00d4",
                  },
                }}
              >
                حمل التطبيق الآن
              </Button>
            </Box>
          </Grid>

          {/* الصور */}
          <Grid item xs={12} md={12} lg={6} xl={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Box
                component="img"
                src="/src/assets/Frame 13.png"
                alt="عقارات مصر"
                sx={{
                  width: { xs: "30%", sm: 145 },
                  height: { xs: "auto", sm: 135 },
                  objectFit: "contain",
                  boxShadow: 3,
                  transition: "transform 0.3s ease-in-out",
                  mt: { xs: 12, sm: 6, md: 0 },
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MobilSection;

// ----------------------------------------------------------------------------------------

// import React from "react";
// import { Box, Container, Grid } from "@mui/material";
// import { Button } from "@mui/material"; // تأكد أنك مستورد الـ Button من MUI
// const MobilSection = () => {
//   return (
//     <Box sx={{ backgroundColor: "white", pt: 9 }}>
//       {/* <Container maxWidth="lg"> */}
//       <Grid container alignItems="center" dir="rtl">
//         {/* النص الرئيسي */}
//         {/* <Grid item xs={12} md={6}> */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Box
//             sx={{
//               textAlign: { xs: "center", md: "right" },
//               px: { xs: 2, md: 4 },
//             }}
//           >
//             <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
//               حمّل تطبيق البحث عن العقارات الأكثر موثوقية في الوطن العربي
//             </h1>
//             <p className="text-lg md:text-xl text-gray-600 mb-6">
//               قم بتحميل تطبيق سمسارك العقاري الآن على هاتفك، وتمتع بعملية بحث عن
//               عقار أسهل، وأسرع، وأكثر دقة.
//             </p>
//             <Button
//               variant="contained"
//               size="large"
//               sx={{
//                 borderRadius: "12px",
//                 px: 4,
//                 py: 1.5,
//                 fontSize: "1.1rem",
//                 fontWeight: 600,
//                 backgroundColor: "#6E00FE",
//                 "&:hover": {
//                   backgroundColor: "#5a00d4",
//                 },
//               }}
//             >
//               حمل التطبيق الآن
//             </Button>
//           </Box>
//         </Grid>

//         <Grid size={{ xs: 12, md: 5 }}>
//           <Box>
//             <Box
//               component="img"
//               src="/src/assets/Frame 13.png"
//               alt="عقارات مصر"
//               sx={{
//                 width: 145,
//                 height: 165,
//                 objectFit: "contain",
//                 boxShadow: 3,
//                 marginRight: "190px",

//                 transition: "transform 0.3s ease-in-out",
//                 "&:hover": {
//                   transform: "scale(1.05)",
//                 },
//               }}
//             ></Box>
//             {/* <Box
//               component="img"
//               src="/src/assets/mobile-pic.png"
//               alt="تطبيق إيروزي فليدز"
//               sx={{
//                 width: 610,
//                 height: 610,
//                 objectFit: "cover",
//                 // boxShadow: 3,
//                 transition: "transform 0.3s ease-in-out",
//                 // "&:hover": {
//                 //   transform: "scale(1.05)",
//                 // },
//               }}
//             />
//           </Box> */}
//             <Box
//               component="img"
//               src="/src/assets/mobile-pic2.png"
//               alt="تطبيق إيروزي فليدز"
//               sx={{
//                 width: 200,
//                 height: 450,
//                 objectFit: "cover",
//                 // marginRight: "100px",
//                 marginTop: "20px",
//                 transition: "transform 0.3s ease-in-out",
//                 // "&:hover": {
//                 //   transform: "scale(1.05)",
//                 // },
//               }}
//             />
//           </Box>
//         </Grid>
//       </Grid>
//       {/* </Container> */}
//     </Box>
//   );
// };
// export default MobilSection;
