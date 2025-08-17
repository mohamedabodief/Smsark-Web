    import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
    import RealEstateDeveloperAdvertisement from '../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import FinancingAdvertisement from '../../FireBase/modelsWithOperations/FinancingAdvertisement';
import ClientAdvertisement from '../../FireBase/modelsWithOperations/ClientAdvertisemen';
import User from '../../FireBase/modelsWithOperations/User';

    // Async thunk to fetch comprehensive analytics data using model classes - REAL DATA ONLY
// This replaces the previous direct Firestore calls with model class methods
// All mock/fake data generation has been removed to ensure accurate analytics
export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchData',
  async ({ userRole, userId, filters = {} }, { rejectWithValue }) => {
        try {
        const {
            dateRange = 'month',
            selectedCity = 'all',
            selectedStatus = 'all',
            adType = 'all'
        } = filters;

        // Calculate date range
        const now = new Date();
        let daysAgo = 30; // default to 30 days
        
        if (dateRange === 'week') {
            daysAgo = 7;
        } else if (dateRange === 'month') {
            daysAgo = 30;
        } else if (dateRange === 'quarter') {
            daysAgo = 90;
        } else if (dateRange === 'all') {
            daysAgo = 365; // Show all data for the last year
        }
        
        const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

              // Fetch all data using model classes (with error handling for authentication)
      let developerAds = [];
      let financingAds = [];
      let clientAds = [];
      let users = [];
      
      try {
        [developerAds, financingAds, clientAds, users] = await Promise.all([
          RealEstateDeveloperAdvertisement.getAll(),
          FinancingAdvertisement.getAll(),
          ClientAdvertisement.getAll(),
          User.getAllUsers()
        ]);
      } catch (error) {
        console.warn('Authentication required for model classes, falling back to empty data:', error.message);
        // Return empty arrays if authentication fails
        developerAds = [];
        financingAds = [];
        clientAds = [];
        users = [];
      }

        console.log('Fetched data counts using model classes:', {
            developerAds: developerAds.length,
            financingAds: financingAds.length,
            clientAds: clientAds.length,
            users: users.length
        });

        // Process data based on user role
        let processedData = processAnalyticsData(
            developerAds,
            financingAds,
            clientAds,
            users,
            userRole,
            userId,
            { dateRange, selectedCity, selectedStatus, adType, startDate, daysAgo }
        );

        console.log('Processed analytics data:', processedData);
        console.log('Time-based data summary:', {
            totalDays: processedData.timeBasedData.length,
            daysWithAds: processedData.timeBasedData.filter(d => d.adsCreated > 0).length,
            totalAdsInTimeSeries: processedData.timeBasedData.reduce((sum, d) => sum + d.adsCreated, 0)
        });
        console.log('User growth data summary:', {
            totalDays: processedData.userGrowthData.length,
            daysWithUsers: processedData.userGrowthData.filter(d => d.usersRegistered > 0).length,
            totalUsersInTimeSeries: processedData.userGrowthData.reduce((sum, d) => sum + d.usersRegistered, 0)
        });
        return processedData;
        } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Return a default structure instead of failing completely
        return {
            overview: {
            totalRealEstateAds: 0,
            totalFinancingAds: 0,
            totalClientAds: 0,
            activeAds: 0,
            inactiveAds: 0,
            statusBreakdown: { pending: 0, approved: 0, rejected: 0 },
            categoryBreakdown: {},
            cityBreakdown: {}
            },
            userEngagement: {
            userTypes: { client: 0, developer: 0, organization: 0, admin: 0 },
            totalUsers: 0
            },
            financialInsights: {
            totalFinancingRequests: 0,
            approvedRequests: 0,
            rejectedRequests: 0,
            pendingRequests: 0,
            approvalRate: 0,
            interestRateBreakdown: { '≤5%': 0, '≤10%': 0, '>10%': 0 },
            totalRevenue: 0,
            perAdAnalytics: []
            },
            timeBasedData: [],
            userGrowthData: [],
            developerAds: [],
            financingAds: [],
            clientAds: [],
            filters: { dateRange, selectedCity, selectedStatus, adType }
        };
        }
    }
    );

    // Helper function to safely parse dates from various timestamp fields
    const safeParseDate = (dateValue) => {
    if (!dateValue) return null;

    try {
        // Handle Firestore Timestamp
        if (dateValue.toDate && typeof dateValue.toDate === 'function') {
        return dateValue.toDate();
        }

        // Handle timestamp numbers (milliseconds)
        if (typeof dateValue === 'number') {
        return new Date(dateValue);
        }

        // Handle regular date strings/objects
        const date = new Date(dateValue);
        return !isNaN(date.getTime()) ? date : null;
    } catch (error) {
        console.warn('Failed to parse date:', dateValue, error);
        return null;
    }
    };

    // Helper function to get creation date from various possible fields
    const getCreationDate = (item) => {
    // Try different possible timestamp field names
    const possibleFields = ['createdAt', 'created_at', 'submitted_at', 'timestamp'];

    for (const field of possibleFields) {
        if (item[field]) {
        const date = safeParseDate(item[field]);
        if (date) return date;
        }
    }

    // If no timestamp field found, return null (will be excluded from time-based analytics)
    return null;
    };

    // Helper function to process analytics data using model class instances
    const processAnalyticsData = (developerAds, financingAds, clientAds, users, userRole, userId, filters) => {
    const { dateRange, selectedCity, selectedStatus, adType, startDate, daysAgo } = filters;

    // Filter data based on user role
    let filteredDeveloperAds = developerAds;
    let filteredFinancingAds = financingAds;
    let filteredClientAds = clientAds;
    let filteredUsers = users;

    // Apply role-based filtering
    if (userRole === 'developer') {
        filteredDeveloperAds = developerAds.filter(ad => ad.userId === userId);
        filteredFinancingAds = financingAds.filter(ad => ad.userId === userId);
        filteredClientAds = clientAds.filter(ad => ad.userId === userId);
    } else if (userRole === 'organization') {
        // For organization users, filter both developer and financing ads by userId
        filteredDeveloperAds = developerAds.filter(ad => ad.userId === userId);
        filteredFinancingAds = financingAds.filter(ad => ad.userId === userId);
        console.log('Organization filtering:', {
            userId,
            totalDeveloperAds: developerAds.length,
            filteredDeveloperAds: filteredDeveloperAds.length,
            totalFinancingAds: financingAds.length,
            filteredFinancingAds: filteredFinancingAds.length,
            developerAdsUserIds: developerAds.map(ad => ad.userId),
            financingAdsUserIds: financingAds.map(ad => ad.userId)
        });
    } else if (userRole === 'client') {
        filteredClientAds = clientAds.filter(ad => ad.userId === userId);
    }

    // Apply additional filters
    if (selectedCity !== 'all') {
        filteredDeveloperAds = filteredDeveloperAds.filter(ad => ad.location?.city === selectedCity);
        filteredFinancingAds = filteredFinancingAds.filter(ad => ad.location?.city === selectedCity);
        filteredClientAds = filteredClientAds.filter(ad => ad.location?.city === selectedCity);
    }

    if (selectedStatus !== 'all') {
        filteredDeveloperAds = filteredDeveloperAds.filter(ad => ad.reviewStatus === selectedStatus);
        filteredFinancingAds = filteredFinancingAds.filter(ad => ad.reviewStatus === selectedStatus);
        filteredClientAds = filteredClientAds.filter(ad => ad.reviewStatus === selectedStatus);
    }

    // Overview calculations
    const totalRealEstateAds = filteredDeveloperAds.length;
    const totalFinancingAds = filteredFinancingAds.length;
    const totalClientAds = filteredClientAds.length;
    const activeAds = [...filteredDeveloperAds, ...filteredFinancingAds, ...filteredClientAds]
        .filter(ad => ad.ads === true).length;
    const inactiveAds = [...filteredDeveloperAds, ...filteredFinancingAds, ...filteredClientAds]
        .filter(ad => ad.ads === false).length;

    // Status breakdown
    const statusBreakdown = {
        pending: 0,
        approved: 0,
        rejected: 0
    };

    [...filteredDeveloperAds, ...filteredFinancingAds, ...filteredClientAds].forEach(ad => {
        const status = ad.reviewStatus;
        if (statusBreakdown.hasOwnProperty(status)) {
        statusBreakdown[status]++;
        }
    });

    // Category breakdown
    const categoryBreakdown = {};
    filteredDeveloperAds.forEach(ad => {
        const type = ad.project_types || 'غير محدد';
        categoryBreakdown[type] = (categoryBreakdown[type] || 0) + 1;
    });
    
    // Add client ads to category breakdown
    filteredClientAds.forEach(ad => {
        const type = ad.type || 'غير محدد';
        categoryBreakdown[type] = (categoryBreakdown[type] || 0) + 1;
    });

    // City breakdown
    const cityBreakdown = {};
    [...filteredDeveloperAds, ...filteredFinancingAds, ...filteredClientAds].forEach(ad => {
        const city = ad.location?.city || 'غير محدد';
        cityBreakdown[city] = (cityBreakdown[city] || 0) + 1;
    });

    // User engagement
    const userTypes = { client: 0, developer: 0, organization: 0, admin: 0 };
    filteredUsers.forEach(user => {
        const type = user.type_of_user;
        if (userTypes.hasOwnProperty(type)) {
        userTypes[type]++;
        }
    });

    // Financial insights (using financing ads as proxy for requests)
    const totalFinancingRequests = filteredFinancingAds.length;
    const approvedRequests = filteredFinancingAds.filter(ad => ad.reviewStatus === 'approved').length;
    const rejectedRequests = filteredFinancingAds.filter(ad => ad.reviewStatus === 'rejected').length;
    const pendingRequests = filteredFinancingAds.filter(ad => ad.reviewStatus === 'pending').length;

    // Calculate approval rate
    const approvalRate = totalFinancingRequests > 0 ? Number(((approvedRequests / totalFinancingRequests) * 100).toFixed(3)) : 0;

    // Interest rate analysis
    const interestRateBreakdown = {
        '≤5%': 0,
        '≤10%': 0,
        '>10%': 0
    };

    filteredFinancingAds.forEach(ad => {
        const rate5 = ad.interest_rate_upto_5 || 0;
        const rate10 = ad.interest_rate_upto_10 || 0;
        const rateAbove = ad.interest_rate_above_10 || 0;
        
        if (rate5 > 0) interestRateBreakdown['≤5%']++;
        if (rate10 > 0) interestRateBreakdown['≤10%']++;
        if (rateAbove > 0) interestRateBreakdown['>10%']++;
    });

    // Revenue tracking (real calculation based on approved ads' package prices)
    const totalRevenue = filteredFinancingAds
        .filter(ad => ad.reviewStatus === 'approved')
        .reduce((sum, ad) => sum + (ad.adPackagePrice || 0), 0);

    // Time-based data
    const timeBasedData = [];
    console.log('Processing time-based data for', daysAgo, 'days');
    console.log('Sample ads for timestamp analysis:', {
        developerAds: filteredDeveloperAds.slice(0, 2).map(ad => ({ id: ad.id, createdAt: ad.createdAt, created_at: ad.created_at })),
        financingAds: filteredFinancingAds.slice(0, 2).map(ad => ({ id: ad.id, createdAt: ad.createdAt, created_at: ad.created_at })),
        clientAds: filteredClientAds.slice(0, 2).map(ad => ({ id: ad.id, createdAt: ad.createdAt, created_at: ad.created_at }))
    });

    for (let i = daysAgo - 1; i >= 0; i--) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];

        const adsCreated = [...filteredDeveloperAds, ...filteredFinancingAds, ...filteredClientAds]
        .filter(ad => {
            const adDate = getCreationDate(ad);
            return adDate && adDate.toISOString().split('T')[0] === dateStr;
        }).length;

        // Calculate approvals and rejections for this date
        const approvals = [...filteredDeveloperAds, ...filteredFinancingAds, ...filteredClientAds]
        .filter(ad => {
            const adDate = getCreationDate(ad);
            return adDate && adDate.toISOString().split('T')[0] === dateStr && ad.reviewStatus === 'approved';
        }).length;

        const rejections = [...filteredDeveloperAds, ...filteredFinancingAds, ...filteredClientAds]
        .filter(ad => {
            const adDate = getCreationDate(ad);
            return adDate && adDate.toISOString().split('T')[0] === dateStr && ad.reviewStatus === 'rejected';
        }).length;

        timeBasedData.push({
        date: dateStr,
        adsCreated,
        requestsCreated: adsCreated, // Using ads as proxy for requests
        approvals,
        rejections
        });
    }

    // User growth data
    const userGrowthData = [];
    console.log('Processing user growth data');
    console.log('Sample users for timestamp analysis:', filteredUsers.slice(0, 3).map(user => ({ uid: user.uid, createdAt: user.createdAt, created_at: user.created_at })));

    for (let i = daysAgo - 1; i >= 0; i--) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];

        const usersRegistered = filteredUsers
        .filter(user => {
            const userDate = getCreationDate(user);
            return userDate && userDate.toISOString().split('T')[0] === dateStr;
        }).length;

        userGrowthData.push({
        date: dateStr,
        usersRegistered
        });
    }

      return {
    overview: {
      totalRealEstateAds,
      totalFinancingAds,
      totalClientAds,
      activeAds,
      inactiveAds,
      statusBreakdown,
      categoryBreakdown,
      cityBreakdown
    },
    userEngagement: {
      userTypes,
      totalUsers: filteredUsers.length
    },
    financialInsights: {
      totalFinancingRequests,
      approvedRequests,
      rejectedRequests,
      pendingRequests,
      approvalRate,
      interestRateBreakdown,
      totalRevenue,
      // Per-ad analytics for funders (using real data only)
      perAdAnalytics: filteredFinancingAds.map(ad => ({
        id: ad.id,
        title: ad.title,
        status: ad.reviewStatus,
        createdAt: ad.createdAt,
        interestRate: ad.interest_rate_upto_5 ? '≤5%' : ad.interest_rate_upto_10 ? '≤10%' : '>10%',
        location: ad.location?.city || 'غير محدد',
        // Real data only - no mock values
        totalRequests: 0, // This would need to be calculated from actual FinancingRequest model
        approvedRequests: 0, // This would need to be calculated from actual FinancingRequest model
        averageAmount: 0 // This would need to be calculated from actual FinancingRequest model
      }))
    },
    timeBasedData,
    userGrowthData,
    // Include raw ads data for table display with enhanced analytics
    developerAds: filteredDeveloperAds.map(ad => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      images: ad.images || [],
      phone: ad.phone,
      userId: ad.userId,
      ads: ad.ads,
      adExpiryTime: ad.adExpiryTime,
      reviewStatus: ad.reviewStatus || 'pending',
      reviewed_by: ad.reviewed_by,
      review_note: ad.review_note,
      status: ad.status,
      receipt_image: ad.receipt_image,
      developer_name: ad.developer_name,
      project_types: ad.project_types,
      price_start_from: ad.price_start_from,
      price_end_to: ad.price_end_to,
      location: ad.location,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
      // Calculate time since published
      daysSincePublished: Math.floor((new Date() - new Date(ad.createdAt?.toDate?.() || ad.createdAt)) / (1000 * 60 * 60 * 24)),
      // Real data only - these would need to be tracked in the database
      views: 0, // This would need to be tracked in the database
      edits: 0, // This would need to be tracked in the database
      lastEdited: ad.updatedAt?.toDate?.() || ad.updatedAt || ad.createdAt
    })),
    financingAds: filteredFinancingAds.map(ad => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      images: ad.images || [],
      phone: ad.phone,
      start_limit: ad.start_limit,
      end_limit: ad.end_limit,
      org_name: ad.org_name,
      type_of_user: ad.type_of_user,
      userId: ad.userId,
      ads: ad.ads,
      adExpiryTime: ad.adExpiryTime,
      interest_rate_upto_5: ad.interest_rate_upto_5,
      interest_rate_upto_10: ad.interest_rate_upto_10,
      interest_rate_above_10: ad.interest_rate_above_10,
      receipt_image: ad.receipt_image,
      reviewStatus: ad.reviewStatus || 'pending',
      reviewed_by: ad.reviewed_by,
      review_note: ad.review_note,
      status: ad.status,
      adPackage: ad.adPackage,
      adPackageName: ad.adPackageName,
      adPackagePrice: ad.adPackagePrice,
      adPackageDuration: ad.adPackageDuration,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt
    })),
    clientAds: filteredClientAds.map(ad => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      images: ad.images || [],
      phone: ad.phone,
      userId: ad.userId,
      ads: ad.ads,
      adExpiryTime: ad.adExpiryTime,
      reviewStatus: ad.reviewStatus || 'pending',
      reviewed_by: ad.reviewed_by,
      review_note: ad.review_note,
      status: ad.status,
      receipt_image: ad.receipt_image,
      type: ad.type,
      price: ad.price,
      area: ad.area,
      location: ad.location,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt
    })),
    filters: {
      dateRange,
      selectedCity,
      selectedStatus,
      adType
    }
  };
    };

    // Async thunk to export data as CSV
    export const exportAnalyticsData = createAsyncThunk(
    'analytics/exportData',
    async ({ data, format = 'csv' }, { rejectWithValue }) => {
        try {
        const csvContent = convertToCSV(data);
        return csvContent;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
    );

    // Helper function to convert data to CSV
    const convertToCSV = (data) => {
    const headers = ['Metric', 'Value', 'Category'];
    const rows = [];

    // Overview data
    Object.entries(data.overview).forEach(([key, value]) => {
        if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
            rows.push([`${key}_${subKey}`, subValue, 'overview']);
        });
        } else {
        rows.push([key, value, 'overview']);
        }
    });

    // Financial data
    Object.entries(data.financialInsights).forEach(([key, value]) => {
        if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
            rows.push([`${key}_${subKey}`, subValue, 'financial']);
        });
        } else {
        rows.push([key, value, 'financial']);
        }
    });

    // Time-based data
    data.timeBasedData.forEach((item, index) => {
        Object.entries(item).forEach(([key, value]) => {
        rows.push([`${key}_${index}`, value, 'timeBased']);
        });
    });

    const csvContent = [headers, ...rows.map(row => row.join(','))].join('\n');
    return csvContent;
    };

    const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        data: {
        overview: {},
        userEngagement: {},
        financialInsights: {},
        timeBasedData: [],
        userGrowthData: []
        },
        filters: {
        dateRange: 'month',
        selectedCity: 'all',
        selectedStatus: 'all',
        adType: 'all'
        },
        loading: false,
        error: null,
        lastUpdated: null
    },
    reducers: {
        setFilters: (state, action) => {
        state.filters = { ...state.filters, ...action.payload };
        },
        clearAnalyticsData: (state) => {
        state.data = {
            overview: {},
            userEngagement: {},
            financialInsights: {},
            timeBasedData: [],
            userGrowthData: []
        };
        },
        setLoading: (state, action) => {
        state.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAnalyticsData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.lastUpdated = new Date().toISOString();
        })
        .addCase(fetchAnalyticsData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(exportAnalyticsData.fulfilled, (state, action) => {
            // Handle export success
        })
        .addCase(exportAnalyticsData.rejected, (state, action) => {
            state.error = action.payload;
        });
    }
    });

    export const { setFilters, clearAnalyticsData, setLoading } = analyticsSlice.actions;

    export default analyticsSlice.reducer; 