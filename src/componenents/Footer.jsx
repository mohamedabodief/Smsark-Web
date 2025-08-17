import { Box, Stack, Typography, IconButton, Paper } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#6E00FE",
        color: "#fff",
        minHeight: "20vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        p: 2,
        marginTop: 0,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-around"
        alignItems="center"
        spacing={4}
        sx={{ width: "100%", px: 0 }}
      >
        {/* العمود 1 - وصف وشعار */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "transparent",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Semsark
          </Typography>
          <Typography>
            From dreams to doorstep <br /> Semsark leads the way!
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            منصتك المثالية للبحث عن عقارك بسهولة وأمان
          </Typography>
        </Paper>

        {/* العمود 2 - العنوان */}
        <Stack spacing={1} alignItems="center">
          <Typography fontWeight="bold" variant="h6">
            Address
          </Typography>
          <Typography>Damanhour - Egypt</Typography>
          <Typography>شارع التحرير، بجوار الجامعة</Typography>
        </Stack>

        {/* العمود 3 - تواصل معنا */}
        <Stack spacing={1} alignItems="center">
          <Typography fontWeight="bold" variant="h6">
            Contact Us
          </Typography>
          <Box
            sx={{
              bgcolor: "#7c8cff",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            info@semsark.com
          </Box>
          <Typography>+20 1119159182</Typography>

          <Stack direction="row" spacing={1} mt={1}>
            <IconButton
              sx={{ color: "#fff" }}
              component="a"
              href="https://facebook.com/your_page"
              target="_blank"
              rel="noopener"
            >
              <FacebookIcon />
            </IconButton>

            <IconButton
              sx={{ color: "#fff" }}
              component="a"
              href="https://twitter.com/your_account"
              target="_blank"
              rel="noopener"
            >
              <TwitterIcon />
            </IconButton>

            <IconButton
              sx={{ color: "#fff" }}
              component="a"
              href="https://instagram.com/your_account"
              target="_blank"
              rel="noopener"
            >
              <InstagramIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
