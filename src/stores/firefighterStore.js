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

export const useFirefighterStore = defineStore('firefighter', () => {
  const firefighters = ref([]);

  // Fetch all firefighters
  const fetchFirefighters = async () => {
    try {
      const q = query(collection(db, 'firefighters'), orderBy('fullname'));
      const querySnapshot = await getDocs(q);
      firefighters.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching firefighters:', error);
      throw error;
    }
  };

  // Add new firefighter
  const addFirefighter = async (firefighterData) => {
    try {
      const docRef = await addDoc(collection(db, 'firefighters'), {
        ...firefighterData,
        dateJoined: new Date().toISOString(),
        // Generate Dicebear avatar URL
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firefighterData.fullname)}&backgroundColor=random`
      });
      
      // Fetch updated list
      await fetchFirefighters();
      return docRef.id;
    } catch (error) {
      console.error('Error adding firefighter:', error);
      throw error;
    }
  };

  // Update firefighter
  const updateFirefighter = async (firefighterData) => {
    try {
      const { id, ...updateData } = firefighterData;
      const firefighterRef = doc(db, 'firefighters', id);
      await updateDoc(firefighterRef, updateData);
      
      // Fetch updated list
      await fetchFirefighters();
    } catch (error) {
      console.error('Error updating firefighter:', error);
      throw error;
    }
  };

  // Update firefighter status
  const updateFirefighterStatus = async (firefighterId, newStatus) => {
    try {
      const firefighterRef = doc(db, 'firefighters', firefighterId);
      await updateDoc(firefighterRef, {
        status: newStatus
      });
      
      // Fetch updated list
      await fetchFirefighters();
    } catch (error) {
      console.error('Error updating firefighter status:', error);
      throw error;
    }
  };

  // Delete firefighter
  const deleteFirefighter = async (firefighterId) => {
    try {
      const firefighterRef = doc(db, 'firefighters', firefighterId);
      await deleteDoc(firefighterRef);
      
      // Fetch updated list
      await fetchFirefighters();
    } catch (error) {
      console.error('Error deleting firefighter:', error);
      throw error;
    }
  };

  return {
    firefighters,
    fetchFirefighters,
    addFirefighter,
    updateFirefighter,
    updateFirefighterStatus,
    deleteFirefighter
  };
});