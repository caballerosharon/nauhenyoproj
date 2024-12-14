import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db, auth } from '../firebase/config';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  getDocs,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { requestNotificationPermission, onMessageListener } from '../firebase/messaging';

export const useFireReportStore = defineStore('fireReport', () => {
  const fireReports = ref([]);
  const recentFireReports = ref([]);
  const notifications = ref([]);
  const unreadNotificationsCount = ref(0);
  const fcmToken = ref(null);

  const totalFireReports = computed(() => fireReports.value.length);
  const pendingFireReports = computed(() => fireReports.value.filter(report => report.status === 'Pending').length);
  const resolvedFireReports = computed(() => fireReports.value.filter(report => report.status === 'Resolved').length);
  const unassignedFireReports = computed(() => fireReports.value.filter(report => !report.assignedTo).length);

  const initializePushNotifications = async () => {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        fcmToken.value = token;
        await updateUserFCMToken(token);
        setupMessageListener();
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  };

  const updateUserFCMToken = async (token) => {
    if (!auth.currentUser) return;
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token)
      });
    } catch (error) {
      console.error('Error updating FCM token:', error);
    }
  };

  const removeFCMToken = async () => {
    if (!auth.currentUser || !fcmToken.value) return;
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        fcmTokens: arrayRemove(fcmToken.value)
      });
      fcmToken.value = null;
    } catch (error) {
      console.error('Error removing FCM token:', error);
    }
  };

  const setupMessageListener = () => {
    onMessageListener().then((payload) => {
      console.log('Received foreground message:', payload);
      
      if (payload.notification) {
        addNotification({
          title: payload.notification.title,
          body: payload.notification.body,
          data: payload.data
        });
      }
    }).catch(err => console.log('Failed to receive foreground message:', err));
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      title: notification.title || 'New Notification',
      body: notification.body,
      data: notification.data,
      read: false,
      timestamp: new Date(),
    };
    
    notifications.value.unshift(newNotification);
    updateUnreadCount();
    
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      updateDoc(userRef, {
        notifications: arrayUnion(newNotification)
      }).catch(error => {
        console.error('Error storing notification:', error);
      });
    }
  };

  const fetchFireReports = async () => {
    const q = query(collection(db, 'fireReports'), orderBy('dateTime', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const report = { id: change.doc.id, ...change.doc.data() };
          fireReports.value.unshift(report);
          addNotification({
            title: 'New Fire Report',
            body: `A new fire incident has been reported at ${report.location}`,
            data: { reportId: report.id }
          });
        } else if (change.type === 'modified') {
          const index = fireReports.value.findIndex(r => r.id === change.doc.id);
          if (index !== -1) {
            fireReports.value[index] = { id: change.doc.id, ...change.doc.data() };
          }
        } else if (change.type === 'removed') {
          const index = fireReports.value.findIndex(r => r.id === change.doc.id);
          if (index !== -1) {
            fireReports.value.splice(index, 1);
          }
        }
      });
      updateUnreadCount();
      updateRecentFireReports();
    });
    return unsubscribe;
  };

  const getFireReports = async () => {
    try {
      const q = query(collection(db, 'fireReports'), orderBy('dateTime', 'desc'));
      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Report data:', data);
        return { id: doc.id, ...data };
      });
      fireReports.value = reports;
      updateRecentFireReports();
      return reports;
    } catch (error) {
      console.error('Error getting fire reports:', error);
      throw error;
    }
  };

  const updateRecentFireReports = () => {
    recentFireReports.value = fireReports.value.slice(0, 5).map(report => ({
      id: report.id,
      subType: report.incidentType || 'Unknown',
      location: report.location || 'Not specified',
      timestamp: report.dateTime ? new Date(report.dateTime.seconds * 1000) : new Date()
    }));
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VUE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VUE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const data = await response.json();
      console.log('Cloudinary upload response:', data);
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  };

  const addFireReport = async (reportData) => {
    try {
      const docData = {
        ...reportData,
        createdAt: serverTimestamp(),
        status: 'Pending',
        imageUrls: reportData.imageUrls || []
      };

      const docRef = await addDoc(collection(db, 'fireReports'), docData);
      console.log('Document written with ID: ', docRef.id);
      console.log('Report data saved:', docData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  };

  const markNotificationAsRead = (notificationId) => {
    const index = notifications.value.findIndex(n => n.id === notificationId);
    if (index !== -1 && !notifications.value[index].read) {
      notifications.value[index].read = true;
      updateUnreadCount();
    }
  };

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true;
    });
    updateUnreadCount();
  };

  const clearNotifications = () => {
    notifications.value = notifications.value.filter(n => !n.read);
    updateUnreadCount();
  };

  const updateUnreadCount = () => {
    unreadNotificationsCount.value = notifications.value.filter(n => !n.read).length;
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const reportRef = doc(db, 'fireReports', reportId);
      await updateDoc(reportRef, { status: newStatus });
      const index = fireReports.value.findIndex(report => report.id === reportId);
      if (index !== -1) {
        fireReports.value[index].status = newStatus;
      }
      updateRecentFireReports();
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  };

  const assignFirefighter = async (reportId, firefighterId) => {
    try {
      const reportRef = doc(db, 'fireReports', reportId);
      await updateDoc(reportRef, { 
        assignedTo: firefighterId,
        status: 'Resolved'
      });
      const index = fireReports.value.findIndex(report => report.id === reportId);
      if (index !== -1) {
        fireReports.value[index].assignedTo = firefighterId;
        fireReports.value[index].status = 'Resolved';
      }
      updateRecentFireReports();
    } catch (error) {
      console.error('Error assigning firefighter:', error);
      throw error;
    }
  };

  const setFireReports = (reports) => {
    fireReports.value = reports;
    updateRecentFireReports();
  };

  const setRecentFireReports = (reports) => {
    recentFireReports.value = reports;
  };

  return {
    fireReports,
    recentFireReports,
    notifications,
    unreadNotificationsCount,
    totalFireReports,
    pendingFireReports,
    resolvedFireReports,
    unassignedFireReports,
    fetchFireReports,
    getFireReports,
    addFireReport,
    uploadImageToCloudinary,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    updateReportStatus,
    assignFirefighter,
    setFireReports,
    setRecentFireReports,
    initializePushNotifications,
    removeFCMToken,
    fcmToken,
    addNotification
  };
});

