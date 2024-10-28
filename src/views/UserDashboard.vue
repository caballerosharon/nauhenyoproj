<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMjt8ka4DkCBbkE6h5f7pYN68g4SE7L1Wf4pFTO" crossorigin="anonymous">
  <!-- Poppins Font -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <div class="dashboard">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="@/assets/naulogo.png" alt="Logo" class="logo" />
        <h1>NauHenyo</h1>
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
        <h1>Dashboard</h1>
      </header>
      <main>
        <!-- Statistics Grid -->
        <div class="statistics-grid">
          <div
            v-for="stat in statistics"
            :key="stat.name"
            class="statistic-card"
          >
            <div class="statistic-content">
              <div class="statistic-icon">
                <i :class="stat.icon"></i>
              </div>
              <div class="statistic-info">
                <h3>{{ stat.name }}</h3>
                <p class="statistic-value">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reports Section -->
        <div class="reports-section">
          <h2>Your Reports</h2>
          <div class="reports-list">
            <div v-for="report in reports" :key="report.id" class="report-item">
              <div class="report-header">
                <h3>{{ report.title }}</h3>
                <span :class="['report-status', report.status.toLowerCase()]">
                  {{ report.status }}
                </span>
              </div>
              <div class="report-details">
                <p>
                  <i class="fas fa-calendar"></i>
                  {{ report.date }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDashboard',
  data() {
    return {
      menuItems: [
      { name: 'Dashboard', to: '/dashboard', icon: 'fas fa-home', current: true },
      { name: 'Report Incident', to: '/report', icon: 'fas fa-chart-bar', current: false },
      { name: 'My Reports', to: '/history', icon: 'fas fa-folder', current: false },
      { name: 'Map', to: '/usermap', icon: 'fas fa-users', current: false },
      { name: 'Message', to: '/', icon: 'fas fa-folder', current: false },
      { name: 'Profile', to: '/', icon: 'fas fa-users', current: false },
    ],
      statistics: [
        { name: 'Total Reports', value: 12, icon: 'fas fa-inbox' },
        { name: 'My Reports', value: 8, icon: 'fas fa-tasks' },
        { name: 'Incidents', value: 5, icon: 'fas fa-users' },
      ],
      reports: [
        { id: 1, title: 'Q1 Financial Report', status: 'Completed', date: 'March 31, 2023' },
        { id: 2, title: 'Project X Progress', status: 'In Progress', date: 'April 15, 2023' },
        { id: 3, title: 'Customer Satisfaction Survey', status: 'Pending Review', date: 'May 1, 2023' },
      ],
    };
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.sidebar {
  width: 250px;
  background-color: #002855;
  color: #ecf0f1;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
}

.sidebar-header .logo {
  width: 40px; /* Adjust width as needed */
  height: 40px;
  margin-right: 10px; /* Space between logo and text */
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

.sidebar-nav .router-link-active {
  background-color: #34495e;
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

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.statistic-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.statistic-content {
  display: flex;
  align-items: center;
}

.statistic-icon {
  font-size: 2em;
  color: #3498db;
  margin-right: 15px;
}

.statistic-info h3 {
  margin: 0;
  font-size: 1em;
  color: #7f8c8d;
}

.statistic-value {
  font-size: 1.5em;
  font-weight: bold;
  color: #2c3e50;
  margin: 5px 0 0;
}

.reports-section h2 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.reports-list {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.report-item {
  padding: 15px 20px;
  border-bottom: 1px solid #ecf0f1;
}

.report-item:last-child {
  border-bottom: none;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.report-header h3 {
  margin: 0;
  font-size: 1.1em;
  color: #2980b9;
}

.report-status {
  font-size: 0.9em;
  padding: 3px 8px;
  border-radius: 12px;
}

.report-status.completed {
  background-color: #2ecc71;
  color: #ffffff;
}

.report-status.in.progress {
  background-color: #f39c12;
  color: #ffffff;
}

.report-status.pending.review {
  background-color: #e74c3c;
  color: #ffffff;
}

.report-details {
  font-size: 0.9em;
  color: #7f8c8d;
}

.report-details i {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
  }

  .main-content {
    height: calc(100vh - 200px);
  }
}
</style>