import { Box, Stack, Typography, IconButton, Paper } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
  return (
    <Box component="footer"
      sx={{
        bgcolor: "#6E00FE",
        color: "#fff",
        minHeight: "20vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        p: 2,
        // position:'fixed',
        // bottom:'0'
        marginTop:0,
        }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-around"
        alignItems="center"
        spacing={4}
        sx={{ width: "100%", px: 0 }}
      >

        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "transparent",
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <Typography>
            From dreams to <br /> doorstep - Semsark <br /> leads the way!
          </Typography>
        </Paper>

        <Stack spacing={0} alignItems="center">
          <Typography fontWeight="bold">Address</Typography>
          <Typography>1080 Brickell Ave</Typography>
          <Typography>Damanhour - Egypt</Typography>
          <Typography>U.S. of America</Typography>
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

            {/* <IconButton
              sx={{ color: "#fff" }}
              component="a"
              href="https://youtube.com/your_channel"
              target="_blank"
              rel="noopener"
            >
              <YouTubeIcon />
            </IconButton> */}

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

        <Stack spacing={1} alignItems="center">
          <Typography fontWeight="bold">Contact</Typography>
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
        </Stack>
      </Stack>
    </Box>
  );
}
