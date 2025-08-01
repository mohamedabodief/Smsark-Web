import { collection, getDocs, query, where, orderBy, limit, startAfter, Timestamp } from 'firebase/firestore';
import { db } from '../FireBase/firebaseConfig';

class AnalyticsService {
  // Fetch all analytics data
  async fetchAllAnalyticsData() {
    try {
      const [
        clientAds,
        developerAds,
        financingAds,
        users,
        financingRequests,
        favorites
      ] = await Promise.all([
        this.fetchClientAdvertisements(),
        this.fetchDeveloperAdvertisements(),
        this.fetchFinancingAdvertisements(),
        this.fetchUsers(),
        this.fetchFinancingRequests(),
        this.fetchFavorites()
      ]);

      return {
        clientAds,
        developerAds,
        financingAds,
        users,
        financingRequests,
        favorites
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  // Fetch client advertisements
  async fetchClientAdvertisements() {
    try {
      const querySnapshot = await getDocs(collection(db, 'clientAdvertisements'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching client ads:', error);
      return [];
    }
  }

  // Fetch developer advertisements
  async fetchDeveloperAdvertisements() {
    try {
      const querySnapshot = await getDocs(collection(db, 'realEstateDeveloperAdvertisements'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching developer ads:', error);
      return [];
    }
  }

  // Fetch financing advertisements
  async fetchFinancingAdvertisements() {
    try {
      const querySnapshot = await getDocs(collection(db, 'financingAdvertisements'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching financing ads:', error);
      return [];
    }
  }

  // Fetch users
  async fetchUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Fetch financing requests
  async fetchFinancingRequests() {
    try {
      const querySnapshot = await getDocs(collection(db, 'financingRequests'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching financing requests:', error);
      return [];
    }
  }

  // Fetch favorites
  async fetchFavorites() {
    try {
      const querySnapshot = await getDocs(collection(db, 'favorites'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  // Process analytics data
  processAnalyticsData(rawData) {
    const {
      clientAds,
      developerAds,
      financingAds,
      users,
      financingRequests,
      favorites
    } = rawData;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Overview calculations
    const totalRealEstateAds = clientAds.length + developerAds.length;
    const totalFinancingAds = financingAds.length;
    const activeAds = [...clientAds, ...developerAds, ...financingAds].filter(ad => ad.ads).length;
    const inactiveAds = [...clientAds, ...developerAds, ...financingAds].filter(ad => !ad.ads).length;

    // Status breakdown
    const statusBreakdown = {
      pending: 0,
      approved: 0,
      rejected: 0
    };

    [...clientAds, ...developerAds, ...financingAds].forEach(ad => {
      const status = ad.reviewStatus;
      if (statusBreakdown.hasOwnProperty(status)) {
        statusBreakdown[status]++;
      }
    });

    // Category breakdown
    const categoryBreakdown = {};
    clientAds.forEach(ad => {
      const type = ad.type;
      if (type) {
        categoryBreakdown[type] = (categoryBreakdown[type] || 0) + 1;
      }
    });

    // City breakdown
    const cityBreakdown = {};
    [...clientAds, ...developerAds].forEach(ad => {
      const city = ad.city || ad.location?.city;
      if (city) {
        cityBreakdown[city] = (cityBreakdown[city] || 0) + 1;
      }
    });

    // User engagement
    const userTypes = { client: 0, developer: 0, organization: 0 };
    users.forEach(user => {
      const type = user.type_of_user;
      if (userTypes.hasOwnProperty(type)) {
        userTypes[type]++;
      }
    });

    // Financial insights
    const totalFinancingRequests = financingRequests.length;
    const approvedRequests = financingRequests.filter(req => req.status === 'approved').length;
    const rejectedRequests = financingRequests.filter(req => req.status === 'rejected').length;

    // Developer insights
    const developerStats = {};
    developerAds.forEach(ad => {
      const developerId = ad.userId;
      if (!developerStats[developerId]) {
        developerStats[developerId] = {
          adsCount: 0,
          approvedCount: 0,
          pendingCount: 0,
          rejectedCount: 0
        };
      }
      developerStats[developerId].adsCount++;
      if (ad.reviewStatus === 'approved') developerStats[developerId].approvedCount++;
      else if (ad.reviewStatus === 'pending') developerStats[developerId].pendingCount++;
      else if (ad.reviewStatus === 'rejected') developerStats[developerId].rejectedCount++;
    });

    // Time-based data (last 30 days)
    const timeData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const adsCreated = [...clientAds, ...developerAds, ...financingAds].filter(ad => {
        const adDate = ad.created_at?.toDate?.() || new Date(ad.created_at);
        return adDate.toISOString().split('T')[0] === dateStr;
      }).length;

      timeData.push({
        date: dateStr,
        adsCreated,
        approvals: 0,
        rejections: 0
      });
    }

    // Ad performance metrics
    const adPerformance = [...clientAds, ...developerAds, ...financingAds].map(ad => ({
      id: ad.id,
      title: ad.title || ad.developer_name,
      type: ad.type_of_user,
      status: ad.reviewStatus,
      city: ad.city || ad.location?.city,
      created_at: ad.created_at,
      views: ad.views || 0,
      favorites: favorites.filter(fav => fav.adId === ad.id).length,
      isActive: ad.ads
    }));

    return {
      overview: {
        totalRealEstateAds,
        totalFinancingAds,
        activeAds,
        inactiveAds,
        statusBreakdown,
        categoryBreakdown,
        cityBreakdown
      },
      userEngagement: {
        userTypes,
        totalUsers: users.length,
        activeUsers: users.filter(user => {
          const userAds = [...clientAds, ...developerAds, ...financingAds].filter(ad => ad.userId === user.id);
          return userAds.length > 0;
        }).length
      },
      financialInsights: {
        totalFinancingRequests,
        approvedRequests,
        rejectedRequests,
        approvalRate: totalFinancingRequests > 0 ? (approvedRequests / totalFinancingRequests * 100).toFixed(1) : 0
      },
      developerInsights: {
        developerStats,
        topDevelopers: Object.entries(developerStats)
          .sort(([,a], [,b]) => b.adsCount - a.adsCount)
          .slice(0, 10)
      },
      timeBasedData: timeData,
      adPerformance
    };
  }

  // Get filtered data
  getFilteredData(data, filters) {
    const { dateRange, city, status, adType } = filters;
    
    let filteredData = [...data.clientAds, ...data.developerAds, ...data.financingAds];

    // Filter by date range
    if (dateRange && dateRange !== 'all') {
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      filteredData = filteredData.filter(ad => {
        const adDate = ad.created_at?.toDate?.() || new Date(ad.created_at);
        return adDate >= cutoffDate;
      });
    }

    // Filter by city
    if (city && city !== 'all') {
      filteredData = filteredData.filter(ad => {
        const adCity = ad.city || ad.location?.city;
        return adCity === city;
      });
    }

    // Filter by status
    if (status && status !== 'all') {
      filteredData = filteredData.filter(ad => ad.reviewStatus === status);
    }

    // Filter by ad type
    if (adType && adType !== 'all') {
      filteredData = filteredData.filter(ad => ad.type_of_user === adType);
    }

    return filteredData;
  }

  // Export data to CSV
  exportToCSV(data, filename) {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Convert data to CSV format
  convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  }
}

export default new AnalyticsService(); 