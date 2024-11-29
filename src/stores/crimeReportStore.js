import { defineStore } from 'pinia'
import { db, storage, auth } from '../firebase/config'
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const useCrimeReportStore = defineStore('crimeReport', {
  state: () => ({
    reports: []
  }),
  actions: {
    async submitReport(reportData, images) {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to submit a report')
      }
      
      try {
        // Upload images to Firebase Storage and get their URLs
        const imagePaths = await Promise.all(
          images.map(async (image) => {
            const fileName = `${Date.now()}_${image.name}`
            const storageRef = ref(storage, `crime-reports/${auth.currentUser.uid}/${fileName}`)
            
            const snapshot = await uploadBytes(storageRef, image)
            const downloadURL = await getDownloadURL(snapshot.ref)
            
            return {
              url: downloadURL,
              path: `crime-reports/${auth.currentUser.uid}/${fileName}`,
              name: image.name
            }
          })
        )
        
        // Add the report data to Firestore with image metadata
        const reportWithImages = {
          ...reportData,
          images: imagePaths,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: auth.currentUser.uid
        }
        
        const docRef = await addDoc(collection(db, 'crimeReports'), reportWithImages)
        console.log('Report submitted with ID:', docRef.id)
        return docRef.id
      } catch (error) {
        console.error('Error submitting report:', error)
        throw error
      }
    },
    
    async fetchReports() {
      try {
        const q = query(collection(db, 'crimeReports'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        this.reports = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          images: doc.data().images || []
        }))
      } catch (error) {
        console.error('Error fetching reports:', error)
        throw error
      }
    },
    
    async updateReportStatus(reportId, newStatus) {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to update a report')
      }
      
      try {
        const reportRef = doc(db, 'crimeReports', reportId)
        await updateDoc(reportRef, { 
          status: newStatus,
          updatedAt: new Date().toISOString()
        })
        console.log('Report status updated successfully')
      } catch (error) {
        console.error('Error updating report status:', error)
        throw error
      }
    }
  }
})

