import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export const useFireReportStore = defineStore('fireReport', () => {
  const fireReports = ref([]);
  const notifications = ref([]);

  const totalFireReports = computed(() => fireReports.value.length);
  const pendingFireReports = computed(() => fireReports.value.filter(report => report.status === 'Pending').length);
  const resolvedFireReports = computed(() => fireReports.value.filter(report => report.status === 'Resolved').length);
  const unassignedFireReports = computed(() => fireReports.value.filter(report => !report.assignedTo).length);
  const recentFireReports = computed(() => fireReports.value.slice(0, 5));

  const unreadNotifications = computed(() => notifications.value.filter(notif => !notif.read).length);

  const fetchFireReports = async () => {
    const q = query(collection(db, 'fireReports'), orderBy('dateTime', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const report = { id: change.doc.id, ...change.doc.data() };
          fireReports.value.unshift(report);
          addNotification(report);
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
    });
    return unsubscribe;
  };

  const addFireReport = async (reportData) => {
    try {
      const docRef = await addDoc(collection(db, 'fireReports'), {
        ...reportData,
        createdAt: serverTimestamp()
      });
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  };

  const addNotification = (report) => {
    notifications.value.unshift({
      id: report.id,
      title: 'New Fire Report',
      body: `A new fire incident has been reported at ${report.location}`,
      read: false,
      timestamp: new Date(),
    });
  };

  const markNotificationAsRead = (notificationId) => {
    const index = notifications.value.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications.value[index].read = true;
    }
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const reportRef = doc(db, 'fireReports', reportId);
      await updateDoc(reportRef, { status: newStatus });
      const index = fireReports.value.findIndex(report => report.id === reportId);
      if (index !== -1) {
        fireReports.value[index].status = newStatus;
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  };

  const assignFirefighter = async (reportId, firefighterId) => {
    try {
      const reportRef = doc(db, 'fireReports', reportId);
      await updateDoc(reportRef, { assignedTo: firefighterId });
      const index = fireReports.value.findIndex(report => report.id === reportId);
      if (index !== -1) {
        fireReports.value[index].assignedTo = firefighterId;
      }
    } catch (error) {
      console.error('Error assigning firefighter:', error);
      throw error;
    }
  };

  return {
    fireReports,
    notifications,
    totalFireReports,
    pendingFireReports,
    resolvedFireReports,
    unassignedFireReports,
    recentFireReports,
    unreadNotifications,
    fetchFireReports,
    addFireReport,
    markNotificationAsRead,
    clearNotifications,
    updateReportStatus,
    assignFirefighter,
  };
});