<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMjt8ka4DkCBbkE6h5f7pYN68g4SE7L1Wf4pFTO" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <div class="app-container">
    <!-- Sidebar with logo and menu -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container">
        <img src="@/assets/naulogo.png" alt="NauHenyo Logo" class="logo" />
        <h1>NauHenyo</h1>
      </div>
       </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          :class="{ active: item.current }"
        >
          <i :class="item.icon"></i>
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <header class="main-header">
      </header>
      <main>
        <form @submit.prevent="submitReport" class="incident-form">
          <h1>Report an Incident</h1>
          <div class="form-group">
            <label for="incidentType">Incident Type</label>
            <select v-model="incidentType" id="incidentType" required>
              <option value="">Select Incident Type</option>
              <option value="index">Index Crime</option>
              <option value="non-index">Non-Index Crime</option>
              <option value="psi">PSI</option>
              <option value="special">Special Laws</option>
            </select>
          </div>

          <div class="form-group">
            <label for="incidentSub">Incident Subcategory</label>
            <select v-model="incidentSub" id="incidentSub" required>
              <option value="">Select Subcategory</option>
              <option value="theft">Theft</option>
              <option value="accident">Accident</option>
              <option value="rob">Robbery</option>
              <option value="physical">Physical Abuse</option>
              <option value="assault">Assault</option>
            </select>
          </div>

          <div class="form-group">
            <label for="location">Location</label>
            <input v-model="location" type="text" id="location" placeholder="Enter incident location" required />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea v-model="description" id="description" placeholder="Describe the incident in detail" required></textarea>
          </div>

          <div class="form-group">
            <label for="dateTime">Date and Time</label>
            <input v-model="dateTime" type="datetime-local" id="dateTime" required />
          </div>

          <div class="form-group">
            <label for="photos">Upload Photos (if any)</label>
            <input type="file" id="photos" multiple @change="handleFileUpload" />
          </div>

          <div class="form-group">
            <label>Report anonymously</label>
            <input v-model="isAnonymous" type="checkbox" />
          </div>

          <div class="form-group">
            <button type="submit" class="submit-btn">
              <i class="icon-submit"></i> Submit Report
            </button>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { name: 'Dashboard', to: '/dashboard', icon: 'fas fa-home', current: false },
        { name: 'Report Incident', to: '/report', icon: 'fas fa-chart-bar', current: true },
        { name: 'My Reports', to: '/', icon: 'fas fa-folder', current: false },
        { name: 'Map', to: '/map', icon: 'fas fa-users', current: false },
        { name: 'Message', to: '/', icon: 'fas fa-folder', current: false },
        { name: 'Profile', to: '/', icon: 'fas fa-users', current: false },
      ],
      incidentType: '',
      incidentSub: '',
      location: '',
      description: '',
      dateTime: '',
      isAnonymous: false,
      files: []
    };
  },
  methods: {
    handleFileUpload(event) {
      this.files = event.target.files;
    },
    submitReport() {
      console.log('Submitting report:', {
        incidentType: this.incidentType,
        location: this.location,
        description: this.description,
        dateTime: this.dateTime,
        isAnonymous: this.isAnonymous,
        files: this.files
      });
      this.resetForm();
    },
    resetForm() {
      this.incidentType = '';
      this.incidentSub = '';
      this.location = '';
      this.description = '';
      this.dateTime = '';
      this.isAnonymous = false;
      this.files = [];
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');


* {
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  height: 100vh;
}

.logo {
  width: 40px;
  height: 40px;
}

.sidebar {
  width: 250px;
  background-color: #002855;
  color: #ecf0f1;
}

.sidebar-header {
  padding: 20px;
}

.sidebar-header h1 {
  font-size: 1.5em;
  margin: 0;
}

.sidebar-nav {
  padding-top: 20px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #ecf0f1;
  text-decoration: none;
  transition: background-color 0.3s;
}

.sidebar-nav a:hover, .sidebar-nav a.active {
  background-color: #041a30;
}

.sidebar-nav a i {
  margin-right: 10px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: #ecf0f1;
}

.main-header {
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-header h1 {
  margin: 0;
  font-size: 2em;
  color: #2c3e50;
}

main {
  padding: 20px;
}

.incident-form {
  max-width: 800px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-group label {
  width: 200px;
  margin-right: 10px;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="datetime-local"],
.form-group select,
.form-group textarea,
.form-group input[type="file"] {
  width: calc(100% - 220px);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Poppins', sans-serif;
}

textarea {
  height: 100px;
}

.submit-btn {
  background-color: #e63946;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 160px;
  font-weight: 500;
}

.submit-btn:hover {
  background-color: #c62b38;
}
</style>
