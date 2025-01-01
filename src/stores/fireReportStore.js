import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  getDocs
} from 'firebase/firestore';

export const useFireReportStore = defineStore('fireReport', () => {
  const fireReports = ref([]);
  const recentFireReports = ref([]);

  const totalFireReports = computed(() => fireReports.value.length);
  const pendingFireReports = computed(() => fireReports.value.filter(report => report.status === 'Pending').length);
  const resolvedFireReports = computed(() => fireReports.value.filter(report => report.status === 'Resolved').length);
  const unassignedFireReports = computed(() => fireReports.value.filter(report => !report.assignedTo).length);

  const fetchFireReports = async () => {
    const q = query(collection(db, 'fireReports'), orderBy('dateTime', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const report = { id: change.doc.id, ...change.doc.data() };
          fireReports.value.unshift(report);
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
      return docRef.id;
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
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
      return { success: true, message: 'Report status updated successfully' };
    } catch (error) {
      console.error('Error updating report status:', error);
      return { success: false, message: error.message };
    }
  };

  const assignFirefighter = async (reportId, firefighterId, newStatus = 'In Progress') => {
    try {
      const reportRef = doc(db, 'fireReports', reportId);
      await updateDoc(reportRef, { 
        assignedTo: firefighterId,
        status: newStatus
      });
      const index = fireReports.value.findIndex(report => report.id === reportId);
      if (index !== -1) {
        fireReports.value[index].assignedTo = firefighterId;
        fireReports.value[index].status = newStatus;
      }
      updateRecentFireReports();
      return { success: true, message: 'Firefighter assigned successfully' };
    } catch (error) {
      console.error('Error assigning firefighter:', error);
      return { success: false, message: error.message };
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
    totalFireReports,
    pendingFireReports,
    resolvedFireReports,
    unassignedFireReports,
    fetchFireReports,
    getFireReports,
    addFireReport,
    updateReportStatus,
    assignFirefighter,
    setFireReports,
    setRecentFireReports
  };
});

