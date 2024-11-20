// src/stores/reportStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, auth } from '../firebase/config'
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore'

export const useReportStore = defineStore('report', () => {
  const crimeReports = ref([])
  const fireReports = ref([])
  let unsubscribeCrime = null
  let unsubscribeFire = null

  const totalReports = computed(() => crimeReports.value.length + fireReports.value.length)
  const pendingReports = computed(() => 
    [...crimeReports.value, ...fireReports.value].filter(r => r.status === 'Pending').length
  )
  const resolvedReports = computed(() => 
    [...crimeReports.value, ...fireReports.value].filter(r => r.status === 'Resolved').length
  )
  const unassignedReports = computed(() => 
    [...crimeReports.value, ...fireReports.value].filter(r => !r.assignedTo).length
  )

  const allReports = computed(() => [...crimeReports.value, ...fireReports.value])

  const recentReports = computed(() => {
    return [...crimeReports.value, ...fireReports.value]
      .sort((a, b) => b.dateTime.toDate() - a.dateTime.toDate())
      .slice(0, 5)
      .map(report => ({
        id: report.id,
        title: report.incidentType || 'Incident',
        status: report.status || 'Pending',
        date: report.dateTime ? report.dateTime.toDate().toLocaleDateString() : 'N/A',
        type: report.incidentType && report.incidentType.toLowerCase().includes('fire') ? 'fire' : 'crime'
      }))
  })

  async function fetchReports() {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.error("No user is logged in")
        return
      }

      const crimeReportsQuery = query(collection(db, 'crimeReports'), where("userId", "==", currentUser.uid))
      const fireReportsQuery = query(collection(db, 'fireReports'), where("userId", "==", currentUser.uid))

      const [crimeSnapshot, fireSnapshot] = await Promise.all([
        getDocs(crimeReportsQuery),
        getDocs(fireReportsQuery)
      ])

      crimeReports.value = crimeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      fireReports.value = fireSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      console.log('Fetched reports:', { crime: crimeReports.value, fire: fireReports.value })
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  function setupRealtimeListeners() {
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error("No user is logged in")
      return
    }

    if (unsubscribeCrime || unsubscribeFire) {
      console.log("Listeners already set up")
      return
    }

    const crimeReportsQuery = query(collection(db, 'crimeReports'), where("userId", "==", currentUser.uid))
    const fireReportsQuery = query(collection(db, 'fireReports'), where("userId", "==", currentUser.uid))

    unsubscribeCrime = onSnapshot(crimeReportsQuery, (snapshot) => {
      crimeReports.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }, (error) => {
      console.error('Error in crime reports listener:', error)
    })

    unsubscribeFire = onSnapshot(fireReportsQuery, (snapshot) => {
      fireReports.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }, (error) => {
      console.error('Error in fire reports listener:', error)
    })

    console.log("Real-time listeners set up")
  }

  function cleanupListeners() {
    if (unsubscribeCrime) {
      unsubscribeCrime()
      unsubscribeCrime = null
    }
    if (unsubscribeFire) {
      unsubscribeFire()
      unsubscribeFire = null
    }
    console.log("Listeners cleaned up")
  }

  return {
    crimeReports,
    fireReports,
    totalReports,
    pendingReports,
    resolvedReports,
    unassignedReports,
    allReports,
    recentReports,
    fetchReports,
    setupRealtimeListeners,
    cleanupListeners
  }
})