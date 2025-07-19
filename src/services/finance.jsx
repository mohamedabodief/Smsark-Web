import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Finance() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 12, px: { xs: 2, md: 6 }, backgroundColor: '#f9f9f9', minHeight: '100vh', direction: 'rtl' }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          حلول تمويلية مرنة لشراء عقارك بسهولة
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 2 }}>
          بنقدملك مجموعة متنوعة من حلول التمويل العقاري اللي بتناسب احتياجاتك، سواء كنت بتشتري شقة، فيلا، أو مكتب. مع شركائنا من البنوك وشركات التمويل، هتقدر توصل لتمويل مضمون، سهل، وبشروط مريحة.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ليه تختار التمويل العقاري من خلالنا؟
        </Typography>

        <ul style={{ paddingRight: '20px', marginBottom: '2.5rem', lineHeight: '2', fontSize: '1rem' }}>
          <li>شراكات موثوقة مع أكبر البنوك وشركات التمويل.</li>
          <li>نسب فائدة تنافسية وخطط سداد مرنة.</li>
          <li>دعم كامل في تجهيز الأوراق والإجراءات.</li>
          <li>استشارات مجانية لمساعدتك على اختيار الأنسب لك.</li>
          <li>تحديث دائم للعروض التمويلية والعقارات المؤهلة للتمويل.</li>
        </ul>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          خطوات الحصول على التمويل العقاري:
        </Typography>

        <ol style={{ paddingRight: '20px', marginBottom: '2.5rem', lineHeight: '2', fontSize: '1rem' }}>
          <li>سجل على منصتنا واختر العقار اللي حابب تشتريه.</li>
          <li>قدّم طلب التمويل إلكترونيًا مع تفاصيلك الشخصية والمالية.</li>
          <li>هنراجع الطلب ونتواصل معاك خلال 48 ساعة.</li>
          <li>نرشحلك أفضل العروض التمويلية المتاحة.</li>
          <li>نساعدك في تجهيز الأوراق وتوقيع العقد مع الجهة الممولة.</li>
        </ol>

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 2 }}>
          هدفنا هو تمكينك من تملك عقارك بأقل مجهود، وأسرع وقت، وبدون تعقيدات. لو مش عارف تبدأ منين، فريقنا هنا لمساعدتك خطوة بخطوة.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/services/finance/financing-request')} 
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
          اطلع علي طلب التمويل
        </Button>
      </Container>
    </Box>
  );
}
