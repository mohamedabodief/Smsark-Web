import { Box, Typography, Button, Container } from '@mui/material';

export default function Rent() {
  return (
    <Box sx={{ py: 12, px: { xs: 2, md: 6 }, backgroundColor: '#f9f9f9', minHeight: '100vh', direction: 'rtl' }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          تأجير عقارك بسهولة، ووصل للمستأجر المناسب
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 2 }}>
          إذا كنت تمتلك شقة، فيلا، أو محل تجاري وترغب في تأجيره، فأنت في المكان المناسب. منصتنا تساعدك في عرض عقارك أمام آلاف الباحثين عن سكن أو مساحة عمل بطريقة احترافية وسهلة.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          لماذا تعرض عقارك للإيجار معنا؟
        </Typography>

        <ul style={{ paddingRight: '20px', marginBottom: '2.5rem', lineHeight: '2', fontSize: '1rem' }}>
          <li>وصول مباشر لعدد كبير من المستأجرين المحتملين يوميًا.</li>
          <li>نظام تصفية متقدم يساعد المهتمين في العثور على عقارك بسهولة.</li>
          <li>دعم كامل لإدخال الصور، الفيديو، والموقع الجغرافي.</li>
          <li>خيارات ترويجية لزيادة عدد المشاهدات.</li>
          <li>سهولة في إدارة العقارات المؤجرة من خلال لوحة تحكم احترافية.</li>
        </ul>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          خطوات عرض عقارك للإيجار:
        </Typography>

        <ol style={{ paddingRight: '20px', marginBottom: '2.5rem', lineHeight: '2', fontSize: '1rem' }}>
          <li>قم بتسجيل الدخول إلى حسابك أو أنشئ حسابًا جديدًا.</li>
          <li>اضغط على "أضف إعلان" واختر نوع العقار والتفاصيل.</li>
          <li>أضف وصف دقيق وصور واضحة للعقار.</li>
          <li>حدّد مدة الإيجار والسعر المناسب.</li>
          <li>انتظر رسائل المهتمين وتواصل معهم مباشرة عبر المنصة.</li>
        </ol>

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 2 }}>
          منصة الإيجار العقاري لدينا مصممة لتوفر لك تجربة سهلة وسريعة مع نتائج فعّالة. لا تتردد، أضف عقارك الآن وابدأ في تحقيق دخل شهري ثابت من خلال الإيجار.
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
          أضف عقارك للإيجار
        </Button>
      </Container>
    </Box>
  );
}
