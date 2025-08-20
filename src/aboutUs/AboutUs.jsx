import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  Paper,
  Divider,
  Button,
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import heroBackground from "../assets/about-us-header.png";
import aboutUsHeader from "../assets/about-us-header.png";
import samsarakOffice from "../assets/samsarak-office.png";
import clientStory1 from "../assets/client-story-1.png";
import clientStory2 from "../assets/client-story-2.png";
import clientStory3 from "../assets/client-story-3.png";
import propertyCard1 from "../assets/property-card-1.png";
import propertyCard2 from "../assets/property-card-2.png";
import propertyCard3 from "../assets/property-card-3.png";

const aboutUsData = {
  companyName: "سمسارك",
  slogan: "بوابتك لعالم العقارات",
  description:
    "سمسارك هي شركة رائدة في مجال التسويق العقاري الرقمي، تأسست عام 2015. نحن نقدم حلولاً مبتكرة لمساعدة الأفراد والشركات على النمو والازدهار في سوق العقارات. نؤمن بتقديم تجربة سلسة وموثوقة لعملائنا، ونلتزم بأعلى معايير الشفافية والجودة.",
  features: [
    "تنوع واسع من العقارات",
    "فريق من الخبراء",
    "خدمة عملاء ممتازة",
    "حلول تسويقية مبتكرة",
    "شفافية وموثوقية",
    "سهولة الاستخدام",
  ],
  stats: [
    { value: "5000+", label: "عقار مباع" },
    { value: "10+", label: "سنوات خبرة" },
    { value: "1500+", label: "عميل سعيد" },
  ],
  team: [
    {
      name: "محمود يسري",
      position: "الرئيس التنفيذي",
      bio: "يقود فريق سمسارك برؤية استراتيجية لتحقيق الريادة في السوق.",
    },
    {
      name: "آلاء السيد",
      position: "مدير التسويق",
      bio: "خبير في استراتيجيات التسويق الرقمي وبناء العلامة التجارية.",
    },
    {
      name: "محمد أبو ضيف",
      position: "مدير المبيعات",
      bio: "يتمتع بسجل حافل في تحقيق أهداف المبيعات وبناء علاقات قوية مع العملاء.",
    },
    {
      name: "عبدالرحمن محمود",
      position: "مدير المالية",
      bio: "يتمتع بسجل حافل في تحقيق أهداف المبيعات وبناء علاقات قوية مع العملاء.",
    },
    {
      name: "مريم القاضى",
      position: "مدير العلاقات العامة",
      bio: "يتمتع بسجل حافل في تحقيق أهداف المبيعات وبناء علاقات قوية مع العملاء.",
    },
  ],
  contactInfo: {
    phone: "+971 50 123 4567",
    email: "info@samsarak.com",
    address: "التجمع الخامس, مصر",
  },

  heroText: "بيتك المثالي هيكون حقيقة مع سمسارك",
  whoIsSamsarakTitle: "مرحبًا بك في سمسارك",
  whoIsSamsarakDescription:
    "تأسست سمسارك على يد مجموعة من المهندسين المصريين بخبرة واسعة في مجال العقارات، لتكون منصة متخصصة في البيع، الشراء، والإيجار لكافة أنواع العقارات في جميع أنحاء مصر. نحن شركة مصرية 100%، نفخر بخدمة عملائنا في مختلف المحافظات من خلال فهم عميق للسوق العقاري المصري، وتقديم حلول مرنة وواقعية تناسب جميع الاحتياجات السكنية والاستثمارية.",
  clientStoriesTitle: "قصص عملائنا",
  clientStories: [
    {
      image: clientStory1,
      text: "تجربة ممتازة مع سمسارك! وجدت بيت أحلامي في وقت قياسي. الفريق كان محترف ومتعاون جداً في كل التفاصيل.",
      author: "أحمد محمود",
      location: "التجمع الخامس, القاهرة",
    },
    {
      image: clientStory2,
      text: "تجربة رائعة مع سمسارك! وجدنا منزل أحلامنا بسرعة وسهولة، وفريق العمل كان متعاونًا للغاية في كل خطوة.",
      author: "ليلى محمد",
      location: "الإسكندرية, مصر",
    },
    {
      image: clientStory3,
      text: "أفضل خدمة عقارية على الإطلاق. الاحترافية والشفافية هي ما يميزهم. أنصح بهم بشدة لأي شخص يبحث عن عقار.",
      author: "خالد منصور",
      location: "مدينة السادات، المنوفية",
    },
    {
      image: clientStory3,
      text: "تجربة رائعة مع سمسارك! وجدنا منزل أحلامنا بسرعة وسهولة، وفريق العمل كان متعاونًا للغاية في كل خطوة.",
      author: "ليلى محمد",
      location: "الإسكندرية, مصر",
    },
    {
      image: clientStory2,
      text: "تجربة رائعة مع سمسارك! وجدنا منزل أحلامنا بسرعة وسهولة، وفريق العمل كان متعاونًا للغاية في كل خطوة.",
      author: "ليلى محمد",
      location: "الإسكندرية, مصر",
    },
  ],
  heroProperties: [
    {
      image: propertyCard1,
      type: "فيلا سكنية",
      location: "التجمع الخامس",
      price: "2,500,000 جنيه",
    },
    {
      image: propertyCard2,
      type: "شقة فاخرة",
      location: "الإسكندرية",
      price: "1,200,000 جنيه",
    },
    {
      image: propertyCard3,
      type: "أرض تجارية",
      location: "مدينة نصر",
      price: "5,000,000 جنيه",
    },
  ],
};

