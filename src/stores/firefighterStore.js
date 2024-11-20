import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const useFirefighterStore = defineStore('firefighter', () => {
  const firefighters = ref([]);

  const fetchFirefighters = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'firefighters'));
      firefighters.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        fullname: doc.data().fullname,
        email: doc.data().email,
        contactNumber: doc.data().contactNumber,
        birthday: doc.data().birthday,
        gender: doc.data().gender,
        uid: doc.data().uid
      }));
      console.log('Fetched firefighters:', firefighters.value);
    } catch (error) {
      console.error('Error fetching firefighters:', error);
      throw error;
    }
  };

  return {
    firefighters,
    fetchFirefighters,
  };
});