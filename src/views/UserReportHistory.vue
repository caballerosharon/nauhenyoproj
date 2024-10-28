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
      <div class="sidebar-nav">
  <router-link
    v-for="item in menuItems"
    :key="item.name"
    :to="item.to"
    :class="{ active: item.current }"
  >
    <i :class="item.icon"></i>
    {{ item.name }}
  </router-link>
</div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <header class="main-header">
        <h1>Reports History</h1>
      </header>
      <main>
        <!-- Reports Filter -->
        <div class="reports-filter">
          <input v-model="searchQuery" type="text" placeholder="Search reports..." class="search-input">
          <select v-model="statusFilter" class="status-filter">
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Review">Pending Review</option>
          </select>
        </div>

        <!-- Reports Table -->
        <div class="reports-table-container">
          <table class="reports-table">
            <thead>
              <tr>
                <th @click="sortBy('id')">ID <i :class="getSortIcon('id')"></i></th>
                <th @click="sortBy('title')">Title <i :class="getSortIcon('title')"></i></th>
                <th @click="sortBy('status')">Status <i :class="getSortIcon('status')"></i></th>
                <th @click="sortBy('date')">Date <i :class="getSortIcon('date')"></i></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in filteredAndSortedReports" :key="report.id">
                <td>{{ report.id }}</td>
                <td>{{ report.title }}</td>
                <td>
                  <span :class="['report-status', report.status.toLowerCase().replace(' ', '-')]">
                    {{ report.status }}
                  </span>
                </td>
                <td>{{ report.date }}</td>
                <td>
                  <button @click="viewReport(report.id)" class="action-button view">
                    <i class="fas fa-eye"></i> View
                  </button>
                  <button @click="editReport(report.id)" class="action-button edit">
                    <i class="fas fa-edit"></i> Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
            <i class="fas fa-chevron-left"></i> Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
            Next <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportsHistory',
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
      reports: [
        { id: 1, title: 'Theft', status: 'Completed', date: '2023-03-31' },
        { id: 2, title: 'Assault', status: 'In Progress', date: '2023-04-15' },
        { id: 3, title: 'Customer Satisfaction Survey', status: 'Pending Review', date: '2023-05-01' },
        { id: 4, title: 'Verbal Abuse', status: 'Completed', date: '2023-05-10' },
        { id: 5, title: 'Cybercrime', status: 'In Progress', date: '2023-05-20' },
        { id: 6, title: 'Employee Engagement Survey', status: 'Pending Review', date: '2023-06-01' },
        { id: 7, title: 'Product Launch Report', status: 'Completed', date: '2023-06-15' },
        { id: 8, title: 'IT Infrastructure Audit', status: 'In Progress', date: '2023-06-30' },
        { id: 9, title: 'Annual Compliance Review', status: 'Pending Review', date: '2023-07-10' },
        { id: 10, title: 'Sales Performance Analysis', status: 'Completed', date: '2023-07-20' },
      ],
      searchQuery: '',
      statusFilter: '',
      currentSort: 'id',
      currentSortDir: 'asc',
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    filteredReports() {
      return this.reports.filter(report => {
        return (
          report.title.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          (this.statusFilter === '' || report.status === this.statusFilter)
        );
      });
    },
    filteredAndSortedReports() {
  const sortedReports = [...this.filteredReports].sort((a, b) => {
    let modifier = this.currentSortDir === 'desc' ? -1 : 1;
    if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
    if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
    return 0;
  });
  
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return sortedReports.slice(start, end);
},
    totalPages() {
      return Math.ceil(this.filteredReports.length / this.pageSize);
    }
  },
  methods: {
    sortBy(key) {
      if (key === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }
      this.currentSort = key;
    },
    getSortIcon(key) {
      if (this.currentSort === key) {
        return this.currentSortDir === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
      }
      return 'fas fa-sort';
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    viewReport(id) {
      // Implement view report functionality
      console.log('Viewing report', id);
    },
    editReport(id) {
      // Implement edit report functionality
      console.log('Editing report', id);
    }
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  font-family: Poppins, sans-serif;
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

.reports-filter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input, .status-filter {
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 14px;
}

.search-input {
  flex-grow: 1;
  margin-right: 10px;
}

.status-filter {
  width: 150px;
}

.reports-table-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table th, .reports-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.reports-table th {
  background-color: #f9f9f9;
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
}

.reports-table th i {
  margin-left: 5px;
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

.report-status.in-progress {
  background-color: #f39c12;
  color: #ffffff;
}

.report-status.pending-review {
  background-color: #e74c3c;
  color: #ffffff;
}

.action-button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.action-button.view {
  background-color: #3498db;
  color: #ffffff;
}

.action-button.edit {
  background-color: #f1c40f;
  color: #ffffff;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 8px 12px;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
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

  .reports-filter {
    flex-direction: column;
  }

  .search-input, .status-filter {
    width: 100%;
    margin-bottom: 10px;
  }

  .reports-table th, .reports-table td {
    padding: 8px;
  }

  .action-button {
    padding: 3px 6px;
    font-size: 10px;
  }
}
</style>