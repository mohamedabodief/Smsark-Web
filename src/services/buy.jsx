import { Box, Typography, Button, Container } from '@mui/material';

export default function Buy() {
    return (
        <Box sx={{ py: 12, px: { xs: 2, md: 6 }, backgroundColor: '#f9f9f9', minHeight: '100vh', direction: 'rtl' }}>
            <Container maxWidth="md">
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    استكشف واشتري عقارك المثالي بكل سهولة
                </Typography>

                <Typography variant="body1" sx={{ mb: 4, lineHeight: 2 }}>
                    إذا كنت تبحث عن منزل أحلامك أو استثمار عقاري مربح، منصتنا توفر لك آلاف الخيارات من الشقق، الفلل، الأراضي، والعقارات التجارية في جميع المناطق.
                    ابحث، قارن، واختر بكل سهولة وشفافية.
                </Typography>

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    مميزات الشراء من خلال منصتنا:
                </Typography>

                <ul style={{ paddingRight: '20px', marginBottom: '2.5rem', lineHeight: '2', fontSize: '1rem' }}>
                    <li>قاعدة بيانات ضخمة لعقارات معروضة للبيع في كل مكان.</li>
                    <li>فلاتر بحث متقدمة تساعدك على العثور على ما يناسبك بالضبط.</li>
                    <li>صور ومعلومات تفصيلية لكل عقار.</li>
                    <li>إمكانية التواصل المباشر مع البائع أو الوسيط.</li>
                    <li>عروض تمويلية خاصة للمشترين الجادين.</li>
                </ul>

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    خطوات شراء عقار:
                </Typography>

                <ol style={{ paddingRight: '20px', marginBottom: '2.5rem', lineHeight: '2', fontSize: '1rem' }}>
                    <li>ابدأ بالبحث باستخدام الفلاتر (الموقع، السعر، النوع، المساحة...)</li>
                    <li>تصفح التفاصيل والصور واختر العقارات التي تناسبك.</li>
                    <li>تواصل مع المالك أو الوسيط مباشرة عبر المنصة.</li>
                    <li>حدد موعدًا للمعاينة أو الاستشارة.</li>
                    <li>أكمل الإجراءات القانونية والتمويلية بمساعدة فريقنا.</li>
                </ol>

                <Typography variant="body1" sx={{ mb: 4, lineHeight: 2 }}>
                    فريقنا جاهز لمساعدتك في كل خطوة — من البحث وحتى التملك. ابدأ رحلتك في شراء عقار جديد بثقة وأمان.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        borderRadius: '30px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        px: 5,
                        py: 1.5,
                        fontSize: '1rem',
                        backgroundColor: '#673ab7',
                        '&:hover': {
                            backgroundColor: '#5e35b1',
                        },
                    }}
                >
                    ابحث عن عقارك الآن
                </Button>
            </Container>
        </Box>
    );
}
