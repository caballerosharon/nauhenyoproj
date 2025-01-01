import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, auth } from '../firebase/config';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs,
  addDoc,
  doc,
  // getDoc,
  updateDoc,
  deleteDoc,
  where
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const useFirefighterStore = defineStore('firefighter', () => {
  const firefighters = ref([]);
  const loggedInFirefighter = ref(null);

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
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, firefighterData.email, firefighterData.password);
      const uid = userCredential.user.uid;

      // Add firefighter to Firestore
      const docRef = await addDoc(collection(db, 'firefighters'), {
        ...firefighterData,
        uid: uid,
        dateJoined: new Date().toISOString(),
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

  // Login firefighter
  const loginFirefighter = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch firefighter data from Firestore
      const q = query(collection(db, 'firefighters'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const firefighterDoc = querySnapshot.docs[0];
        loggedInFirefighter.value = {
          id: firefighterDoc.id,
          ...firefighterDoc.data()
        };
        return loggedInFirefighter.value;
      } else {
        throw new Error('Firefighter not found');
      }
    } catch (error) {
      console.error('Error logging in firefighter:', error);
      throw error;
    }
  };

  // Logout firefighter
  const logoutFirefighter = async () => {
    try {
      await signOut(auth);
      loggedInFirefighter.value = null;
    } catch (error) {
      console.error('Error logging out firefighter:', error);
      throw error;
    }
  };

  // Get logged in firefighter
  const getLoggedInFirefighter = () => {
    return loggedInFirefighter.value;
  };

  // Fetch firefighter by email
  const fetchFirefighterByEmail = async (email) => {
    try {
      const q = query(collection(db, 'firefighters'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const firefighterDoc = querySnapshot.docs[0];
        return {
          id: firefighterDoc.id,
          ...firefighterDoc.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching firefighter by email:', error);
      throw error;
    }
  };

  return {
    firefighters,
    fetchFirefighters,
    addFirefighter,
    updateFirefighter,
    updateFirefighterStatus,
    deleteFirefighter,
    loginFirefighter,
    logoutFirefighter,
    getLoggedInFirefighter,
    fetchFirefighterByEmail
  };
});