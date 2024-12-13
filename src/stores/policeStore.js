import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

export const usePoliceStore = defineStore('police', () => {
  const police = ref([]);

  // Fetch all police
  const fetchPolice = async () => {
    try {
      const q = query(collection(db, 'police'), orderBy('fullname'));
      const querySnapshot = await getDocs(q);
      police.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching police:', error);
      throw error;
    }
  };

  // Add new police
  const addPolice = async (policeData) => {
    try {
      const docRef = await addDoc(collection(db, 'police'), {
        ...policeData,
        dateJoined: new Date().toISOString(),
        // Generate Dicebear avatar URL
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(policeData.fullname)}&backgroundColor=random`
      });
      
      // Fetch updated list
      await fetchPolice();
      return docRef.id;
    } catch (error) {
      console.error('Error adding police:', error);
      throw error;
    }
  };

  // Update police
  const updatePolice = async (policeData) => {
    try {
      const { id, ...updateData } = policeData;
      const policeRef = doc(db, 'police', id);
      await updateDoc(policeRef, updateData);
      
      // Fetch updated list
      await fetchPolice();
    } catch (error) {
      console.error('Error updating police:', error);
      throw error;
    }
  };

  // Update police status
  const updatePoliceStatus = async (policeId, newStatus) => {
    try {
      const policeRef = doc(db, 'police', policeId);
      await updateDoc(policeRef, {
        status: newStatus
      });
      
      // Fetch updated list
      await fetchPolice();
    } catch (error) {
      console.error('Error updating police status:', error);
      throw error;
    }
  };

  // Delete police
  const deletePolice = async (policeId) => {
    try {
      const policeRef = doc(db, 'police', policeId);
      await deleteDoc(policeRef);
      
      // Fetch updated list
      await fetchPolice();
    } catch (error) {
      console.error('Error deleting police:', error);
      throw error;
    }
  };

  return {
    police,
    fetchPolice,
    addPolice,
    updatePolice,
    updatePoliceStatus,
    deletePolice
  };
});