const HeroSection = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  height: { xs: "60vh", md: "80vh" },
  minHeight: 500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  color: "#fff",
  textAlign: "center",
  "&::before": {
    content: '" "',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${heroBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.5)",
    zIndex: -1,
  },
}));

const SearchFormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  textAlign: "right",
  maxWidth: 420,
  width: "100%",
  backdropFilter: "blur(10px)",
}));

const ModernCard = styled(Card)(() => ({
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(68, 41, 41, 0.08)",
  transition: "all 0.3s ease-in-out",
  border: "1px solid #f0f0f0",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
  },
}));

const PropertyCard = styled(Card)(() => ({
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  height: "100%",
  padding: theme.spacing(3),
  textAlign: "center",
  border: "1px solid #e8e8e8",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    borderColor: theme.palette.primary.main,
  },
}));

const StatsBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  padding: theme.spacing(6),
  borderRadius: 20,
  marginBottom: theme.spacing(6),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "inherit",
  },
}));

const AboutUs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const scrollToIndex = (index) => {
    if (sliderRef.current) {
      const cardWidth =
        window.innerWidth >= 900 ? 300 : sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  // وظائف الأزرار
  const handleBrowseProperties = () => {
    navigate("/home");
  };

  const handleContactUs = () => {
    navigate("/contact");
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }}>
      {/* Header Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "60vh",
          minHeight: 500,
          mb: 6,
          left: "50%",
          right: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <img
          src={aboutUsHeader}
          alt="عقارات سمسارك"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(32, 13, 58, 0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            p: 10,
            color: "white",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", md: "4rem" },
              mb: 3,
              textAlign: "left",
              width: "100%",
            }}
          >
            {aboutUsData.companyName}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontSize: { xs: "1.5rem", md: "2rem" },
              textAlign: "right",
            }}
          >
            {aboutUsData.slogan}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleBrowseProperties}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              تصفح العقارات
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleContactUs}
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: theme.palette.secondary.main,
                },
              }}
            >
              تواصل معنا
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* About Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component="img"
                src={samsarakOffice}
                alt="مكتب سمسارك"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ textAlign: "right", px: { xs: 0, md: 4 } }}>
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                    mb: 4,
                  }}
                >
                  {aboutUsData.whoIsSamsarakTitle}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: "text.secondary",
                    fontWeight: 400,
                    whiteSpace: "pre-line",
                  }}
                >
                  {aboutUsData.whoIsSamsarakDescription}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Enhanced Hero Section */}
        <HeroSection>
          <Container maxWidth="lg">
            <Grid spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ pr: { md: 4 }, textAlign: "center" }}>
                  <Typography
                    variant="h1"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "2rem", md: "3.5rem" },
                      color: "white",
                      mb: 4,
                      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {aboutUsData.heroText}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={3} justifyContent="center">
                  {aboutUsData.heroProperties.map((property, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <PropertyCard>
                        <Box
                          component="img"
                          src={property.image}
                          alt={property.type}
                          sx={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                          }}
                        />
                        <CardContent sx={{ textAlign: "right", p: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", mb: 1 }}
                          >
                            {property.type}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {property.location}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: "bold",
                            }}
                          >
                            {property.price}
                          </Typography>
                        </CardContent>
                      </PropertyCard>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </HeroSection>

        <Box
          sx={{
            px: { xs: 4, md: 12 },
            mb: 8,
            textAlign: "right",
            direction: "rtl",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            color="primary.main"
          >
            رؤيتنا
          </Typography>
          <Typography
            variant="body1"
            mb={5}
            sx={{ fontSize: "1.2rem", lineHeight: 2 }}
          >
            أن نكون المنصة العقارية الأولى في مصر، التي تُحدث فرقًا حقيقيًا في
            حياة الناس من خلال تيسير الوصول إلى العقار المناسب، بأعلى درجات
            الشفافية والمصداقية والاحترافية.
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            color="primary.main"
          >
            رسالتنا
          </Typography>
          <Typography
            variant="body1"
            mb={5}
            sx={{ fontSize: "1.2rem", lineHeight: 2 }}
          >
            نهدف إلى تقديم تجربة عقارية موثوقة وسهلة، تربط بين العملاء والعقارات
            التي تناسبهم، من خلال فريق متخصص، وتقنيات حديثة، ودعم حقيقي قبل
            وأثناء وبعد عملية البيع أو الإيجار.
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            color="primary.main"
          >
            قيمنا
          </Typography>

          <Stack spacing={3}>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 2 }}
            >
              <strong>الشفافية:</strong> نؤمن بأهمية الوضوح والمصداقية في كل
              خطوة من خطوات التعامل.
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 2 }}
            >
              <strong>الثقة:</strong> نبني علاقات طويلة الأمد مع عملائنا مبنية
              على الثقة والاحترام المتبادل.
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 2 }}
            >
              <strong>الاحترافية:</strong> نقدم خدماتنا بمعايير عالية وجودة
              مستمرة في الأداء.
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 2 }}
            >
              <strong>الابتكار:</strong> نستخدم أحدث التقنيات لتسهيل تجربة
              المستخدم وتحسين الوصول إلى الفرص العقارية.
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 2 }}
            >
              <strong>خدمة العملاء:</strong> دعمنا مستمر قبل وأثناء وبعد أي
              تعامل، لضمان رضاك الكامل.
            </Typography>
          </Stack>
        </Box>

        {/* Client Stories */}
        <Box sx={{ mb: 10, mt: 10, textAlign: "center", position: "relative" }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.main,
              mb: 6,
            }}
          >
            {aboutUsData.clientStoriesTitle}
          </Typography>
          <Box sx={{ position: "relative", overflow: "hidden" }}>
            <IconButton
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                zIndex: 1,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              }}
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <Box
              ref={sliderRef}
              sx={{
                display: "flex",
                overflowX: "auto",
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { display: "none" },
                scrollSnapType: "x mandatory",
              }}
            >
              {aboutUsData.clientStories.map((story, index) => (
                <Box
                  key={index}
                  sx={{
                    minWidth: { xs: "100%", md: "300px" },
                    maxWidth: { xs: "100%", md: "300px" },
                    mx: 2,
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                  }}
                >
                  <ModernCard sx={{ height: "100%" }}>
                    <Box
                      component="img"
                      src={story.image}
                      alt={`قصة عميل ${index + 1}`}
                      sx={{ width: "100%", height: 220, objectFit: "cover" }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="body1"
                        paragraph
                        sx={{ fontStyle: "italic", lineHeight: 1.6, mb: 3 }}
                      >
                        "{story.text}"
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            bgcolor: theme.palette.primary.main,
                          }}
                        >
                          {story.author.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {story.author}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {story.location}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </ModernCard>
                </Box>
              ))}
            </Box>
            <IconButton
              sx={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                zIndex: 1,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              }}
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(prev + 1, aboutUsData.clientStories.length - 1)
                )
              }
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Features */}
        <Box sx={{ mb: 10, textAlign: "center" }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              mb: 6,
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            لماذا تختار {aboutUsData.companyName}؟
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {aboutUsData.features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {feature}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats */}
        <StatsBox>
          <Grid container spacing={4} justifyContent="center">
            {aboutUsData.stats.map((stat, index) => (
              <Grid
                item
                xs={4}
                key={index}
                sx={{ textAlign: "center", zIndex: 1 }}
              >
                <Typography
                  variant="h2"
                  sx={{ fontWeight: "bold", color: "white", mb: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="h6" sx={{ color: "white" }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </StatsBox>

        {/* Team */}
        <Box sx={{ mb: 10, textAlign: "center" }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              mb: 6,
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            فريقنا
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {aboutUsData.team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ModernCard>
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        mx: "auto",
                        mb: 3,
                        fontSize: "2.5rem",
                        backgroundColor: theme.palette.primary.main,
                      }}
                    >
                      {member.name.split(" ")[0].charAt(0)}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {member.position}
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {member.bio}
                    </Typography>
                  </CardContent>
                </ModernCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact */}
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 2,
            // backgroundColor: "white",
            border: "1px solid #e8e8e8",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              mb: 4,
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            تواصل معنا
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid
            container
            spacing={6}
            sx={{
              mb: 4,
              fontWeight: "bold",
              justifyContent: "center",
            }}
          >
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  الهاتف
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {aboutUsData.contactInfo.phone}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  البريد الإلكتروني
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {aboutUsData.contactInfo.email}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  العنوان
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {aboutUsData.contactInfo.address}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutUs;
