<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha384-..." crossorigin="anonymous">
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

        <main>
          <form @submit.prevent="submitReport" class="incident-form">
            <h1>Report a Crime</h1>
            
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
      <div class="location-input-container">
        <input
          ref="locationInput"
          type="text"
          id="location"
          v-model="location"
          placeholder="Enter incident location"
          required
        />
        <!-- Location Icon Button -->
        <i class="fas fa-map-marker-alt location-icon" @click="showMap = true"></i>
      </div>
    </div>

    <!-- Map Modal -->
    <div v-if="showMap" class="map-modal">
      <div class="map-modal-content">
        <span class="close-btn" @click="showMap = false">&times;</span>
        <div ref="map" class="map-container"></div>
      </div>
    </div>



            <div class="form-group">
              <label for="description">Description</label>
              <Editor v-model="description" :init="tinymceSettings" />

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
              <button type="submit" class="submit-btn">
                <i class="icon-submit"></i> Submit Report
              </button>
            </div>
          </form>
        </main>
      </div>

      <!-- New Right Panel -->
      <div class="right-panel">
        <div class="info-card">
          <div class="info-header">
            <i class="fas fa-info-circle"></i>
            Important Information
          </div>
          <div class="info-content">
            <div class="info-item">
              <i class="fas fa-check text-success"></i>
              Your report will be immediately sent to relevant authorities
            </div>
            <div class="info-item">
              <i class="fas fa-check text-success"></i>
              You can track the status of your report
            </div>
            <div class="info-item">
              <i class="fas fa-check text-success"></i>
              All information is kept confidential
            </div>
            <div class="info-item warning">
              <i class="fas fa-exclamation-triangle"></i>
              False reporting is punishable by law
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-header crime-report">
            <i class="fas fa-bullhorn"></i>
            Report a Crime
          </div>
          <div class="info-content">
            <div class="station-info">
              <div class="info-label">Nearby Police Station:</div>
              <div class="info-value">Naujan Police Station</div>
            </div>
            <div class="station-info">
              <div class="info-label">Hotline:</div>
              <div class="info-value">0917-XXXXXXX</div>
            </div>
            <div class="reporting-process">
              <div class="info-label">Reporting Process:</div>
              <div class="step">
                <span class="step-number">Step 1:</span>
                Provide detailed information about the incident.
              </div>
              <div class="step">
                <span class="step-number">Step 3:</span>
                Submit any evidence or attach photo for crime confirmation.
              </div>
              <div class="step">
                <span class="step-number">Step 4:</span>
                Receive a report reference number for follow-up.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */ 
import { Editor } from '@tinymce/tinymce-vue';

export default {
  components: {
    Editor
  },
  data() {
    return {
      menuItems: [
        { name: 'Dashboard', to: '/dashboard', icon: 'fas fa-home', current: false },
        { name: 'Report Crime', to: '/reportcrime', icon: 'fas fa-shield-alt', current: false },
       { name: 'Report Fire Incident', to: '/reportfire', icon: 'fas fa-fire', current: false },
        { name: 'My Reports', to: '/history', icon: 'fas fa-folder', current: false },
        { name: 'Map', to: '/usermap', icon: 'fas fa-users', current: false },
        { name: 'Message', to: '/', icon: 'fas fa-folder', current: false },
        { name: 'Profile', to: '/', icon: 'fas fa-users', current: false },
      ],
      incidentType: '',
      incidentSub: '',
      location: '', showMap: false,
      description: '',
      dateTime: '',
      isAnonymous: false,
      files: [],
      tinymceSettings: {
        height: 200,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help'
      }
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
    },
 
    initializeMap() {
      const input = this.$refs.locationInput;
      const mapContainer = this.$refs.map;

      const autocomplete = new window.google.maps.places.Autocomplete(input);
      const map = new window.google.maps.Map(mapContainer, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      });
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          map.setCenter(place.geometry.location);
          new window.google.maps.Marker({
            position: place.geometry.location,
            map: map
          });
        }
      });
    }
  },
  mounted() {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDe50S-5Ul4XkfcQ5tcCR4Xb3zTEiDvPgs&libraries=places";
      script.async = true;
      script.defer = true;
      script.onload = this.initializeMap;
      document.head.appendChild(script);
    } else {
      this.initializeMap();
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
  display: grid;
  grid-template-columns: 250px 1fr 350px; /* Sidebar, main content, right panel */
  height: 100vh;
  overflow: hidden;
}

.logo {
  width: 40px;
  height: 40px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-container h1 {
  margin-left: 10px;
  font-size: 1.5em;
  color: #ecf0f1;
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
  overflow-y: auto;
  background-color: #ecf0f1;
  padding: 20px; /* Padding for comfortable spacing */
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

.map-container {
  width: 100%;
  height: 300px;
  margin-top: 20px; /* Adjust the spacing above the map */
  border: 1px solid #ddd;
  border-radius: 4px;
}
/* New styles for right panel */
.right-panel {
  background-color: #f8f9fa;
  padding: 20px;
  border-left: 1px solid #dee2e6;
  overflow-y: auto;
}

.info-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.info-header {
  background-color: #00bcd4;
  color: white;
  padding: 15px;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-header.crime-report {
  background-color: #e91e63;
}

.info-content {
  padding: 15px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  color: #495057;
}

.info-item i {
  margin-top: 4px;
}

.info-item.warning {
  color: #dc3545;
}

.text-success {
  color: #28a745;
}

.station-info {
  margin-bottom: 15px;
}

.info-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 5px;
}

.info-value {
  color: #666;
}

.reporting-process {
  margin-top: 20px;
}

.step {
  margin-bottom: 10px;
  color: #666;
}

.step-number {
  font-weight: 600;
  color: #495057;
}

location-input-container {
  display: flex;
  align-items: center;
  position: relative;
}

.location-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #888;
}

.location-icon:hover {
  color: #555;
}

/* Map Modal Styles */
.map-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.map-modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}

.close-btn:hover {
  color: #555;
}

</style>