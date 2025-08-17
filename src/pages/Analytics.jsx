import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Avatar,
  Menu,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Approval as ApprovalIcon,
  DoNotDisturbOn as DoNotDisturbOnIcon,
  Delete as DeleteIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Block as BlockIcon,
  Close as CloseIcon,
  TableChart as TableChartIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { fetchAnalyticsData, exportAnalyticsData, setFilters } from '../reduxToolkit/slice/analyticsSlice';
import { 
  deleteAd, 
  toggleAdStatus, 
  approveAd, 
  rejectAd, 
  returnAdToPending 
} from '../reduxToolkit/slice/paidAdsSlice';
import theme from '../theme';
import { PieChart } from '@mui/x-charts/PieChart';

// Enhanced Pie Chart Component (matching Reports page design)
const EnhancedPieChart = ({ data, title, colors = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <Card sx={{ bgcolor: 'background.paper', height: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <Typography color="textSecondary">لا توجد بيانات متاحة</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Transform data to match PieChart format
  const chartData = data.map((item, index) => ({
    label: item.name,
    value: item.value,
    color: colors[index % colors.length]
  }));

  return (
    <Card sx={{ bgcolor: 'background.paper', height: 400 }}>
      <CardContent>
        <Typography variant="h6" marginBottom={3} gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PieChart
            series={[
              {
                data: chartData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                outerRadius: 120,
                innerRadius: 60,
              },
            ]}
            height={300}
            width={400}
            slotProps={{ legend: { direction: 'rtl', position: { vertical: 'middle', horizontal: 'left' } } }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Enhanced Bar Chart Component (improved styling)
const EnhancedBarChart = ({ data, title, color = theme.palette.primary.main }) => {
  if (!data || data.length === 0) {
    return (
      <Card sx={{ bgcolor: 'background.paper', height: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <Typography color="textSecondary">لا توجد بيانات متاحة</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <Card sx={{ bgcolor: 'background.paper', height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} height={300} overflow="auto" sx={{ pr: 1 }}>
          {data.map((item, index) => {
            const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            return (
              <Box key={index}>
                <Box display="flex" justifyContent="space-between" mb={1} alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 500, minWidth: '60px' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: color }}>
                    {item.value}
                  </Typography>
                </Box>
                <Box
                  height={24}
                  bgcolor="#f5f5f5"
                  borderRadius={2}
                  overflow="hidden"
                  sx={{ 
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                    position: 'relative'
                  }}
                >
                  <Box
                    height="100%"
                    bgcolor={color}
                    width={`${percentage}%`}
                    transition="width 0.5s ease"
                    sx={{
                      borderRadius: 2,
                      background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

// Analytics Dashboard Component - REAL DATA ONLY
// This component now exclusively uses real data from the database via model classes
// All mock/fake data has been removed to ensure accurate analytics
const Analytics = () => {
  const dispatch = useDispatch();
  const { data: reduxData, loading, error, filters } = useSelector((state) => state.analytics || {
    data: {
      overview: {},
      userEngagement: {},
      financialInsights: {},
      timeBasedData: [],
      userGrowthData: []
    },
    loading: false,
    error: null,
    filters: {
      dateRange: '30',
      selectedCity: 'all',
      selectedStatus: 'all',
      adType: 'all'
    }
  });
  
  // Get real data from Redux store
  const { uid, type_of_user } = useSelector((state) => state.auth);
  
  // Get data from analytics slice (this contains the real data)
  const analyticsData = useSelector((state) => state.analytics?.data);
  const analyticsLoading = useSelector((state) => state.analytics?.loading);
  const analyticsError = useSelector((state) => state.analytics?.error);
  
  // Fallback to individual slices if analytics data is not available
  const homepageAds = useSelector((state) => state.homepageAds?.all || []);
  const developerAds = useSelector((state) => state.paidAds?.developerAds || []);
  const funderAds = useSelector((state) => state.paidAds?.funderAds || []);
  const paidAdsLoading = useSelector((state) => state.paidAds?.loading || { developer: false, funder: false });
  const financialRequests = useSelector((state) => state.financialRequests?.list || []);
  const inquiries = useSelector((state) => state.inquiries?.list || []);
  const properties = useSelector((state) => state.properties?.list || []);
  const users = useSelector((state) => state.users?.users || []);
  
  const [activeTab, setActiveTab] = useState(0);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  // State for ads table functionality
  const [adsTableActiveTab, setAdsTableActiveTab] = useState('developerAds');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('all');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [adToDeleteType, setAdToDeleteType] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [adToReject, setAdToReject] = useState(null);
  const [adToRejectType, setAdToRejectType] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activationMenuAnchorEl, setActivationMenuAnchorEl] = useState(null);
  const [adToActivate, setAdToActivate] = useState(null);
  const [adToActivateType, setAdToActivateType] = useState(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [receiptDialogImage, setReceiptDialogImage] = useState(null);
  const [receiptDialogAd, setReceiptDialogAd] = useState(null);
  const [receiptDialogType, setReceiptDialogType] = useState(null);
  const [receiptDialogDays, setReceiptDialogDays] = useState(7);

  // Default empty data structure for when no real data is available
  const emptyData = {
    overview: {
      totalRealEstateAds: 0,
      totalFinancingAds: 0,
      totalClientAds: 0,
      activeAds: 0,
      inactiveAds: 0,
      statusBreakdown: {
        pending: 0,
        approved: 0,
        rejected: 0
      },
      categoryBreakdown: {},
      cityBreakdown: {}
    },
    userEngagement: {
      userTypes: {
        client: 0,
        developer: 0,
        organization: 0,
        admin: 0
      },
      totalUsers: 0
    },
    financialInsights: {
      totalFinancingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
      pendingRequests: 0,
      approvalRate: 0,
      interestRateBreakdown: {
        '≤5%': 0,
        '≤10%': 0,
        '>10%': 0
      },
      totalRevenue: 0
    },
    timeBasedData: [],
    userGrowthData: []
  };

  // Use only real analytics data from the slice - no mock data fallback
  const data = (analyticsData && Object.keys(analyticsData.overview || {}).length > 0) ? analyticsData : emptyData;
  
  // Colors for charts
  const colors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
    grey: theme.palette.grey[500]
  };
  
  // Status breakdown for charts (from analytics data)
  const statusBreakdown = {
    pending: data.overview.statusBreakdown?.pending || 0,
    approved: data.overview.statusBreakdown?.approved || 0,
    rejected: data.overview.statusBreakdown?.rejected || 0
  };
  
  // Total ads counts (from analytics data)
  const totalRealEstateAds = data.overview.totalRealEstateAds || 0;
  const totalFinancingAds = data.overview.totalFinancingAds || 0;
  const totalClientAds = data.overview.totalClientAds || 0;

  // Check if user has access to analytics
  const hasAccess = () => {
    return uid && ['admin', 'developer', 'organization'].includes(type_of_user);
  };

  // Fetch all required data (force refresh)
  const fetchAllData = () => {
    if (hasAccess()) {
      console.log('Force fetching all analytics data using model classes...');
      
      // Fetch analytics data using the new thunk with model classes
      dispatch(fetchAnalyticsData({ 
        userRole: type_of_user, 
        userId: uid, 
        filters 
      }));
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  // Handle export
  const handleExport = async () => {
    try {
      const result = await dispatch(exportAnalyticsData({ data, format: 'csv' })).unwrap();
      
      // Create and download CSV file
      const blob = new Blob([result], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSnackbar({ open: true, message: 'تم تصدير التقرير بنجاح', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'فشل في تصدير التقرير', severity: 'error' });
    }
    setExportDialogOpen(false);
  };

  // Fetch data using the new analytics thunk
  useEffect(() => {
    if (hasAccess()) {
      // Fetch analytics data using model classes
      dispatch(fetchAnalyticsData({ 
        userRole: type_of_user, 
        userId: uid, 
        filters 
      }));
    }
  }, [dispatch, uid, type_of_user, filters]);

  // Debug logging
  useEffect(() => {
    console.log('Analytics component - Current state:', {
      uid,
      type_of_user,
      hasAccess: hasAccess(),
      analyticsDataAvailable: !!analyticsData,
      analyticsLoading,
      analyticsError,
      dataKeys: analyticsData ? Object.keys(analyticsData.overview).length : 0
    });

    // Log analytics data details if available
    if (analyticsData) {
      console.log('Analytics data details:', {
        totalUsers: analyticsData.userEngagement?.totalUsers,
        totalFinancingRequests: analyticsData.financialInsights?.totalFinancingRequests,
        totalRealEstateAds: analyticsData.overview?.totalRealEstateAds,
        totalFinancingAds: analyticsData.overview?.totalFinancingAds,
        statusBreakdown: analyticsData.overview?.statusBreakdown
      });
    }
  }, [uid, type_of_user, analyticsData, analyticsLoading, analyticsError]);

  // --- Ads Table Handlers ---
  
  // Status chip color mapping
  const statusChipColor = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error'
  };

  // Filtering logic for ads (using analytics data)
  const filteredDeveloperAds = (analyticsData?.developerAds || []).filter((ad) => {
    if (reviewStatusFilter === 'all') return true;
    return ad.reviewStatus === reviewStatusFilter;
  });

  const filteredFunderAds = (analyticsData?.financingAds || []).filter((ad) => {
    if (reviewStatusFilter === 'all') return true;
    return ad.reviewStatus === reviewStatusFilter;
  });

  const filteredClientAds = (analyticsData?.clientAds || []).filter((ad) => {
    if (reviewStatusFilter === 'all') return true;
    return ad.reviewStatus === reviewStatusFilter;
  });

  // Handlers for ads table actions
  const handleStatusChipClick = (status) => {
    setReviewStatusFilter(status);
  };

  const handleEditClick = (ad, type) => {
    console.log(`Edit ${type} ad:`, ad);
    setSnackbar({
      open: true,
      message: `وظيفة التعديل للإعلان ${ad.title || ad.developer_name} قيد التنفيذ.`,
      severity: 'info',
    });
  };

  const handleDeleteClick = (ad, type) => {
    setAdToDelete(ad);
    setAdToDeleteType(type);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!adToDelete || !adToDeleteType) return;
    
    try {
      await dispatch(deleteAd({ id: adToDelete.id, type: adToDeleteType })).unwrap();
      setSnackbar({
        open: true,
        message: `تم حذف الإعلان بنجاح`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `فشل حذف الإعلان: ${error}`,
        severity: 'error',
      });
    }
    setOpenDeleteDialog(false);
    setAdToDelete(null);
    setAdToDeleteType(null);
  };

  const handleApprove = async (ad) => {
    try {
      const type = ad.developer_name ? 'developer' : 'funder';
      await dispatch(approveAd({ id: ad.id, type })).unwrap();
      setSnackbar({
        open: true,
        message: `تم الموافقة على الإعلان بنجاح`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `فشل الموافقة على الإعلان: ${error}`,
        severity: 'error',
      });
    }
  };

  const handleReject = (ad) => {
    setAdToReject(ad);
    setAdToRejectType(ad.developer_name ? 'developer' : 'funder');
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!adToReject || !adToRejectType || !rejectReason.trim()) return;
    
    try {
      await dispatch(rejectAd({ 
        id: adToReject.id, 
        type: adToRejectType, 
        reason: rejectReason 
      })).unwrap();
      setSnackbar({
        open: true,
        message: `تم رفض الإعلان بنجاح`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `فشل رفض الإعلان: ${error}`,
        severity: 'error',
      });
    }
    setRejectDialogOpen(false);
    setAdToReject(null);
    setAdToRejectType(null);
    setRejectReason('');
  };

  const handleReturnToPending = async (ad) => {
    try {
      const type = ad.developer_name ? 'developer' : 'funder';
      await dispatch(returnAdToPending({ id: ad.id, type })).unwrap();
      setSnackbar({
        open: true,
        message: `تم إعادة الإعلان للمراجعة بنجاح`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `فشل إعادة الإعلان للمراجعة: ${error}`,
        severity: 'error',
      });
    }
  };

  const handleActivationMenuOpen = (event, ad, type) => {
    setActivationMenuAnchorEl(event.currentTarget);
    setAdToActivate(ad);
    setAdToActivateType(type);
  };

  const handleActivationMenuClose = () => {
    setActivationMenuAnchorEl(null);
    setAdToActivate(null);
    setAdToActivateType(null);
  };

  const handleActivateWithDays = async (days, ad = adToActivate, type = adToActivateType) => {
    if (!ad || !type) return;
    
    try {
      await dispatch(toggleAdStatus({ adId: ad.id, type, days })).unwrap();
      setSnackbar({
        open: true,
        message: `تم تفعيل الإعلان لمدة ${days} يوم بنجاح`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `فشل تفعيل الإعلان: ${error}`,
        severity: 'error',
      });
    }
    handleActivationMenuClose();
  };

  const handleDeactivate = async (ad) => {
    try {
      const type = ad.developer_name ? 'developer' : 'funder';
      await dispatch(toggleAdStatus({ adId: ad.id, type, days: 0 })).unwrap();
      setSnackbar({
        open: true,
        message: `تم إلغاء تفعيل الإعلان بنجاح`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `فشل إلغاء تفعيل الإعلان: ${error}`,
        severity: 'error',
      });
    }
  };

  const handleReceiptClick = (ad, type) => {
    let days = 7;
    if (ad.adPackage === 1) days = 7;
    else if (ad.adPackage === 2) days = 14;
    else if (ad.adPackage === 3) days = 21;
    setReceiptDialogImage(ad.receipt_image);
    setReceiptDialogAd(ad);
    setReceiptDialogType(type);
    setReceiptDialogDays(days);
    setReceiptDialogOpen(true);
  };

  const handleReceiptDialogActivate = async () => {
    if (receiptDialogAd && receiptDialogType) {
      await handleActivateWithDays(receiptDialogDays, receiptDialogAd, receiptDialogType);
      setReceiptDialogOpen(false);
    }
  };

  // DataGrid columns for developer ads
  const developerColumns = [
    { field: 'developer_name', headerName: 'اسم المطور', width: 200 },
    { field: 'description', headerName: 'الوصف', width: 300 },
    {
      field: 'images',
      headerName: 'الصور',
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={(params.value && params.value[0]) || 'https://placehold.co/50x50/E0E0E0/FFFFFF?text=No+Image'}
          variant="rounded"
          sx={{ width: 60, height: 50 }}
        />
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'phone', headerName: 'رقم الهاتف', width: 150 },
    { field: 'location', headerName: 'الموقع', width: 150, renderCell: (params) => {
      const loc = params.value;
      if (!loc) return 'غير محدد';
      if (typeof loc === 'object') {
        return `${loc.governorate || ''}${loc.governorate && loc.city ? ' - ' : ''}${loc.city || ''}`;
      }
      return loc;
    } },
    { field: 'price_start_from', headerName: 'السعر من', width: 120, type: 'number' },
    { field: 'price_end_to', headerName: 'السعر إلى', width: 120, type: 'number' },
    {
      field: 'reviewStatus',
      headerName: 'حالة المراجعة',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value === 'pending' ? 'قيد المراجعة' : params.value === 'approved' ? 'مقبول' : 'مرفوض'}
          color={statusChipColor[params.value] || 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'ads',
      headerName: 'التفعيل',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'مفعل' : 'غير مفعل'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 350,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Tooltip title="موافقة">
            <span>
              <IconButton
                aria-label="approve"
                size="small"
                onClick={() => handleApprove(params.row)}
                color="success"
                disabled={params.row.reviewStatus === 'approved'}
              >
                <ApprovalIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="رفض">
            <span>
              <IconButton
                aria-label="reject"
                size="small"
                onClick={() => handleReject(params.row)}
                color="error"
                disabled={params.row.reviewStatus === 'rejected'}
              >
                <DoNotDisturbOnIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="إعادة للمراجعة">
            <span>
              <IconButton
                aria-label="return to pending"
                size="small"
                onClick={() => handleReturnToPending(params.row)}
                color="warning"
                disabled={params.row.reviewStatus === 'pending'}
              >
                <PendingIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="تفعيل">
            <span>
              <IconButton
                aria-label="activate"
                size="small"
                onClick={(e) => handleActivationMenuOpen(e, params.row, 'developer')}
                color="primary"
                disabled={params.row.ads || params.row.reviewStatus !== 'approved'}
              >
                <CheckCircleOutlineIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="إلغاء تفعيل">
            <span>
              <IconButton
                aria-label="deactivate"
                size="small"
                onClick={() => handleDeactivate(params.row)}
                color="secondary"
                disabled={!params.row.ads}
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="تعديل">
            <span>
              <IconButton
                aria-label="edit"
                size="small"
                onClick={() => handleEditClick(params.row, 'developer')}
                color="info"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="حذف">
            <span>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => handleDeleteClick(params.row, 'developer')}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {params.row.receipt_image && (
            <Tooltip title="إيصال الدفع">
              <span>
                <IconButton
                  aria-label="receipt"
                  size="small"
                  onClick={() => handleReceiptClick(params.row, 'developer')}
                  color="info"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      ),
    },
    { 
      field: 'adPackageName', 
      headerName: 'الباقة المختارة', 
      width: 150, 
      renderCell: (params) => {
        if (params.value) {
          return (
            <Chip
              label={params.value}
              color="primary"
              size="small"
              variant="outlined"
            />
          );
        }
        return '—';
      }
    },
    { field: 'adExpiryTime', headerName: 'تاريخ الانتهاء', width: 150, renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString('ar-EG') : '—'     },
  ];

  // DataGrid columns for client ads
  const clientColumns = [
    { field: 'title', headerName: 'العنوان', width: 200 },
    { field: 'description', headerName: 'الوصف', width: 300 },
    {
      field: 'image',
      headerName: 'الصورة',
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={params.value || 'https://placehold.co/50x50/E0E0E0/FFFFFF?text=No+Image'}
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        />
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'type', headerName: 'النوع', width: 120 },
    { field: 'price', headerName: 'السعر', width: 120, type: 'number' },
    { field: 'area', headerName: 'المساحة', width: 120, type: 'number' },
    { field: 'location', headerName: 'الموقع', width: 150, renderCell: (params) => params.value?.city || 'غير محدد' },
    {
      field: 'reviewStatus',
      headerName: 'حالة المراجعة',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value === 'pending' ? 'قيد المراجعة' : params.value === 'approved' ? 'مقبول' : 'مرفوض'}
          color={statusChipColor[params.value] || 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'ads',
      headerName: 'التفعيل',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'مفعل' : 'غير مفعل'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 350,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Tooltip title="موافقة">
            <span>
              <IconButton
                aria-label="approve"
                size="small"
                onClick={() => handleApprove(params.row)}
                color="success"
                disabled={params.row.reviewStatus === 'approved'}
              >
                <ApprovalIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="رفض">
            <span>
              <IconButton
                aria-label="reject"
                size="small"
                onClick={() => handleReject(params.row)}
                color="error"
                disabled={params.row.reviewStatus === 'rejected'}
              >
                <DoNotDisturbOnIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="إعادة للمراجعة">
            <span>
              <IconButton
                aria-label="return to pending"
                size="small"
                onClick={() => handleReturnToPending(params.row)}
                color="warning"
                disabled={params.row.reviewStatus === 'pending'}
              >
                <PendingIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="تفعيل">
            <span>
              <IconButton
                aria-label="activate"
                size="small"
                onClick={(e) => handleActivationMenuOpen(e, params.row, 'client')}
                color="primary"
                disabled={params.row.ads || params.row.reviewStatus !== 'approved'}
              >
                <CheckCircleOutlineIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="إلغاء تفعيل">
            <span>
              <IconButton
                aria-label="deactivate"
                size="small"
                onClick={() => handleDeactivate(params.row)}
                color="secondary"
                disabled={!params.row.ads}
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="تعديل">
            <span>
              <IconButton
                aria-label="edit"
                size="small"
                onClick={() => handleEditClick(params.row, 'client')}
                color="info"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="حذف">
            <span>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => handleDeleteClick(params.row, 'client')}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {params.row.receipt_image && (
            <Tooltip title="إيصال الدفع">
              <span>
                <IconButton
                  aria-label="receipt"
                  size="small"
                  onClick={() => handleReceiptClick(params.row, 'client')}
                  color="info"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      ),
    },
    { 
      field: 'adPackageName', 
      headerName: 'الباقة المختارة', 
      width: 150, 
      renderCell: (params) => {
        if (params.value) {
          return (
            <Chip
              label={params.value}
              color="primary"
              size="small"
              variant="outlined"
            />
          );
        }
        return null;
      }
    },
  ];

  // DataGrid columns for funder ads
  const funderColumns = [
    { field: 'org_name', headerName: 'المؤسسة', width: 200 },
    { field: 'title', headerName: 'العنوان', width: 200 },
    { field: 'description', headerName: 'الوصف', width: 300 },
    {
      field: 'image',
      headerName: 'الصورة',
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={params.value || 'https://placehold.co/50x50/E0E0E0/FFFFFF?text=No+Image'}
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        />
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'phone', headerName: 'رقم الهاتف', width: 150 },
    { field: 'financing_model', headerName: 'نموذج التمويل', width: 150 },
    { field: 'start_limit', headerName: 'حدود التمويل من', width: 120, type: 'number' },
    { field: 'end_limit', headerName: 'حدود التمويل إلى', width: 120, type: 'number' },
    {
      field: 'reviewStatus',
      headerName: 'حالة المراجعة',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value === 'pending' ? 'قيد المراجعة' : params.value === 'approved' ? 'مقبول' : 'مرفوض'}
          color={statusChipColor[params.value] || 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'ads',
      headerName: 'التفعيل',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'مفعل' : 'غير مفعل'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 350,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Tooltip title="موافقة">
            <span>
              <IconButton
                aria-label="approve"
                size="small"
                onClick={() => handleApprove(params.row)}
                color="success"
                disabled={params.row.reviewStatus === 'approved'}
              >
                <ApprovalIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="رفض">
            <span>
              <IconButton
                aria-label="reject"
                size="small"
                onClick={() => handleReject(params.row)}
                color="error"
                disabled={params.row.reviewStatus === 'rejected'}
              >
                <DoNotDisturbOnIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="إعادة للمراجعة">
            <span>
              <IconButton
                aria-label="return to pending"
                size="small"
                onClick={() => handleReturnToPending(params.row)}
                color="warning"
                disabled={params.row.reviewStatus === 'pending'}
              >
                <PendingIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="تفعيل">
            <span>
              <IconButton
                aria-label="activate"
                size="small"
                onClick={(e) => handleActivationMenuOpen(e, params.row, 'funder')}
                color="primary"
                disabled={params.row.ads || params.row.reviewStatus !== 'approved'}
              >
                <CheckCircleOutlineIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="إلغاء تفعيل">
            <span>
              <IconButton
                aria-label="deactivate"
                size="small"
                onClick={() => handleDeactivate(params.row)}
                color="secondary"
                disabled={!params.row.ads}
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="تعديل">
            <span>
              <IconButton
                aria-label="edit"
                size="small"
                onClick={() => handleEditClick(params.row, 'funder')}
                color="info"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="حذف">
            <span>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => handleDeleteClick(params.row, 'funder')}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {params.row.receipt_image && (
            <Tooltip title="إيصال الدفع">
              <span>
                <IconButton
                  aria-label="receipt"
                  size="small"
                  onClick={() => handleReceiptClick(params.row, 'funder')}
                  color="info"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      ),
    },
    { 
      field: 'adPackageName', 
      headerName: 'الباقة المختارة', 
      width: 150, 
      renderCell: (params) => {
        if (params.value) {
          return (
            <Chip
              label={params.value}
              color="primary"
              size="small"
              variant="outlined"
            />
          );
        }
        return '—';
      }
    },
    { field: 'adExpiryTime', headerName: 'تاريخ الانتهاء', width: 150, renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString('ar-EG') : '—' },
  ];

  // Function to get the DataGrid content based on the active tab
  const renderDataGrid = () => {
    if (adsTableActiveTab === 'developerAds') {
      return (
        <DataGrid
          rows={filteredDeveloperAds.filter(ad => ad.id !== null && ad.id !== undefined)}
          columns={developerColumns}
          pageSizeOptions={[5, 10, 20, 30, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          autoHeight
          disableRowSelectionOnClick
          sx={{ background: '#fff', borderRadius: 2, mb: 2 }}
          showToolbar
          loading={analyticsLoading}
          getRowId={(row) => row.id || `developer-${row.userId || 'unknown'}-${row.developer_name || 'unnamed'}`}
        />
      );
    } else if (adsTableActiveTab === 'funderAds') {
      return (
        <DataGrid
          rows={filteredFunderAds.filter(ad => ad.id !== null && ad.id !== undefined)}
          columns={funderColumns}
          pageSizeOptions={[5, 10, 20, 30, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          autoHeight
          disableRowSelectionOnClick
          sx={{ background: '#fff', borderRadius: 2, mb: 2 }}
          showToolbar
          loading={analyticsLoading}
          getRowId={(row) => row.id || `funder-${row.userId || 'unknown'}-${row.org_name || 'unnamed'}`}
        />
      );
    } else if (adsTableActiveTab === 'clientAds') {
      return (
        <DataGrid
          rows={filteredClientAds.filter(ad => ad.id !== null && ad.id !== undefined)}
          columns={clientColumns}
          pageSizeOptions={[5, 10, 20, 30, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          autoHeight
          disableRowSelectionOnClick
          sx={{ background: '#fff', borderRadius: 2, mb: 2 }}
          showToolbar
          loading={analyticsLoading}
          getRowId={(row) => row.id || `client-${row.userId || 'unknown'}-${row.title || 'untitled'}`}
        />
      );
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('Analytics component - Current state:', {
      uid,
      type_of_user,
      hasAccess: hasAccess(),
      dataKeys: Object.keys(data.overview).length,
      analyticsDataAvailable: !!analyticsData,
      homepageAds: homepageAds.length,
      developerAds: developerAds.length,
      funderAds: funderAds.length,
      financialRequests: financialRequests.length,
      inquiries: inquiries.length,
      properties: properties.length,
      users: users.length
    });

    // Log analytics data details if available
    if (analyticsData) {
      console.log('Analytics data details:', {
        totalUsers: analyticsData.userEngagement?.totalUsers,
        totalFinancingRequests: analyticsData.financialInsights?.totalFinancingRequests,
        totalRealEstateAds: analyticsData.overview?.totalRealEstateAds,
        totalFinancingAds: analyticsData.overview?.totalFinancingAds,
        totalClientAds: analyticsData.overview?.totalClientAds
      });
    }
  }, [uid, type_of_user, data, analyticsData, homepageAds.length, developerAds.length, funderAds.length, financialRequests.length, inquiries.length, properties.length, users.length]);

  // Access denied component
  if (!hasAccess()) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <SecurityIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" color="error" gutterBottom>
          لا يمكن الوصول إلى هذه الصفحة
        </Typography>
        <Typography variant="body1" color="textSecondary">
          يجب أن تكون مسجل الدخول وأن تمتلك صلاحيات مناسبة لعرض التحليلات
        </Typography>
      </Box>
    );
  }

  // Overview Widgets
  const OverviewWidgets = () => (
    <Grid container spacing={3} mb={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: theme.palette.primary.main, color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <HomeIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {data.overview.totalRealEstateAds || 0}
          </Typography>
          <Typography variant="body1">إجمالي الإعلانات العقارية</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {data.overview.activeAds || 0} نشط | {data.overview.totalRealEstateAds || 0} عقاري | {data.overview.totalFinancingAds || 0} تمويل | {data.overview.totalClientAds || 0} عميل
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: theme.palette.secondary.main, color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <MoneyIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {data.overview.totalFinancingAds || 0}
          </Typography>
          <Typography variant="body1">إعلانات التمويل</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {data.financialInsights.totalFinancingRequests || 0} طلب | {data.overview.totalFinancingAds || 0} منظمة | {data.financialInsights.approvedRequests || 0} مُوافق عليه
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: colors.warning, color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {data.overview.totalClientAds || 0}
          </Typography>
          <Typography variant="body1">إعلانات العملاء</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {(analyticsData?.clientAds || []).filter(ad => ad.reviewStatus === 'approved').length} مُوافق عليه | {(analyticsData?.clientAds || []).filter(ad => ad.reviewStatus === 'pending').length} قيد المراجعة
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: colors.info, color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {data.userEngagement.totalUsers || 0}
          </Typography>
          <Typography variant="body1">المستخدمين المسجلين</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {Object.values(data.userEngagement.userTypes || {}).reduce((a, b) => a + b, 0)} نشط
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: colors.success, color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
          <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {data.financialInsights.approvalRate || 0}%
          </Typography>
          <Typography variant="body1">معدل الموافقة</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {data.financialInsights.approvedRequests || 0} من {data.financialInsights.totalFinancingRequests || 0}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  // Status Distribution Chart
  const StatusDistributionChart = () => {
    const chartData = [
      { name: 'قيد المراجعة', value: data.overview.statusBreakdown?.pending || 0 },
      { name: 'مُوافق عليه', value: data.overview.statusBreakdown?.approved || 0 },
      { name: 'مرفوض', value: data.overview.statusBreakdown?.rejected || 0 }
    ].filter(item => item.value > 0);

    return (
      <EnhancedPieChart 
        data={chartData} 
        title="توزيع حالة الإعلانات"
        colors={[colors.warning, colors.success, colors.error]}
      />
    );
  };

  // Category Distribution Chart
  const CategoryDistributionChart = () => {
    const chartData = Object.entries(data.overview.categoryBreakdown || {})
      .map(([category, count]) => ({
        name: category,
        value: count
      }))
      .sort((a, b) => b.value - a.value);

    return (
      <EnhancedBarChart 
        data={chartData} 
        title="توزيع الإعلانات حسب النوع"
        color={colors.primary}
      />
    );
  };

  // City Distribution Chart
  const CityDistributionChart = () => {
    const chartData = Object.entries(data.overview.cityBreakdown || {})
      .map(([city, count]) => ({
        name: city,
        value: count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 cities

    return (
      <EnhancedBarChart 
        data={chartData} 
        title="توزيع الإعلانات حسب المدينة"
        color={colors.purple}
      />
    );
  };

  // User Engagement Chart
  const UserEngagementChart = () => {
    const chartData = Object.entries(data.userEngagement.userTypes || {})
      .map(([type, count]) => ({
        name: type === 'client' ? 'عملاء' : 
              type === 'developer' ? 'مطورين' : 
              type === 'organization' ? 'منظمات' : 'مدراء',
        value: count
      }))
      .filter(item => item.value > 0);

    return (
      <EnhancedPieChart 
        data={chartData} 
        title="توزيع المستخدمين"
        colors={[colors.primary, colors.secondary, colors.success, colors.warning]}
      />
    );
  };

  // Interest Rate Analysis Chart
  const InterestRateAnalysisChart = () => {
    const chartData = Object.entries(data.financialInsights.interestRateBreakdown || {})
      .map(([rate, count]) => ({
        name: rate,
        value: count
      }))
      .filter(item => item.value > 0);

    return (
      <EnhancedBarChart 
        data={chartData} 
        title="تحليل معدلات الفائدة"
        color={colors.teal}
      />
    );
  };

  // Time Series Chart
  const TimeSeriesChart = () => {
    const chartData = data.timeBasedData.map(item => ({
      name: item.date,
      value: item.adsCreated
    }));

    return (
      <EnhancedBarChart 
        data={chartData} 
        title="الإعلانات المُنشأة عبر الزمن"
        color={colors.primary}
      />
    );
  };

  // User Growth Chart
  const UserGrowthChart = () => {
    const chartData = data.userGrowthData.map(item => ({
      name: item.date,
      value: item.usersRegistered
    }));

    return (
      <EnhancedBarChart 
        data={chartData} 
        title="نمو المستخدمين"
        color={colors.info}
      />
    );
  };

  // Ad Type Breakdown Chart
  const AdTypeBreakdownChart = () => {
    const chartData = [
      { name: 'إعلانات المطورين العقاريين', value: data.overview.totalRealEstateAds || 0 },
      { name: 'إعلانات التمويل', value: data.overview.totalFinancingAds || 0 },
      { name: 'إعلانات العملاء', value: data.overview.totalClientAds || 0 }
    ].filter(item => item.value > 0);

    return (
      <EnhancedPieChart 
        data={chartData} 
        title="توزيع الإعلانات حسب النوع"
        colors={[colors.primary, colors.success, colors.warning]}
      />
    );
  };

  // Ad Status Summary Chart
  const AdStatusSummaryChart = () => {
    const chartData = [
      { name: 'قيد المراجعة', value: data.overview.statusBreakdown.pending },
      { name: 'مُوافق عليه', value: data.overview.statusBreakdown.approved },
      { name: 'مرفوض', value: data.overview.statusBreakdown.rejected }
    ].filter(item => item.value > 0);

    return (
      <EnhancedPieChart 
        data={chartData} 
        title="ملخص حالة الإعلانات"
        colors={[colors.warning, colors.success, colors.error]}
      />
    );
  };

  // Ad Status by Type Chart
  const AdStatusByTypeChart = () => {
    const chartData = [
      { name: 'إعلانات المطورين - قيد المراجعة', value: (analyticsData?.developerAds || []).filter(ad => ad.reviewStatus === 'pending').length },
      { name: 'إعلانات المطورين - مُوافق عليه', value: (analyticsData?.developerAds || []).filter(ad => ad.reviewStatus === 'approved').length },
      { name: 'إعلانات المطورين - مرفوض', value: (analyticsData?.developerAds || []).filter(ad => ad.reviewStatus === 'rejected').length },
      { name: 'إعلانات التمويل - قيد المراجعة', value: (analyticsData?.financingAds || []).filter(ad => ad.reviewStatus === 'pending').length },
      { name: 'إعلانات التمويل - مُوافق عليه', value: (analyticsData?.financingAds || []).filter(ad => ad.reviewStatus === 'approved').length },
      { name: 'إعلانات التمويل - مرفوض', value: (analyticsData?.financingAds || []).filter(ad => ad.reviewStatus === 'rejected').length },
      { name: 'إعلانات العملاء - قيد المراجعة', value: (analyticsData?.clientAds || []).filter(ad => ad.reviewStatus === 'pending').length },
      { name: 'إعلانات العملاء - مُوافق عليه', value: (analyticsData?.clientAds || []).filter(ad => ad.reviewStatus === 'approved').length },
      { name: 'إعلانات العملاء - مرفوض', value: (analyticsData?.clientAds || []).filter(ad => ad.reviewStatus === 'rejected').length }
    ].filter(item => item.value > 0);

    return (
      <EnhancedBarChart 
        data={chartData} 
        title="حالة الإعلانات حسب النوع"
        color={colors.purple}
      />
    );
  };

  // Client Ads Analysis Chart
  const ClientAdsAnalysisChart = () => {
    const clientAds = analyticsData?.clientAds || [];
    const chartData = [
      { name: 'إعلانات نشطة', value: clientAds.filter(ad => ad.ads === true).length },
      { name: 'إعلانات غير نشطة', value: clientAds.filter(ad => ad.ads === false).length },
      { name: 'قيد المراجعة', value: clientAds.filter(ad => ad.reviewStatus === 'pending').length },
      { name: 'مُوافق عليه', value: clientAds.filter(ad => ad.reviewStatus === 'approved').length },
      { name: 'مرفوض', value: clientAds.filter(ad => ad.reviewStatus === 'rejected').length }
    ].filter(item => item.value > 0);

    return (
      <EnhancedPieChart 
        data={chartData} 
        title="تحليل إعلانات العملاء"
        colors={[colors.success, colors.grey, colors.warning, colors.primary, colors.error]}
      />
    );
  };

  // Client User Analysis Chart
  const ClientUserAnalysisChart = () => {
    const users = analyticsData?.users || [];
    const clientUsers = users.filter(user => user.type_of_user === 'client');
    const clientAds = analyticsData?.clientAds || [];
    
    const chartData = [
      { name: 'عملاء نشطين', value: clientUsers.filter(user => user.isActive !== false).length },
      { name: 'عملاء غير نشطين', value: clientUsers.filter(user => user.isActive === false).length },
      { name: 'عملاء لديهم إعلانات', value: [...new Set(clientAds.map(ad => ad.userId))].length },
      { name: 'عملاء بدون إعلانات', value: clientUsers.length - [...new Set(clientAds.map(ad => ad.userId))].length }
    ].filter(item => item.value > 0);

    return (
      <EnhancedPieChart 
        data={chartData} 
        title="تحليل عملاء الإعلانات"
        colors={[colors.success, colors.grey, colors.primary, colors.warning]}
      />
    );
  };

  // Client Ads Revenue Chart
  const ClientAdsRevenueChart = () => {
    const clientAds = analyticsData?.clientAds || [];
    const approvedClientAds = clientAds.filter(ad => ad.reviewStatus === 'approved');
    
    const chartData = [
      { name: 'إعلانات مُوافق عليها', value: approvedClientAds.length },
      { name: 'إعلانات قيد المراجعة', value: clientAds.filter(ad => ad.reviewStatus === 'pending').length },
      { name: 'إعلانات مرفوضة', value: clientAds.filter(ad => ad.reviewStatus === 'rejected').length },
      { name: 'إعلانات نشطة', value: clientAds.filter(ad => ad.ads === true).length },
      { name: 'إعلانات غير نشطة', value: clientAds.filter(ad => ad.ads === false).length }
    ].filter(item => item.value > 0);

    const totalRevenue = approvedClientAds.reduce((sum, ad) => sum + (ad.adPackagePrice || 0), 0);

    return (
      <Paper direction="rtl" elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>
          تحليل إعلانات العملاء
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary">
                {clientAds.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                إجمالي الإعلانات
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box textAlign="center">
              <Typography variant="h4" style={{ color: colors.success }}>
                {totalRevenue}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                إجمالي الإيرادات
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ height: 200 }}>
          <EnhancedPieChart 
            data={chartData} 
            title="توزيع إعلانات العملاء"
            colors={[colors.success, colors.warning, colors.error, colors.primary, colors.grey]}
          />
        </Box>
      </Paper>
    );
  };

  // Client Ads Time Series Chart
  const ClientAdsTimeSeriesChart = () => {
    const clientAds = analyticsData?.clientAds || [];
    const timeBasedData = data.timeBasedData || [];
    
    // Create time series data for client ads
    const clientAdsTimeData = timeBasedData.map(item => ({
      date: item.date,
      clientAdsCreated: clientAds.filter(ad => {
        if (!ad.created_at) return false;
        const adDate = new Date(ad.created_at?.toDate?.() || ad.created_at);
        if (isNaN(adDate.getTime())) return false; // skip invalid dates
        return adDate.toISOString().split('T')[0] === item.date;
      }).length,
      clientAdsApproved: clientAds.filter(ad => {
        if (!ad.created_at) return false;
        const adDate = new Date(ad.created_at?.toDate?.() || ad.created_at);
        if (isNaN(adDate.getTime())) return false; // skip invalid dates
        return adDate.toISOString().split('T')[0] === item.date && ad.reviewStatus === 'approved';
      }).length
    }));

    const chartData = clientAdsTimeData.map(item => ({
      name: item.date,
      'إعلانات منشأة': item.clientAdsCreated,
      'إعلانات مُوافق عليها': item.clientAdsApproved
    }));

    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>
          تطور إعلانات العملاء عبر الزمن
        </Typography>
        <Box sx={{ height: 300 }}>
          <EnhancedBarChart 
            data={chartData} 
            title="إعلانات العملاء - تحليل زمني"
            color={colors.warning}
          />
        </Box>
      </Paper>
    );
  };

  // Client Ads Summary Section
  const ClientAdsSummarySection = () => {
    const clientAds = analyticsData?.clientAds || [];
    const users = analyticsData?.users || [];
    const clientUsers = users.filter(user => user.type_of_user === 'client');
    
    const stats = {
      totalClientAds: clientAds.length,
      activeClientAds: clientAds.filter(ad => ad.ads === true).length,
      pendingClientAds: clientAds.filter(ad => ad.reviewStatus === 'pending').length,
      approvedClientAds: clientAds.filter(ad => ad.reviewStatus === 'approved').length,
      rejectedClientAds: clientAds.filter(ad => ad.reviewStatus === 'rejected').length,
      totalClientUsers: clientUsers.length,
      clientsWithAds: [...new Set(clientAds.map(ad => ad.userId))].length,
      averageAdsPerClient: clientUsers.length > 0 ? (clientAds.length / clientUsers.length).toFixed(1) : 0
    };

    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', mb: 3 }}>
          ملخص شامل لإعلانات العملاء
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box textAlign="center" p={2} bgcolor="primary.light" borderRadius={2} color="white">
              <Typography variant="h4">{stats.totalClientAds}</Typography>
              <Typography variant="body2">إجمالي الإعلانات</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={2} color="white">
              <Typography variant="h4">{stats.activeClientAds}</Typography>
              <Typography variant="body2">إعلانات نشطة</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={2} color="white">
              <Typography variant="h4">{stats.pendingClientAds}</Typography>
              <Typography variant="body2">قيد المراجعة</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box textAlign="center" p={2} bgcolor="info.light" borderRadius={2} color="white">
              <Typography variant="h4">{stats.totalClientUsers}</Typography>
              <Typography variant="body2">إجمالي العملاء</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center" p={2} bgcolor="secondary.light" borderRadius={2} color="white">
              <Typography variant="h4">{stats.approvedClientAds}</Typography>
              <Typography variant="body2">إعلانات مُوافق عليها</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center" p={2} bgcolor="error.light" borderRadius={2} color="white">
              <Typography variant="h4">{stats.rejectedClientAds}</Typography>
              <Typography variant="body2">إعلانات مرفوضة</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center" p={2} bgcolor="grey.500" borderRadius={2} color="white">
              <Typography variant="h4">{stats.averageAdsPerClient}</Typography>
              <Typography variant="body2">متوسط الإعلانات لكل عميل</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // Financial Insights
  const FinancialInsights = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'right' }}>
            ملخص التمويل
          </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {data.financialInsights.totalFinancingRequests || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    إجمالي الطلبات
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box textAlign="center">
                  <Typography variant="h4" style={{ color: colors.success }}>
                    {data.financialInsights.approvedRequests || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    مُوافق عليها
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box textAlign="center">
                  <Typography variant="h4" style={{ color: colors.error }}>
                    {data.financialInsights.rejectedRequests || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    مرفوضة
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box textAlign="center">
                  <Typography variant="h4" style={{ color: colors.warning }}>
                    {data.financialInsights.pendingRequests || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    قيد المراجعة
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Box textAlign="center">
              <Typography variant="h5" color="primary">
                {data.financialInsights.approvalRate || 0}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                معدل الموافقة
              </Typography>
            </Box>
          </Paper>
      </Grid>
      
      <Grid size={{ xs: 12, md: 6 }}>
        <InterestRateAnalysisChart />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ClientAdsRevenueChart />
      </Grid>
    </Grid>
  );

  // Controls
  const Controls = () => (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
        أدوات التحكم والفلترة
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid size="auto">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>المدة الزمنية</InputLabel>
            <Select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              label="المدة الزمنية"
            >
              <MenuItem value="7">7 أيام</MenuItem>
              <MenuItem value="30">30 يوم</MenuItem>
              <MenuItem value="90">90 يوم</MenuItem>
              <MenuItem value="365">سنة</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size="auto">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>المدينة</InputLabel>
            <Select
              value={filters.selectedCity}
              onChange={(e) => handleFilterChange('selectedCity', e.target.value)}
              label="المدينة"
            >
              <MenuItem value="all">جميع المدن</MenuItem>
              <MenuItem value="القاهرة">القاهرة</MenuItem>
              <MenuItem value="الإسكندرية">الإسكندرية</MenuItem>
              <MenuItem value="الجيزة">الجيزة</MenuItem>
              <MenuItem value="المنوفية">المنوفية</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size="auto">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>الحالة</InputLabel>
            <Select
              value={filters.selectedStatus}
              onChange={(e) => handleFilterChange('selectedStatus', e.target.value)}
              label="الحالة"
            >
              <MenuItem value="all">جميع الحالات</MenuItem>
              <MenuItem value="pending">قيد المراجعة</MenuItem>
              <MenuItem value="approved">مُوافق عليه</MenuItem>
              <MenuItem value="rejected">مرفوض</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size="auto">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>نوع الإعلان</InputLabel>
            <Select
              value={filters.adType}
              onChange={(e) => handleFilterChange('adType', e.target.value)}
              label="نوع الإعلان"
            >
              <MenuItem value="all">جميع الأنواع</MenuItem>
              <MenuItem value="client">إعلانات العملاء</MenuItem>
              <MenuItem value="developer">إعلانات المطورين</MenuItem>
              <MenuItem value="financing">إعلانات التمويل</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size="auto">
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAllData}
            disabled={loading}
          >
            تحديث البيانات
          </Button>
        </Grid>
        <Grid size="auto">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              console.log('Manual data fetch triggered');
              fetchAllData();
            }}
            size="small"
          >
            جلب البيانات يدوياً
          </Button>
        </Grid>
        <Grid size="auto">
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => setExportDialogOpen(true)}
          >
            تصدير التقرير
          </Button>
        </Grid>

      </Grid>
    </Paper>
  );

  if (analyticsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box dir='rtl' sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <AnalyticsIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          لوحة التحكم التحليلية
        </Typography>
      </Box>

      {analyticsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {analyticsError}
        </Alert>
      )}

             {/* Debug Info */}
       {/* <Alert severity="info" sx={{ mb: 3 }}>
         <Typography variant="body2">
           <strong>Debug Info:</strong> User ID: {uid}, Type: {type_of_user},
           Data Source: Real Database Data Only,
           Analytics Data Available: {analyticsData ? 'Yes' : 'No'},
           Loading: {analyticsLoading ? 'Yes' : 'No'},
           Error: {analyticsError || 'None'}
         </Typography>
         <Typography variant="body2" sx={{ mt: 1 }}>
           <strong>Analytics Data:</strong> Total Real Estate: {data.overview.totalRealEstateAds || 0}, 
           Total Financing: {data.overview.totalFinancingAds || 0}, Active: {data.overview.activeAds || 0}, 
           Pending: {data.overview.statusBreakdown?.pending || 0}, 
           Approved: {data.overview.statusBreakdown?.approved || 0},
           Total Users: {data.userEngagement?.totalUsers || 0},
           Financial Requests: {data.financialInsights?.totalFinancingRequests || 0}
         </Typography>
         <Typography variant="body2" sx={{ mt: 1 }}>
           <strong>Model Classes Used:</strong> RealEstateDeveloperAdvertisement.getAll(), 
           FinancingAdvertisement.getAll(), User.getAllUsers()
         </Typography>
       </Alert> */}

      <Controls />

      <OverviewWidgets />

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="نظرة عامة" icon={<AssessmentIcon />} />
        <Tab label="أداء الإعلانات" icon={<HomeIcon />} />
        <Tab label="تفاصيل الإعلانات" icon={<BusinessIcon />} />
        <Tab label="تحليل الإعلانات" icon={<AnalyticsIcon />} />
        <Tab label="تفاعل المستخدمين" icon={<PeopleIcon />} />
        <Tab label="الرؤى المالية" icon={<AccountBalanceIcon />} />
        <Tab label="التقارير الزمنية" icon={<TimelineIcon />} />
        <Tab label="جدول الإعلانات" icon={<TableChartIcon />} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatusDistributionChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CategoryDistributionChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AdTypeBreakdownChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AdStatusSummaryChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientAdsAnalysisChart />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TimeSeriesChart />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ClientAdsSummarySection />
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CategoryDistributionChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CityDistributionChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatusDistributionChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientAdsAnalysisChart />
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AdTypeBreakdownChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AdStatusByTypeChart />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>
                إحصائيات مفصلة للإعلانات
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box textAlign="center" p={2} bgcolor="primary.light" borderRadius={2} color="white">
                    <Typography variant="h4">{data.overview.totalRealEstateAds || 0}</Typography>
                    <Typography variant="body2">إعلانات المطورين العقاريين</Typography>
                    <Typography variant="caption">
                      نشط: {(analyticsData?.developerAds || []).filter(ad => ad.ads === true).length} | 
                      قيد المراجعة: {(analyticsData?.developerAds || []).filter(ad => ad.reviewStatus === 'pending').length}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={2} color="white">
                    <Typography variant="h4">{data.overview.totalFinancingAds || 0}</Typography>
                    <Typography variant="body2">إعلانات التمويل</Typography>
                    <Typography variant="caption">
                      نشط: {(analyticsData?.financingAds || []).filter(ad => ad.ads === true).length} | 
                      قيد المراجعة: {(analyticsData?.financingAds || []).filter(ad => ad.reviewStatus === 'pending').length}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={2} color="white">
                    <Typography variant="h4">{data.overview.totalClientAds || 0}</Typography>
                    <Typography variant="body2">إعلانات العملاء</Typography>
                    <Typography variant="caption">
                      نشط: {(analyticsData?.clientAds || []).filter(ad => ad.ads === true).length} | 
                      قيد المراجعة: {(analyticsData?.clientAds || []).filter(ad => ad.reviewStatus === 'pending').length}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AdStatusSummaryChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AdStatusByTypeChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientAdsAnalysisChart />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'right' }}>
                تحليل مفصل لحالة الإعلانات
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={2} color="white">
                    <Typography variant="h4">{statusBreakdown.pending}</Typography>
                    <Typography variant="body2">قيد المراجعة</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={2} color="white">
                    <Typography variant="h4">{statusBreakdown.approved}</Typography>
                    <Typography variant="body2">مُوافق عليه</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box textAlign="center" p={2} bgcolor="error.light" borderRadius={2} color="white">
                    <Typography variant="h4">{statusBreakdown.rejected}</Typography>
                    <Typography variant="body2">مرفوض</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box textAlign="center" p={2} bgcolor="info.light" borderRadius={2} color="white">
                    <Typography variant="h4">{totalRealEstateAds + totalFinancingAds + totalClientAds}</Typography>
                    <Typography variant="body2">إجمالي الإعلانات</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <UserEngagementChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <UserGrowthChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientAdsAnalysisChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientUserAnalysisChart />
          </Grid>
        </Grid>
      )}

      {activeTab === 5 && (
        <FinancialInsights />
      )}

      {activeTab === 6 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TimeSeriesChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <UserGrowthChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientAdsTimeSeriesChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientAdsAnalysisChart />
          </Grid>
        </Grid>
      )}

      {activeTab === 7 && (
        <Box dir={'rtl'} sx={{ p: { xs: 1, md: 3 }, textAlign: 'right', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Paper dir={'rtl'} sx={{ p: { xs: 1, md: 3 }, borderRadius: 2, minHeight: 400, textAlign: 'right', flexGrow: 1 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                variant='scrollable'
                value={adsTableActiveTab}
                onChange={(e, v) => setAdsTableActiveTab(v)}
                aria-label="advertisement tabs"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab value="developerAds" label="إعلانات مطورين عقاريين" />
                <Tab value="funderAds" label="إعلانات ممولين عقاريين" />
                <Tab value="clientAds" label="إعلانات العملاء" />
              </Tabs>
            </Box>
            
            {/* Filter Chips */}
            <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
              <Chip
                label="الكل"
                color={reviewStatusFilter === 'all' ? 'primary' : 'default'}
                onClick={() => handleStatusChipClick('all')}
                sx={{ borderRadius: 1.5 }}
              />
              <Chip
                label="قيد المراجعة"
                color={reviewStatusFilter === 'pending' ? statusChipColor['pending'] : 'default'}
                onClick={() => handleStatusChipClick('pending')}
                sx={{ borderRadius: 1.5 }}
              />
              <Chip
                label="مقبول"
                color={reviewStatusFilter === 'approved' ? statusChipColor['approved'] : 'default'}
                onClick={() => handleStatusChipClick('approved')}
                sx={{ borderRadius: 1.5 }}
              />
              <Chip
                label="مرفوض"
                color={reviewStatusFilter === 'rejected' ? statusChipColor['rejected'] : 'default'}
                onClick={() => handleStatusChipClick('rejected')}
                sx={{ borderRadius: 1.5 }}
              />
            </Stack>
            
            {/* DataGrid Table */}
            <Box sx={{ width: '100%', flexGrow: 1 }}>
              {renderDataGrid()}
            </Box>
          </Paper>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        dir="rtl"
      >
        <DialogTitle id="delete-dialog-title">{"تأكيد الحذف"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            هل أنت متأكد أنك تريد حذف الإعلان: "{adToDelete?.developer_name || adToDelete?.org_name || adToDelete?.title}"؟
            هذا الإجراء لا يمكن التراجع عنه.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} dir="rtl">
        <DialogTitle>سبب الرفض</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="سبب الرفض"
            type="text"
            fullWidth
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            helperText={rejectReason.trim() === '' ? 'الرجاء إدخال سبب لرفض الإعلان.' : ''}
            error={rejectReason.trim() === ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>إلغاء</Button>
          <Button
            onClick={handleConfirmReject}
            color="error"
            disabled={rejectReason.trim() === ''}
          >
            رفض
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activation Duration Menu */}
      <Menu
        anchorEl={activationMenuAnchorEl}
        open={Boolean(activationMenuAnchorEl)}
        onClose={handleActivationMenuClose}
        dir="rtl"
      >
        <MenuItem onClick={() => handleActivateWithDays(7)}>7 أيام</MenuItem>
        <MenuItem onClick={() => handleActivateWithDays(14)}>14 يومًا</MenuItem>
        <MenuItem onClick={() => handleActivateWithDays(21)}>21 يومًا</MenuItem>
        <MenuItem onClick={() => handleActivateWithDays(28)}>28 يومًا</MenuItem>
      </Menu>

      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} maxWidth="sm" fullWidth dir="rtl">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>إيصال الدفع</span>
          <IconButton onClick={() => setReceiptDialogOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          {receiptDialogImage ? (
            <img src={receiptDialogImage} alt="إيصال الدفع" style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, marginBottom: 16 }} />
          ) : (
            <Typography color="text.secondary">لا يوجد إيصال دفع</Typography>
          )}
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel id="receipt-dialog-days-label">مدة التفعيل (بالأيام)</InputLabel>
            <Select
              labelId="receipt-dialog-days-label"
              value={receiptDialogDays}
              label="مدة التفعيل (بالأيام)"
              onChange={e => setReceiptDialogDays(Number(e.target.value))}
            >
              <MenuItem value={7}>7 أيام</MenuItem>
              <MenuItem value={14}>14 يوم</MenuItem>
              <MenuItem value={21}>21 يوم</MenuItem>
              <MenuItem value={28}>28 يوم</MenuItem>
            </Select>
            {receiptDialogAd?.adPackage && (
              <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                {receiptDialogAd.adPackage === 1 && 'باقة الأساس (7 أيام)'}
                {receiptDialogAd.adPackage === 2 && 'باقة النخبة (14 يوم)'}
                {receiptDialogAd.adPackage === 3 && 'باقة التميز (21 يوم)'}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleReceiptDialogActivate} variant="contained" color="primary">تفعيل</Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>تصدير التقرير</DialogTitle>
        <DialogContent>
          <Typography>
            سيتم تصدير جميع البيانات الحالية بتنسيق CSV. هل تريد المتابعة؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleExport} variant="contained">
            تصدير
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Analytics; 