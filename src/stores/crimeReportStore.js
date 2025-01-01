import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';

export const useCrimeReportStore = defineStore('crimeReport', () => {
  const crimeReports = ref([]);
  const notifications = ref([]);
  const unreadNotificationsCount = ref(0);

  const totalCrimeReports = computed(() => crimeReports.value.length);
  const pendingCrimeReports = computed(() => crimeReports.value.filter(report => report.status === 'Pending').length);
  const resolvedCrimeReports = computed(() => crimeReports.value.filter(report => report.status === 'Resolved').length);
  const unassignedCrimeReports = computed(() => crimeReports.value.filter(report => !report.assignedTo).length);
  const recentCrimeReports = computed(() => crimeReports.value.slice(0, 5));

  const fetchCrimeReports = async () => {
    const q = query(collection(db, 'crimeReports'), orderBy('dateTime', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const report = { id: change.doc.id, ...change.doc.data() };
          crimeReports.value.unshift(report);
          addNotification(report);
        } else if (change.type === 'modified') {
          const index = crimeReports.value.findIndex(r => r.id === change.doc.id);
          if (index !== -1) {
            crimeReports.value[index] = { id: change.doc.id, ...change.doc.data() };
          }
        } else if (change.type === 'removed') {
          const index = crimeReports.value.findIndex(r => r.id === change.doc.id);
          if (index !== -1) {
            crimeReports.value.splice(index, 1);
          }
        }
      });
      updateUnreadCount();
    });
    return unsubscribe;
  };

  const getCrimeReports = async () => {
    try {
      const q = query(collection(db, 'crimeReports'), orderBy('dateTime', 'desc'));
      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Report data:', data); // Log each report's data
        return { id: doc.id, ...data };
      });
      crimeReports.value = reports;
      return reports;
    } catch (error) {
      console.error('Error getting crime reports:', error);
      throw error;
    }
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
      console.log('Cloudinary upload response:', data); // Log the Cloudinary response
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  };

  const addCrimeReport = async (reportData) => {
    try {
      // Ensure that imageUrls is included in the document data
      const docData = {
        ...reportData,
        createdAt: serverTimestamp(),
        status: 'Pending',
        imageUrls: reportData.imageUrls || [] // Include imageUrls, defaulting to an empty array if not provided
      };

      const docRef = await addDoc(collection(db, 'crimeReports'), docData);
      console.log('Document written with ID: ', docRef.id);
      console.log('Report data saved:', docData); // Log the saved report data
      return docRef.id;
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  };

  const addNotification = (report) => {
    const newNotification = {
      id: report.id,
      title: 'New Fire Report',
      body: `A new incident has been reported at ${report.location}`,
      read: false,
      timestamp: new Date(),
    };
    notifications.value.unshift(newNotification);
    updateUnreadCount();
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
      const reportRef = doc(db, 'crimeReports', reportId);
      await updateDoc(reportRef, { status: newStatus });
      const index = crimeReports.value.findIndex(report => report.id === reportId);
      if (index !== -1) {
        crimeReports.value[index].status = newStatus;
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  };

  const assignPolice = async (reportId, policeId) => {
    try {
      const reportRef = doc(db, 'crimeReports', reportId);
      await updateDoc(reportRef, { 
        assignedTo: policeId,
        status: 'Resolved'  // Automatically set status to 'Resolved' when assigning
      });
      const index = crimeReports.value.findIndex(report => report.id === reportId);
      if (index !== -1) {
        crimeReports.value[index].assignedTo = policeId;
        crimeReports.value[index].status = 'Resolved';
      }
    } catch (error) {
      console.error('Error assigning police:', error);
      throw error;
    }
  };

  return {
    crimeReports,
    notifications,
    unreadNotificationsCount,
    totalCrimeReports,
    pendingCrimeReports,
    resolvedCrimeReports,
    unassignedCrimeReports,
    recentCrimeReports,
    fetchCrimeReports,
    getCrimeReports,
    addCrimeReport,
    uploadImageToCloudinary,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    updateReportStatus,
    assignPolice,
  };
});