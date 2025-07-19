import { Box, Typography, Button, Container } from '@mui/material';

export default function Sell() {
  return (
    <Box sx={{ py: 12, px: { xs: 2, md: 6 }, backgroundColor: '#f9f9f9', minHeight: '100vh', direction: 'rtl' }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          بيع عقارك بسهولة، بسرعة، وبأعلى قيمة!
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 2 }}>
          هل تفكر في بيع عقارك؟ نحن هنا لمساعدتك في الوصول إلى أكبر عدد من المشترين المحتملين في أقل وقت ممكن وبأفضل تجربة ممكنة.
          مع منصتنا، يمكنك نشر إعلان لعقارك خلال دقائق، وتبدأ في تلقي العروض فورًا.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          لماذا تبيع معنا؟
        </Typography>

        <ul style={{ paddingRight: '20px', marginBottom: '2.5rem', lineHeight: '2', fontSize: '1rem' }}>
          <li>نصل إلى آلاف الزوار يوميًا المهتمين بشراء العقارات في منطقتك.</li>
          <li>سهولة في الاستخدام: واجهة بسيطة تمكنك من إضافة عقارك خلال دقائق.</li>
          <li>إمكانية إضافة صور، فيديو، وموقع دقيق للعقار على الخريطة.</li>
          <li>نظام ترويج مدفوع لزيادة فرص البيع بشكل أسرع.</li>
          <li>فريق دعم فني جاهز للإجابة عن أي استفسار على مدار الساعة.</li>
        </ul>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          خطوات بيع العقار:
        </Typography>

        <ol style={{ paddingRight: '20px', marginBottom: '2.5rem', lineHeight: '2', fontSize: '1rem' }}>
          <li>سجل الدخول إلى حسابك أو أنشئ حسابًا جديدًا مجانًا.</li>
          <li>اختر "أضف إعلان" واملأ بيانات العقار بدقة.</li>
          <li>أضف صور عالية الجودة وموقع العقار على الخريطة.</li>
          <li>فعّل خيار الترويج لزيادة الظهور (اختياري).</li>
          <li>ابدأ في استقبال رسائل وطلبات الشراء من العملاء.</li>
        </ol>

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 2 }}>
          نحن نهتم بجعل عملية البيع سلسة واحترافية. لا تضيع وقتك في طرق تقليدية قديمة — ابدأ الآن وحقق أفضل سعر لعقارك.
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
          أضف عقارك الآن
        </Button>
      </Container>
    </Box>
  );
}
