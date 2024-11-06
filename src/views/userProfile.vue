<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">Nau-Henyo</a>
        <button
          class="navbar-toggler"
          type="button"
          @click="toggleNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div :class="['collapse', 'navbar-collapse', { show: navbarOpen }]" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-home"></i> Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-exclamation-triangle"></i> Report Incident</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-history"></i> My Reports</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-map-marked-alt"></i> Map</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-chart-bar"></i> Statistics</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-envelope"></i> Messages</a></li>
            <li class="nav-item"><a class="nav-link active" href="#"><i class="fas fa-user"></i> Profile</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <h1 class="mb-4">User Profile</h1>

      <div class="row">
        <div class="col-md-4">
          <!-- Profile Card -->
          <div class="card">
            <div class="card-body text-center">
              <img src="/api/placeholder/150/150" class="rounded-circle mb-3" alt="Profile picture" />
              <h4>{{ userName }}</h4>
              <p class="text-muted">Member since {{ memberSince }}</p>
              <div class="d-grid gap-2">
                <button class="btn btn-primary"><i class="fas fa-edit"></i> Edit Profile</button>
                <button class="btn btn-outline-secondary"><i class="fas fa-key"></i> Change Password</button>
              </div>
            </div>
          </div>

          <!-- Account Statistics -->
          <div class="card mt-4">
            <div class="card-header">
              <h5 class="card-title mb-0">Account Statistics</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span>Total Reports:</span>
                <span class="badge bg-primary">{{ stats.totalReports }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Resolved Cases:</span>
                <span class="badge bg-success">{{ stats.resolvedCases }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Pending Cases:</span>
                <span class="badge bg-warning">{{ stats.pendingCases }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item">
                  <a class="nav-link active" href="#"><i class="fas fa-user"></i> Personal Info</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#"><i class="fas fa-bell"></i> Notifications</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#"><i class="fas fa-shield-alt"></i> Privacy</a>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <form @submit.prevent="saveChanges">
                <div class="mb-3">
                  <label for="fullName" class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="fullName" v-model="form.fullName" />
                </div>
                <div class="row mb-3">
                  <div class="col">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="form.email" />
                  </div>
                  <div class="col">
                    <label for="phone" class="form-label">Phone</label>
                    <input type="tel" class="form-control" id="phone" v-model="form.phone" />
                  </div>
                </div>
                <div class="mb-3">
                  <label for="address" class="form-label">Address</label>
                  <input type="text" class="form-control" id="address" v-model="form.address" />
                </div>
                <div class="mb-3">
                  <label for="emergencyContact" class="form-label">Emergency Contact</label>
                  <input type="text" class="form-control" id="emergencyContact" v-model="form.emergencyContact" />
                </div>
                <div class="mb-3">
                  <label for="idType" class="form-label">ID Type</label>
                  <select class="form-select" id="idType" v-model="form.idType">
                    <option>National ID</option>
                    <option>Driver's License</option>
                    <option>Passport</option>
                    <option>Voter's ID</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="idNumber" class="form-label">ID Number</label>
                  <input type="text" class="form-control" id="idNumber" v-model="form.idNumber" />
                </div>
                <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
              </form>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="card mt-4">
            <div class="card-header">
              <h5 class="card-title mb-0">Recent Activity</h5>
            </div>
            <div class="card-body">
              <div class="list-group">
                <a
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  href="#"
                  class="list-group-item list-group-item-action"
                >
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">{{ activity.title }}</h6>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                  <p class="mb-1">{{ activity.details }}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navbarOpen: false,
      userName: 'Juan Dela Cruz',
      memberSince: 'October 2023',
      stats: {
        totalReports: 15,
        resolvedCases: 12,
        pendingCases: 3,
      },
      form: {
        fullName: 'Juan Dela Cruz',
        email: 'juan@example.com',
        phone: '+63 912 345 6789',
        address: '123 Main St, Barangay San Jose, Naujan',
        emergencyContact: 'Maria Dela Cruz - +63 912 987 6543',
        idType: 'National ID',
        idNumber: '1234-5678-9012',
      },
      recentActivity: [
        { id: 1, title: 'Reported a fire incident', time: '3 days ago', details: 'Case #12345 - Barangay San Jose' },
        { id: 2, title: 'Updated contact information', time: '1 week ago', details: 'Changed phone number' },
      ],
    };
  },
  methods: {
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
    },
    saveChanges() {
      alert('Changes saved!');
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.card {
  border-radius: 8px;
}
.card-body {
  padding: 20px;
}
.card-header-tabs .nav-link {
  padding: 10px;
}
.card-header h5 {
  font-weight: 500;
}
.mt-4 {
  margin-top: 1.5rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
.rounded-circle {
  width: 100px;
  height: 100px;
}
.list-group-item-action {
  cursor: pointer;
}
</style>

