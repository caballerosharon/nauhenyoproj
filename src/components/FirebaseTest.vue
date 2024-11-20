<template>
  <div class="firebase-test">
    <h2>Firebase Configuration Test</h2>
    <form @submit.prevent="testSignUp">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Test Sign Up</button>
    </form>
    <div v-if="result" :class="{ 'success': !error, 'error': error }">
      {{ result }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const result = ref('');
    const error = ref(false);

    const testSignUp = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        
        // Store user details in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date()
        });
        
        result.value = `User created successfully and stored in Firestore. UID: ${user.uid}`;
        error.value = false;
      } catch (e) {
        result.value = `Error: ${e.message}`;
        error.value = true;
        console.error('Error during signup:', e);
      }
    };

    return {
      email,
      password,
      result,
      error,
      testSignUp
    };
  }
};
</script>

<style scoped>
.firebase-test {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  width: 100%;
  padding: 5px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>